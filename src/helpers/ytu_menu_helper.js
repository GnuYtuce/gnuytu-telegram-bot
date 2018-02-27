const axios = require('axios');

const config = require('../../config.js');

const getTodaysMenu = function () {
    return new Promise((resolve, reject) => {
        axios.get(config.APP.MENU_API_URL).
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

const sendMenuToChats = function (bot, chats) {
    getTodaysMenu().
        then((menu) => {
            chats.forEach((chat) => {
                bot.sendMessage(chat.id, menu);
            });
        }).
        catch((err) => {
            console.log(`Error accured when getting menu from API : Error => ${err}`);
        });
}

module.exports = {
    sendMenuToChats: sendMenuToChats,
    getTodaysMenu: getTodaysMenu
}