// This is for future use if we need it (idfk if it works)
const profileModel = require("../../models/profileSchema");


//So much dead code here. someone fix it

module.exports = {
    name: "db",
    aliases: "database",
    category: "Admin",
    usage: "a!db [<get, add, set, delete, create] [user id] [amount]",
    description: "Modify the database settings for your selected user",
    ownerOnly: true,
    permission: "ADMINISTRATOR, OWNER_ONLY",
    run: async (client, message, args, profileData) => {

        const option = args[0];

        if (!option) return message.reply("Please provide a valid option\n`a!db <get, add, set, delete, create> <user>`");

        if (option === "get") {
            let profileData;
            let user = args[1];
            try {
                if (args[1].startsWith("<@")) {
                    user = args[1].replace(/[<@!>]/g, "");

                }
            } catch (e) {
                return console.log("fuck this error")
            }
            const usertag = client.users.cache.get(user).username;

            profileData = await profileModel.findOne({ userID: user });

            if (!profileData) return message.reply("User not found!");

            const embed = new client.discord.MessageEmbed()
                .setTitle(`${usertag}'s Profile`)
                .addField("User ID", `${profileData.userID}`)
                .addField("Proxy Req", `${profileData.ProxyReq}`)
                .setColor(client.config.embedColor)
                .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });
            return message.channel.send({ embeds: [embed] });


        } else if (option === "add") {
            const user = message.mentions.users.first();
            const amount = args[2];
            if (!user) return message.reply("Please provide a user!");
            if (!amount) return message.reply("Please provide an amount!");
            profileModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $inc: {
                        ProxyReq: amount,
                    },

                },
            ).then(() => {
                message.reply("Successfully added " + amount + " proxy requests to " + "<@" + user + ">");
            }
            ).catch(() => {
                message.reply("Error!");
            }
            );
        } else if (option === "set") {
            const user = message.mentions.users.first();
            const amount = args[2];
            if (!user) return message.reply("Please provide a user!");
            if (!amount) return message.reply("Please provide an amount!");
            profileModel.updateOne(
                {
                    userID: user.id,
                },
                {
                    $set: {
                        ProxyReq: amount,
                    },

                },
            ).then(() => {
                message.reply("Successfully set " + amount + " proxy requests to " + "<@" + user + ">");
            }
            ).catch(() => {
                message.reply("Error!");
            }
            );
        } else if (option === "delete") {
            const user = message.mentions.users.first();
            if (!user) return message.reply("Please provide a user!");
            profileModel.findOneAndDelete(
                {
                    userID: user.id,
                },
            ).then(() => {
                message.reply("Successfully deleted " + user.tag);
            }
            ).catch(() => {
                message.reply("Error!");
            }
            );
        } else if (option === "create") {
            let profileData;

            let user = args[1];
            if (args[1].startsWith("<@")) {
                user = args[1].replace(/[<@!>]/g, "");
            }
            if (!user) return message.reply("Please provide a user!");

            profileData = await profileModel.findOne({ userID: user });
            console.log(user)
            // create a new profile for the user
            if (!profileData) {
                let profile = await profileModel.create({
                    userID: user,
                    ServerID: message.guild.id,
                    ProxyReq: 0,
                });
                profileData = await profileModel.findOne({ userID: user });
                message.reply("Successfully created profile for " + user);
                profile.save()
                    .catch((err) => {
                        console.log(err);
                        message.reply("Error! Could not create a new profile for " + user + "!");


                    }
                    );
            } else {
                message.reply("User already has a profile!");
            }
        } else if (option === "clear") {

            profileModel.deleteMany({})
                .then(() => {
                    // react to the users message with a thumbs up
                    message.react("✅");
                }
                ).catch(() => {
                    message.reply("Error!");
                }
                );

        }

    }

};





