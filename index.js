/*
* Load dependencies and secure access tokens
*/

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN
const vocabulary = require('./vocbulary')

app.set('port',(process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send("Hello World")
})

// Have facebook verify the webhook token

app.get('/webhook/', function(req, res) {
	if(req.query['hub.verify_token'] === token) {
		res.send(req.query['hub.challenge'])
	}

	res.send('No entry')
})


// Have facebook post on webhook

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
      // if event is a message  
        if (event.message) {
          receivedMessage(event);
      // if event is a postback    
        } else if (event.postback) {
          receivedPostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

// I added a comment

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  // Need to parse message and filter out keywords
  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    // should match agains keywords
    switch (messageText) {
      case 'help':
        quickReply(senderID);
      break;
      case 'generic':
        sendGenericMessage(senderID);
        break;
      case 'hello':
      	greeter(senderID);
      	break;
      case 'hot':
      	sendTextMessage(senderID, "Yup, I'm a bot");
      	break;
      case 'how are you?':
      	sendTextMessage(senderID, "I'm a bot, are you Human?");
      	break;
      case 'yes':
      	sendTextMessage(senderID, "Good");
      	break;
      case 'menu':
        quickReply(senderID, "Have food and beverages which would you like? ", "food", "beverage");
        break;        
      case 'push to master':
      	sendTextMessage(senderID, "Authenticated to master");
      	break;
      case 'push to test-deploy':
        sendTextMessage(senderID, "Authenticated to test-deploy");
        break;
      case 'doom':
        sendImage(senderID);
        break;
      case 'metal':
        sendVideo(senderID);
        break;
      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  } else {
    sendTextMessage(senderID, "I don't know that. I'm just a bot");
  } 
}

// Incomplete greeter: Does not personalize message
function greeter(recipientId) {
 var messageData = {
  setting_type:"greeting",
  greeting:{
    text:"Hi {{user_first_name}}, welcome to this bot."
  }
};
  callSendAPI(messageData);
}

// sends img

function sendImage(recipientId) {
  var messageData = {
  recipient:{
    id: recipientId
  },
  message:{
    attachment:{
      type:"image",
      payload:{
        url:"https://i.ytimg.com/vi/RO90omga8D4/maxresdefault.jpg"
      }
    }
  }
}

callSendAPI(messageData);

}

// sends vid

function sendVideo(recipientId) {
  var messageData = {
  recipient:{
    id: recipientId
  },
  message:{
    attachment:{
      type:"video",
      payload:{
        url:"https://www.youtube.com/watch?v=LhIS4FdS7co"
      }
    }
  }
}

callSendAPI(messageData);

}



/*
* Uses the send message api template. See https://developers.facebook.com/docs/messenger-platform/send-api-reference
*/

function sendGenericMessage(recipientId, messageText) {
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

// use quick reply 
function quickReply(recipientId, ask, option1, option2) {
  var messageData = {
  recipient:{
    id: recipientId
  },
  message:{
    text:ask,
    quick_replies:[
      {
        content_type:"text",
        title: option1,
        payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
      {
        content_type:"text",
        title:option2,
        payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ]
  }
};
  callSendAPI(messageData);
}


/*
* Uses the send message api template. See https://developers.facebook.com/docs/messenger-platform/send-api-reference
*/

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

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}


typeof vocbulary.test();


app.listen(app.get('port'), function() {
	console.log('Running on port', app.get('port'))
}) 