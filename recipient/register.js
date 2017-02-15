/*--------------------------------------------------------------------------
Description : The register dialog of the bot for recipient

Created by : Chiang,Chun-Wei

20170130 @Chun-Wei #create the basic function of the bot
---------------------------------------------------------------------------*/

var builder = require('botbuilder');
var dbserver = require('../System/dbserver');

exports.beginDialog = function(session){
	session.beginDialog('/recRegister');
};

exports.create = function(bot){
	bot.dialog('/recRegister', [
		function(session){
			builder.Prompts.confirm(session,"If you are not our member, you cannot use the match system. Do you want to sign up as a recipient right know?")
		},
		function(session,results){
	        if(results.response){
	        	session.beginDialog('/recName');
	        }else{
	        	session.endDialog("OK! If you want to register, you can restart the bot next time.");
	        }
	        
		}
	]);

	bot.dialog('/recName',[
		function(session){
			builder.Prompts.text(session,"where do you work?");
		},
		function(session,results){
			session.dialogData.work = results.response;
			builder.Prompts.text(session,"Where do you want to send the assistive device?");
		},
		function(session,results){
			session.dialogData.addr = results.response;
			builder.Prompts.text(session,"Please enter your email");
		},
		function(session, results){
			session.dialogData.mail_addr = results.response;
			
			dbserver.createDocInfo(session, session.userData.name, session.dialogData.work,session.dialogData.addr,session.dialogData.mail_addr);
			session.endDialog("Welcome! You successfully join e-NABLE recipient");
			session.beginDialog('/portal');
		}

	]);

};

