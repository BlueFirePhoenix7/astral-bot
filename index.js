const { Client, Collection, Intents, WebhookClient } = require('discord.js');
const handler = require("./handler/index");
const mongoose = require('mongoose');
const chalk = require("chalk");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
});

const Discord = require('discord.js');

// Call .env file to get Token
require('dotenv').config()

module.exports = client;

// Global Variables
client.discord = Discord;
client.commands = new Collection();
client.slash = new Collection();
client.config = require('./config')

// Records commands and events
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

// colors
const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;
const warning = chalk.bold.yellow;
// Error Handling

process.on("uncaughtException", (err) => {
    console.log(error("[FATAL] Uncaught Exception: \n" + err));
});

process.on("unhandledRejection", (reason, promise) => {
    console.log(error("[FATAL] Possibly Unhandled Rejection at: Promise \n"), promise, " reason: ", reason.message);
});







// Connect to the database

mongoose.connect(client.config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(success("[DATABASE]") + ' > Connected to MongoDB');
}).catch((err) => {
    console.log(error("[DATABASE]") + ' > Unable to connect to MongoDB Database.\nError: ' + err)
})

// Login Discord Bot Token
client.login(process.env.TOKEN);