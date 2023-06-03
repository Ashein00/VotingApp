
const app = require("../app");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


exports.getHome = (req,res)=>{

    res.render("home");
}