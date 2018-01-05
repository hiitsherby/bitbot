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
    console.log('event', event);
    // event.reply('這是您的ID，請妥善保管'+ event.message.id).then(function () {
    //     // success 
        
    // }).catch(function (error) {
    //     // error 
    //     console.log('error', error)
    // });
    
    if (event.message.text === '我想出題'){
        firebase.database().ref('users/').on('value', function(snapshot) {
            console.log('snapshot', snapshot.val());//資料庫所有資料
            for (let key in snapshot.val()){//loop through資料
              if (snapshot.val()[key].id == event.message.id && snapshot.val()[key].songlist.length < 3){//如果找到user+還能再加歌
                  event.reply('')
              }
            }
            snapshot.val().indexOf(event.message.id)
        });
        event.reply('共可設定三首歌曲，請輸入第一首，輸入歌手+歌名，格式: 謝金燕+姊姊')
    }
    if (event.message.text.split('').indexOf('+') > -1 ){//如果是點歌的話
        //看看他還有幾首額度，if ok, then push to firebase
        //必須確認身份才知道要用set還是update
        //先把所有user抓下來看看他在不在裡面
        firebase.database().ref('users/'+ event.message.id).set('value', function(snapshot) {
            updateStarCount(postElement, snapshot.val());
        });
        
    }
    
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
