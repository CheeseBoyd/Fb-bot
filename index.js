/*
* Load dependencies and secure access tokens
*/


'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN
const sp = require('./speech.js')
const speech = sp.get() 
const speechKeys = Object.keys(speech) 

let userMap = null; // Map of user information


app.set('port',(process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.send("Hello World")
})

app.get('/webhook/', function(req, res) {
  if(req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge'])
  }

  res.send('No entry')
})


app.post('/webhook', function (req, res) {
  var data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);  
        } else if (event.postback) {
          receivedPostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    /*
     Assume all went well.
     You must send back a 200, within 20 seconds, to let us know
     you've successfully received the callback. Otherwise, the request
     will time out and we will keep trying to resend.
    */    
    res.sendStatus(200);
  }
});

function escapeChars(value) {
     return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
}


/*Initial interaction with user*/
greetingText()
getStarted()



function receivedMessage(event) {

  let senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log("Received message for user %d and page %d at %d with message:", 
  senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));
  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var wordsLeft = true
  var scaffold = ["\\b", 'dummyValue' ,"\\b" ]
  callUserAPI(senderID)
  if (messageText) {
  speechLoop: {
      for (let key of speechKeys) {
          for(let value of speech[key]) {
            scaffold.splice(1, 1, value)
            let newValue = scaffold.join("")            
            let regex = new RegExp(newValue, 'i')
            console.log(regex)
            if(regex.test(messageText)) {
                if (Object.is(key, 'GREET')){
                  makeMenu()                 
                  sendTextMessage(senderID, sp.getRandomResponse('R_GREET'))                 
                  break speechLoop;
                }
                else if (Object.is(key, 'GOODBYE')) {
                  sendTextMessage(senderID, sp.getRandomResponse('R_GOODBYE'))  
                  break speechLoop;
                } else if(Object.is(key, 'INQUIRE')){
                  sendTextMessage(senderID, sp.getRandomResponse('R_INQUIRE'))
                  sendGenericMessage(senderID)
                  break speechLoop; // gotta be a better way to do this... 
                }   

            }

          }
        }

        wordsLeft = false;
  } // End of speech label
      if(!wordsLeft) { sendTextMessage(senderID, "¯\\_(ツ)_/¯   I don't know what you meant by --    " + messageText)  } 

  } else {
    sendTextMessage(senderID, "Message with attachment received");
  }
}



function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*#################--PRE-LAUNCH CHECKLIST--######################*/

// TEST Greeting text & Get Started button

function greetingText(){
  var messageData = {
    setting_type:"greeting",
    greeting:{
      "text":"Say Hello to me!"
    }
  }

  startConvo(messageData)
}



function getStarted(){
  var messageData = { 
    get_started:{
      payload:"GET_STARTED_PAYLOAD"
    }
  }

  getStartedButton(messageData)
}


function getStartedButton(messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'POST',
    json: messageData
  },
  function(error, response, body){
    if(!error){
      console.log('<--------STARTED BUTTON RESPONSE-------->')
      console.log(response)
      console.log('<------STARTED BUTTON RESPONSE END------>')      
    } else {
      console.log('<--------------FAILED BUTTON INIT-------------->')        
      console.log("Unable to send message")
      console.log(response)
      console.log(error)
      console.log('<--------------FAIL BUTTON INIT END-------------->')    
    }
  })


}

function startConvo(messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'POST',
    json: messageData
  },
  function(error, response, body){
    if(!error){
      console.log('<--------STARTED CONVO RESPONSE-------->')
      console.log(response)
      console.log('<------STARTED CONVO RESPONSE END------>')      
    } else {
      console.log('<--------------FAILED CONVO INIT-------------->')        
      console.log("Unable to send message")
      console.log(response)
      console.log(error)
      console.log('<--------------FAIL CONVO INIT END-------------->')    
    }
  })
}

function makeMenu(){
  var messageData = {
    persistent_menu:[
      {
        locale:"default",
        composer_input_disabled:true,
        call_to_actions:[
          {
            type:"web_url",
            title:"r/news",
            url:"https://www.reddit.com/r/news/",
            webview_height_ratio:"full"
          },        
          {
            title:"Get local news",
            type:"nested",
            call_to_actions:[
              {
                type:"web_url",
                title:"Manila Bulletin",
                url:"http://mb.com.ph/",
                webview_height_ratio:"full"
              },
              {
                type:"web_url",
                title:"Philippine Star",
                url:"http://www.philstar.com/",
                webview_height_ratio:"full"
              },
              {
                type:"web_url",
                title:"Daily Inquirer",
                url:"http://www.inquirer.net/",
                webview_height_ratio:"full"
              },
              {
                type:"web_url",
                title:"The Manila Times",
                url:"http://www.manilatimes.net/news/",
                webview_height_ratio:"full"
              },
              {
                title:"Up to 5 Items Only",
                type:"postback",
                payload:"ITEM_5_PAYLOAD"
              }                            
            ]
          },
          {
            title: "Do a postback",
            type: "postback",
            payload: "Top_Level_menu_PostBack"
          },       
        ]
      },
      {
        locale:"en_US",
        composer_input_disabled:false
      }
    ]
  }
  
  showPersitentMenu(messageData)
}


function showPersitentMenu(messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=YOUR_ACCESS_TOKEN_HERE',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'POST',
    json: messageData
  },
   function(error, response, body){
    if(!error){
      console.log('Persistent menu status:')
      console.log(JSON.parse(response.body))    
    } else {
      console.log('Persistent menu failed: ------------------>')        
      console.log("Unable to send message")
      console.log(response)
      console.log("<---------ERROR MESSAGE START-------------->")
      console.log(error) 
      console.log("<----------ERROR MESSAGE END--------------->")    
    }
  })


}

/* NOTE: To test 'get-started button' on messenger app you first need to clear the data and any instance of 
  any previous conversation in order for the button to appear
  OR
  Use messenger.com
/*

for persistend menu --> make a POST request at https://graph.facebook.com/v2.6/me/messenger_profile?access_token=YOUR_ACCESS_TOKEN_HERE
for get started button --> make a POST request at https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN
*/

function makeRequests(messageData, method, uri){
  request({
    uri: uri,
    qs: { access_token: access }, 
    method: method,
    json: messageData
  },
   function(error, response, body){
    if(!error){
      console.log(method + " request to: " + url)
      console.log(JSON.parse(response.body))    
    } else {       
      console.log("Unable to send " + method + " request to " + url)
      console.log(response)
      console.log("<---------ERROR MESSAGE START-------------->")
      console.log(error) 
      console.log("<----------ERROR MESSAGE END--------------->") 
    }
  })  
} 

/*#################--PRE-LAUNCH CHECKLIST--######################*/


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

/*function getUserInfo(senderID, initalGreetMsg){
  request({
    uri: 'https://graph.facebook.com/v2.6/'+senderID+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'GET'
  },
  function(error, response, body){
    var user = null
    if(!error){
      user = JSON.parse(response.body)
      console.log(user) 
      console.log("Userf first name --> "+user.first_name)
      sendTextMessage(senderID, initalGreetMsg+ " " +user.first_name)
    } else {
      console.log('<--------------FAIL-------------->')        
      console.log("Unable to send message")
      console.log(response)
      console.log(error)
      console.log('<--------------FAIL END-------------->')    
    }
  })

}*/

function callUserAPI(senderID){
  request({
    uri: 'https://graph.facebook.com/v2.6/'+senderID+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'GET'
  },
  function(error, response, body){
    if(!error){
      userMap = new Map(Object.entries(JSON.parse(response.body)))
      console.log(userMap)
    } else {      
      console.log("Unable to call UserAPI")
      console.log(response)
      console.log(error)  
    }
  })

}
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
  


function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;
  if(payload == 'GET_STARTED_PAYLOAD'){
    sendTextMessage(senderID, "get started payload delivered and filtered");
    makeMenu() 
    return true
  }
  // if payload is radarada... so on.. do this ->
  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}



app.listen(app.get('port'), function() {
  console.log('Running on port', app.get('port'))
}) 
