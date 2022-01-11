/* eslint-disable guard-for-in */
const moment = require('moment');

const {notifyVikram} = require('./bot/bot');

/**
 * CACHE = {
 *    {
 *      name,
 *      symbol,
 *      price = [{
 *          value,
 *          time
 *      }],
 *      percentChange24h
 *    }
 * }
 */
const CACHE = {};

/**
 * NotifiedCryptos = {
 *      change,
 *      timeGap,
 *      timeStamp,
 * }
 */
const NotifiedCryptos = {};

// 3% change
const MinChangeRequired = 1.02;

// in 40 minutes
const MaxMinutes = 20;

// Max change (expecting 5% from here)
// const Max24Change = 10;

// Min gap between notifications
const MinGapForRally = 30;


const addCrypto = (crypto) => {
    if (CACHE[crypto.symbol]) {
        if (CACHE[crypto.symbol].price.length >= MaxMinutes) {
            CACHE[crypto.symbol].price.shift();
        }
        CACHE[crypto.symbol].price.push({
            value: crypto.value,
            time: crypto.time,
        });
        CACHE[crypto.symbol].percentChange24h = crypto.percentChange24h;
    } else {
        CACHE[crypto.symbol] = {
            name: crypto.name,
            price: [{
                value: crypto.value,
                time: crypto.time,
            }],
            percentChange24h: crypto.percentChange24h,
        };
    }
};

const processCrypto = (hist) => {
    let maxChangeIdx = -1;
    let maxChange = 0;
    let ups = 0;
    let downs = 0;
    const current = hist[hist.length - 1];
    for (const idx in hist) {
        if (current.value - hist[idx].value > maxChange) {
            maxChange = current.value - hist[idx].value;
            maxChangeIdx = idx;
        };
        if (idx!=0) {
            if (hist[idx].value>hist[idx-1].value) {
                ups = ups+1;
            } else if (hist[idx].value<hist[idx-1].value) {
                downs = downs+1;
            }
        }
    }

    // if (maxChangeIdx != -1 && current.value > (hist[maxChangeIdx].value * MinChangeRequired)) {
    if (maxChangeIdx != -1 && current.value > (hist[maxChangeIdx].value * MinChangeRequired)) {
        return {
            pumping: true,
            timeGap: moment(current.time).diff(hist[maxChangeIdx].time, 'minutes'),
            change: ((current.value - hist[maxChangeIdx].value) * 100) / (hist[maxChangeIdx].value),
            ups,
            downs,
        };
    }

    return {pumping: false};
};

/**
 * @param {{symbol, name, timeGap, change, ups, downs }} hotCrypto
 * @param {Number} rallyCount
 */
const notifyAndUpdate = (hotCrypto, rallyCount)=>{
    hotCrypto.rallyCount = rallyCount;
    notifyVikram(hotCrypto);
    NotifiedCryptos[hotCrypto.symbol] = {
        change: hotCrypto.change,
        timeGap: hotCrypto.timeGap,
        timeStamp: new Date(),
        rallyCount,
    };
    CACHE[hotCrypto.symbol].price = [];
};

const doAllCrypto = () => {
    const onFire = [];

    for (const key in CACHE) {
        const result = processCrypto(CACHE[key].price);

        // if (result.pumping && CACHE[key].percentChange24h < Max24Change) {
        if (result.pumping) {
            onFire.push({
                symbol: key,
                name: CACHE[key].name,
                timeGap: result.timeGap,
                change: result.change,
                ups: result.ups,
                downs: result.downs,
            });
        }
    }

    onFire.sort((a, b) => {
        return (a.change/a.timeGap - b.change/b.timeGap);
    });

    for (const idx in onFire) {
        if (idx > 4) break;

        if (NotifiedCryptos[onFire[idx].symbol]) {
            const note = NotifiedCryptos[onFire[idx].symbol];

            if (moment().diff(note.timeStamp, 'minutes') > MinGapForRally) {
                notifyAndUpdate(onFire[idx], 1);
            } else {
                notifyAndUpdate(onFire[idx], note.rallyCount+1);
            }
        } else {
            notifyAndUpdate(onFire[idx], 1);
        }
        console.log((NotifiedCryptos[onFire[idx].symbol]));
    }
};

// const btc = {
//     name: 'Bitcoin',
//     symbol: 'BTC',
//     price: 5000,
//     time: moment(),
//     percentChange24h: 5,
// };


// function addMinutes( minutes) {
//     return new Date((new Date()).getTime() + minutes*60000);
// }


// function test() {
//     const n=15;
//     for (let i=0; i<n; i++) {
//         btc.value = 5000 + (i*10);
//         btc.time = addMinutes(i);
//         addCrypto(btc);
//         doAllCrypto();
//     }
// }
// test();

module.exports = {
    doAllCrypto,
    addCrypto,
};


/**
    TO BE DONE:
        Total ups and downs.
        links
        -> coinmarketcap - `https://coinmarketcap.com/currencies/${crypto.name}/`
        -> coingecko - `https://www.coingecko.com/en/coins/${crypto.name}`
        -> binance - `https://www.binance.com/en/trade/${crypto.symbol}_USDT`
        -> cryptopanic - `https://cryptopanic.com/news/${crypto.name}/`
        -> coinmarketcal - `https://coinmarketcal.com/en/coin/${crypto.name}`
        embed
        1% in, 2% in, ..
        30min, 1hr, 2hr change ..
        algo - near candles = more weight
 */
