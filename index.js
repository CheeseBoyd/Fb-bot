/*
* Load dependencies and secure access tokens
*/

// T

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
                  sendTextMessage(senderID, "Hello there"); 
                  break speechLoop;
                }
                else if (Object.is(key, 'GOODBYE')) {
                  sendTextMessage(senderID, "Goodbye there") 
                  break speechLoop;
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



/* ##############################################################################
*  TESTING FEED PARSER API 
*/
function getFeed(senderID){
  
var parser = require('rss-parser');

parser.parseURL('https://www.reddit.com/.rss', function(err, parsed) {
  console.log(parsed.feed.title);
  parsed.feed.entries.forEach(function(entry) {

 console.log(Object.getOwnPropertyNames(entry));
// inject output to messenger card
singleCard(senderID, entry.title, entry.description, entry.link, entry.image, "see more");

    console.log(entry.title + ':' + entry.link);
  })
}); 


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

function getUserInfo(senderID){
  request({
    uri: 'https://graph.facebook.com/v2.6/'+senderID+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access }, // ----> An active access token must be used to query information about the current user.
    method: 'GET'
  },
  function(error, response, body){
    if(!error){
      console.log('<--------------RESPONSE-------------->')         
      console.log(response)
      console.log('<--------------RESPONSE END-------------->')      
    } else {
      console.log('<--------------FAIL-------------->')        
      console.log("Unable to send message")
      console.log(response)
      console.log(error)
      console.log('<--------------FAIL END-------------->')       
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
  

/* Test this out by
   Making the bot understand addiiton e.g 1 + 1 = 2
*/

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}



app.listen(app.get('port'), function() {
  console.log('Running on port', app.get('port'))
}) 
