/*--------------------------------------------------------------------------
Description : The register dialog of the bot for volunteer

Created by : Chiang,Chun-Wei

20170130 @Chun-Wei #create the basic function of the bot
---------------------------------------------------------------------------*/

var builder = require('botbuilder');
var dbserver = require('../System/dbserver');

exports.beginDialog = function(session){
	session.beginDialog('/volRegister');
};

exports.create = function(bot){
	bot.dialog('/volRegister', [
		function(session){
			builder.Prompts.confirm(session,"If you are not our member, you cannot use the match system. Do you want to sign up as a volunteer right know?")
		},
		function(session,results){
	        if(results.response){
	        	session.beginDialog('/volName');
	        }else{
	        	session.endDialog("OK! If you want to register, you can restart the bot next time.");
	        }
	        
		}
	]);

	bot.dialog('/volName',[
		function(session){
			builder.Prompts.text(session,"which city do you live?");
		},
		function(session,results){
			session.dialogData.addr = results.response;
			builder.Prompts.text(session,"Please enter your email");
		},
		function(session,results){
			session.dialogData.mail_addr = results.response;
			builder.Prompts.text(session,"what type 3D printer do you have?");
		},
		function(session, results){
			session.dialogData.p_type = results.response;
			
			dbserver.createVolInfo(session, session.userData.name, session.dialogData.addr,session.dialogData.mail_addr,session.dialogData.p_type);
			session.endDialog("Welcome! You successfully join e-NABLE volunteer");
			session.beginDialog('/portal');
		}

	]);

};

