const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const session = require('express-session')
const Joi = require('joi')
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override");
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect(
  "mongodb+srv://admin:rULTn0hL49ZYqOPj@yelpcampwproject.k2o2dgx.mongodb.net/YelpCampProject?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: 'betterSecret!',
  resave:false,
  saveUnitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:  1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
})



app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)
app.use(express.static(path.join(__dirname, "public")))



app.get('/', (req, res) => {
  res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = "Something Went Wrong"
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});