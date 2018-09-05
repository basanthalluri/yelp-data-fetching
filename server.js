let express = require('express');
let request = require('request');
let app = express();
const config_KEYS = require('./config.js');
let db = require("./db.js");
let bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '500mb' }))

app.use(bodyParser.urlencoded({ extended: true }))

app.all('*', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

// Saving Venu Data
app.post('/saveVenuData', function (req, res) {
    let venu = req.body.venu
    if (venu == undefined | venu == "") {
        let message = JSON.parse('{"message":" Please provide venu"}');
        res.status(400).json(message)
    }
    else {
        if (venu == null) {
            let message = JSON.parse('{"message":" Please provide venu"}');
            res.status(400).json(message)
        }
        else {
            db.Data.find({ venu: req.body.venu }, function (err, venuData) {
                var length = venuData.length
                if (length == 0) {
                    let newData = db.Data({
                        venu: req.body.venu,
                        location:req.body.location  
                    });
                    let dataSaved = newData.save()
                    let message = JSON.parse('{"status":"success", "message":"You have successfully created data!" }');
                    res.send(message)
                }
                else {
                    let message = JSON.parse('{"message": "Already saved Please Provide other venu!" }');
                    res.send(message)
                }
            })
        }
    }
})

// Saving Yelp's Restaurents Data using Venues from DB
app.post('/YelpData', function (req, res) {
    let ResultCount = 50;
    let count = 0;
    var limit = 5
    let start = 1
    let Location = req.body.Location;
    var output = getyelp(limit, start);

    function getyelp(limit, start) {
        db.Data.find({}).limit(limit).skip(start).exec(function (err, eachData) {
            let eachDataLength = eachData.length
            eachData.map((single, key) => {
                let venu = single.venu
                let result = yelpSearchReuslt(Location, venu, count, ResultCount)

                //Recursive Function
                function yelpSearchReuslt(Location, venu, count, ResultCount) {
                    let options =
                    {
                        method: 'GET',
                        url: config_KEYS.YELP_URL + Location + "&term=" + venu + "&limit=" + ResultCount + "&offset=" + count + "",
                        headers:
                        {
                            authorization: config_KEYS.YELP_FUSION_API_KEY
                        },
                        body: '{}'
                    };
                    request(options, function (error, response, body) {
                        if (error) {
                            //res.status(400).json({ MESSAGE: config_KEYS.MESSAGE })
                        }
                        else {
                            if (response.statusCode == 429) {
                                res.status(400).json({ MESSAGE: JSON.parse(body) })
                            }
                            else {
                                let data = JSON.parse(body)
                                if (response.statusCode == 400) {
                                    start = limit + start
                                    var yelp3 = getyelp(limit, start);
                                    //res.status(400).json({ MESSAGE: JSON.parse(body) })
                                }
                                else {
                                    let businessesList = data.businesses
                                    let length = businessesList.length
                                    if (length > 0) {
                                        businessesList.map((bussiness, key) => {
                                            let businessName = bussiness.name
                                            let categories = bussiness.categories
                                            let location = bussiness.location
                                            let url = bussiness.url
                                            let rating = bussiness.rating
                                            let coordinates = bussiness.coordinates
                                            let latitude = coordinates.latitude
                                            let longitude = coordinates.longitude
                                            let address = location.address1
                                            let country = location.country
                                            let address2 = location.address2
                                            let address3 = location.address3
                                            let display_address = location.display_address
                                            let city = location.city
                                            let state = location.state
                                            let zip_code = location.zip_code
                                            let phone = bussiness.phone
                                            let display_phone = bussiness.display_phone
                                            let categoriesLength = categories.length
                                            let categories2 = []
                                            categories.map((result, key) => {
                                                let obj = {}
                                                obj.title = result.title
                                                obj.alias = result.alias
                                                categories2.push(obj)
                                                categoriesLength--
                                                if (categoriesLength == 0) {
                                                    let newUser = db.Details({
                                                        businessName: businessName, venu: venu, location: {
                                                            address1: address,
                                                            address2: address2, address3: address3, city: city, zip_code: zip_code, country: country,
                                                            state: state
                                                        }, category: categories2, url: url, rating: rating, display_address: display_address,
                                                        phone: phone, display_phone: display_phone, coordinates: { latitude: latitude, longitude: longitude }
                                                    });
                                                    let user = newUser.save()
                                                }
                                            })
                                            length--;
                                            if (length == 0) {
                                                count = count + ResultCount
                                                let result2 = yelpSearchReuslt(Location, venu, count, ResultCount)
                                            }
                                        })
                                    }
                                    else {
                                        start = limit + start
                                        var yelp3 = getyelp(limit, start);
                                    }
                                }
                            }
                        }
                    })
                }
            })
            eachDataLength--
            if (eachDataLength == 0) {
                start = limit + start
                var yelp2 = getyelp(limit, start);
            }
        })
    }
})

// Initializing Server
let server = app.listen(5005, function () {
    let host = server.address().address
    let port = server.address().port
    console.log('app running at host', port)
});