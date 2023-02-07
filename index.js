const ccxt = require('ccxt');
const moment = require('moment');
const delay = require('delay');


const binance = new ccxt.binance({
    apiKey: 'H4hhbcab6aSow50Dm8qRXU3KsDIj4A7mxw9At1QIc3U1pa2Od2fKBVM9Bh3UzQrG',
    secret: '29lU7bHfO9Wo8x2kDpk5gjGAFIysznAzkeMQ1zLb23RU41siNortoqQd6MK0vwPH',
});

binance.setSandboxMode(true)

async function printBlance(btcPrice) {
    const balance = await binance.fetchBalance();
    const total = balance.total
    console.log('balance: BTC ${total.BTC}, USDT: ${total.USDT}');
    console.log(total.BTC)
    console.log(total.USDT)
        // console.log('Total USDT: ${total.BTC -1 * btcPrice + total.USDT}. \n');
        // console.log(total.BTC * btcPrice + total.USDT)

    console.log('Tong so tien hien tai:')
    console.log((total.BTC - 1) * btcPrice + total.USDT);
}

async function tick() {
    const prices = await binance.fetchOHLCV('BTC/USDT', '1m', undefined, 5);

    const bPrices = prices.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            high: price[2],
            low: price[3],
            close: price[4],
            volume: price[5]
        }
    })

    const averagePrice = bPrices.reduce((acc, price) => acc + price.close, 0) / 5;
    const lastPrice = bPrices[bPrices.length - 1].close

    console.log(bPrices.map(p => p.close), averagePrice, lastPrice);
    //Thuật toán bán khi tiền lên, mua khi tiền xuống


    const direction = lastPrice > averagePrice ? 'sell' : 'buy';
    const TRADE_SIZE = 100
    const quantity = TRADE_SIZE / lastPrice;

    console.log('average price: ${averagePrice}. Last price: ${lastPrice}');


    const order = await binance.createMarketOrder('BTC/USDT', direction, quantity);
    console.log('${moment().format()}: ${direction} ${quantity} BTC at ${lastPrice}');

    printBlance(lastPrice)
}

async function main() {
    while (true) {
        await tick();
        await delay(1 * 1000);
    }
}

main();
// printBlance();