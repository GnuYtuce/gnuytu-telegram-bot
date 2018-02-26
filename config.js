module.exports = {
    APP: {
        TOKEN: process.env.TOKEN || '',
        MENU_API_URL: 'https://ytuyemekhane-api.herokuapp.com/',
        MONGO_URL: process.env.MONGO_URL || ''
    },
    MSG : {
        ADDED : "I will send you notification!",
        ADDED_ALREADY: "I already added you to the database!",
        REMOVED : "I won't send you notification anymore!",
        STATUS_ON : "Notification is ON!",
        STATUS_OFF : "Notification is OFF!"
    }
}