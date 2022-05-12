const chalk = require("chalk");
const profileModel = require("../../models/profileSchema");

module.exports = {
  name: "messageCreate",

  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {

    // remove the DB comments if we do not need them


    if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(client.config.botPrefix)
    )
      return;
    const [cmd, ...args] = message.content
      .slice(client.config.botPrefix.length)
      .trim()
      .split(" ");
    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));





    if (!command) return;

    if (command.ownerOnly) {
      // if the persons id doesn't match one of the owners ids then return
      if (!client.config.botowners.includes(message.author.id)) {
        return message.reply({
          content: "This command only for The bot owners!",
          allowedMentions: { repliedUser: false },
        });
      }
    }

    // DATABASE STUFF

    let profileData;
    try {
      profileData = await profileModel.findOne({ userID: message.author.id });
      if (!profileData) {
        let profile = await profileModel.create({
          userID: message.author.id,
          ServerID: message.guild.id,
          ProxyReq: 3,
	    		DomainsRecieved: [],
        })
        profile.save();
        console.log(
          chalk.green(
            `[PROFILE] Created new profile for ${message.author.tag}`
          )
        );
      }
    } catch (err) {
      console.log(err);
    }

    //

    // when the command is executed, console.log the command name
    console.log(
      chalk.green(
        `[${message.guild.name}] ${message.author.tag} (${message.author.id}) used command ${command.name}`
      )
    );
    await command.run(client, message, args, profileData);
  },
};