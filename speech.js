// Test
'use strict'

var speech_class = {
	words: {
		GREET: ["hello", "how are you?", "hey", "get started"],
		GOODBYE: ["bye", "goodbye", "see you"]
	},
	response: {
		R_GREET: ["hello", "Howdy", "Sayonara!", "Monday"],
		R_GOODBYE: ["bye bye", "see ya", "til next time"]
	},
	getRandomResponse: function(responseType){		
		var res = this.response
		if(res[responseType]){
			return res[responseType][getRandomInt(0, res[responseType].length)]
		}
	},
	get: function(){
		return this.words;
	},
	logKeyWords: function(){
		var word = this.words;
		word.forEach(function(key){
			word[key].forEach(function(keywords){
				console.log(keywords);
			})
		})
	}

};

// Helper function

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



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


