const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var isLogedIn = false;
var currentUser = null;

// <-- database connection -->

mongoose.set("strictQuery", false);
//mongoose.connect("mongodb://localhost:27017/votingAppDB", { useNewUrlParser: true });

const conn_str =
  "mongodb+srv://sanjueranga:A8D0iBJyKqXgTtYy@cluster0.rl958vp.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  conn_str,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("MongoDB Connection Failed");
    } else {
      console.log("Mongodb is connected");
    }
  }
);

// <-- Creating users and votes schemas -->

const userSchema = {
  NIC: String,
  password: String,
};

const voteSchema = {
  NIC: String,
  party: String,
  vote1: String,
  vote2: String,
  Vote3: String,
};

const candidateSchema = {
  Name: String,
  qualifications: String,
  party: String,
};

const User = mongoose.model("User", userSchema);
const Vote = mongoose.model("vote", voteSchema);
const Candidate = mongoose.model("Candidate", candidateSchema);

// <-- app -->

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/vote", function (req, res) {
  if (isLogedIn){
    res.render("vote", { user : currentUser });
  }else{
    res.render("register");
  }  
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/c_register", function (req, res) {
  res.render("c_register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    NIC: req.body.NIC,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/login", function (req, res) {
  const NIC = req.body.NIC;
  const password = req.body.password;

  User.findOne({ NIC: NIC }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          isLogedIn = true;
          currentUser = foundUser;
          res.render("vote", { status: "you can vote!", user: curr});
        } else {
          res.render("vote", { status: "wrong password" });
        }
      } else {
        res.render("vote", { status: "Sorry:( you can't vote,please login!" });
      }
    }
  });
});

app.post("/c_register", function (req, res) {
  const newCandidate = new Candidate({
    Name: req.body.Name,
    qualifications: req.body.qualifications,
  });

  newCandidate.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server has started successfully");
});