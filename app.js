const TelegramBot = require('node-telegram-bot-api');
const token = "";
const bot = new TelegramBot(token,{polling : true});

bot.on('message',(msg) => { 
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Dont Send Me message");
});

const getTodaysMenu = function(){

}
