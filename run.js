require('dotenv').config()
const pm2 = require('pm2')
const cron = require('node-cron');
const moment = require('moment-timezone')
const fs = require('fs')

const { sizeFormatter } = require('human-readable')
const os = require('os')
const spawn = require("child_process").spawn;
const checkDiskSpace = require('check-disk-space').default
const randomWords = require("random-words")
const lunicode = require("lunicode")
const crypto = require('crypto')
const toMs = require('ms')

const axios = require('axios')
const cheerio = require('cheerio')

const WebSocket = require('ws')

const { numberWithCommas2, GenerateSerialNumber, sleep, sendRequestRandomJadibot, getAllJadibotFromAPI, sendReqToGroupJadibot, checkImageNsfw } = require('./lib/functions')(false)
const { _mongo_UserSchema, _mongo_UserAccountSchema, _mongo_BotSchema, _mongo_CommandSchema, _mongo_CommandMessageSchema, _mongo_GroupSchema } = require('./lib/dbtype')(false)

const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.connect(process.env.MONGODB_PRODUCTION_URI)
mongoose.pluralize(null);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Behasil menghubungkan database mongo ✓!');
})

moment.tz.setDefault('Asia/Jakarta').locale('id')

pm2.connect(async (error) => {
    if (error) {
        console.error(error)
    }

    pm2.start({
        script: 'index_whatsmeow.js',
        name: 'new',
        max_memory_restart: '3072M',
        node_args: '--max-old-space-size=10384',
        shutdown_with_message: true,
        kill_timeout: 10000,
        "out_file": "/dev/null",
        "error_file": "/dev/null"
        // cron_restart: '*/30 * * * *',
    }, (error, apps) => {
        pm2.disconnect()
        if (error) {
            console.error(error)
        }
    })

    // for(let i = 0; i < 5; i++) {
    //     console.log('starting', i + 1)
    //     pm2.start({
    //         script: 'jadibot.js',
    //         name: 'jadibot' + (i + 1),
    //         // instances : "max",
    //         max_memory_restart: '3072M',
    //         //restart_delay: 3000,
    //         node_args: `--max-old-space-size=10384`,
    //         args: `--key=OIBARPOINAIWRH9QONWI097124AOIHWFO --server=${i + 1} --serverPort=${[9027, 7027, 5027, 3027, 1027, 1127, 2027, 4027, 6027, 8027][i]}`,
    //         shutdown_with_message: true,
    //         kill_timeout: 10000,
    //         cron_restart: '*/60 * * * *',
    //         // "out_file": "/dev/null",
    //         // "error_file": "/dev/null",
    //         env: {
    //             LD_PRELOAD: '/usr/lib/aarch64-linux-gnu/libjemalloc.so'
    //         }
    //     }, (error, apps) => {
    //         pm2.disconnect()
    //         if (error) {
    //             console.error(error)
    //         }
    //     })
    // }

    pm2.start({
        script: 'puppeteer.js',
        name: 'puppeteer',
        // exec_mode : "cluster",
        max_memory_restart: '3096M',
        node_args: '--max-old-space-size=4196',
        shutdown_with_message: true,
        kill_timeout: 10000,
        cron_restart: '*/30 * * * *',
    }, (error, apps) => {
        pm2.disconnect()
        if (error) {
            console.error(error)
        }
    })

    pm2.start({
        script: 'invest_handler.js',
        name: 'invest_handler',
        // exec_mode : "cluster",
        max_memory_restart: '3096M',
        node_args: '--max-old-space-size=4196',
        shutdown_with_message: true,
        kill_timeout: 10000
    }, (error, apps) => {
        pm2.disconnect()
        if (error) {
            console.error(error)
        }
    })

    // pm2.start({
    //     script: '../listJadibot/index.js',
    //     name: 'list-jadibot',
    //     // exec_mode : "cluster",
    //     max_memory_restart: '1096M',
    //     node_args: '--max-old-space-size=4196',
    //     shutdown_with_message: true,
    //     kill_timeout: 10000,
    // }, (error, apps) => {
    //     pm2.disconnect()
    //     if (error) {
    //         console.error(error)
    //     }
    // })

    cron.schedule('0 * * * *', async function () { // per hour
        const commandDb = await _mongo_CommandSchema.findOne({ cId: 'togel' })

        if(commandDb.content[0] != undefined) {
            const isWinner = commandDb.content.find((x) => x.number == commandDb.options.randomNumber)

            if(isWinner) {
                await _mongo_UserSchema.updateOne({ iId: isWinner.iId }, { $inc: { "economy.money": commandDb.options.money } })
                await _mongo_CommandSchema.updateOne({ cId: 'togel' }, { $set: { content: [], "options.money": 10000, "options.randomNumber": Math.floor(Math.random() * 1000) }, $push: { "options.winner": { iId: isWinner.iId, number: isWinner.number, time: Date.now() } } } )
            
                console.log(await sendRequestRandomJadibot('sendText', [isWinner.iId, `Selamat anda *menang di game togel*, anda mendapatkan Rp. ${numberWithCommas2(commandDb.options.money)}`]))
            } else {
                await _mongo_CommandSchema.updateOne({ cId: 'togel' }, { $set: { content: [], "options.randomNumber": Math.floor(Math.random() * 1000) } } )

                const listLose = commandDb.content.map((x) => x.iId)
                listLose.forEach(async (x) => {
                    console.log(await sendRequestRandomJadibot('sendText', [x, `Maaf anda *kalah di game togel*, silahkan coba lagi nanti`]))
                })
            }
        }

        // backup section
        console.log('Begin backup')

        try {
            await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6281358181668@s.whatsapp.net', data: `Backup ${moment().format('DD-MM-YYYY HH-mm')}`, options: {} })
            await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6282229778223@s.whatsapp.net', data: `Backup ${moment().format('DD-MM-YYYY HH-mm')}`, options: {} })
        } catch (err) {
            console.error('Failed sendText to botAPI_0', err)
        }
        const filePathBackup = `${process.cwd()}/lib/cache/backup`
        let backupProcess = spawn('mongodump', [
            `--uri="${process.env.MONGODB_ADMIN_URI}"`,
            '--authenticationDatabase=admin',
            '--db=db-bot-rem-comp',
            '--dumpDbUsersAndRoles',
            '--gzip',
            `--archive=${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`,
            '--quiet'
        ]);
        
        backupProcess.on('exit', async (code, signal) => {
            if(code)  {
                console.log('Backup process exited with code ', code);

                try {
                    await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6281358181668@s.whatsapp.net', data: '*!! WARNING !!*\nBackup process exited with code ' + code, options: {} })
                    await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6282229778223@s.whatsapp.net', data: '*!! WARNING !!*\nBackup process exited with code ' + code, options: {} })
                } catch (err) {
                    console.error('Failed sendText to botAPI_1', err)
                }
            } else if (signal) {
                console.error('Backup process was killed with singal ', signal);

                try {
                    await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6281358181668@s.whatsapp.net', data: '*!! WARNING !!*\nBackup process was killed with singal ' + signal, options: {} })
                    await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6282229778223@s.whatsapp.net', data: '*!! WARNING !!*\nBackup process was killed with singal ' + signal, options: {} })
                } catch (err) {
                    console.error('Failed sendText to botAPI_2', err)
                }
            } else {
                console.log('Successfully backedup the database')

                try {
                    // await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendMessage', number: '6281358181668@s.whatsapp.net', data: `${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, options: `backup.${moment().format('DD-MM-YYYY HH-mm')}.db-bot-rem-comp.gz`, options1: '', options2: '', options3: 'documentMessage', options4: 'application/gzip' })
                    // await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendMessage', number: '6282229778223@s.whatsapp.net', data: `${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, options: `backup.${moment().format('DD-MM-YYYY HH-mm')}.db-bot-rem-comp.gz`, options1: '', options2: '', options3: 'documentMessage', options4: 'application/gzip' })
                    const sendBodyBackup = { id: 'CORE', key: 'OIAHOIFBAPW790709ba', method: 'sendFile', content: [] }
                    await axios.post('http://localhost:7516/access', Object.assign(sendBodyBackup, { content: ["6281358181668@s.whatsapp.net", `${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, `backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, '', '', 'documentMessage', 'application/gzip'] }))
                    await axios.post('http://localhost:7516/access', Object.assign(sendBodyBackup, { content: ["6282229778223@s.whatsapp.net", `${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, `backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`, '', '', 'documentMessage', 'application/gzip'] }))
                } catch (err) {
                    console.error('Failed sendMessage to botAPI_4', err)
                }
                fs.unlinkSync(`${filePathBackup}/backup.${moment().format('DD-MM-YYYY HH-mm')}.gz`)
            }
        });

        try {
            await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6281358181668@s.whatsapp.net', data: '*/Daily Backup\*\n\nBerhasil melakukan backup Database', options: {} })
            await axios.post('http://localhost:7516/api/v2/post/useBotMethod', { method: 'sendText', number: '6282229778223@s.whatsapp.net', data: '*/Daily Backup\*\n\nBerhasil melakukan backup Database', options: {} })
        } catch (err) {
            console.error('Failed sendText to botAPI_3', err)
        }

        const newsAnime = await _mongo_CommandSchema.findOne({ cId: 'anime_news' })

        const getPageBeritaAnime = await axios.get('https://amhmagz.com/')
        const pageBeritaAnime = getPageBeritaAnime.data
    
        const $ = cheerio.load(pageBeritaAnime)
        const dataAnimeNews = []

        $('ul.slides > li > article > div').each(function (a, b) {
            const url = $(b).find('h2 > a').attr('href')
            const thumb = $(b).find('div.post-thumbnail > a > img').attr('src')
            const title = $(b).find('h2 > a').text()?.trim()
            const desc = $(b).find('div.entry.excerpt.entry-summary > p').text()?.trim()

            const category = $(b).find('div.post-meta.group > p.post-category > a').text().trim()
            const date = $(b).find('div.post-meta.group > p.post-date > time').attr('datetime')
            dataAnimeNews.push({ url, thumb, title, desc, category, ts: moment(date).valueOf() })
        })

        $('#grid-wrapper > div > article > div').each(function (a, b) {
            const url = $(b).find('h2 > a').attr('href')
            const thumb = $(b).find('div.post-thumbnail > a > img').attr('src')
            const title = $(b).find('h2 > a').text()?.trim()
            const desc = $(b).find('div.entry.excerpt.entry-summary > p').text()?.trim()
    
            const category = $(b).find('div.post-meta.group > p.post-category > a').text().trim()
            const date = $(b).find('div.post-meta.group > p.post-date > time').attr('datetime')
            dataAnimeNews.push({ url, thumb, title, desc, category, ts: moment(date).valueOf() })
        })
        dataAnimeNews.sort((a, b) => a.ts - b.ts)

        await _mongo_CommandSchema.updateOne({ cId: 'anime_news' }, { $set: { content: dataAnimeNews } })

        const allUrlOld = newsAnime.content.map((x) => x.url)
        const allUrlNew = dataAnimeNews.map((x) => x.url)

        const newUrl = allUrlNew.filter((x) => !allUrlOld.includes(x))

        if(newUrl.length > 0) {
            const newUrlData = dataAnimeNews.filter((x) => newUrl.includes(x.url))

            await sleep(30000)
            
            const _jadibot = Object.values(await getAllJadibotFromAPI())
            const subscribedNewsAnimeGroup = await _mongo_GroupSchema.find({ "isSubsAnimeNews": true }, { iId: 1 })
            console.log(subscribedNewsAnimeGroup)
            subscribedNewsAnimeGroup.forEach(async (x) => {
                newUrlData.forEach(async (newsData) => {
                    const textSendCaption = `*_「 Berita Anime 」_*\n\n*${newsData.title}*\n\n${newsData.desc}\n\n_${lunicode.tools.tiny.encode('Source : amhmagz.com')}_\n${newsData.url}`
                    const sendBody = { id: x.iId, key: 'OV5B1ON5O46BP23N3pa', method: 'sendMessage', content: [{ image: { url: newsData.thumb }, caption: textSendCaption }] }
                    const portCoreBot = 7516

                    try {
                        await axios.post(`http://localhost:${portCoreBot}/access/sendReqToGroup`, sendBody)
                    } catch (err) {
                        console.error(err)
                    }

                    _jadibot.forEach(async (jadibotData) => {
                        try {
                            await axios.post(`http://localhost:${jadibotData.port}/access/sendReqToGroupJadibot`, sendBody)
                        } catch (err) {
                            console.error(err)
                        }
                    })
                })
            })
        }
    })

    cron.schedule("*/1 * * * *", async function () {
        try {
            const _botDb = await  _mongo_BotSchema.findOne({ iId: 'CORE' })
            var _invest = _botDb.invest
            var _record_ram_cpu = _botDb.record
            const setRecord_stat = async () => {
                const obj = {
                    re0: null,
                    re1: null,
                    re2: null,
                    re3: null,
                    re4: null,
                    re5: null,
                    re6: null,
                    re7: null,
                    re8: null,
                    re9: null,
                    r0: null,
                    r1: null,
                    r2: null,
                    r3: null,
                    r4: null,
                    r5: null,
                    r6: null,
                    r7: null,
                    r8: null,
                    r9: null,
                    c0: null,
                    c1: null,
                    c2: null,
                    c3: null,
                    c4: null,
                    c5: null,
                    c6: null,
                    c7: null,
                    c8: null,
                    c9: null
                }
                await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { record: obj })
            }
            const getRecord_stat = () => {
                return _record_ram_cpu?.re0
            }
            if (getRecord_stat() == undefined) await setRecord_stat()
        
            const format = sizeFormatter({
                std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
                decimalPlaces: 2,
                keepTrailingZeroes: false,
                render: (literal, symbol) => `${literal} ${symbol}B`,
            })
        
            var cpuPercentage = ''
            const exec = require('child_process').exec
        
            await exec(`awk '{u=$2+$4; t=$2+$4+$5; if (NR==1){u1=u; t1=t;} else print ($2+$4-u1) * 100 / (t-t1) "%"; }' \
                <(grep 'cpu ' /proc/stat) <(sleep 1;grep 'cpu ' /proc/stat)`, {
                shell: "/bin/bash"
            }, (err, stdout, stderr) => {
                cpuPercentage = parseFloat(stdout.replace('%', ''))
                if (err) {
                    console.log(stderr)
                }
            })

            // const minMaxValueCoal = [1_999, 9_999]
            // const randomMinMaxCoal = [Math.floor(Math.random() * 70) + 40, Math.floor(Math.random() * 100) + 120]

            // const minMaxValueCopper = [10_000, 15_999]
            // const randomMinMaxCopper = [Math.floor(Math.random() * 90) + 120, Math.floor(Math.random() * 50) + 230]

            // const minMaxValueIron = [10_000, 50_000]
            // // [0] Decrease | [1] Increase
            // const randomMinMaxIron = [Math.floor(Math.random() * 1300) + 200, Math.floor(Math.random() * 1100) + 400]

            // const minMaxValueGold = [110_000, 165_000]
            // // const minMaxValueGold = [150_000, 200_000]
            // const randomMinMaxGold = [Math.floor(Math.random() * 1700) + 100, Math.floor(Math.random() * 1300) + 500]

            // const minMaxValueDiamond = [189_000, 389_000]
            // const randomMinMaxDiamond = [Math.floor(Math.random() * 7999) + 1000, Math.floor(Math.random() * 11000) + 9000]

            // const minMaxValueSaCoin = [409_000, 789_000]
            // const randomMinMaxSaCoin = [Math.floor(Math.random() * 10289) + 2500, Math.floor(Math.random() * 27000) + 7000]

            // // const minMaxValueNaoCoin = [450_000, 850_000]
            // // // const minMaxValueNaoCoin = [450_000, 700_000]
            // // const randomMinMaxNaoCoin = [Math.floor(Math.random() * 2700) + 400, Math.floor(Math.random() * 2400) + 700]

            // // const minMaxValueElaCoin = [1_300_000, 3_500_000]
            // // // const minMaxValueElaCoin = [1_300_000, 3_000_000]
            // // const randomMinMaxElaCoin = [Math.floor(Math.random() * 4000) + 500, Math.floor(Math.random() * 3600) + 900]

            // // const minMaxValueReCoin = [70_500_000, 80_000_000]
            // // // const minMaxValueReCoin = [70_000_000, 70_500_000]
            // // const randomMinMaxReCoin = [Math.floor(Math.random() * 2000) + 3000, 5000]

            // // const invsListPercent = { // digit
            // //     "0": {
            // //         buy: 0.5,
            // //         sell: 0.5
            // //     },
            // //     "1": {
            // //         buy: 0.05,
            // //         sell: 0.05
            // //     },
            // //     "2": {
            // //         buy: 0.005,
            // //         sell: 0.005
            // //     },
            // //     "3": {
            // //         buy: 0.0005,
            // //         sell: 0.0005
            // //     },
            // //     "4": {
            // //         buy: 0.00005,
            // //         sell: 0.00005
            // //     },
            // //     "5": {
            // //         buy: 0.000006,
            // //         sell: 0.000006
            // //     },
            // //     "6": {
            // //         buy: 0.0000006,
            // //         sell: 0.0000006
            // //     },
            // //     "7": {
            // //         buy: 0.00000006,
            // //         sell: 0.00000006
            // //     }
            // // }
            // // const invsList = _invest[2]

            // // [0] data | [1] variable_name
            // // const allCoin = [['coal', 'Coal'], ['copper', 'Copper'], ['iron', 'Iron'], ['gold', 'Gold'], ['diamond', 'Diamond'], ['sacoin', 'SaCoin'], ['naocoin', 'NaoCoin'], ['elacoin', 'ElaCoin'], ['recoin', 'ReCoin']]
            // // const allCoin = [['iron', 'Iron'], ['gold', 'Gold'], ['diamond', 'Diamond'], ['naocoin', 'NaoCoin'], ['elacoin', 'ElaCoin'], ['recoin', 'ReCoin']]
            // const allCoin = [['iron', 'Iron'], ['gold', 'Gold'], ['diamond', 'Diamond']]
            // for(let i = 0; i < allCoin.length; i++) {
            //     const currentCoin = allCoin[i]
            //     console.log('Updating', currentCoin[1])
            //     const randomNaikTurunInvest = Math.floor(Math.random() * 2)
                
            //     const minMaxValue = eval(`minMaxValue${currentCoin[1]}`)
            //     const randomMinMax = eval(`randomMinMax${currentCoin[1]}`)
                
            //     // const invListValue = invsList[currentCoin[0]]
            //     // const digitInvCount = (Math.floor(_invest[0][currentCoin[0]] / 1000) || '').toString().length
            //     // const invPrice = invsListPercent[digitInvCount]
            //     // const buyIncrease = Math.floor((invListValue.buy * _invest[0][currentCoin[0]]) * invPrice.buy)
            //     // const sellDecrease = Math.floor((invListValue.sell * _invest[0][currentCoin[0]]) * invPrice.sell)
                
            //     // _invest[0][currentCoin[0]] = Math.floor(Math.abs(_invest[0][currentCoin[0]] + buyIncrease - sellDecrease))

            //     if (randomNaikTurunInvest == 0) { //Turun
            //         const minValue = Number(minMaxValue[0])
            //         if (Number(_invest[0][currentCoin[0]]) <= minValue) { //Paksa Naik
            //             _invest[0][currentCoin[0]] = Math.floor(_invest[0][currentCoin[0]] + randomMinMax[1])
            //         } else {
            //             _invest[0][currentCoin[0]] = Math.abs(_invest[0][currentCoin[0]] - randomMinMax[0])
            //         }
            //     } else if (randomNaikTurunInvest == 1) {
            //         const maxValue = Number(minMaxValue[1])
            //         if (Number(_invest[0][currentCoin[0]]) >= maxValue) { //Paksa Turun
            //             _invest[0][currentCoin[0]] = Math.abs(_invest[0][currentCoin[0]] - randomMinMax[0])
            //         } else {
            //             _invest[0][currentCoin[0]] = Math.floor(_invest[0][currentCoin[0]] + randomMinMax[1])
            //         }
            //     }

            //     _invest[1][`re_${currentCoin[0]}0`] = _invest[1][`re_${currentCoin[0]}1`]
            //     _invest[1][`re_${currentCoin[0]}1`] = _invest[1][`re_${currentCoin[0]}2`]
            //     _invest[1][`re_${currentCoin[0]}2`] = _invest[1][`re_${currentCoin[0]}3`]
            //     _invest[1][`re_${currentCoin[0]}3`] = _invest[1][`re_${currentCoin[0]}4`]
            //     _invest[1][`re_${currentCoin[0]}4`] = _invest[1][`re_${currentCoin[0]}5`]
            //     _invest[1][`re_${currentCoin[0]}5`] = _invest[1][`re_${currentCoin[0]}6`]
            //     _invest[1][`re_${currentCoin[0]}6`] = _invest[1][`re_${currentCoin[0]}7`]
            //     _invest[1][`re_${currentCoin[0]}7`] = _invest[1][`re_${currentCoin[0]}8`]
            //     _invest[1][`re_${currentCoin[0]}8`] = _invest[1][`re_${currentCoin[0]}9`]
            //     _invest[1][`re_${currentCoin[0]}9`] = _invest[0][currentCoin[0]]
            //     _invest[2][currentCoin[0]] = { buy: 0, sell: 0 }
            // }
            // await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { $set: { invest: _invest } })

            if (cpuPercentage == '') await sleep(2000)
            _record_ram_cpu.re0 = _record_ram_cpu.re1
            _record_ram_cpu.re1 = _record_ram_cpu.re2
            _record_ram_cpu.re2 = _record_ram_cpu.re3
            _record_ram_cpu.re3 = _record_ram_cpu.re4
            _record_ram_cpu.re4 = _record_ram_cpu.re5
            _record_ram_cpu.re5 = _record_ram_cpu.re6
            _record_ram_cpu.re6 = _record_ram_cpu.re7
            _record_ram_cpu.re7 = _record_ram_cpu.re8
            _record_ram_cpu.re8 = _record_ram_cpu.re9
            //_record_ram_cpu.re9 = Number(Number(speed_c) / 60 * 100).toFixed(3)
            _record_ram_cpu.r0 = _record_ram_cpu.r1
            _record_ram_cpu.r1 = _record_ram_cpu.r2
            _record_ram_cpu.r2 = _record_ram_cpu.r3
            _record_ram_cpu.r3 = _record_ram_cpu.r4
            _record_ram_cpu.r4 = _record_ram_cpu.r5
            _record_ram_cpu.r5 = _record_ram_cpu.r6
            _record_ram_cpu.r6 = _record_ram_cpu.r7
            _record_ram_cpu.r7 = _record_ram_cpu.r8
            _record_ram_cpu.r8 = _record_ram_cpu.r9
            _record_ram_cpu.r9 = Number(Number(100 * Number(format(os.totalmem() - os.freemem()).replace(' GB', '')).toFixed(3) / Number(format(os.totalmem()).replace(' GB', '')).toFixed(3)).toFixed(3))
            _record_ram_cpu.c0 = _record_ram_cpu.c1
            _record_ram_cpu.c1 = _record_ram_cpu.c2
            _record_ram_cpu.c2 = _record_ram_cpu.c3
            _record_ram_cpu.c3 = _record_ram_cpu.c4
            _record_ram_cpu.c4 = _record_ram_cpu.c5
            _record_ram_cpu.c5 = _record_ram_cpu.c6
            _record_ram_cpu.c6 = _record_ram_cpu.c7
            _record_ram_cpu.c7 = _record_ram_cpu.c8
            _record_ram_cpu.c8 = _record_ram_cpu.c9
            _record_ram_cpu.c9 = cpuPercentage
            await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { $set: { record: _record_ram_cpu } })
            console.log('Writing Ram/Cpu Record')
        
            // const re0_diamond = _invest[1].re_diamond0
            // const re1_diamond = _invest[1].re_diamond1
            // const re2_diamond = _invest[1].re_diamond2
            // const re3_diamond = _invest[1].re_diamond3
            // const re4_diamond = _invest[1].re_diamond4
            // const re5_diamond = _invest[1].re_diamond5
            // const re6_diamond = _invest[1].re_diamond6
            // const re7_diamond = _invest[1].re_diamond7
            // const re8_diamond = _invest[1].re_diamond8
            // const re9_diamond = _invest[1].re_diamond9
            // const re0_gold = _invest[1].re_gold0
            // const re1_gold = _invest[1].re_gold1
            // const re2_gold = _invest[1].re_gold2
            // const re3_gold = _invest[1].re_gold3
            // const re4_gold = _invest[1].re_gold4
            // const re5_gold = _invest[1].re_gold5
            // const re6_gold = _invest[1].re_gold6
            // const re7_gold = _invest[1].re_gold7
            // const re8_gold = _invest[1].re_gold8
            // const re9_gold = _invest[1].re_gold9
            // const re0_iron = _invest[1].re_iron0
            // const re1_iron = _invest[1].re_iron1
            // const re2_iron = _invest[1].re_iron2
            // const re3_iron = _invest[1].re_iron3
            // const re4_iron = _invest[1].re_iron4
            // const re5_iron = _invest[1].re_iron5
            // const re6_iron = _invest[1].re_iron6
            // const re7_iron = _invest[1].re_iron7
            // const re8_iron = _invest[1].re_iron8
            // const re9_iron = _invest[1].re_iron9
        
        
            // const timeFilter_a2 = moment().format('mm')
            // const timeFilter_b2 = moment().format('HH')
            // if (timeFilter_a2.trim()[0] <= 0) {
            //     var timeFilter_labels_0 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 10) - 40
            //     var timeFilter_labels_1 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 9) - 40
            //     var timeFilter_labels_2 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 8) - 40
            //     var timeFilter_labels_3 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 7) - 40
            //     var timeFilter_labels_4 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 6) - 40
            //     var timeFilter_labels_5 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 5) - 40
            //     var timeFilter_labels_6 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 4) - 40
            //     var timeFilter_labels_7 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 3) - 40
            //     var timeFilter_labels_8 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 2) - 40
            //     var timeFilter_labels_9 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 1) - 40
            // } else {
            //     var timeFilter_labels_0 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 10)
            //     var timeFilter_labels_1 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 9)
            //     var timeFilter_labels_2 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 8)
            //     var timeFilter_labels_3 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 7)
            //     var timeFilter_labels_4 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 6)
            //     var timeFilter_labels_5 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 5)
            //     var timeFilter_labels_6 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 4)
            //     var timeFilter_labels_7 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 3)
            //     var timeFilter_labels_8 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 2)
            //     var timeFilter_labels_9 = Math.floor(`${timeFilter_b2}${timeFilter_a2}` - 1)
            // };
        
            // (async () => {
            //     const configuration = {
            //         type: 'line',
            //         data: {
            //             labels: [numberWithCommas2(timeFilter_labels_0), numberWithCommas2(timeFilter_labels_1), numberWithCommas2(timeFilter_labels_2), numberWithCommas2(timeFilter_labels_3), numberWithCommas2(timeFilter_labels_4), numberWithCommas2(timeFilter_labels_5), numberWithCommas2(timeFilter_labels_6), numberWithCommas2(timeFilter_labels_7), numberWithCommas2(timeFilter_labels_8), numberWithCommas2(timeFilter_labels_9)],
            //             datasets: [{
            //                     label: 'Iron',
            //                     //backgroundColor: 'rgba(255,0,0,0.2)',
            //                     backgroundColor: 'rgb(133,255,0)',
            //                     borderColor: 'rgba(133,255,0,2)',
            //                     data: [re0_iron, re1_iron, re2_iron, re3_iron, re4_iron, re5_iron, re6_iron, re7_iron, re8_iron, re9_iron]
            //                 },
            //                 {
            //                     label: 'Gold',
            //                     //backgroundColor: 'rgba(255,0,0,0.2)',
            //                     backgroundColor: 'rgb(241,202,29)',
            //                     borderColor: 'rgba(241,202,29,2)',
            //                     data: [re0_gold, re1_gold, re2_gold, re3_gold, re4_gold, re5_gold, re6_gold, re7_gold, re8_gold, re9_gold]
            //                 },
            //                 {
            //                     label: 'Diamond',
            //                     //backgroundColor: 'rgba(255,0,0,0.2)',
            //                     backgroundColor: 'rgb(154, 197, 219)',
            //                     borderColor: 'rgba(154, 197, 219, 2)',
            //                     data: [re0_diamond, re1_diamond, re2_diamond, re3_diamond, re4_diamond, re5_diamond, re6_diamond, re7_diamond, re8_diamond, re9_diamond]
            //                 },
            //             ]
            //         },
            //         options: {
            //             plugins: {
            //                 legend: {
            //                     position: 'top',
            //                 },
            //                 title: {
            //                     display: true,
            //                     text: 'Market'
            //                 }
            //             },
            //             scales: {
            //                 y: {
            //                     display: true,
            //                     beginAtZero: true,
            //                     min: 0,
            //                     max: 400000,
            //                     //stepsize: 20000
            //                 }
            //             }
            //         },
            //         plugins: [{
            //             id: 'background-colour',
            //             beforeDraw: (chart) => {
            //                 const width = 1920; //px
            //                 const height = 1080; //px
            //                 const ctx = chart.ctx;
            //                 ctx.save();
            //                 ctx.fillStyle = '#1F2633';
            //                 ctx.fillRect(0, 0, width, height);
            //                 ctx.restore();
            //             }
            //         }]
            //     };
        
            //     const imageBuffer1 = await canvasRenderService1.renderToBuffer(configuration);
        
            //     // Write image to file
            //     await fs.writeFileSync('./lib/cache/chart/invest.png', imageBuffer1);
            // })();
            
            // const _rumahRegenEnergy = {
            //     "16": 5,
            //     "28": 15,
            //     "36": 25,
            //     "49": 35,
            //     "52": 45,
            //     "63": 55,
            //     "75": 65,
            //     "86": 75,
            //     "99": 85,
            //     "01": 95,
            //     "69": 110,
            //     "77": 130,
            //     "757": 150,
            //     "879": 195
            // }
            // // DB 1
            // try {
            //     let _userDbAll = await _mongo_UserSchema.find({}, { _id: 1, rl: 1 });
            
            //     let formattedUpdateUser = [];
            
            //     _userDbAll.forEach(user => {
            //         const { _id, rl: { food, stamina, rumah } } = user;
                    
            //         // Food logic
            //         if (food >= 0) {
            //             formattedUpdateUser.push({
            //                 updateOne: {
            //                     filter: { _id },
            //                     update: { $inc: { "rl.food": -1 } }
            //                 }
            //             });
            //         }
            
            //         // Stamina logic
            //         if (stamina <= 200) {
            //             let staminaRegen = 3;
            //             if (rumah) {
            //                 if (rumah.listrikstatus === 'mati') {
            //                     staminaRegen = 3;
            //                 } else if (rumah.crid) {
            //                     staminaRegen = _rumahRegenEnergy[rumah.crid] || 3;
            //                 }
            //             }
            
            //             const newStamina = Math.min(stamina + staminaRegen, 200);
            //             formattedUpdateUser.push({
            //                 updateOne: {
            //                     filter: { _id },
            //                     update: { $set: { "rl.stamina": newStamina } }
            //                 }
            //             });
            //         }
            //     });
            
            //     // Perform bulk updates in one go
            //     if (formattedUpdateUser.length > 0) {
            //         await _mongo_UserSchema.bulkWrite(formattedUpdateUser);
            //     }
            
            //     // Handle `rl.pd` updates in a single batch operation
            //     await Promise.all([
            //         _mongo_UserSchema.updateMany({ 'rl.pd.food': -1, 'rl.pd.mal_id': { $exists: false } }, { 'rl.pd': {} }),
            //         _mongo_UserSchema.updateMany({ 'rl.pd.img': { $exists: true }, 'rl.pd.mal_id': { $exists: false } }, { 'rl.pd': {} })
            //     ]);
            
            //     formattedUpdateUser = undefined
            //     _userDbAll = undefined
            // } catch (err) {
            //     console.error(err);
            // }

            // // DB 2
            // try {
            //     const _userDbAll = await _mongo_UserAccountSchema.find({}, { _id: 1, rl: 1 })
            //     let formattedUpdateUser = []
            //     for (let ia = 0; ia < _userDbAll.length; ia++) {
            //         const _makan = _userDbAll[ia].rl.food
            //         const _stamina = _userDbAll[ia].rl.stamina
            //         if (_makan >= 0) {
            //             // await _mongo_UserAccountSchema.updateOne({ _id: _userDbAll[ia]._id }, { $inc: { "rl.food": -1 } })
            //             formattedUpdateUser.push({
            //                 updateOne: {
            //                     filter: { _id: _userDbAll[ia]._id },
            //                     update: { $inc: { "rl.food": -1 } }
            //                 }
            //             })
            //         }
            //         if (_stamina <= 200) {
            //             if (_userDbAll[ia].rl.rumah != undefined) {
            //                 let position = await _userDbAll[ia].rl.rumah
            //                 if (position.listrikstatus == 'mati') {
            //                     var staminaRegen = 3
            //                 } else if (position.crid != undefined) {
            //                     var staminaRegen = _rumahRegenEnergy[position.crid]
            //                 } else {
            //                     var staminaRegen = 3
            //                 }
        
            //                 const calculateValueInput = Math.floor(_stamina + staminaRegen)
            //                 if (calculateValueInput <= 200) {
            //                     await formattedUpdateUser.push({
            //                         updateOne: {
            //                             filter: { _id: _userDbAll[ia]._id },
            //                             update: { $set: { "rl.stamina": calculateValueInput } }
            //                         }
            //                     })
            //                 } else {
            //                     await formattedUpdateUser.push({
            //                         updateOne: {
            //                             filter: { _id: _userDbAll[ia]._id },
            //                             update: { $set: { "rl.stamina": 200 } }
            //                         }
            //                     })
            //                 }
            //             } else {
            //                 const calculateValueInput2 = Math.floor(_stamina + 3)
            //                 if (calculateValueInput2 <= 200) {
            //                     await formattedUpdateUser.push({
            //                         updateOne: {
            //                             filter: { _id: _userDbAll[ia]._id },
            //                             update: { $set: { "rl.stamina": calculateValueInput2 } }
            //                         }
            //                     })
            //                 } else {
            //                     await formattedUpdateUser.push({
            //                         updateOne: {
            //                             filter: { _id: _userDbAll[ia]._id },
            //                             update: { $set: { "rl.stamina": 200 } }
            //                         }
            //                     })
            //                 }
            //             }
            //         }
            //     }

            //     if (formattedUpdateUser.length > 0) {
            //         await _mongo_UserAccountSchema.bulkWrite(formattedUpdateUser)
            //     }
            //     await _mongo_UserAccountSchema.updateMany({ 'rl.pd.food': -1, 'rl.pd.mal_id': { $exists: false } }, {'rl.pd': {}})
            // } catch (err) {
            //     console.error(err)
            // }
            // await _mongo_UserSchema.updateMany({ 'rl.pd.food': -1, 'rl.pd.mal_id': { $exists: false } }, {'rl.pd': {}})
            // await _mongo_UserSchema.updateMany({ 'rl.pd.img': { $exists: true }, 'rl.pd.mal_id': { $exists: false } }, {'rl.pd': {}})
        } catch (err) {
            console.error(err)
        }
        // await checkNolHubunganPasangan()
    })

    cron.schedule("*/3 * * * *", async () => {
        // DB 1
        // try {
        //     let _pasangan = await _mongo_UserSchema.find({ "rl.pd.mal_id": { $exists: true } }, { _id: 1, rl: 1 });
            
        //     let formattedUpdateUser = [];
            
        //     _pasangan.forEach(user => {
        //         const { _id, rl: { pd } } = user;
                
        //         if (!pd || pd.food === undefined || pd.nama === undefined) return; // Skip if food or nama is undefined
        
        //         const food = Math.floor(pd.food);
        //         const uang = Math.floor(pd.uang);
        //         if((typeof pd.uang !== 'number') || (typeof pd.food !== 'number')) return;
        
        //         // Determine update based on food and uang
        //         if (food <= 0 && uang >= 40000) {
        //             formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id },
        //                     update: { $inc: { "rl.pd.uang": -40000, "rl.pd.food": 100 } }
        //                 }
        //             });
        //         } else if (food <= 0 && uang >= 25000) {
        //             formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id },
        //                     update: { $inc: { "rl.pd.uang": -25000, "rl.pd.food": 70 } }
        //                 }
        //             });
        //         } else if (food <= 0 && uang >= 15000) {
        //             formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id },
        //                     update: { $inc: { "rl.pd.uang": -15000, "rl.pd.food": 50 } }
        //                 }
        //             });
        //         } else if (food <= 0 && uang <= 14999) {
        //             formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id },
        //                     update: { $inc: { "rl.pd.hubungan": -1 } }
        //                 }
        //             });
        //         } else if (food >= 1) {
        //             formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id },
        //                     update: { $inc: { "rl.pd.food": -1 } }
        //                 }
        //             });
        //         }
        //     });
        
        //     // Perform bulk updates at once
        //     if (formattedUpdateUser.length > 0) {
        //         await _mongo_UserSchema.bulkWrite(formattedUpdateUser);
        //     }
        
        //     console.log('Check Food Pasangan DB 1');
            
        //     formattedUpdateUser = undefined;
        //     _pasangan = undefined;
        // } catch (err) {
        //     console.error(err);
        // }

    //     // DB 2
    //     try {
    //         const _pasangan = await _mongo_UserAccountSchema.find({ "rl.pd.mal_id": { $exists: true } }, { _id: 1, rl: 1 })
    
    //         let formattedUpdateUser = []
    //         for (let ai = 0; ai < _pasangan.length; ai++) {
    //             if(_pasangan[ai]?.rl?.pd?.food == undefined || _pasangan[ai]?.rl?.pd?.nama == undefined) continue;
    //             if (Math.floor(_pasangan[ai].rl.pd.food) <= 0 && Math.floor(_pasangan[ai].rl.pd.uang) >= 40000) {
    //                 await formattedUpdateUser.push({
    //                     updateOne: {
    //                         filter: { _id: _pasangan[ai]._id },
    //                         update: { $inc: { "rl.pd.uang": -40000, "rl.pd.food": 100 } }
    //                     }
    //                 })
    //             } else if (Math.floor(_pasangan[ai].rl.pd.food) <= 0 && Math.floor(_pasangan[ai].rl.pd.uang) >= 25000) {
    //                 await formattedUpdateUser.push({
    //                     updateOne: {
    //                         filter: { _id: _pasangan[ai]._id },
    //                         update: { $inc: { "rl.pd.uang": -25000, "rl.pd.food": 70 } }
    //                     }
    //                 })
    //             } else if (Math.floor(_pasangan[ai].rl.pd.food) <= 0 && Math.floor(_pasangan[ai].rl.pd.uang) >= 15000) {
    //                 await formattedUpdateUser.push({
    //                     updateOne: {
    //                         filter: { _id: _pasangan[ai]._id },
    //                         update: { $inc: { "rl.pd.uang": -15000, "rl.pd.food": 50 } }
    //                     }
    //                 })
    //             } else if (Math.floor(_pasangan[ai].rl.pd.food) <= 0 && Math.floor(_pasangan[ai].rl.pd.uang) <= 14999) {
    //                 await formattedUpdateUser.push({
    //                     updateOne: {
    //                         filter: { _id: _pasangan[ai]._id },
    //                         update: { $inc: { "rl.pd.hubungan": -1 } }
    //                     }
    //                 })
    //             } else if(Math.floor(_pasangan[ai].rl.pd.food) >= 1) {
    //                 await formattedUpdateUser.push({
    //                     updateOne: {
    //                         filter: { _id: _pasangan[ai]._id },
    //                         update: { $inc: { "rl.pd.food": -1 } }
    //                     }
    //                 })
    //             }
    //         }
    
    //         if (formattedUpdateUser.length > 0) {
    //             await _mongo_UserAccountSchema.bulkWrite(formattedUpdateUser)
    //         }
    //         console.log('Check Food Pasangan DB 2')
    //     } catch (err) {
    //         console.error(err)
    //     }
    })

    //Morning Greetings
    cron.schedule("0 6 * * *", async function () { 
        try {
            const morningGreetings = [
                "morning guys, pagi yang cerah untuk beraktivitas hari ini!🌞🍂",
                "selamat pagi semuanya, siap untuk bersenang-senang hari ini?🌷",
                "pagi semuanya, semangat untuk hari ini jangan menyerah!🫵✊",
                "halo semuanya, pagi ini akan melakukan hal menyenangkan apa hari ini?🤔😁",
                "selamat pagi, semoga harimu menyenangkan!🌈",
                "selamat pagi! mau sarapan apa hari ini?👐",
                "pagi teman-teman, kita akan menghabiskan waktu kemana hari ini?🌤️🚗",
                "jawa jawa jawa jawa jawa jawa semangat jawa"
            ]
            
            const randomGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)]
            let morningText = `*${randomGreeting}*`

            const sideOwnerStaff = [
                '6281358181668@s.whatsapp.net',
                '6282229778223@s.whatsapp.net',
                '6288905861849@s.whatsapp.net',
                '6288991122630@s.whatsapp.net'
            ]

            const staffMembers = (await _mongo_UserSchema.find({
                $or: [
                    { isAdmin: true },
                    { "rl.isMod": true }
                ]
            }, { iId: 1 })).map(staff => staff.iId)
            
            let staffText = `${morningText}\n\n*Staff yang bertugas:*\n`
            let mentionedJids = []
            
            for(const staff of staffMembers) {
                staffText += `@${staff.replace(/@s.whatsapp.net/g, '')} `
                mentionedJids.push(staff)
            }
            
            for(const sideOwner of sideOwnerStaff) {
                staffText += `\n\n*Side Owner*\n@${sideOwner.replace(/@s.whatsapp.net/g, '')} `
                mentionedJids.push(sideOwner)
            }

            const sendGroup = ['120363370759845948@g.us']
            const sendGroup2 = ['120363417108683279@g.us']
            for(const group of sendGroup) {
                try {
                    const sendBodyPagi = { 
                        id: 'CORE',
                        key: 'OIAHOIFBAPW790709ba',
                        method: 'sendTextWithMentions',
                        content: [group, staffText]
                    };

                    console.log(await axios.post('http://localhost:7516/access', sendBodyPagi))
                    console.log(`Berhasil mengirim ucapan selamat pagi ke grup ${group}`)
                    await sleep(1000);
                } catch (err) {
                    console.error(`Gagal mengirim ucapan pagi ke grup ${group}:`, err)
                }
            }

            for(const group2 of sendGroup2) {
                try {
                    const sendBodyPagi2 = {
                        id: 'CORE',
                        key: 'OIAHOIFBAPW790709ba',
                        method: 'sendTextWithMentions',
                        content: [group2, staffText]
                    }

                    console.log(await axios.post('http://localhost:7516/access', sendBodyPagi2))
                    console.log(`Berhasil mengirim ucapan selamat pagi ke grup ${group2}`)
                    await sleep(1000);
                } catch (err) {
                    console.error(`Gagal mengirim ucapan pagi ke grup ${group2}:`, err)
                }
            }

            console.log('Morning greeting selesai dikirim ke semua grup')
        } catch (err) {
            console.log('Error saat mengirim morning greeting:', err)
            return reply('Error saat mengirim morning greeting')
        }

        try {
            console.log('sendReqToGroup_1')
            const sendBodyPresent = { 
                id: '120363370759845948@g.us', 
                key: 'OV5B1ON5O46BP23N3pa', 
                method: 'sendEventMessage', 
                content: [
                    "Absensi Hadir",
                    ((Date.now() + toMs('4h')) / 1000).toFixed(0), {
                        "degreesLatitude": 0,
                        "degreesLongitude": 0,
                        "name": "© Rem Company",
                }] }
            const portCoreBot = 7516

            try {
                console.log('sendReqToGroup', await axios.post(`http://localhost:${portCoreBot}/access/sendReqToGroup`, sendBodyPresent))
            } catch (err) {
                console.error(err)
                return reply('Error saat mengirim absensi ke core bot')
            }
        } catch (err) {
            console.error('Error saat mengirim absensi', err)
            return reply('Error saat mengirim absensi')
        }
    }, { timezone: 'Asia/Jakarta' })
    
    cron.schedule("12 * * * *", async function () {
        const checkHamilPasangan = async (db) => {
            const _pasangan = await db.find({ "rl.pd.status2": /^Hamil/ })
            for (let i = 0; i < _pasangan.length; i++) {
                if (_pasangan[i].rl.pd.status2.startsWith('Hamil')) {
                    console.log('a')
                    const berapaBulan = Number(_pasangan[i].rl.pd.status2.split('.')[1])
                    if (berapaBulan >= 9) {
                        console.log('b')
                        const randomGender0 = ["Cowo", "Cewe"]
                        const randomGender = randomGender0[Math.floor(Math.random() * randomGender0.length)]
                        await db.updateOne({ _id: _pasangan[i]._id }, { $set: { "rl.pd.status2": _pasangan[i].rl.pd.status2.replace('Hamil', 'ConfirmHamil'), "rl.pd.nkkand": [{
                            id: GenerateSerialNumber("000000000000"),
                            lahir: Date.now(),
                            gender: randomGender
                        }] } })
                    } else {
                        console.log('c')
                        await db.updateOne({ _id: _pasangan[i]._id }, { $set: { "rl.pd.status2": `Hamil.${berapaBulan + 1}` } })
                    }
                }
            }
            console.log('Success! Check Hamil Pasangan')
        }
        await checkHamilPasangan(_mongo_UserSchema)
        await checkHamilPasangan(_mongo_UserAccountSchema)
    })

    cron.schedule("*/10 * * * *", async function () {
        const _delTime = JSON.parse(fs.readFileSync('./lib/database/web/deltime.json'))
    
        const delTimeCheck = async (_dir) => {
            var checkIlangObject = _dir
            var dateNowCheckIlangObject = Date.now()
            for (let i = 0; i < checkIlangObject.length; i++) {
                if (dateNowCheckIlangObject >= checkIlangObject[i].time) {
                    console.log(`DELETE FILE: ${checkIlangObject[i].file}`)
                    try {
                        await fs.unlinkSync(checkIlangObject[i].file)
                        await checkIlangObject.splice(i, 1)
                    } catch (err) {
                        console.error(err)
                        await checkIlangObject.splice(i, 1)
                    }
                }
            }
            fs.writeFileSync('./lib/database/web/deltime.json', JSON.stringify(checkIlangObject))
        }
        await delTimeCheck(_delTime)

        checkDiskSpace('/').then(async (diskSpace) => {
            const { free, size } = diskSpace
            const freePercent = Math.floor((free / size) * 100)
            if(freePercent <= 20) {
                const specialPathFolder = ['doujin/tmp', 'kerang/cache']
                const dontDelPathFolder = ['chart', 'kerang']

                //get list folder
                const listFolder = fs.readdirSync(`${process.cwd()}/lib/cache`)
                for(let i = 0; i < listFolder.length; i++) {
                    const folderName = listFolder[i]
                    if(!dontDelPathFolder.includes(folderName)) {
                        await fs.rmSync(`${process.cwd()}/lib/cache/${folderName}`, { recursive: true })
                        await fs.mkdirSync(`${process.cwd()}/lib/cache/${folderName}`)
                    }

                    //last loop
                    if(i == listFolder.length - 1) {
                        specialPathFolder.forEach(async (path) => {
                            if(fs.existsSync(`${process.cwd()}/lib/cache/${path}`)) await fs.rmSync(`${process.cwd()}/lib/cache/${path}`, { recursive: true })
                            await fs.mkdirSync(`${process.cwd()}/lib/cache/${path}`)
                        })
                    }
                }
            }
        })

        await _mongo_CommandMessageSchema.deleteMany({})
    })

    cron.schedule("10 23 * * *", async function () {
        await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { $set: { "hits.today": 0 } })
        await _mongo_GroupSchema.updateMany({}, { $set: { "recentlyAddGroup": [] } })

        await _mongo_UserSchema.updateMany({ "limit.lgivein": { $exists: true } }, { $set: { "limit.lgivein": [] } })
        await _mongo_UserAccountSchema.updateMany({ "limit.lgivein": { $exists: true } }, { $set: { "limit.lgivein": [] } })

        await _mongo_UserSchema.updateMany({ "limit.lpaym": { $exists: true } }, { $set: { "limit.lpaym": [] } })
        await _mongo_UserAccountSchema.updateMany({ "limit.lpaym": { $exists: true } }, { $set: { "limit.lpaym": [] } })

        await _mongo_UserSchema.updateMany({ "limit.createredeem": { $gte: 1 } }, { $set: { "limit.createredeem": 0 } })
        await _mongo_UserAccountSchema.updateMany({ "limit.createredeem": { $gte: 1 } }, { $set: { "limit.createredeem": 0 } })

        await _mongo_CommandSchema.updateOne({ cId: 'zerochan' }, { $set: { "content": [] } })
        await _mongo_CommandSchema.updateOne({ cId: 'lewd' }, { $set: { "content": [] } })
    
        // var _countGroupMessage0 = JSON.parse(fs.readFileSync('./lib/database/group/count.json'))
        // for (let i = 0; i < _countGroupMessage0.length; i++) {
        //     _countGroupMessage0[i].msg0 = _countGroupMessage0[i].msg1
        //     _countGroupMessage0[i].msg1 = _countGroupMessage0[i].msg2
        //     _countGroupMessage0[i].msg2 = _countGroupMessage0[i].msg3
        //     _countGroupMessage0[i].msg3 = _countGroupMessage0[i].msg4
        //     _countGroupMessage0[i].msg4 = _countGroupMessage0[i].msg5
        //     _countGroupMessage0[i].msg5 = _countGroupMessage0[i].msg6
        //     _countGroupMessage0[i].msg6 = _countGroupMessage0[i].msg7
        //     _countGroupMessage0[i].msg7 = _countGroupMessage0[i].msg8
        //     _countGroupMessage0[i].msg8 = _countGroupMessage0[i].msg9
        //     _countGroupMessage0[i].msg9 = 0
        //     _countGroupMessage0[i].cmd0 = _countGroupMessage0[i].cmd1
        //     _countGroupMessage0[i].cmd1 = _countGroupMessage0[i].cmd2
        //     _countGroupMessage0[i].cmd2 = _countGroupMessage0[i].cmd3
        //     _countGroupMessage0[i].cmd3 = _countGroupMessage0[i].cmd4
        //     _countGroupMessage0[i].cmd4 = _countGroupMessage0[i].cmd5
        //     _countGroupMessage0[i].cmd5 = _countGroupMessage0[i].cmd6
        //     _countGroupMessage0[i].cmd6 = _countGroupMessage0[i].cmd7
        //     _countGroupMessage0[i].cmd7 = _countGroupMessage0[i].cmd8
        //     _countGroupMessage0[i].cmd8 = _countGroupMessage0[i].cmd9
        //     _countGroupMessage0[i].cmd9 = 0
        // }

        // fs.writeFileSync('./lib/database/group/count.json', JSON.stringify(_countGroupMessage0))
    
        const _rumahListrikHarga = {
            "16": 5000,
            "28": 20000,
            "36": 60000,
            "49": 150000,
            "52": 250000,
            "63": 500000,
            "75": 1000000,
            "86": 3000000,
            "99": 6000000,
            "01": 10000000,
            "69": 50000000,
            "77": 100000000,
            "757": 7000000000,
            "879": 8000000000000
        }
    
        // DB 1
        try {
            const _userDbAll = await _mongo_UserSchema.find({ "rl.rumah": { $exists: true } }, { _id: 1, "rl.rumah": 1, "economy.money": 1 })
            let formattedUpdateUser = []
            for (let ia = 0; ia < _userDbAll.length; ia++) {
                const hargaBayarListrik = _rumahListrikHarga[_userDbAll[ia].rl.rumah.crid]
                let money = _userDbAll[ia].economy.money
    
                if (money != undefined) {
                    if (money > hargaBayarListrik) {
                        console.log('Bayar listrik')
                        await formattedUpdateUser.push({
                            updateOne: {
                                filter: { _id: _userDbAll[ia]._id },
                                update: { $inc: { "economy.money": -hargaBayarListrik }, $set: { "rl.rumah.listrikstatus": 'dibayar', "rl.rumah.lastlistrikbayar": Date.now() } }
                            }
                        })
                    } else {
                        await formattedUpdateUser.push({
                            updateOne: {
                                filter: { _id: _userDbAll[ia]._id },
                                update: { $set: { "rl.rumah.listrikstatus": 'mati' } }
                            }
                        })
                    }
                } else {
                    await formattedUpdateUser.push({
                        updateOne: {
                            filter: { _id: _userDbAll[ia]._id },
                            update: { $set: { "rl.rumah.listrikstatus": 'mati' } }
                        }
                    })
                }
            }
    
            if (formattedUpdateUser.length > 0) {
                await _mongo_UserSchema.bulkWrite(formattedUpdateUser)
            }
        } catch (err) {
            console.error('Failed to update user listrik', err)
        }

        // DB 2
        // try {
        //     const _userDbAll = await _mongo_UserAccountSchema.find({ "rl.rumah": { $exists: true } }, { _id: 1, "rl.rumah": 1, "economy.money": 1 })
        //     let formattedUpdateUser = []
        //     for (let ia = 0; ia < _userDbAll.length; ia++) {
        //         const hargaBayarListrik = _rumahListrikHarga[_userDbAll[ia].rl.rumah.crid]
        //         let money = _userDbAll[ia].economy.money
    
        //         if (money != undefined) {
        //             if (money > hargaBayarListrik) {
        //                 console.log('Bayar listrik')
        //                 await formattedUpdateUser.push({
        //                     updateOne: {
        //                         filter: { _id: _userDbAll[ia]._id },
        //                         update: { $inc: { "economy.money": -hargaBayarListrik }, $set: { "rl.rumah.listrikstatus": 'dibayar', "rl.rumah.lastlistrikbayar": Date.now() } }
        //                     }
        //                 })
        //             } else {
        //                 await formattedUpdateUser.push({
        //                     updateOne: {
        //                         filter: { _id: _userDbAll[ia]._id },
        //                         update: { $set: { "rl.rumah.listrikstatus": 'mati' } }
        //                     }
        //                 })
        //             }
        //         } else {
        //             await formattedUpdateUser.push({
        //                 updateOne: {
        //                     filter: { _id: _userDbAll[ia]._id },
        //                     update: { $set: { "rl.rumah.listrikstatus": 'mati' } }
        //                 }
        //             })
        //         }
        //     }
    
        //     if (formattedUpdateUser.length > 0) {
        //         await _mongo_UserAccountSchema.bulkWrite(formattedUpdateUser)
        //     }
        // } catch (err) {
        //     console.error('Failed to update user listrik', err)
        // }

        // ping vits-model
        try {
            async function pingVits (sess, apiEndpoint) {
                return new Promise((resolve, reject) => {
                    const headersCookie = sess
                    const vAiWs = new WebSocket(`wss://mizukidesuu-${apiEndpoint}.hf.space/queue/join`, {
                        headers: {
                            ['Cookie']: headersCookie
                        }
                    })
        
                    const bodyMessageSend = randomWords(5).join()
                    const hashConn = GenerateSerialNumber("00000000000").toLowerCase()
                    const fnIndex = Number(0)
        
                    vAiWs.on('error', (err) => { console.error(err) })
                    vAiWs.on('message', (data) => {
                        const vAiMsg = JSON.parse(data)
                        console.log(vAiMsg, apiEndpoint)
                        if(vAiMsg.msg == 'send_hash') {
                            vAiWs.send(JSON.stringify({"session_hash": hashConn, "fn_index": fnIndex }))
                        }
                        if(vAiMsg.msg == 'estimation') {
                            // reply(from, `Estimasi Waktu : ${vAiMsg.avg_event_process_time.toFixed(1)} Detik`, id)
                        }
                        if(vAiMsg.msg == 'send_data') {
                            const payloadSendData = {"fn_index": fnIndex ,"data":[bodyMessageSend, "Japanese", 0.6,0.668, 1, false], "session_hash": hashConn}
                            vAiWs.send(JSON.stringify(payloadSendData))
                        }
                        if(vAiMsg.msg == 'process_starts') {
                            // reply(from, 'Proses dimulai, tunggu sebentar!', id)
                        }
                        if(vAiMsg.msg == 'process_completed') {
                            resolve(vAiWs.close())
                            // const dataOutput = vAiMsg.output.data
                            // if(dataOutput[1] == undefined) {
                            //     return reply(from, `Error!\n${dataOutput[0]}`, id)
                            // } else {
                            //     const bufferData = Buffer.from(dataOutput[1].split(';base64,')[1], 'base64')
                            //     rem.sendFile(from, bufferData, 'vai.mp3', '', messageRaw, audio, 'audio/mpeg', false, { ptt: true })
                            // }
                        }
                    })
                })
            }

            pingVits('jwt-cookie=eyJhbGciOiJFZERTQSJ9.eyJzdWIiOiJtaXp1a2lkZXN1dS92aXRzLW1vZGVscyIsImV4cCI6MTY4MTI4ODc0MiwiaXNzIjoiaHVnZ2luZ2ZhY2UtbW9vbiJ9.MzqPydx0L3sjIq8zy-zZcCG_IKhTkfoz9wZ1RiDH_IWI-75F-dpn4FYBVVgdzytVzNNvD6zyQx23A_eAqd5iBQ; Path=/; HttpOnly; Secure; SameSite=None', 'vits-models')
            pingVits('jwt-cookie=eyJhbGciOiJFZERTQSJ9.eyJzdWIiOiJtaXp1a2lkZXN1dS92aXRzLW1vZGVscy1nZW5zaGluLWJoMyIsImV4cCI6MTY4MTI4ODUzOSwiaXNzIjoiaHVnZ2luZ2ZhY2UtbW9vbiJ9.9tt-kwBxuKI2ZuxPy9_mRY5zHHtEk9bEpbzUKAfVHIxUb7PFRL1HC9Zq0T6mIflaiF5ifGHbp-qHe3-bGoZyCA; Path=/; HttpOnly; Secure; SameSite=None', 'vits-models-genshin-bh3')
            
            const imageReadBuffer = await fs.readFileSync('./media/img/bg.png')
            const clientRemoveBg = import('./lib/esm/exports.mjs')
            const resultRemoveBg = new Promise(async (resolve) => {
                clientRemoveBg.then(async (all) => resolve(await all.removeBgGradio(imageReadBuffer)))
            })
            // const resultRemoveAnimeBg = new Promise(async (resolve) => { // using public instance
            //     clientRemoveBg.then(async (all) => resolve(await all.removeAnimeBgGradio(imageReadBuffer)))
            // })
            Promise.all([resultRemoveBg]).then(async ([resultRemoveBg]) => { 
                console.log('success removebg')
            })

            // const imageReadBuffer = await fs.readFileSync('./media/img/bg.png')
            // checkImageNsfw(imageReadBuffer)
        } catch (err) {
            console.error(err)
        } 
    })
})