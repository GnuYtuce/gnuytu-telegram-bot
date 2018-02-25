const axios = require('axios');
const CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const config = require('./config');
mongoose.connect(config.MONGO_URL);

const bot = new TelegramBot(config.TOKEN, { polling: true });
const Chat = require('./models/chat.js');

bot.onText(/\/addMe/, (msg) => {
    const chat = new Chat(msg.chat);
    chat.saveChat().then(() => {
        bot.sendMessage(msg.chat.id, "I will send you notification!");
    }).catch( (err) => {
        if(err.code == 11000)
            bot.sendMessage(msg.chat.id, "I already add you to database!");        
        console.log(err.code);
    });
});

bot.onText(/\/removeMe/, (msg) => {
    Chat.removeChat(msg.chat.id).then(() => {
        bot.sendMessage(msg.chat.id, "I won't send you notification anymore!");
    });

});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        "-----Commands-----\n" +
        "\/help : Help :)\n" +
        "\/addMe : Bot will add you to database.\n" +
        "\/removeMe : Bot will remove you from database.\n" +
        "\/myStatus : Bot will show you the notification status."+
        "Repo\n"+
        "https://github.com/Emre-Kul/ytu-telegram-bot"
    );
});

bot.onText(/\/myStatus/, (msg) => {
    Chat.getChat(msg.chat.id).
        then((doc) => {
            if (doc == null)
                bot.sendMessage(msg.chat.id, "No notification.");
            else
                bot.sendMessage(msg.chat.id, "Yes notification.");
        }).
        catch((err) => {
            bot.sendMessage(msg.chat.id, `Error : ${err}`);
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