const axios = require('axios');
const CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const DataStore = require('nedb');

const config = require('./config');

const bot = new TelegramBot(config.TOKEN, { polling: true });
const chatDb = new DataStore({ filename: config.NEDB_FILENAME, autoload: true });

chatDb.ensureIndex({
    fieldName: 'id',
    unique: true
}, function (err) { });

bot.onText(/\/addMe/, (msg) => {
    chatDb.insert(msg.chat);
    bot.sendMessage(msg.chat.id, "I will send you notification!");
});

bot.onText(/\/removeMe/, (msg) => {
    chatDb.remove({ id: msg.chat.id });
    bot.sendMessage(msg.chat.id, "I won't send you notification anymore!");
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        "-----Commands-----\n" +
        "\/help : Help :)\n" +
        "\/addMe : Bot will add you to database.\n" +
        "\/removeMe : Bot will remove you from database.\n" +
        "\/myStatus : Bot will show you the notification status."
    );
});

bot.onText(/\/myStatus/, (msg) => {
    chatDb.findOne({ id: msg.chat.id }, (err, doc) => {
        if (err) {
            bot.sendMessage(msg.chat.id, `Error : ${err}`);
        }
        else {
            if (doc == null)
                bot.sendMessage(msg.chat.id, "No notification.");
            else
                bot.sendMessage(msg.chat.id, "Yes notification.");
        }
    });
});
const getTodaysMenu = function () {
    return new Promise((resolve, reject) => {
        axios.get(config.MENU_API_URL).
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
                resolve(`${dateText}\n -----LUNCH-----\n${lunchMenu}\n-----DINNER-----\n${dinnerMenu}`);
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