const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());


const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const {addCrypto, doAllCrypto} = require('./analysis');

const getCrypto = (query) => {
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        params: {
            start: query.start,
            limit: query.limit,
        },
        headers: {
            'X-CMC_PRO_API_KEY': query.key,
        },
    }).then((res) => {
        const data = res.data.data;

        data.forEach((item) => {
            addCrypto({
                name: item.name,
                symbol: item.symbol,
                value: item.quote.USD.price,
                time: new Date(item.quote.USD.last_updated),
                percent_change_24h: item.quote.USD.percent_change_24h,
            });
        });

        doAllCrypto();
    }).catch((err) => {
        console.log(err);
    });
};


const cryptoInit = () => {
    // getCrypto(1, 25, process.env.cmc_api_key_1);
    getCrypto({start: 40, limit: 10, key: process.env.cmc_api_key_3});
    // getCrypto(51, 75, process.env.cmc_api_key_2);
    // getCrypto(76, 100, process.env.cmc_api_key_4);
};

cron.schedule('* * * * *', cryptoInit);

app.listen(process.env.PORT || 3000, () => {
    console.log('running on ', process.env.PORT||3000);
});
