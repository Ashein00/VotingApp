const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const getParties = require("./public/scripts/getParties");


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
  name: String
};

const voteSchema = {
  NIC: String,
  party: String,
  vote1: String,
  vote2: String,
  Vote3: String,
};

const candidateSchema = {
  name: String,
  qualifications: String,
  party: String,
  voting_number: Number
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
    Candidate.find({},function(err,cands){
        
      if(err){
        console.log(err);
      }
      const partyArrays = getParties(cands);
      
      // console.log(partyArrays[0][2].name)

      res.render("vote", { user : currentUser , parties : partyArrays});

    })
  }else{
    res.render("redirect",{msg : "you need to login first! please click the login button bellow"});
  }  
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/c_register", function (req, res) {
  res.render("c_register");
});

app.get("/results", function (req, res) {
  res.render("results");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    name: req.body.name,
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
          res.render("vote", { user : currentUser });
        } else {
          res.render("redirect",{msg : "Incorrect password! please try again."});
        }
      } else {
        res.render("redirect",{msg : "User not defined! please check your username and password again."});
      }
    }
  });
});

app.post("/c_register", function (req, res) {
  const newCandidate = new Candidate({
    name: req.body.fname +" "+ req.body.lname,
    qualifications: req.body.qualification,
    party:req.body.party,
    voting_number:req.body.voting_number

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