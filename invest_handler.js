require('dotenv').config()

const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.connect(process.env.MONGODB_PRODUCTION_URI)
mongoose.pluralize(null);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Behasil menghubungkan database mongo ✓!');
})

const { _mongo_CommandSchema, _mongo_InvestHistorySchema, _mongo_BotSchema } = require('./lib/dbtype')(false)
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
require('chartjs-chart-financial'); // For financial chart types
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const Big = require('big.js');

// Configure Big.js for high precision
Big.DP = 20; // decimal places
Big.RM = Big.roundHalfUp;

const infinityNumber = "1.797693134862315E+307"
require('./invest_timer')

class CryptoMarketSimulator {
    constructor(coin, dataCoin) {
        const { initialPrice, currentPrice, adjustmentRatio, initialSupply, circulatingSupply, maxSupply, totalVolume } = dataCoin;

        this.coin = coin;
        this.initialPrice = new Big(initialPrice);
        this.currentPrice = new Big(currentPrice || initialPrice);
        this.minutePriceUpdate = new Big(0);
        this.adjustmentRatio = new Big(adjustmentRatio);
        this.circulatingSupply = new Big(circulatingSupply || initialSupply);
        this.maxSupply = new Big(maxSupply);
        this.marketCap = this.currentPrice.times(this.circulatingSupply);
        this.totalVolume = new Big(totalVolume || 0);
    }

    updatePrice(transaction) {
        console.log('start', this.coin, this.minutePriceUpdate.toString())
        const { type, content } = transaction;
        let impactRatio = new Big(content).div(this.circulatingSupply);
        // if(impactRatio.lt(0.01)) {
        //     impactRatio = new Big(0.01);
        // }
        console.log('impactRatio', this.coin, content, this.circulatingSupply.toString(), impactRatio.toString())
    
        const priceChange = this.currentPrice.times(this.adjustmentRatio).times(impactRatio);
        console.log('priceChange', this.coin, priceChange.toString())
    
        if (type === "buy") {
            this.minutePriceUpdate = this.minutePriceUpdate.plus(priceChange);
        } else if (type === "sell") {
            // Apply price reduction logic for selling
            this.minutePriceUpdate = this.minutePriceUpdate.minus(priceChange);
        }
    }

    async updateMinutePrice() {
        // minutePriceUpdate threshold 5%
        console.log('updateMinutePrice', this.coin, this.minutePriceUpdate.toString())
        let formattedPrice = this.currentPrice.plus(this.minutePriceUpdate);
        const priceChangeThreshold = this.currentPrice.plus(this.currentPrice.times(0.5));
        formattedPrice = formattedPrice.gt(priceChangeThreshold) ? priceChangeThreshold : formattedPrice;

        this.currentPrice = formattedPrice;
        this.minutePriceUpdate = new Big(0);

        this.marketCap = this.currentPrice.times(this.circulatingSupply);

        return await _mongo_CommandSchema.updateOne({
            cId: 'invest_price'
        }, {
            $set: {
                [`invest.${this.coin}.currentPrice`]: this.currentPrice.toString(),
                [`invest.${this.coin}.circulatingSupply`]: this.circulatingSupply.toString(),
                [`invest.${this.coin}.marketCap`]: this.marketCap.toString(),
                [`invest.${this.coin}.totalVolume`]: this.totalVolume.toString()
            }
        })
    }
    
    getHistoricalData(window) {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - window * 60 * 1000);
        return _mongo_InvestHistorySchema.find({
            coin: this.coin,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });
    }

    async updateMetrics(transaction) {
        // this.circulatingSupply = Math.min(this.maxSupply, this.circulatingSupply + transaction.content);
        if(transaction.type === 'buy') {
            this.circulatingSupply = this.circulatingSupply.plus(transaction.content);
            // Check for infinity by comparing string representation
            // if(this.circulatingSupply.toString().includes('e+') && 
            //    new Big(this.circulatingSupply.toString()).gte(infinityNumber)) {
            //     this.circulatingSupply = new Big(infinityNumber);
            // }
        } else if(transaction.type === 'sell') {
            this.circulatingSupply = this.circulatingSupply.minus(transaction.content);
            // if(this.circulatingSupply.lt(0)) {
            //     this.circulatingSupply = new Big(this.initialSupply || 0);
            // }
        }
        // this.marketCap = this.currentPrice * this.circulatingSupply;
        this.totalVolume = this.totalVolume.plus(transaction.content);
        await _mongo_CommandSchema.updateOne({
            cId: 'invest_price'
        }, {
            $set: {
                [`invest.${this.coin}.currentPrice`]: this.currentPrice.toString(),
                [`invest.${this.coin}.circulatingSupply`]: this.circulatingSupply.toString(),
                [`invest.${this.coin}.marketCap`]: this.marketCap.toString(),
                [`invest.${this.coin}.totalVolume`]: this.totalVolume.toString()
            }
        })
        // await _mongo_BotSchema.updateOne({ iId: 'CORE' }, {

        // }
        // the example structure of the metrics is
        // {
        //     invest: [{
        //         currentPriceThisCoin: 1000,
        //     }, {
        //         historyPrice_thisCoin0: 1000,
        //         historyPrice_thisCoin1: 1000,
        //         historyPrice_thisCoin2: 1000,
        //         historyPrice_thisCoin3: 1000,
        //         historyPrice_thisCoin4: 1000,
        //         historyPrice_thisCoin5: 2311,
        //         historyPrice_thisCoin6: 2311,
        //         historyPrice_thisCoin7: 2311,
        //         historyPrice_thisCoin8: 2311,
        //         historyPrice_thisCoin9: 2311,
        //     }]
        // } update the invest array with the new price and 
        // const objCOREInvest = await _mongo_BotSchema.findOne({ iId: 'CORE' }, { invest: 1 })

        // objCOREInvest.invest[0][this.coin] = this.currentPrice
        // objCOREInvest.invest[1][`re_${this.coin}_0`] = objCOREInvest.invest[1][`re_${this.coin}_1`]
        // objCOREInvest.invest[1][`re_${this.coin}_1`] = objCOREInvest.invest[1][`re_${this.coin}_2`]
        // objCOREInvest.invest[1][`re_${this.coin}_2`] = objCOREInvest.invest[1][`re_${this.coin}_3`]
        // objCOREInvest.invest[1][`re_${this.coin}_3`] = objCOREInvest.invest[1][`re_${this.coin}_4`]
        // objCOREInvest.invest[1][`re_${this.coin}_4`] = objCOREInvest.invest[1][`re_${this.coin}_5`]
        // objCOREInvest.invest[1][`re_${this.coin}_5`] = objCOREInvest.invest[1][`re_${this.coin}_6`]
        // objCOREInvest.invest[1][`re_${this.coin}_6`] = objCOREInvest.invest[1][`re_${this.coin}_7`]
        // objCOREInvest.invest[1][`re_${this.coin}_7`] = objCOREInvest.invest[1][`re_${this.coin}_8`]
        // objCOREInvest.invest[1][`re_${this.coin}_8`] = objCOREInvest.invest[1][`re_${this.coin}_9`]
        // objCOREInvest.invest[1][`re_${this.coin}_9`] = this.currentPrice

        // await _mongo_BotSchema.updateOne({ iId: 'CORE' }, {
        //     $set: {
        //         invest: objCOREInvest.invest
        //     }
        // })

        await _mongo_InvestHistorySchema.create({
            coin: this.coin,
            hash: transaction.hash,
            from: transaction.from,
            to: transaction.to,
            date: transaction.date,
            type: transaction.type,
            content: transaction.content.toString(),
            price: this.currentPrice.toString()
        })
    }

    async calculateSMA(period) {
        const historicalData = await this.getHistoricalData(period);
        if (historicalData.length === 0) {
          return null;
        }
        let sum = new Big(0);
        for(const data of historicalData) {
            sum = sum.plus(new Big(data.price));
        }
        return sum.div(historicalData.length).toString();
      }

    async calculateVolatility(period) {
        const filteredPriceHistory = await this.getHistoricalData(period);
        if (filteredPriceHistory.length < 2) {
          return null;
        }

        const priceHistory = filteredPriceHistory.map(data => new Big(data.price));
        const returns = [];
        for(let i = 1; i < priceHistory.length; i++) {
            const logReturn = Math.log(priceHistory[i].div(priceHistory[i-1]).toNumber());
            returns.push(logReturn);
        }
        const meanReturn = returns.reduce((sum, return_) => sum + return_, 0) / returns.length;
        const squaredDeviations = returns.map(return_ => Math.pow(return_ - meanReturn, 2));
        const variance = squaredDeviations.reduce((sum, deviation) => sum + deviation, 0) / (returns.length - 1);
        const volatility = Math.sqrt(variance * 252); // Annualized volatility assuming 252 trading days

        return volatility.toString();
    }

    async calculateWAP(period = null) {
        let matchStage = { $match: { coin: this.coin } };

        if (period) {
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - period);
            matchStage.$match.date = { $gte: startDate, $lte: endDate };
        }

        const result = await _mongo_InvestHistorySchema.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    // Convert strings to numbers for MongoDB aggregation, but handle as strings in our code
                    totalValue: { $sum: { $multiply: [{ $toDouble: "$price" }, { $toDouble: "$content" }] } },
                    totalVolume: { $sum: { $toDouble: "$content" } }
                }
            }
        ]);

        if (result.length > 0) {
            const { totalValue, totalVolume } = result[0];
            if(totalVolume > 0) {
                return new Big(totalValue).div(new Big(totalVolume)).toString();
            }
            return null;
        }

        return null;
    }

    async calculateOHLC(intervalMinutes = 5, totalHours = 3) {
        /**
         * This function calculates the OHLC values based on the given interval and total hours.
         * 
         * Parameters:
         * intervalMinutes (int): The time interval in minutes to calculate OHLC values.
         * totalHours (int): The total number of hours for which OHLC values need to be calculated.
         * priceData (Array): An array of objects, each containing 'date' (JavaScript Date object) and 'price'.
         * 
         * Returns:
         * Array: An array of objects with each object containing `x` (date), `o` (open price), `h` (high price),
         *        `l` (low price), and `c` (close price).
         */
        // Step 1: Initialize an empty array to hold OHLC values
        let ohlcValues = [];

        const startTimeMongoFind = Date.now() - (totalHours * 60 * 60 * 1000);
        const priceHistory = await _mongo_InvestHistorySchema.find({
            coin: this.coin,
            date: { $gt: startTimeMongoFind }
        }).sort({ date: 1 });
        const priceData = priceHistory.map(data => ({ date: new Date(data.date), price: new Big(data.price).toFixed(2) }));
        if(priceData.length === 0) {
            return null;
        }
        
        // Step 2: Calculate number of intervals
        let numIntervals = Math.floor((totalHours * 60) / intervalMinutes);
    
        // Step 3: Create a Date object to track intervals
        let startTime = priceData[0].date;
    
        for (let i = 0; i < numIntervals; i++) {
            // Calculate the start and end times for this interval
            let intervalStart = new Date(startTime.getTime() + i * intervalMinutes * 60000);
            let intervalEnd = new Date(intervalStart.getTime() + intervalMinutes * 60000);
    
            // Filter the price data to include only data points within the current interval
            let intervalData = priceData.filter(data => data.date >= intervalStart && data.date < intervalEnd);
    
            if (intervalData.length === 0) continue;
    
            let openPrice = intervalData[0].price;
            let highPrice = Math.max(...intervalData.map(data => Number(data.price)));
            let lowPrice = Math.min(...intervalData.map(data => Number(data.price)));
            let closePrice = intervalData[intervalData.length - 1].price;
    
            let ohlc = {
                x: intervalStart,
                o: Number(openPrice),
                h: Number(highPrice),
                l: Number(lowPrice),
                c: Number(closePrice)
            };
    
            ohlcValues.push(ohlc);
        }
    
        return ohlcValues;
    }
    
    
    

    // New method to generate candlestick chart
    async generateCandlestickChart() {
        let ohlcData = await this.calculateOHLC();
        if (!ohlcData) {
            // console.log('Not enough data to generate chart');
            // return null;
            ohlcData = [{ x: new Date(), o: this.currentPrice.toNumber(), h: this.currentPrice.toNumber(), l: this.currentPrice.toNumber(), c: this.currentPrice.toNumber() }];
        }
    
        // Convert OHLC data to Chart.js format
        const formattedData = ohlcData.map(({ x, o, h, l, c }, index) => ({
            x: moment(x).valueOf(),
            o,
            h,
            l,
            c,
        }));
        console.log('Formatted data:', formattedData);
    
        const width = 1200;  // Define the width of the chart
        const height = 800;  // Define the height of the chart
    
        // Use the correct settings for Chart.js canvas creation
        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width,
            height,
            plugins: {
                modern: ['chartjs-chart-financial'],
                globalVariableLegacy: ['chartjs-adapter-luxon']
            },
            chartCallback: () => {
                global.window = global.window || {};
                global.window.luxon = require('luxon');
            }
        });
    
        // const configuration = {
        //     type: 'candlestick',
        //     data: {
        //         datasets: [{
        //             label: `${this.coin} Price History`,
        //             data: formattedData
        //         }]
        //     },
        //     options: {
        //         plugins: {
        //             legend: {
        //                 display: false,
        //             }
        //         },
        //         scales: {
        //             x: {
        //                 type: 'time',
        //                 time: {
        //                     unit: 'minute',
        //                     tooltipFormat: 'HH:mm'
        //                 }
        //             },
        //         }
        //     }
        // };
        const configuration = {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: `${this.coin} Price History`,
                    data: formattedData
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                            tooltipFormat: 'HH:mm'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grace: '5%',
                        ticks: {
                            maxTicksLimit: 5
                        }
                    }
                }
            }
        };
    
        try {
            const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
            return imageBuffer;
        } catch (error) {
            console.error('Error generating candlestick chart:', error);
            return null;
        }
    }

    // example of transaction
    // const transaction = {
    //     hash: 'XXX',
    //     from: 'XXX',
    //     to: 'XXX',
    //     date: Date.now(),
    //     type: 'buy',
    //     content: 100,
    // }
    async processTransaction(transaction) {
        await this.updatePrice(transaction);
        await this.updateMetrics(transaction);

        return {
            currentPrice: this.currentPrice.toString(),
            marketCap: this.marketCap.toString(),
            circulatingSupply: this.circulatingSupply.toString(),
            totalVolume: this.totalVolume.toString()
        };
    }
}

// const listCoin = [
//     {
//         coin: 'naocoin',
//         dataCoin: {
//             initialPrice: 900_000,
//             adjustmentRatio: 0.1,
//             initialSupply: 1_000,
//             maxSupply: 2_000_000
//         }
//     },
//     {
//         coin: 'elacoin',
//         dataCoin: {
//             initialPrice: 3_500_000,
//             adjustmentRatio: 0.05,
//             initialSupply: 1_000,
//             maxSupply: 5_000_000
//         }
//     },
//     {
//         coin: 'recoin',
//         dataCoin: {
//             initialPrice: 80_000_000,
//             adjustmentRatio: 0.15,
//             initialSupply: 1_000,
//             maxSupply: 1_000_000
//         }
//     }
// ]

let ObjectCoin = {}
let imageBufferChart = {}
async function loadCoin() {
    const getDataMongoListPrice = await _mongo_CommandSchema.findOne({ cId: 'invest_price' })
    const listCoin = Object.keys(getDataMongoListPrice.invest).map(coin => {
        return {
            coin: coin,
            dataCoin: getDataMongoListPrice.invest[coin]
        }
    })

    for(const { coin, dataCoin } of listCoin) {
        const simulator = new CryptoMarketSimulator(coin, dataCoin);
        ObjectCoin[coin] = simulator;
        
        // Generate the initial candlestick chart for each coin
        imageBufferChart[coin] = await simulator.generateCandlestickChart();
    }

    setInterval(async () => {
        for(let i = 0; i < listCoin.length; i++) {
            const { coin } = listCoin[i];
            await ObjectCoin[coin].updateMinutePrice();

            // if last coin
            if(i === listCoin.length - 1) {
                const objCOREInvest = await _mongo_BotSchema.findOne({ iId: 'CORE' }, { invest: 1 })

                let updateBatch = {}
                for(const { coin, dataCoin } of listCoin) {
                    // objCOREInvest.invest[0][coin] = dataCoin.currentPrice
                    // objCOREInvest.invest[1][re_${coin}0] = objCOREInvest.invest[1][re_${coin}1]
                    // objCOREInvest.invest[1][re_${coin}1] = objCOREInvest.invest[1][re_${coin}2]
                    // objCOREInvest.invest[1][re_${coin}2] = objCOREInvest.invest[1][re_${coin}3]
                    // objCOREInvest.invest[1][re_${coin}3] = objCOREInvest.invest[1][re_${coin}4]
                    // objCOREInvest.invest[1][re_${coin}4] = objCOREInvest.invest[1][re_${coin}5]
                    // objCOREInvest.invest[1][re_${coin}5] = objCOREInvest.invest[1][re_${coin}6]
                    // objCOREInvest.invest[1][re_${coin}6] = objCOREInvest.invest[1][re_${coin}7]
                    // objCOREInvest.invest[1][re_${coin}7] = objCOREInvest.invest[1][re_${coin}8]
                    // objCOREInvest.invest[1][re_${coin}8] = objCOREInvest.invest[1][re_${coin}9]
                    // objCOREInvest.invest[1][re_${coin}9] = dataCoin.currentPrice
                    updateBatch[`invest.0.${coin}`] = ObjectCoin[coin].currentPrice.toString()
                    updateBatch[`invest.1.re_${coin}0`] = objCOREInvest.invest[1][`re_${coin}1`]
                    updateBatch[`invest.1.re_${coin}1`] = objCOREInvest.invest[1][`re_${coin}2`]
                    updateBatch[`invest.1.re_${coin}2`] = objCOREInvest.invest[1][`re_${coin}3`]
                    updateBatch[`invest.1.re_${coin}3`] = objCOREInvest.invest[1][`re_${coin}4`]
                    updateBatch[`invest.1.re_${coin}4`] = objCOREInvest.invest[1][`re_${coin}5`]
                    updateBatch[`invest.1.re_${coin}5`] = objCOREInvest.invest[1][`re_${coin}6`]
                    updateBatch[`invest.1.re_${coin}6`] = objCOREInvest.invest[1][`re_${coin}7`]
                    updateBatch[`invest.1.re_${coin}7`] = objCOREInvest.invest[1][`re_${coin}8`]
                    updateBatch[`invest.1.re_${coin}8`] = objCOREInvest.invest[1][`re_${coin}9`]
                    updateBatch[`invest.1.re_${coin}9`] = ObjectCoin[coin].currentPrice.toString()
                }

                console.log(await _mongo_BotSchema.updateOne({ iId: 'CORE' }, {
                    $set: updateBatch
                }))
            }
            // Generate candlestick chart for each coin
            imageBufferChart[coin] = await ObjectCoin[coin].generateCandlestickChart();
        }
    }, 1000 * 60)
}
loadCoin()


const express = require('express');
const app = express();
const port = 5153;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/price/:coin', async (req, res) => {
    const { coin } = req.params;
    if (!ObjectCoin[coin]) {
        return res.status(404).json({ message: 'Coin not found' });
    }

    const currentPrice = ObjectCoin[coin].currentPrice.toString();
    const marketCap = ObjectCoin[coin].marketCap.toString();
    const circulatingSupply = ObjectCoin[coin].circulatingSupply.toString();
    const maxSupply = ObjectCoin[coin].maxSupply.toString();
    const totalVolume = ObjectCoin[coin].totalVolume.toString();
    const sma = await ObjectCoin[coin].calculateSMA(Number(req.query.period));
    const volatility = await ObjectCoin[coin].calculateVolatility(Number(req.query.period));
    const wap = await ObjectCoin[coin].calculateWAP();
    res.json({ currentPrice, marketCap, circulatingSupply, maxSupply, totalVolume, sma, volatility, wap });
});

app.get('/chart/:coin', async (req, res) => {
    const { coin } = req.params;
    if (!ObjectCoin[coin]) {
        return res.status(404).json({ message: 'Coin not found' });
    }

    // const imageBuffer = await ObjectCoin[coin].generateCandlestickChart();
    const imageBuffer = imageBufferChart[coin];
    if (!imageBuffer) {
        return res.status(500).json({ message: 'Failed to generate chart' });
    }

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
});

app.post('/transaction/:coin', async (req, res) => {
    const { coin } = req.params;
    if (!ObjectCoin[coin]) {
        return res.status(404).json({ message: 'Coin not found' });
    }

    const { hash, from, to, date, type, content } = req.body;
    if (!hash || !from || !to || !date || !type || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = { hash, from, to, date, type, content };
    const result = await ObjectCoin[coin].processTransaction(transaction);
    res.json(result);
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});