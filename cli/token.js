var fs   = require('fs');
var path = require('path');

exports.run = function(token) {
	var str  = '{"token": "' + token + '"}';
	var file = path.join(__dirname, '../lib/', 'global.json');

	fs.writeFile(file, str, function(err) {
		if (err) {
			console.log(err);
		}
	});
}