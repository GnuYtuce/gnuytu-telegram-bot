const CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const config = require('./config');
const Chat = require('./models/chat.js');
const MenuHelper = require('./helpers/ytu_menu_helper.js');


const bot = new TelegramBot(config.TOKEN, { polling: true });

mongoose.connect(config.MONGO_URL);

bot.onText(/\/addMe/, (msg) => {
    const chat = new Chat(msg.chat);
    chat.saveChat().then(() => {
        bot.sendMessage(msg.chat.id, "I will send you notification!");
    }).catch((err) => {
        if (err.code == 11000)
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
        "\/myStatus : Bot will show you the notification status.\n" +
        "-----Repo-----\n" +
        "https://github.com/GnuYtuce/gnuytu-telegram-bot"
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

new CronJob('00 00 00 * * 1-5', function () {
    console.log("Sended");
    Chat.getChats().
        then((chats) => MenuHelper.sendMenuToChats(bot, chats)).
        catch((err) => console.log(err));
}, null, true, 'America/Los_Angeles');

