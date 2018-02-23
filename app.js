const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = "";
const MENU_API_URL = 'https://ytuyemekhane-api.herokuapp.com/';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.chat);
    sendTodaysMenu(chatId);
});

const sendTodaysMenu = function (chatId) {
    axios.get(MENU_API_URL).
        then((res) => {
            const data = res.data;
            const dateText = `${data.date.day}/${data.date.month}/${data.date.year}`;
            let lunchMenu = '';
            let dinnerMenu = '';
            data.lunch.forEach((lunchFood) => {
                lunchMenu += lunchFood + "\n";
            });
            data.dinner.forEach( (dinnerFood) => {
                dinnerMenu += dinnerFood + "\n";
            });
            bot.sendMessage(chatId, `${dateText}\n -------LUNCH--------\n${lunchMenu}\n----------DINNER-----------\n${dinnerMenu}`);
            //console.log(data);
        }).
        catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, 'Error accured when getting todays menu!');
        });
}
