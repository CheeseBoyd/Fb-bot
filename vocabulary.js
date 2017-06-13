/*
* export object that can contain methods or properties.
*/

module.exports = {
	// Stuff you want to export here
	// Remember that they are objects are you are declaring methods

		test: function() {
			console.log("cheese");
		},

		phraseParser: function(senderID, messageText){
		if( /((how are you\?)|(how are you)|((are you\?)|(you\?)))/gi.test(messageText) ) {
		    sendTextMessage(senderID, "I'm a bot, are you Human?");		
		} else if ( /((goodmorning)|(good morning)|(morning))/gi.test(messageText) ) {sendTextMessage(senderID, "Good day") }
		else {
			tokenizer(messageText);
		}

	},




	 	tokenParser: function(messageText){
	    var tokenizer = (messageText) => {
	    	messageText.split(/\s+/i);
	    };

	    for( var i = 0; i < tokenizer.length(); i++) {

		    switch (tokenizer[i]) {
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
	    	
	    }



	}
};