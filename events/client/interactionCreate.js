const profileModel = require("../../models/profileSchema");
const chalk = require("chalk");

const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;
const warning = chalk.bold.yellow;



/*
Un comment or remove the DB comments if we do not need them
*/


module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        // Defining proxies 
        const lucid = process.env.LUCID;
        const lucidArray = lucid.split(",");
        var lucidRandom = lucidArray[Math.floor(Math.random() * lucidArray.length)];
        console.log(lucidRandom);

        let profileData;

        profileData = await profileModel.findOne({ userID: interaction.user.id });

        // if the user is null in the database then create a new user
        if (!profileData) {

            profileData = await profileModel.create({
                userID: interaction.user.id,
                ServerID: interaction.guild.id,
                ProxyReq: 3,
                DomainsRecieved: [],
            });
            profileData.save();
            console.log(success(`[Database] > ${interaction.user.username}#${interaction.user.discriminator} created a new profile`));
        }





        if (interaction.isCommand()) {
            const command = client.slash.get(interaction.commandName);
            if (!command)
                return interaction.reply({ content: "an Error check console" });

            if (command.ownerOnly) {
                if (interaction.user.id !== client.config.botowners) {
                    return interaction.reply({
                        content: "This command only for Bot Owner!",
                        ephemeral: true,
                    });
                }
            }



            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }


            try {
                command.run(client, interaction, args);
                console.log(info(`[BOT] ${interaction.user.tag} used ${interaction.commandName}`));
            } catch (e) {
                interaction.reply({ content: e.message });
            }
        } else if (interaction.isButton()) {
            console.log(info(`[BOT] ${interaction.user.tag} clicked ${interaction.customId}`));
            let profileData;



            profileData = await profileModel.findOne({
                userID: interaction.user.id,
            })


            // if ProxyReq is or is bellow 0 then return
            if (profileData.ProxyReq <= 0) return interaction.reply({ content: "You have no proxy requests!", ephemeral: true });




            if (interaction.customId === "lucid-button") {
                // if DomainsRecieved includes the lucidRandom then return
                if (profileData.DomainsRecieved.includes(lucidRandom)) {
                    interaction.reply({ content: "You have already recieved a proxy for this domain! **[NO PROXY REQS HAVE BEEN DEDUCTED]**", ephemeral: true });
                    var lucidRandom = lucidArray[Math.floor(Math.random() * lucidArray.length)];
                    console.log(lucidRandom);
                    return; // make sure to return so the user doesnt lose a proxy request
                }

                console.log(lucidRandom);
                // decrease ProxyReq by 1
                await profileModel.findOneAndUpdate({
                    userID: interaction.user.id,
                }, {
                    $inc: {
                        ProxyReq: -1, // decrement by 1
                    },
                });

                await profileModel.findOneAndUpdate({
                    userID: interaction.user.id,
                }, {
                    $push: {
                        DomainsRecieved: lucidRandom, // push the random proxy to domains recieved array
                    },
                });

                console.log(info(`[BOT] ${interaction.user.tag} recieved ${lucidRandom} as a proxy request`));


                // making and sending the embed


                const lucidEmbed = new client.discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Lucid")
                    .setDescription("Lucid is a proxy that allows you to access the internet without any limitations.\n\n")
                    .addField("**Your Lucid Link: **", `${lucidRandom}`)
                    .addField("**Remaining Proxies: **", `${profileData.ProxyReq - 1} `)
                interaction.reply({ embeds: [lucidEmbed], ephemeral: true });
            } else if (interaction.customId === "void-button") {
                interaction.reply({ content: "void proxy goes here alongside an embed" });

            }


        }

    }
};