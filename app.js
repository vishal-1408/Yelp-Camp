var express = require("express");
var app = express();
var mongoose = require("mongoose");
var Camp = require("./models/camps.js");
var Comment = require("./models/comments.js");
var bodyparser = require("body-parser");
var seedDb = require("./seeds.js");
var User = require("./models/users.js");
var passport = require("passport");
var localStrategy = require("passport-local");
var expressSession = require("express-session");
var campRoutes = require("./routes/camps.js");
var commentsRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");
var methodOverride = require("method-override");
var flash = require("connect-flash");


mongoose.set("useFindAndModify",false);
mongoose.set("useCreateIndex",true);
mongoose.set("useUnifiedTopology",true);
mongoose.set("useNewUrlParser",true);
mongoose.connect("mongodb+srv://vishalreddy:<password>@cluster0-wzf6j.mongodb.net/test");


app.use(bodyparser.urlencoded({extend:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(expressSession({
  secret : "i am vishal reddy chintham",
  resave : false,
  saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDb();    // seeding the db


//middleware for every route
app.use(function(req,res,next){
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use("/campgrounds",campRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use(indexRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
