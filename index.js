'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN
const send = require('./send.js')
const sp = require('./speech.js')
const speech = sp.get() 
const speechKeys = Object.keys(speech) 
let userMap = null 
// Map of user information for later use



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
  let data = req.body

  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      let pageID = entry.id
      let timeOfEvent = entry.time
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event)  
        } else if (event.postback) {
          receivedPostback(event)
        } else {
          console.log("Webhook received unknown event: ", event)
        }
      })
    })

    /*
     From fb: 

     Assume all went well.
     You must send back a 200, within 20 seconds, to let us know
     you've successfully received the callback. Otherwise, the request
     will time out and we will keep trying to resend.
    */    
    res.sendStatus(200)
  }
})

// Incase I find the need to escape characters

function escapeChars(value) {
     return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" )
}


/*Initial interaction with user*/
greetingText()
getStarted()


function receivedMessage(event) {
  let senderID = event.sender.id
  let recipientID = event.recipient.id
  let timeOfMessage = event.timestamp
  let message = event.message
  console.log("Received message for user %d and page %d at %d with message:", 
  senderID, recipientID, timeOfMessage)
  console.log(JSON.stringify(message))
  let messageId = message.mid
  let messageText = message.text
  let messageAttachments = message.attachments
  let wordsLeft = true
  let scaffold = ["\\b", 'dummyValue' ,"\\b" ]
  // callUserAPI(senderID) // will use later
  send.grantAccess(access) // grant access to sendAPI library
  /*  
  * Ugly fragile code that works below
  * gotta be a better way to do this...
  */
  if (messageText) {
  speechLoop: {
      /*
      * Iterates through the keywords
      * Converts keywords to a regular expression that only finds the keyword in message with whitespace see scaffold for example
      */
      for (let key of speechKeys) {
          for(let value of speech[key]) {
            scaffold.splice(1, 1, value)
            let newValue = scaffold.join("")            
            let regex = new RegExp(newValue, 'i')
            console.log(regex)
            if(regex.test(messageText)) {
                if (Object.is(key, 'GREET')){
                  makeMenu()
                  send.sendText(senderID, sp.getRandomResponse('R_GREET'))                                 
                  break speechLoop
                }
                else if (Object.is(key, 'GOODBYE')) {
                  send.sendText(senderID, sp.getRandomResponse('R_GOODBYE'))
                  break speechLoop
                } else if(Object.is(key, 'INQUIRE')){
                  sendTextMessage(senderID, sp.getRandomResponse('R_INQUIRE'))
                  break speechLoop  
                }   

            }

          }
        }

        wordsLeft = false
  } // End of speech label
      if(!wordsLeft) { 
        sendTextMessage(senderID, "¯\\_(ツ)_/¯   I don't know what you meant by --    " + messageText)
        makeMenu()  
      } 

  } else {
    sendTextMessage(senderID, "Message with attachment received")
  }
}




/*#################--PRE-LAUNCH CHECKLIST--######################*/

function greetingText(){
  var messageData = {
    setting_type:"greeting",
    greeting:{
      "text":"Say Hello to me!"
    }
  }
  /*
  * @param
  * messageData: messageData
  * method: POST
  * uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN'
  */
  makeRequests(messageData, 'POST', 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN')
}

/*
* creates a get started button that is only available for first time 
* users
*/

function getStarted(){
  var messageData = { 
    get_started:{
      payload:"GET_STARTED_PAYLOAD"
    }
  }
  /*
  * @param
  * messageData: messageData
  * method: POST
  * uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=PAGE_ACCESS_TOKEN'
  */  

  makeRequests(messageData, 'POST', 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=PAGE_ACCESS_TOKEN')
}


/*
* calls persistent menu 
*
* Caveats:
* call_to_actions is limited to 3 items for the top level, and 5 items 
* for any submenus.
*/

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

  /*
  * @param
  * messageData: messageData
  * method: POST
  * uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=YOUR_ACCESS_TOKEN_HERE'
  */    

  makeRequests(messageData, 'POST', 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=YOUR_ACCESS_TOKEN_HERE')
}



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
      console.log(response.body)    
    } else {       
      console.log("Unable to send " + method + " request to " + url)
      console.log(response)
      console.log("<---------ERROR MESSAGE START-------------->")
      console.log(error) 
      console.log("<----------ERROR MESSAGE END--------------->") 
    }
  })  
} 



function callUserAPI(senderID){
  request({
    uri: 'https://graph.facebook.com/v2.6/'+senderID+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN',
    qs: { access_token: access },
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


function receivedPostback(event) {
  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfPostback = event.timestamp

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload
  if(payload == 'GET_STARTED_PAYLOAD'){
    makeMenu() 
    return true
  }
  // if payload is radarada... so on.. do this ->
  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback)
  // log postback string
  console.log("postback -> " + payload)
}



app.listen(app.get('port'), function() {
  console.log('Running on port', app.get('port'))
}) 
