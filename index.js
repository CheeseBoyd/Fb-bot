/*
* Load dependencies and secure access tokens
*/


const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

// Load speech.js
const speech = require('./speech.js')


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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}



 


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
  var text = messageText.toLowerCase()

  if (messageText) {

  switch (messageText.toLowerCase()) {
    case 'help':
        quickReply(senderID, "Hi. I'm a bot that can get you coffee or news. What will you have?", "try products", "get news");
    break;      
    case 'generic':
      sendGenericMessage(senderID);
      break;
    case 'hello':
      quickReply(senderID, "Hi I am test-bot. I can get you coffee or the latest news for you. So. what would you like?", "try products", "get news");
    	break;
    case 'get news':
      singleCard(senderID, "Headlines", "More on MB.com.ph", "http://mb.com.ph/", "http://www.komikon.org/wp-content/uploads/2013/08/mb-logo-guide-1-1024x394.jpg")
      break;
    case 'try products':
      singleCard(senderID, "Visit us", "Promise of good coffee just for you", "https://web.facebook.com/PaperPlusCupCoffee/", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/275px-A_small_cup_of_coffee.JPG", "I'll go there");
      quickReply(senderID, "You can order at our location or you can order here :)", "Here", "I'll go there");
      break;
    case 'Here':
      quickReply(senderID, "Okay. What will you have?", "Black Tea", "Caramel Frapp", "Black brewed","Berry Tea");
      break;
    case 'I\'ll go there':
      sendTextMessage(senderID, "Okay. Were at the ground floor lobby. Bye!");
      break;
    case 'bot':
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
      sendImage(senderID, "https://i.ytimg.com/vi/RO90omga8D4/maxresdefault.jpg");
      break;
    case 'rss':
    	testAPI(senderID);
    	break;
    case 'list':
    	displayList(senderID);
    	break;
    default:
      sendTextMessage(senderID, "¯\\_(ツ)_/¯   I don't know what you meant by --    " + messageText);
  }

  } else {
    sendTextMessage(senderID, "Message with attachment received");
}


function sendImage(recipientId, url) {
  var messageData = {
  recipient:{
    id: recipientId
  },
  message:{
    attachment:{
      type:"image",
      payload:{
        url: url,
        is_reusable: true
      }
    }
  }
}

callSendAPI(messageData);

}

/*
* Adds quick reply functionality:
* Can give up to 5 options
*/
  function quickReply(recipientId, ask, option1, option2, option3, option4, option5) {
    var messageData = null;

    if ((option3 && option4)&&option5) {

        messageData = {
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
            },
            {
              content_type:"text",
              title: option3,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
              content_type:"text",
              title: option4,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
              content_type:"text",
              title: option5,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },                              
          ]
        }
      };
      callSendAPI(messageData);           

    } else if (option3 && option4) {

        messageData = {
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
            },
            {
              content_type:"text",
              title: option3,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
              content_type:"text",
              title: option4,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            }                   
          ]
        }
      };
      callSendAPI(messageData);   

    } else if(option3) {

        messageData = {
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
            },
            {
              content_type:"text",
              title: option3,
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            }                             
          ]
        }
      };
      callSendAPI(messageData);        

    } else {

        messageData = {
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

  }


function singleCard(recipientId, title, subTitle, url, imgUrl, button1) {
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
            title: title,
            subtitle: subTitle,
            item_url: url,               
            image_url: imgUrl,
            buttons: [{
              type: "web_url",
              url: url,
              title: button1
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}


function displayList(recipientId) {
var messageData = {
  recipient:{
    id:recipientId
  }, message: {
    attachment: {
        type: "template",
        payload: {
            template_type: "list",
            elements: [
                {
                    title: "Reddit",
                    image_url: "https://assets.ifttt.com/images/channels/1352860597/icons/on_color_large.png",
                    subtitle: "Stuff around the web",
                    default_action: {
                        type: "web_url",
                        url: "https://www.reddit.com/",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: "https://www.reddit.com/"
                    },
                    buttons: [
                        {
                            title: "See",
                            type: "web_url",
                            url: "https://www.reddit.com/",
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: "https://www.reddit.com/"                        
                        }
                    ]
                },
                {
                    title: "9gag",
                    image_url: "http://icons.iconarchive.com/icons/martz90/circle/512/9gag-icon.png",
                    subtitle: "Have fun",
                    default_action: {
                        type: "web_url",
                        url: "https://www.9gag.com/",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: "https://www.9gag.com/"
                    },
                    buttons: [
                        {
                            title: "Shop Now",
                            type: "web_url",
                            url: "https://www.9gag.com/",
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: "https://www.9gag.com/"                        
                        }
                    ]                
                }
            ],
             buttons: [
                {
                    title: "View More",
                    type: "postback",
                    payload: "payload"                        
                }
            ]  
        }
    }
}
    
}

callSendAPI(messageData);
}

/* ##############################################################################
*  TESTING FEED PARSER API 
*/
function testAPI(senderID){
	
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



app.listen(app.get('port'), function() {
	console.log('Running on port', app.get('port'))
}) 
