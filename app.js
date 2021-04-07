//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/logout", function(req, res){
  res.render("logout");
});


app.post("/register", function(req, res){
  const newUser =  new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        let l = password.length;
        // console.log(l);
        let flag = 1;
        for(i=0;i<l;i++){
          // console.log(String.fromCharCode(foundUser.password.charCodeAt(i) + 1));
          // console.log(password.charAt(i));
          if(String.fromCharCode(foundUser.password.charCodeAt(i) + 1) != password.charAt(i))
          flag=0;
        }

        if (foundUser.password === password) {
          // console.log("1");
          res.render("secrets");
        }
        else if(Boolean(flag)){
          // console.log("2");
          res.render("secrets");
        }
        else{

          // console.log("3");
          var str1 = foundUser.password;
          var arr = str1.split('');
          var tmp;
          for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
              /* if ASCII code greater then swap the elements position*/
              if(arr[i] > arr[j]){
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
              }
            }
          }
          str1 = arr.join('');



          var str2 = password;
          var arr = str2.split('');
          var tmp;
          for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
              /* if ASCII code greater then swap the elements position*/
              if(arr[i] > arr[j]){
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
              }
            }
          }
          str2 = arr.join('');
          
          if(str1 === str2){
            res.render("secrets");
          }
          else{
            res.render("wrong")
          }
        }
      }
    }
  });
});







app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});
