var mongoose = require('mongoose'),
	userSchema = mongoose.Schema({
	    username: String,
	    password: String
	});

module.exports = {
	"User": mongoose.model('User', userSchema)
}