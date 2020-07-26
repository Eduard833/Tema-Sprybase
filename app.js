const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const app = express();

const port = 6789;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use('/public', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/createAd", (req, res) => {
    res.render("createAd");
});

var AdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Need a title.']
    },
    description: {
        type: Array,
        required: [true, 'Need a description.']
    },
    type: {
        type: String,
        required: [true, 'Need a type.']
    },
    address: {
        type: String,
        required: [true, 'Need an address.']
    },
    price:{
        type:Number,
        required: [true, "Need a price."]
    },
    phone: {
        type: String,
        required: [true, 'Need a phone number.']
    }
});

var Ad = mongoose.model('Ads', AdSchema);

mongoose.connect(('mongodb://localhost:27017/AdsDB'), {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

var db = mongoose.connection;
    

db.on('error', console.error.bind(console, 'connection error:'));
	
db.once('open', () =>{
    console.log('Connected successfully.');
    app.post("/ads", (req, res) => {
        const newAd = new Ad({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            address: req.body.address,
            price: req.body.price,
            phone: req.body.phone
        });

        newAd.save((err, ad) => {
            if(err) {
                console.log(err);
            } else {
                console.log(`${ad.title} successfully added to the collection.`);
            }
        });

        res.redirect("/");
    });
	app.get("/ads", (req, res) => {
        Ad.find((err, items) => {
            if(err) {
                console.log(err);
            } else {
                res.render('showAds', {ads: items});
            }
        });
    });
});


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));

