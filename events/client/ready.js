module.exports = {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client 
     */
    async execute(client) {

        // Puts an activity

        client.user.setActivity("a!.help", {
            type: "WATCHING",
            name: "a!.help"
        });

        // Send a message on the console
        console.log(`[BOT] ${client.user.tag} is now online!\n[BOT] Bot serving on Ready to serve in ${client.guilds.cache.size} servers\n[BOT] Bot serving ${client.users.cache.size} users`);
    }
}
