const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());


const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const {addCrypto, doAllCrypto} = require('./analysis');

const getCrypto = async (query) => {
    const url = 'https://coinmarketcap.com/';
    const data = await axios.get(url);
    const root = parse(data.data);
    const htmlJSON = root.querySelector('tbody');

    const crypto = [];

    for (let i = 1; i < htmlJSON.childNodes.length; i += 2) {
        const name = htmlJSON.childNodes[i].childNodes[3].childNodes[1].childNodes[0]._rawText;
        const time = new Date(dateString);
        const value = htmlJSON.childNodes[i].childNodes[5].childNodes[0].childNodes[0]._rawText;
        const percentChange24h = htmlJSON.childNodes[i].childNodes[6].childNodes.length === 3;
        crypto.push({name, time, value, percentChange24h});
    }

    crypto.forEach((item) => {
        addCrypto({
            name: item.name,
            symbol: item.symbol,
            value: item.quote.USD.price,
            time: new Date(item.quote.USD.last_updated),
            percentChange24h: item.quote.USD.percentChange24h,
        });
    });

    doAllCrypto();
};


cron.schedule('*/2 * * * *', getCrypto);

app.listen(process.env.PORT || 3000, () => {
    console.log('running on ', process.env.PORT||3000);
});
