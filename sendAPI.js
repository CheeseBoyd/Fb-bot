/*
* Send API Library
* v - 1.0
* author: Aaron
* github: https://github.com/CheeseBoyd
*/

// Sending text:

var sendText = (message, senderID, callback) => {

var messageData = 	
	{
		"recipient":{
			"id": senderID
		},
		"message":{
			"text": message
		}
	}
callback(messageData)	

}