global.Discord = require('discord.js');
global.client = new Discord.Client();


/* ============================================== */
/* =================== EVENTS =================== */
/* ============================================== */

// ------------------------------ On Ready -----------------------------
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

const notifyVikram = (data) => {
    client.users.fetch('849240584036024331', false).then((user) => {
        user.send(JSON.stringify(data));
    });
};

module.exports = {
    notifyVikram,
};


// client.commands = new Discord.Collection();

// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// const prefix = "$";

// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     client.commands.set(command.name, command);
// }

