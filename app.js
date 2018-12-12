var express  = require("express");
var request  = require("request");
var bdParser = require("body-parser");
var http     = require("http"); 
var mongoose = require("mongoose");

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '../public'));


app.get("/",function(req,res){
    res.render("home");
});
app.get("/mastery",function(req,res){
    request("https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/100010686?api_key=RGAPI-72907cb3-540c-4a35-bee0-6ff8cd9a4270",function(error,response,body){
        if(!error){
            var parsedbd = JSON.parse(body);
            res.render("mastery.ejs",{parsedbd:parsedbd});
        }else{
            res.send(error);
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started!");
});