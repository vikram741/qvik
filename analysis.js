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
 *      percent_change_24h
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
const minChangeRequired = 1.01;

const addCrypto = (crypto) => {
    if (CACHE[crypto.symbol]) {
        if (CACHE[crypto.symbol].price.length >= 20) {
            CACHE[crypto.symbol].price.shift();
        }
        CACHE[crypto.symbol].price.push({
            value: crypto.value,
            time: crypto.time,
        });
        CACHE[crypto.symbol].percent_change_24h = crypto.percent_change_24h;
    } else {
        CACHE[crypto.symbol] = {
            name: crypto.name,
            price: [{
                value: crypto.value,
                time: crypto.time,
            }],
            percent_change_24h: crypto.percent_change_24h,
        };
    }
};

const processCrypto = (hist) => {
    let maxChangeIdx = -1;
    let maxChange = 0;
    const current = hist[hist.length - 1];
    for (const idx in hist) {
        if (current.value - hist[idx].value > maxChange) {
            maxChange = current.value - hist[idx].value;
            maxChangeIdx = idx;
        };
    }
    console.log(maxChange);

    if (maxChangeIdx != -1 && current.value > (hist[maxChangeIdx].value * minChangeRequired)) {
        return {
            pumping: true,
            timeGap: moment(current.time).diff(hist[maxChangeIdx].time, 'minutes'),
            change: ((current.value - hist[maxChangeIdx].value) * 100) / (hist[maxChangeIdx].value),
        };
    }

    return {pumping: false};
};

const doAllCrypto = () => {
    const onFire = [];

    for (const key in CACHE) {
        console.log(key);
        const result = processCrypto(CACHE[key].price);

        if (result.pumping) {
            console.log(({
                name: CACHE[key].name,
                timeGap: result.timeGap,
                change: result.change,
            }));
        }

        if (result.pumping && CACHE[key].percent_change_24h < 7) {
            onFire.push({
                symbol: key,
                name: CACHE[key].name,
                timeGap: result.timeGap,
                change: result.change,
            });
        }
    }

    onFire.sort((a, b) => {
        return (a.change - b.change);
    });

    for (const idx in onFire) {
        if (idx > 4) break;

        if (NotifiedCryptos[onFire[idx].symbol]) {
            const note = NotifiedCryptos[onFire[idx].symbol];

            if (moment().diff(note.timeStamp, 'minutes') > 5 ||
(note.change * 1.5 < onFire[idx].change) ||
(note.timeGap * 1.5 < onFire[idx].timeGap)) {
                notifyVikram(onFire[idx]);

                NotifiedCryptos[onFire[idx].symbol] = {
                    change: onFire[idx].change,
                    timeGap: onFire[idx].timeGap,
                    timeStamp: new Date(),
                };
            }
        } else {
            notifyVikram(onFire[idx]);
            NotifiedCryptos[onFire[idx].symbol] = {
                change: onFire[idx].change,
                timeGap: onFire[idx].timeGap,
                timeStamp: new Date(),
            };
        }
        console.log((NotifiedCryptos[onFire[idx].symbol]));
    }
};

// const btc = {
//     name: 'Bitcoin',
//     symbol: 'BTC',
//     price: 5000,
//     time: moment(),
//     percent_change_24h: 5,
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

