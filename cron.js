const CronJob = require('cron').CronJob;
const MenuHelper = require('./helpers/ytu_menu_helper.js');

new CronJob('00 00 00 * * 1-5', function () {
    console.log("Sended");
    Chat.getChats().
        then((chats) => MenuHelper.sendMenuToChats(bot, chats)).
        catch((err) => console.log(err));
}, null, true, 'America/Los_Angeles');