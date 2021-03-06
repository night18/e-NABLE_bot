/*--------------------------------------------------------------------------
Description : Create the server and connector of the bot
Created by : Chiang,Chun-Wei

20170130 @Chun-Wei #create the basic function of the bot
---------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var dbserver = require('./System/dbserver');
var register = require('./doctors/register');

/*-----------------
Set restify server
-----------------*/
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
	console.log('%s listening to %s', server.name, server.url); 
});

dbserver.connectdb();

var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
 	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

/*-------------
Create chat bot
-------------*/
var bot = new builder.UniversalBot(connector);

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//Create LUIS recognizer
var model = 'MY_LUIS_RECOGNIZER'; //TODO
var recognizer = new builder.LuisRecognizer(model);
var create_dialog = new builder.IntentDialog({recognizers: [recognizer]});

/*----------------
Bot global Actions 
----------------*/
// say goodbye or by in a dialog would end the conversation
bot.endConversationAction('goodbye', 'Goodbye :)', {matches: /^(bye|goodbye)/ig });

/*---------
Bot Dialogs
---------*/
//Welcome dialog
bot.dialog('/', [ 
	function (session){
		session.send('Hi there. This is e-NABLE BOT, I will help you match the e-NABLE voulunteers and contact with them about the upper asstive device');
		session.send('This is our website: http://enablingthefuture.org/');
		//TODO if the user is not in the database, he should sign up the system.
		register.beginDialog(session);

	}, function(session){
		
		session.send('back to main');
	}
]);

//call the register.js  
register.create(bot);

