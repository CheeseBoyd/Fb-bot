/* 
* How it understands and processes language and simple speech
*/

'use strict'

// Note: Where is a lib that can do this?
// Need a better way to do this
// Note: Checkout -> https://wit.ai/docs/recipes#overview-link (for ai references)
// Note: Checkout -> API.AI
// Aything that will make user interaction smooth and easy will help out

var speech_class = {
	words: {
		GREET: ["hello", "hi", "hey", "what's up", "sup", "hola"],
		GOODBYE: ["bye", "goodbye", "see you","bye-bye"],
		INQUIRE: ["help", "confused", "how", "don't understand"],
		NEWS: ["news", "news", "what's going on", "headline", "headlines"]
	},
	response: {
		R_GREET: ["hello", "Howdy", "hey!", "hola"],
		R_INTRO: ["Hello I can get you the latest posts from AOM, BrainPickings or the School of Life"],
		R_GOODBYE: ["bye bye", "see you", "til next time", "Allright, take care now :)"],
		R_INQUIRE: ["What do you need help with?", "Anything you wish to know?", "How may I help you?"],
		R_NEWS: ["Here are the news that I can find for you", "The latest news from the web", "Check out this news article"]
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

