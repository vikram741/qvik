global.Discord = require('discord.js');
global.client = new Discord.Client();

// const embed = require('./embed');
const {color, VIKRAM_ID, DISCORD_TOKEN} = require('../constants');

// ------------------------------ On Ready -----------------------------
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    notifyVikram({
        name: 'Bitcoin',
        symbol: 'BTC',
        change: 2,
        timeGap: 6,
        ups: 3,
        downs: 9,
    });
});


client.login(DISCORD_TOKEN);

const notifyVikram = (crypto) => {
    client.users.fetch(VIKRAM_ID, false).then((user) => {
        const embed = new Discord.MessageEmbed()
            .setColor(color.GREY)
            .setTitle(crypto.name)
            .setDescription(`Pumped ${crypto.change}% in ${crypto.timeGap}mins.
Ups: ${crypto.ups}, Downs: ${crypto.downs}`)
            .addField('Coinmarketcap', `[Click here](https://coinmarketcap.com/currencies/${crypto.name.toLowerCase()}/)`, true)
            .addField('Coingecko', `[Click here](https://www.coingecko.com/en/coins/${crypto.name.toLowerCase()})`, true)
            .addField('Binance', `[Click here](https://www.binance.com/en/trade/${crypto.symbol}_USDT)`, true)
            .addField('Cryptopanic', `[Click here](https://cryptopanic.com/news/${crypto.name.toLowerCase()}/)`, true)
            .addField('Coinmarketcal', `[Click here](https://coinmarketcal.com/en/coin/${crypto.name.toLowerCase()})`, true);

        // Coinmarketcap - https://coinmarketcap.com/currencies/${crypto.name.toLowerCase()}/
        // Coingecko - https://www.coingecko.com/en/coins/${crypto.name.toLowerCase()}
        // Binance - https://www.binance.com/en/trade/${crypto.symbol}_USDT
        // Cryptopanic - https://cryptopanic.com/news/${crypto.name.toLowerCase()}/
        // Coinmarketcal - https://coinmarketcal.com/en/coin/${crypto.name.toLowerCase()}
        //         `, crypto.name);
        user.send({embed});
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports = {
    notifyVikram,
};

