const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const getParties = require("./public/scripts/getParties");
const getVotes = require("./public/scripts/getVotes");

var isLogedIn = false;
var currentUser;


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
  name: String,
  voted:Boolean
};

const voteSchema = {
  NIC: String,
  party: String,
  vote1: String,
  vote2: String,
  vote3: String
};

const candidateSchema = {
  name: String,
  qualifications: String,
  party: String,
  voting_number: Number
};


const User = mongoose.model("User", userSchema);
const Vote = mongoose.model("vote", voteSchema);
const Candidate = mongoose.model("Candidate", candidateSchema,"candidates",{ versionKey: false });

// <-- app -->

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//get methods

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/vote", function (req, res) {
  if (isLogedIn){
    console.log(currenUser);
    Candidate.find({},function(err,cands){
        
      if(err){
        console.log(err);
      }
      const partyArrays = getParties(cands);  
    
      res.render("vote", { user : currentUser , parties : partyArrays});
  
    })
  }else{
    const link = "/login";
    res.render("redirect",{msg : "you need to login first! please click the login button bellow",link:link, button_name:"Log In"});
  }  
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/c_register", function (req, res) {
  res.render("c_register");
});

app.get("/results", function (req, res) {
  Vote.find({},function(err,votes){  
    if(err){
      console.log(err);
    }
    const voteArrays = getVotes(votes);

    res.render("results", {votes : voteArrays });

  })
});




//post methods

app.post("/vote", function (req, res) {

  if(currentUser.voted ==false){

    const vote = req.body.myCheckbox;

    const [vote1,vote2,vote3] = vote;

    const party = vote1.split('|')[0];
    const newVote = new Vote({
     NIC: currentUser.NIC,
     party:party,
     vote1:vote1,
     vote2:vote2,
     vote3:vote3

    });
    newVote.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        if(currentUser){
          currentUser.voted = true;
          User.findOne({ NIC: currentUser.NIC })
            .then(user => {
              if (user) {
                user.voted = true;
                return user.save();
              } else {
                throw new Error('User not found');
              }
            })
  
        res.redirect("/vote");
        }else{
          res.redirect("/");
        }
        }
      
  });

  }else{
    const link = "/results";
     
    res.render("redirect",{msg:"you have already voted",link:link,button_name:"Results"});
  }
});  
  



app.post("/register", function (req, res) {
  const newUser = new User({
    name: req.body.name,
    NIC: req.body.NIC,
    password: req.body.password,
    voted: false
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
          res.redirect("/vote");
        } else {
          const link = "/login";
          res.render("redirect",{msg : "Incorrect password! please try again.", link:link,button_name:"Log In"});
        }
      } else {
        const link = "/login";
        res.render("redirect",{msg : "User not defined! please check your username and password again.",link:link,button_name:"Log In"});
      }
    }
  });
});

app.post("/c_register", function (req, res) {
  const newValue = req.body.qualification.replace(/\n/g, '');
  const newCandidate = new Candidate({
    
    name: req.body.fname +" "+ req.body.lname,
    qualifications:newValue,
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



//server config

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server has started successfully");
});
