const CronJob = require('cron').CronJob;
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const config = require('./config');
const Chat = require('./models/chat.js');
const MenuHelper = require('./helpers/ytu_menu_helper.js');


const bot = new TelegramBot(config.APP.TOKEN, { polling: true });

mongoose.connect(config.APP.MONGO_URL);

bot.onText(/\/addMe/, (msg) => {
    const chat = new Chat(msg.chat);
    chat.saveChat().then(() => {
        bot.sendMessage(msg.chat.id, config.MSG.ADDED);
    }).catch((err) => {
        if (err.code == 11000)
            bot.sendMessage(msg.chat.id, config.MSG.ADDED_ALREADY);
        console.log(err.code);
    });
});

bot.onText(/\/removeMe/, (msg) => {
    Chat.removeChat(msg.chat.id).then(() => {
        bot.sendMessage(msg.chat.id, config.MSG.REMOVED);
    });
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        "-----Commands-----\n" +
        "\/help : Help :)\n" +
        "\/addMe : Bot will add you to the database.\n" +
        "\/removeMe : Bot will remove you from the database.\n" +
        "\/myStatus : Bot will show you the notification status.\n" +
        "-----Repo-----\n" +
        "https://github.com/GnuYtuce/gnuytu-telegram-bot"
    );
});

bot.onText(/\/myStatus/, (msg) => {
    Chat.getChat(msg.chat.id).
        then((doc) => {
            if (doc == null)
                bot.sendMessage(msg.chat.id, config.MSG.STATUS_OFF);
            else
                bot.sendMessage(msg.chat.id, config.MSG.STATUS_ON);
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

