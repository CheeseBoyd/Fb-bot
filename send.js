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

var send = {
	access: null,

	grantAccess: function(accsess_token){
		this.access = accsess_token
	},
	buttonTemplate: function(senderID, qeustion){
		var messageData = 
		{
		  recipient:{
		    id: senderID
		  },
		  message:{
		    attachment:{
		      type:"template",
		      payload:{
		        template_type:"button",
		        text:"What do you want to do next?",
		        buttons:[
		          {
		            type:"web_url",
		            url:"http://example.com/",
		            title:"Show example.com"
		          },
		          {
		            type:"postback",
		            title:"Start Chatting",
		            payload:"USER_DEFINED_PAYLOAD"
		          }
		        ]
		      }
		    }
		  }
		}
		callSendAPI(messageData, this.access)

	},	
	sendText: function(senderID, message) {
		var messageData = 	
			{
				recipient:{
					id: senderID
				},
				message:{
					text: message
				}
			}
		callSendAPI(messageData, this.access)	
	},
	singleCard: function(senderID) {
	  	var messageData = 
			{
			  recipient:{
			    id:senderID
			  },
			  message:{
			    attachment:{
			      type:"template",
			      payload:{
			        template_type:"generic",
			        sharable: true,
			        elements:[
			           {
			            title:"Get today's paper",
			            image_url:"https://static01.nyt.com/images/icons/t_logo_291_black.png",
			            subtitle:"Check this out!",
			            default_action: {
			              type: "web_url",
			              url: "http://www.nytimes.com/pages/todayspaper/index.html",
			              messenger_extensions: true,
			              webview_height_ratio: "tall",
			              fallback_url: "http://www.nytimes.com/pages/todayspaper/index.html"
			            },
			            buttons:[
			              {
			                type:"web_url",
			                url:"http://www.nytimes.com/pages/todayspaper/index.html",
			                title:"View Website"
			              },{
			                type:"postback",
			                title:"Deliver postback",
			                payload:"DEVELOPER_DEFINED_PAYLOAD"
			              }              
			            ]      
			          }
			        ]
			      }
			    }
			  }
			}	  

	  callSendAPI(messageData, this.access)
	},
	sendImage: function(senderID, url){
		var messageData =
		{
			recipient: {
				id: senderID
			},
			message: {
				attachment: {
					type: 'image',
					payload:{
						url: url,
						is_reusable: true
					}
				}
			}
		}
		callSendAPI(messageData, this.access)
	},
	quickReply: function(senderID, question, option1, option2, option3){
		var messageData = 
		{
			recipient:{
				id: senderID
			},
			message:{
				text: question,
				quick_replies:[
					{
						content_type: 'text',
						title: option1,
						payload: 'QUICKREPLY_OPTION1',
						image_url: 'http://www.colorcombos.com/images/colors/FF0000.png'
					},
					{
						content_type: 'text',
						title: option2,
						payload: 'QUICKREPLY_OPTION2',
						image_url: 'https://i0.wp.com/www.ucreative.com/wp-content/uploads/2014/12/18-color.png?resize=600%2C450'
					},
					{
						content_type: 'text',
						title: option3,
						payload: 'QUICKREPLY_OPTION3',
						image_url: 'http://images.mentalfloss.com/sites/default/files/styles/insert_main_wide_image/public/46346365365.png'
					}					
				]
			}	
		}
		callSendAPI(messageData, this.access)
	},

}


function callSendAPI(messageData, access) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  },function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      var recipientId = body.recipient_id
	      var messageId = body.message_id
	      console.log("Successfully sent generic message with id %s to recipient %s", 
	        messageId, recipientId)
	    } else {
	      console.error("Unable to send message.")
	      console.error(response)
	      console.error(error)
	    }
	  }) 
	}


module.exports = send