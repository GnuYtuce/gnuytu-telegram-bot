const axios = require('axios');
const CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const DataStore = require('nedb');

const TOKEN = "";
const MENU_API_URL = 'https://ytuyemekhane-api.herokuapp.com/';
const bot = new TelegramBot(TOKEN, { polling: true });

const chatDb = new DataStore({ filename: 'db/app.db', autoload: true });

chatDb.ensureIndex({
    fieldName: 'id',
    unique: true
}, function (err) { });

bot.onText(/\/start/, (msg) => {
    chatDb.insert(msg.chat);
    bot.sendMessage(msg.chat.id, "I will send you notification!");
});

bot.onText(/\/clear/, (msg) => {
    chatDb.remove({ id: msg.chat.id });
    bot.sendMessage(msg.chat.id, "I won't send you notification anymore!");
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

const sendTodaysMenuToUsers = function () {
    getTodaysMenu().
        then((menu) => {
            chatDb.find({}, function (err, docs) {
                if (err)
                    return;
                docs.forEach((doc) => {
                    bot.sendMessage(doc.id, menu);
                });
            });
        }).
        catch((err) => {
            bot.sendMessage("Error accured when getting menu from API");
        });
}

new CronJob('00 00 01 * * 1-5', function () {
    console.log("Sended");
    sendTodaysMenuToUsers();
}, null, true, 'America/Los_Angeles');