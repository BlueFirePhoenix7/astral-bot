// Example of how to make a Command
var os = require('os');
const prettyMilliseconds = require("pretty-ms");
module.exports = {
    name: "botstats",
    aliases: ["bstats", "latency"],
    category: "Bot",
    usage: "a!botstats",
    description: "Check the bot's ping!",
    ownerOnly: false,
    run: async (client, message, args) => {
        //  Uptime
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        // 

        // Memory Usage
        let memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        var getmemoryPercent = (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100;
        //

        const msg = await message.channel.send(`Fetching...`);

        const pingEmbed = new client.discord.MessageEmbed()
            .setTitle('🤖 - Bot Statistics')
            .addField(":airplane: **Uptime**", `${uptime}`, true)
            .addField(":shield: **Guilds**", `Guild Count:  \`\ ${client.guilds.cache.size} \`\ `, true)
            .addField(":busts_in_silhouette: **Users**", `User Count:  \`\ ${client.users.cache.size} \`\ `, true)
            .addField(":desktop: **Memory Usage**", `${memoryUsage} MB (${getmemoryPercent.toFixed(2)}%)`, true)
            .setColor(client.config.embedColor)
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await message.reply({ embeds: [pingEmbed], allowedMentions: { repliedUser: false } });

        msg.delete();
    },
};
