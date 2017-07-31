/* 
* FEED PARSER API 
* not used yet -works btw-
*/
'use strict'

const parser = require('rss-parser')

var getFeed = function(senderID){
	parser.parseURL('https://www.reddit.com/.rss', function(err, parsed) {
		console.log(parsed.feed.title)
		parsed.feed.entries.forEach(function(entry) {
			console.log(Object.getOwnPropertyNames(entry))
		/*			
		entry properties ->
			entry.title
			entry.description
			entry.link
			entry.image
		*/
			console.log(entry.title + ':' + entry.link)
			  })
		}) 
}

module.exports = getFeed