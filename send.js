/*
* Send API Library
* v - 1.0
* author: Aaron
* github: https://github.com/CheeseBoyd
*/

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

// t
var send = {
	access: null,

	grantAccess: (accsess_token) => {
		this access = accsess_token
		},

	sendText: (message, senderID) => {
		var messageData = 	
			{
				recipient:{
					id: senderID
				},
				message:{
					text: message
				}
			}
		callSendAPI(messageData, grantAccess)	
		},

}


var callSendAPI = (messageData, access) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  },function (error, response, body) {
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
	  }) 
	}


module.exports = send