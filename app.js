const express = require("express");
const bodyParser = require("body-parser");
const getParties = require("./public/scripts/getParties");
const getVotes = require("./public/scripts/getVotes");
const connectDatabase = require("./config/dbconfig");
const session = require("express-session");




// <-- database connection -->

connectDatabase();

const User = require("./Models/user");
const Candidate = require("./Models/candidate");
const Vote = require("./Models/vote");

// <-- app -->

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: "OIDAFJAI390IOjkl9POJKL9iokN78UHJK",
  resave: false,
  saveUninitialized: false
}));


//get methods

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/vote", async function (req, res) {
  
  if (req.session.isLogedIn){
    try {
     
    const cands = await Candidate.find({});
    const partyArrays = getParties(cands);  
    
    res.render("vote", { parties: partyArrays });
  } catch (err) {
      console.log(err);
    }
  } else {
    const link = "/login";
    res.render("redirect", {
      msg: "You need to login first! Please click the login button below",
      link: link,
      button_name: "Log In"
    });
  }  
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/c_register", function (req, res) {
  res.render("c_register");
});

app.get("/results", async function (req, res) {
  try {
    const votes = await Vote.find({});
    const voteArrays = getVotes(votes);

    res.render("results", { user: req.session.currentUser, votes: voteArrays });
  } catch (err) {
    console.log(err);
  }
});


//post methods

  

app.post("/register", async function (req, res) {
  try {
    const newUser = new User({
      name: req.body.name,
      NIC: req.body.NIC,
      password: req.body.password,
      voted: false
    });

    await newUser.save();
    res.render("redirect", {
      msg: "You have successfully registered. Please login!",
      link: "/login",
      button_name: "Log In"
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async function (req, res) {
  try {
    const NIC = req.body.NIC;
    const password = req.body.password;

    const foundUser = await User.findOne({ NIC: NIC });

    if (foundUser) {
      if (foundUser.password === password) {
        req.session.isLogedIn = true;
        req.session.currentUser = foundUser;
        res.redirect("/vote");
      } else {
        const link = "/login";
        res.render("redirect", {
          msg: "Incorrect password! Please try again.",
          link: link,
          button_name: "Log In"
        });
      }
    } else {
      const link = "/login";
      res.render("redirect", {
        msg: "User not defined! Please check your username and password again.",
        link: link,
        button_name: "Log In"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/c_register", async function (req, res) {
  try {
    const newValue = req.body.qualification.replace(/\n/g, '');
    const newCandidate = new Candidate({
      name: req.body.fname + " " + req.body.lname,
      gender:req.body.gender,
      qualifications: newValue,
      party: req.body.party,
      voting_number: req.body.voting_number
    });

    await newCandidate.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/vote", async function (req, res) {
  
  if (req.session.currentUser.voted!=true) {
    try {
      const vote = req.body.myCheckbox;
      const [vote1, vote2, vote3] = vote;
      const party = vote1.split('|')[0];
      
      const newVote = new Vote({
        NIC: req.session.currentUser.NIC,
        party: party,
        vote1: vote1,
        vote2: vote2,
        vote3: vote3
      });

      await newVote.save();

      if (req.session.currentUser) {
       
        req.session.currentUser.voted = true;
        const user = await User.findOne({ NIC: req.session.currentUser.NIC });
        if (user) {
          user.voted = true;
          await user.save();
        } else {
          throw new Error('User not found');
        }
        res.redirect("/vote");
      } else {
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  }else{
    const link = "/results";
     
    res.render("redirect",{msg:"you have already voted",link:link,button_name:"Results"});
  }
});


//server config

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server has started successfully");
});
