const profileModel = require('../../models/profileSchema');
const chalk = require("chalk");
const Discord = require("discord.js");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {

        let profile = await profileModel.create({
            userID: member.id,
            ServerID: member.guild.id,
            ProxyReq: 3,
        }).then(() => {
            profile.save();
        }).catch(() => {
            console.log(chalk.red("[Error] User is already in Database!")); // dw ab this error
        })


        console.log(chalk.green(`[${member.guild.name}] ${member.user.tag} (${member.id}) joined the server`));


    }
}

