const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const DataStore = require('nedb');

const TOKEN = "";
const MENU_API_URL = 'https://ytuyemekhane-api.herokuapp.com/';

const bot = new TelegramBot(TOKEN, { polling: true });
const chatDb = new DataStore({ filename: 'db/app.db', autoload: true });

chatDb.ensureIndex({
    fieldName: 'id',
    unique: true
}, function(err) {});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    chatDb.insert(msg.chat);
    console.log(msg.chat);
    getTodaysMenu().
        then((menu) => {
            bot.sendMessage(chatId, menu);
        }).
        catch((err) => {
            bot.sendMessage("Error accured when getting menu from API");
        });
});

const getTodaysMenu = function () {
    return new Promise((resolve, reject) => {
        axios.get(MENU_API_URL).
            then((res) => {
                const data = res.data;
                const dateText = `${data.date.day}/${data.date.month}/${data.date.year}`;
                let lunchMenu = '';
                let dinnerMenu = '';
                data.lunch.forEach((lunchFood) => {
                    lunchMenu += lunchFood + "\n";
                });
                data.dinner.forEach((dinnerFood) => {
                    dinnerMenu += dinnerFood + "\n";
                });
                resolve(`${dateText}\n -------LUNCH--------\n${lunchMenu}\n----------DINNER-----------\n${dinnerMenu}`);
            }).
            catch(reject);
    });
}
