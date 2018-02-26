const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const config = require('./config');
const Chat = require('./models/chat.js');
const Text = require('./models/text.js');

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
        "\/text : Bot will list the saved Texts.\n" +
        "> \/text [text_name]: Bot will show content of the text.\n" +
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

bot.onText(/\/text/, (msg, match) => {
    let textParam = match.input.split(' ')[1];
    if (typeof textParam != "undefined") {
        Text.getTextByName(textParam).
            then((txt) => {
                bot.sendMessage(msg.chat.id, `${txt.title}\n${txt.content}`);
            }).
            catch((err) => {
                bot.sendMessage(msg.chat.id, config.MSG.TEXT_INVALID);
            });
    }
    else {
        Text.getTexts().
            then((txts) => {
                let txtNames = '-----TEXTS-----\n';
                txts.forEach((txt) => {
                    txtNames += `*** ${txt.name}\n`;
                });
                bot.sendMessage(msg.chat.id, txtNames);
            }).
            catch((err) => {
                bot.sendMessage(msg.chat.id, config.MSG.TEXT_EMPTY);
            });
    }
});