// Example of how to make a Command

module.exports = {
    name: "purge",
    aliases: "pr",
    category: "Admin",
    usage: "a!pr [amount]",
    description: "purge messages",
    ownerOnly: true,
    run: async (client, message, args) => {
        const amount = parseInt(args[0]) + 1;
        if (!amount) return message.reply("Please provide an amount!");
        if (amount > 100) return message.reply("Please provide an amount less than 100!");
        message.channel.bulkDelete(amount, true).then(() => {
            message.channel.send(`Purged ${amount - 1} messages!`);
        }
        );

    },
};
