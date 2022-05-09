// Proxy panel

module.exports = {
    name: "panel",
    category: "Admin",
    usage: "a!panel",
    description: "Check the bot's ping!",
    ownerOnly: true,

    run: async (client, message, args) => {
        // Button Row
        const row = new client.discord.MessageActionRow().addComponents(
            new client.discord.MessageButton()
                .setLabel("💫 - Lucid")
                .setCustomId("lucid-button")
                .setStyle("SECONDARY")
                .setDisabled(false),

            new client.discord.MessageButton()
                .setLabel("🪐 - Void")
                .setCustomId("void-button")
                .setStyle("SECONDARY")
                .setDisabled(true),
        );

        // Embed
        const proxyEmbed = new client.discord.MessageEmbed()
            .setTitle("**Astral Dispenser**")
            .setDescription(`The official proxy bot of Astral Network that dispenses a varienty of different domains for our various web proxies.`)
            .setColor("#5865F2")
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await message.channel.send({ embeds: [proxyEmbed], components: [row] });
    },
};
