/* 
* How it understands and processes language and simple speech
*/
'use strict'

// Note: Where is a lib that can do this?
// Need a better way to do this
// Note: Checkout -> https://wit.ai/docs/recipes#overview-link (for ai references)

var speech_class = {
	words: {
		GREET: ["hello", "hi", "hey", "sup"],
		GOODBYE: ["bye", "goodbye", "see you"],
		INQUIRE: ["help", "confused", "how", "don't understand"]
	},
	response: {
		R_GREET: ["hello", "Howdy", "hey!", "hola"],
		R_GOODBYE: ["bye bye", "see ya", "til next time"],
		R_INQUIRE: ["Hi I'm a just bot and I don't know much . . . yet", "Bear with me"]
	},
	getRandomResponse: function(responseType){		
		var res = this.response
		if(res[responseType]){
			return res[responseType][getRandomInt(0, res[responseType].length)]
		}
	},
	get: function(){
		return this.words
	},
	logKeyWords: function(){
		var word = this.words
		word.forEach(function(key){
			word[key].forEach(function(keywords){
				console.log(keywords)
			})
		})
	}

}

/*
* Helper function
*/

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}



module.exports = speech_class


