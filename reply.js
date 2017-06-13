/*
* Set of known responses based form the vocabulary
*/

module.exports = {
	// Stuff you want to export here
	// Remember that they are objects are you are declaring methods
	// response to quick reply trigger

	quickReply: function(recipientId, ask, option1, option2, option3, option4, option5) {
		var messageData = null;

		if (option3) {

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

		} else if((option3 && option4)&&option5) {

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

} // END OF EXPORT OBJ