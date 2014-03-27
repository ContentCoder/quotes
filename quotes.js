/* 
 * quotes.js
 * 
 * Quote.
 * 
 * version: 0.0.1
 * create date: 2014-3-26
 * update date: 2014-3-26
 */

var util		= require('util'), 
		path		= require('path'), 
		aws			= require('aws-sdk');

var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// load configuration 
var config	= require(path.join(__dirname, 'config.json'));

// aws init 
aws.config.loadFromPath(path.join(__dirname, 'awsconfig.json'));
var dynamodb = new aws.DynamoDB();

/* 
 * Random quote.
 *
 */
function random(callback) {
	var month = Math.floor(Math.random() * 12);
	var date	= Math.floor(Math.random() * days[month]);
	month += 1;
	date	+= 1;
	var monthStr	= month < 10 ? '0' + month.toString() : month.toString();
	var dateStr		= date < 10 ? '0' + date.toString() : date.toString();
	var queryStr	= monthStr + dateStr;
	util.log('Date: ' + queryStr);

	var param = {};
	param.TableName = config.QUOTESTABLE;
	param.Key = {};
	param.Key.Date = {S: queryStr};
	dynamodb.getItem(param, function(err, doc) {
		if (err) {
			callback(err, null);
			return;
		} 
		if (doc == null) {
			var err = {};
			err.message = 'Can not find quote.';
			callback(err, null);
			return;
		}
		
		callback(null, doc);
	});		// dynamodb.getItem
}

exports.random = random;

