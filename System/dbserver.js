/*--------------------------------------------------------------------------
Description : Connect to MangoDB, and the database function

Created by : Chiang,Chun-Wei

20170205 @Chun-Wei #connect to MangoDB
---------------------------------------------------------------------------*/

var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

/*------------------------
Set the schema of database
------------------------*/
//recipient's schema
var recipientSchema = new Schema({
	_id: {type:String, default: uuid.v1 },
	username: {type: String, required: true},
	workspace: {type: String},
	address: {type: String},
	email: {type: String},
	cancel_times: {type: Number},
	edit_times: {type: Number},
	req_times: {type: Number}
});

//volunteer's schema
var volunteerSchema = new Schema({
	_id: {type:String, default: uuid.v1 },
	username: {type: String, required: true},
	address: {type: String},
	email: {type:String},
	printer_type: {type: String},
	cancel_times: {type: Number},
	req_times: {type: Number}
});

/*-----------------------------
screate models using the schema
------------------------------*/
var recInfo = mongoose.model('recipient_table', recipientSchema);
var volInfo = mongoose.model('volunteer_table', volunteerSchema);
/*----------------------------
Create the connection to mLab
-----------------------------*/
exports.connectdb = function(){
	//connect to mongoDB
	mongoose.connect('mongodb://'+process.env.MLABUSER +':'+ process.env.MLABPWD +'@ds143449.mlab.com:43449/enablebot');
	console.log("connect to mongoDB");
}



exports.createDocInfo = function(session, name, work, addr, mail_addr){

	var info = new recInfo({
		username: name,
		workspace: work,
		address: addr,
		email: mail_addr,
		cancel_times: 0,
		edit_times: 0,
		req_times: 0
	});

	info.save(function(err, content){
		if(err){
			console.log("when saving the recipient's info, there is a problem: \n" + err);
		}else{
			session.userData.userid = content._id;
			console.log("create test data");
		}
	})
}

exports.createVolInfo = function(session, name, addr, mail_addr, p_type){

	var info = new recInfo({
		username: name,
		address: addr,
		email: mail_addr,
		printer_type: p_type,
		cancel_times: 0,
		req_times: 0
	});

	info.save(function(err, content){
		if(err){
			console.log("when saving the volunteer's info, there is a problem: \n" + err);
		}else{
			session.userData.userid = content._id;
			console.log("create test data");
		}
	})
}
