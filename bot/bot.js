global.Discord = require('discord.js');
global.client = new Discord.Client();

const embed = require('./embed');

const color = {
    DARK_RED: '#ff0000',
    DARK_GREEN: '#208A17',
    BLURPLE: '#7289da',
    GREY: '#575757',
    DARK_BLUE: '#00086E',
    YELLOW: '#ffc107',
};


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
        user.send(embed.getEmbed(color.GREY,
            `Crypto: ${data.name}
            Pumped ${data.change} in ${data.timeGap}
            Ups: ${data.ups}, Downs: ${data.downs}

            -> Coinmarketcap - https://coinmarketcap.com/currencies/${data.name}/
            -> Coingecko - https://www.coingecko.com/en/coins/${data.name}
            -> Binance - https://www.binance.com/en/trade/${data.symbol}_USDT
            -> Cryptopanic - https://cryptopanic.com/news/${data.name}/
            -> Coinmarketcal - https://coinmarketcal.com/en/coin/${data.name}
        `));
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

