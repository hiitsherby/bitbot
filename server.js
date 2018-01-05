//
var express = require('express');
var http = require('http');
const app = express();
//=============LINE MSG API==================
var linebot = require('linebot');
 
var bot = linebot({
    channelId: '1523389063',
    channelSecret: '2a72b83f27e654b9896f13c48f586cf6',
    channelAccessToken: 'CyYxFlpU0arJR+G2rsrnzmd8vBb2LZSp+p2hw+SOkO1R4Qfv7OC9lRIxWlfLR29GB/m5oo/ajo7+cBfYJk6tRJu0QEuFOUnuYiw1Z1AXmgJxnzyhCflHXCFI0NxGzgBVGRJg8MxmvSoPGjp63Xw2KQdB04t89/1O/w1cDnyilFU='
});

const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);
app.listen(3000);

//============Firebase===============

var firebase = require('firebase');
// Initialize Firebase
var config = {
  apiKey: "AIzaSyASVunPsOES0e6VHGGDhsVUD1vG-N-y8TA",
  authDomain: "bit-bot-623f7.firebaseapp.com",
  databaseURL: "https://bit-bot-623f7.firebaseio.com",
  projectId: "bit-bot-623f7",
  storageBucket: "bit-bot-623f7.appspot.com",
  messagingSenderId: "428064833019"
};
firebase.initializeApp(config);

//===========FETCH BITCOIN===========
var fetch = require('node-fetch');
var url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
var usd_bit = '';
var rate = '';
fetch(url)
.then(function(res){
  console.log('parsing bitcoin rate');
  return res.json()
})
.then(function(data){
  usd_bit = data.bpi.USD.rate
})
.catch(function(err){
  console.log('error', err);
});

//currency exchange
fetch('https://api.fixer.io/latest?symbols=USD,TWD')
.then(function(res){
  console.log('parsing currency rate');
  return res.json()
})
.then(function(data){
  console.log('data2', data);
})
.catch(function(err){
  console.log('error', err);
});

//===================================

bot.on('message', function (event) {
    console.log('data', event);
    event.reply(usd_bit).then(function (data) {
        // success 
        
    }).catch(function (error) {
        // error 
        console.log('error', error)
    });
});
 
var uid; // uid from event
bot.on('follow',   function (event) { 
  uid = event.source.userId;
  
  var database = firebase.database().ref('users').set({
      uid: uid
  });
  
});
bot.on('unfollow', function (event) { 
  //remove user from send list
});




//===========================================

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
 console.log('listening on port 3000')
});
