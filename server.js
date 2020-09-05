const express = require('express');
const dotenv = require('dotenv');
const mongo = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportModules = require('./passport-config');
const initializePassport = passportModules.initialize;
const loginMessage = passportModules.loginMessage;
const ObjectID = require('mongodb').ObjectID;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const nodemailer = require('nodemailer');

//Middleware
const app = express();
const port = 5000;
dotenv.config();

app.use(express.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

let gfs;

//Connecting to database and initializing routes
mongo.connect(process.env.MONGO_URI, (err, database) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');
        const db = database.db('Home-Sweet-Home');

        gfs = Grid(db, mongo);
        gfs.collection('houseImages');

        const storage = new GridFsStorage({
            db: db,
            file: (req, file) => {
              return new Promise((resolve, reject) => {  
                const filename = file.originalname;
                const fileInfo = {
                  filename: filename,
                  bucketName: 'houseImages'
                }
                resolve(fileInfo);
              });
            }
          });

        const upload = multer({ storage });

        var registerMsg = "";
        var loginMsg = "";
        var editingListingId = "";

        //Passport initialization
        initializePassport(passport, async (email) => {
            const user = await db.collection('users').findOne({email: email});
            //console.log("Initialized user username: "+user.username);
            return user; 
        }, async (id) => {
            const user = await db.collection('users').findOne({_id: new ObjectID(id)});
            //console.log("Username of desinc user: "+user.username);
            return user;
        });

        app.use(passport.initialize());
        app.use(passport.session());

        //Register and login error messages routes 
        app.get('/register-msg', function(req, res){
            res.json({msg: registerMsg});
            registerMsg = "";
        });
        app.get('/login-msg', function(req, res){
            console.log("Getting login msg");
            loginMessage(req, res);
        });

        //Route for registering user
        app.post('/register-user', async function(req, resP){
            console.log("Posting to register-user")
            try {
                console.log("Entering try");
                const hash = await bcrypt.hashSync(req.body.password);
                //console.log("Pass: "+req.body.password);
                console.log("Password hashed");
                //console.log("Pass hash: "+hash);
                bcrypt.compare(req.body.confirmPassword, hash, async function(errC, resC){
                    console.log("Entering compare");
                    //console.log("Conf pass: "+req.body.confirmPassword);
                    if(err){
                        console.error("Comparing error: "+errC);
                    }else if(resC){
                        if(await db.collection('users').findOne({email: req.body.email})){
                            registerMsg = "Email already in use";
                            resP.redirect("http://localhost:3000/register");
                        }else if(await db.collection('users').findOne({name: req.body.name, surname: req.body.surname})){
                            registerMsg = "User with that name already exists";
                            resP.redirect("http://localhost:3000/register");
                        }else{
                            db.collection('users').insert({
                                name: req.body.name,
                                surname: req.body.surname,
                                email: req.body.email,
                                password: hash
                             })
                             resP.redirect("http://localhost:3000/login");
                        }
                    }else{
                        registerMsg = "Passwords do not match, Please try again";
                        console.log("Register msg on server: "+registerMsg);
                        resP.redirect("http://localhost:3000/register");
                    }
                })
            } catch (error) {
                console.error("Error: "+error);
                resP.redirect("http://localhost:3000/register");
            }
        });

        //Route for logging in user
        app.post('/login-user', (req, res, next) => {
            passport.authenticate('local', function(err, user, info){
                if(user){
                    console.log("Returned user: "+user.name+" "+user.surname);
                    req.logIn(user, function(err) {
                        if (err) { 
                            return next(err); 
                        }else{
                            console.log("Logging in");
                            console.log("Logged in user: "+req.user.email);
                            console.log("is authenticated: "+req.isAuthenticated());
                            console.log("Current session: "+JSON.stringify(req.session));
                            return res.redirect('http://localhost:3000/');
                        }
                    });
                }else{
                    return res.redirect('http://localhost:3000/login');
                }
            }, {
              successRedirect: 'http://localhost:3000/',
              failureRedirect: 'http://localhost:3000/login',
              failureFlash: true
            })(req, res, next);
          });

        //Route for checking logged user
        app.get('/logged-user', function(req, res){
            console.log("Getting logged user");
            //console.log("Current session: "+JSON.stringify(req.session));
            //console.log("User: "+req.user);
            console.log(req.isAuthenticated());
            if(req.isAuthenticated()){
                console.log("Authenticated username: "+req.user.email);
                res.json({email: req.user.email});
            }else{
                console.log("User not authenticated");
                res.json({email: null});
            }
        });

        //Route for logging user out
        app.get('/logout-user', async function(req, res){
            console.log("Logging out");
            await req.logout();
            await req.session.destroy( function ( err ) {
                if (err) { console.log("Logout error: "+err); }
                console.log('Successfully logged out');
                console.log("Redirecting to /");
                return res.send(200);
            });
        });

        //Route for creating new listings
        app.post('/create-listing', upload.array('images'), function(req, res, next){
            console.log("Files: "+req.files);
            var imageIDs = [];
            req.files.forEach((file) => {
                imageIDs = imageIDs.concat(file.id);
            });
            db.collection('houses').insert({
                listingType: req.body.listingType,
                description: req.body.description,
                addr: req.body.addr,
                city: req.body.city,
                area: parseInt(req.body.area),
                bedrooms: parseInt(req.body.bedrooms),
                bathrooms: parseInt(req.body.bathrooms),
                parking: parseInt(req.body.parking),
                garden: req.body.garden,
                proximity: parseInt(req.body.proximity),
                price: parseInt(req.body.price),
                email: req.body.email,
                phone: req.body.phone,
                sellerId: req.user._id,
                imageIDs: imageIDs
            });
            res.redirect("http://localhost:3000/createlisting");
        });

        //retrieve users listings
        app.get('/get-listings', async function(req, res){
            console.log("Seller ID: "+req.user._id);
            var listings = await db.collection('houses').find({"sellerId": req.user._id}).toArray();
            res.json(listings);
        });

        //get listing images
        app.get('/images/:fileId', function(req, res){
            var bucket = new mongodb.GridFSBucket(db, {bucketName: 'houseImages'});

            var readstream = bucket.openDownloadStream(ObjectID(req.params.fileId));
            readstream.on("error", function(err){
                res.send("No image found with that title"); 
            });
            readstream.pipe(res);
        });

        app.post('/delete-listing', async function(req, res){
            var listing = await db.collection('houses').findOne({"_id": ObjectID(req.body.id)});
            console.log(listing.imageIDs);
            listing.imageIDs.forEach(async (id) => {
                await db.collection('houseImages.chunks').deleteMany({"files_id": id});
                await db.collection('houseImages.files').deleteOne({"_id": ObjectID(id)});
            })
            console.log("Listing ID: "+req.body.id);
            await db.collection('houses').deleteOne({"_id": ObjectID(req.body.id)});
            res.send(200);
        });

        app.post('/get-listing-by-id', async function(req, res){
            console.log("getting listing...");
            var listing = await db.collection('houses').findOne({"_id": ObjectID(req.body.listingId)});
            console.log(JSON.stringify(listing));
            editingListingId = req.body.listingId;
            res.json(listing);
        });

        app.post('/edit-listing', upload.array('images'), async function(req, res){
            var listing = await db.collection('houses').findOne({"_id": ObjectID(editingListingId)});
            var imageIDs = listing.imageIDs;
            req.files.forEach((file) => {
                imageIDs = imageIDs.concat(file.id);
            });
            await db.collection('houses').updateOne({"_id": ObjectID(editingListingId)}, {$set: {
                listingType: req.body.listingType,
                description: req.body.description,
                addr: req.body.addr,
                city: req.body.city,
                area: parseInt(req.body.area),
                bedrooms: parseInt(req.body.bedrooms),
                bathrooms: parseInt(req.body.bathrooms),
                parking: parseInt(req.body.parking),
                garden: req.body.garden,
                proximity: parseInt(req.body.proximity),
                price: parseInt(req.body.price),
                email: req.body.email,
                phone: req.body.phone,
                sellerId: req.user._id,
                imageIDs: imageIDs
            }});
            editingListingId = "";
            res.redirect("http://localhost:3000/pastlistings");
        });

        app.post('/filter-listings', async function(req, res){
            console.log("Entering filter-listings");
            var listings;
            if(req.body.city == ""){
                console.log("city undefined")
                listings = await db.collection('houses').find({
                    "listingType": req.body.listingType,
                    "bedrooms": {$gte: parseInt(req.body.minBedrooms)},
                    "bathrooms": {$gte: parseInt(req.body.minBathrooms)},
                    "parking": {$gte: parseInt(req.body.minParking)},
                    "garden": req.body.garden,
                    "area": {$gte: parseInt(req.body.minArea)},
                    "price": {$lte: parseInt(req.body.maxPrice)}
                }).toArray();
            }else{
                listings = await db.collection('houses').find({
                    "listingType": req.body.listingType,
                    "city": {$regex: new RegExp(req.body.city, "i")},
                    "bedrooms": {$gte: req.body.minBedrooms},
                    "bathrooms": {$gte: req.body.minBathrooms},
                    "parking": {$gte: req.body.minParking},
                    "garden": req.body.garden,
                    "area": {$gte: req.body.minArea},
                    "price": {$lte: req.body.maxPrice}
                }).toArray();
            }
            console.log("filtered listings: "+JSON.stringify(listings));
            res.json(listings);
        });

        app.post('/send-mail', function(req, res){
            let mailOptions = {
                from: process.env.MAIL,
                to: req.body.toMail,
                subject: "Mail from "+req.body.buyerName+" about your property listing",
                text: "You can contact buyer through his email: "+req.body.fromMail+"\n\n"+req.body.message
            }

            transporter.sendMail(mailOptions, function(err, data){
                if(err){
                    console.log("Error while sending mail: "+err);
                    res.send(100);
                }else{
                    console.log("Mail sent");
                    res.send(200);
                }
            })
        })

        app.listen(port, () => console.log('Listening on port '+port));
    }
});