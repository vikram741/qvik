global.Discord = require('discord.js');
global.client = new Discord.Client();

// const embed = require('./embed');
const {color, VIKRAM_ID, DISCORD_TOKEN} = require('../constants');

// ------------------------------ On Ready -----------------------------
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // notifyVikram({
    //     name: 'Bitcoin',
    //     symbol: 'BTC',
    //     change: 2,
    //     timeGap: 6,
    //     ups: 3,
    //     downs: 9,
    // });
    // client.channels.cache.forEach(async (channel) => {
    //     console.log(channel);
    //     fetched = await channel.fetchMessages();
    //     channel.bulkDelete(fetched);
    // });
});


client.login(DISCORD_TOKEN);

const notifyVikram = (crypto) => {
    client.users.fetch(VIKRAM_ID, false).then((user) => {
        const embed = new Discord.MessageEmbed()
            .setColor(color.GREY)
            .setTitle(crypto.name)
            .setDescription(`Pumped ${crypto.change}% in ${crypto.timeGap}mins.\n`+
            `Ups: ${crypto.ups}, Downs: ${crypto.downs}\n`+
            `[Coinmarketcap](https://coinmarketcap.com/currencies/${crypto.name.toLowerCase()}/) | ` +
            `[CoinGecko](https://www.coingecko.com/en/coins/${crypto.name.toLowerCase()}) | ` +
            `[Binance](https://www.binance.com/en/trade/${crypto.symbol}_USDT) | ` +
            `[Cryptopanic](https://cryptopanic.com/news/${crypto.name.toLowerCase()}/) | ` +
            `[Coinmarketcal](https://coinmarketcal.com/en/coin/${crypto.name.toLowerCase()}) | `);

        // Coinmarketcap - https://coinmarketcap.com/currencies/${crypto.name.toLowerCase()}/
        // Coingecko - https://www.coingecko.com/en/coins/${crypto.name.toLowerCase()}
        // Binance - https://www.binance.com/en/trade/${crypto.symbol}_USDT
        // Cryptopanic - https://cryptopanic.com/news/${crypto.name.toLowerCase()}/
        // Coinmarketcal - https://coinmarketcal.com/en/coin/${crypto.name.toLowerCase()}
        user.send({embed});
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports = {
    notifyVikram,
};

