const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb+srv://admin:rULTn0hL49ZYqOPj@yelpcampwproject.k2o2dgx.mongodb.net/YelpCampProject?retryWrites=true&w=majority'
, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10.99;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'http://source.unsplash.com/collection/2001560',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos cum sint necessitatibus eius sunt, quisquam a iste rerum natus cumque atque soluta suscipit doloremque, quod laboriosam obcaecati dolores quasi molestiae.",
            price
        })
        await camp.save()

    }
}

seedDB().then(() =>{
mongoose.connection.close()
})

