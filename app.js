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

//create schema for mongodb to store mastery info.
mongoose.connect("mongodb://localhost/LOLStats");
var masterySchema = mongoose.Schema({
    userID: String,
    championID: String,
    championLevel: String,
    lastPlayTime: String,
});
var mas = mongoose.model("mastery",masterySchema);

app.get("/mastery",function(req,res){
    request("https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/100010686?api_key=RGAPI-f754480e-8116-4abe-bbff-09dff020e67b",function(error,response,body){
        if(!error){
            var parsedbd = JSON.parse(body);
            res.render("mastery.ejs",{parsedbd:parsedbd});
            //send the mastery to mongod db
            for (var i=0;i<parsedbd.length;i++){
                var m = new mas({
                   userID: parsedbd[i]["playerId"],
                   championID: parsedbd[i]["championID"],
                   championLevel: parsedbd[i]["championLevel"],
                   lastPlayTime: parsedbd[i]["lastPlayTime"]
                });
                m.save(function(error,ret){
                    if(error){
                        console.log("Failed to save mastery to database");
                    }else{
                        console.log("We just save a mastery:");
                        console.log(ret);
                    }
                });
            }
        }else{
            res.send(error);
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started!");
});