'use strict'

var speech_class = {
	keywords: {
		GREET: ["hello", "how are you?", "hey"],
		GOODBYE: ["bye", "goodbye", "see you"]
	},
	response: {
		GREET_RESPONSE: ["response to greet"],
		GOODBYE_RESPONSE: ["response to goodbye"]
	},
	get: function(){
		return this.words;
	},


};



module.exports = speech_class;


/*
 // How to use
// local file module
const speech = require('./speech.js');
console.log(speech.get());
console.log(speech.statement);
speech.foo();



// Escapes regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}



 
let speechObj = speech.get();
let keys = null;
keys = Object.keys(speechObj);
console.log("keys: " + keys);
keys.forEach(function(key) {
	console.log("Key group array of: " + key);
	for(let value of speechObj[key]) {
		console.log("---->"+ value);
		let regex = new RegExp(value);
		if(regex.test("goodbye hello hey")) {
			console.log(regex + " found in array: ---> " + key );
			switch(key) {
				case 'GREET':
					console.log("GREET based response activated");
					break;
				case 'GOODBYE':
					console.log("GOODBYE based response activated");
					break;
				default: 
					console.log("NO AVAILABLE response");
			}

			// if no match is found break
			return false
		}

	}
});


*/