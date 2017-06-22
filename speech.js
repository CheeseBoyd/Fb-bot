/*
* Set of keywords or phrases that the bot will look for
*/ 


let speech = {
	greet: ["hello", "hi", "hola", "get started"],
	goodbye:  ["bye", "goodbye", "good bye", 
	"good-bye", "bye-bye"," bye bye"],
	inquire: ["what", "help","do something"],
	GetkNewsSource: ["cnn", "bbc", "the new york times"],
	GetOtherFeed: ["reddit", "9gag"],
	isAwake: ["hello?", "you there?"]

};

/*
* Iterates through the speech object
*/

function getSpeech() {
	let sp = this.speech;
	return sp;
}


var keys = Object.keys(speech);

function filterBySpeech(){
	let arr = [];
	keys.forEach(function(keys){
		console.log("List of known words in " + keys)
		for(var i = 0;i < speech[keys].length; i++) {
	    console.log("----->"+ speech[keys][i]);
	    arr.append(speech[keys][i]);
	  }
	});
	return arr;

}



let log = {

	getSpeech: function() {
		let sp = this.speech;
		return sp		
	},

	filterBySpeech: function() {
		var speech = getSpeech();
		var keys = Object.keys(speech);

		let arr = [];
		keys.forEach(function(keys){
			console.log("List of known words in " + keys)
			for(var i = 0;i < speech[keys].length; i++) {
		    console.log("----->"+ speech[keys][i]);
		    arr.append(speech[keys][i]);
		  }
		});
		return arr;
	},



}


module.exports = log;