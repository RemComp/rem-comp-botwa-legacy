"use strict";

const fetch = require('node-fetch')
const fs = require('fs')
const axios = require('axios')
const moment = require('moment-timezone')
let { JSDOM } = require('jsdom')
const FormData = require('form-data')
const cheerio = require('cheerio')
const { SocksProxyAgent } = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');
const crypto = require('crypto')
const spawn = require('child_process').spawn
const { createSticker, StickerTypes } = require('wa-sticker-formatter')
const PhoneNumber = require('awesome-phonenumber');
const megajs = require('megajs')
const pino = require('pino')
const path = require('path')
// const { dbwsport } = require('./config')
// const WebSocket = require('ws')
//let ws = new WebSocket(`ws://localhost:${dbwsport}/db`);
const toMs = require('ms')
const Cryptr = require('cryptr')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const infinityNumber = "1.797693134862315E+307"
const minInfinityNumber = "-1.797693134862316E+307"
const canvas = require('canvacord')
const htmlToJsx = require('html-react-parser')
const http = require('http')
const https = require('https')
const _jsxRuntime = require("react/jsx-runtime");
const Big = require('big.js')

// Configure Big.js for high precision
Big.DP = 20; // decimal places
Big.RM = Big.roundHalfUp;

module.exports = (isVirtualAccount = false, senderFunction) => {
const { _mongo_GroupSchema, _mongo_UserSchema, _mongo_BotSchema, _mongo_CommandSchema, _mongo_ContactSchema, _mongo_RedeemSchema, _mongo_InvestHistorySchema } = require('./dbtype')(isVirtualAccount)


/*ws.on('open', function open() {
    console.log('Connected to Database API')
});


ws.on('close', function close() {
    console.log('Disconnected from Database API, Reconnecting...');
    tryReconnectDatabaseAPI()
    function tryReconnectDatabaseAPI () {
        try {
            ws = new WebSocket(`ws://localhost:${dbwsport}/db`);
        } catch (err) {
            console.log(err)
            tryReconnectDatabaseAPI()
        }
    }
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});


function writeToDb (filename, content) {
    const sendContent = ['write', filename, JSON.stringify(content)]
    return ws.send(sendContent)
}*/

const liriklagu = async (lagu) => {
    const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return `Lirik Lagu ${lagu}\n\n${json.result.lirik}`
    return `[ Error ] Lirik Lagu ${lagu} tidak di temukan!`
};

const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}
// /**
//  * is it url?
//  * @param  {String} url
//  */

// const quotemaker = async (quotes, author = 'EmditorBerkelas', type = 'random') => {
//     var q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
//     const response = await fetch(`https://terhambar.com/aw/qts/?kata=${q}&author=${author}&tipe=${type}`)
//     if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
//     const json = await response.json()
//     if (json.status) {
//         if (json.result !== '') {
//             const base64 = await getBase64(json.result)
//             return base64
//         }
//     }
// }

const randomNimek = async (type) => {
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await fetch(url + 'nsfwneko')
            if (!nsfw.ok) throw new Error(`unexpected response ${nsfw.statusText}`)
            const resultNsfw = await nsfw.json()
            return resultNsfw.url
            break
        case 'hentai':
            const hentai = await fetch(url + 'hentai')
            if (!hentai.ok) throw new Error(`unexpected response ${hentai.statusText}`)
            const resultHentai = await hentai.json()
            return resultHentai.url
            break
        case 'anime':
            let anime = await fetch(url + 'anime')
            if (!anime.ok) throw new Error(`unexpected response ${anime.statusText}`)
            const resultNime = await anime.json()
            return resultNime.url
            break
        case 'neko':
            let neko = await fetch(url + 'neko')
            if (!neko.ok) throw new Error(`unexpected response ${neko.statusText}`)
            const resultNeko = await neko.json()
            return resultNeko.url
            break
        case 'trap':
            let trap = await fetch(url + 'trap')
            if (!trap.ok) throw new Error(`unexpected response ${trap.statusText}`)
            const resultTrap = await trap.json()
            return resultTrap.url
            break
    }
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jadwalTv = async (query) => {
    const res = await axios.get(`https://api.haipbis.xyz/jadwaltv/${query}`)
    const ress = res.data
    if (ress.error) return ress.error
    switch(query) {
        case 'antv':
            return `\t\t[ ANTV ]\n${ress.join('\n')}`
            break
        case 'gtv':
            return `\t\t[ GTV ]\n${ress.join('\n')}`
            break
        case 'indosiar':
            return `\t\t[ INDOSIAR ]\n${ress.join('\n')}`
            break
        case 'inewstv':
            return `\t\t[ iNewsTV ]\n${ress.join('\n')}`
            break
        case 'kompastv':
            return `\t\t[ KompasTV ]\n${ress.join('\n')}`
            break
        case 'mnctv':
            return `\t\t[ MNCTV ]\n${ress.join('\n')}`
            break
        case 'metrotv':
            return `\t\t[ MetroTV ]\n${ress.join('\n')}`
            break
        case 'nettv':
            return `\t\t[ NetTV ]\n${ress.join('\n')}`
            break
        case 'rcti':
            return `\t\t[ RCTI ]\n${ress.join('\n')}`
            break
        case 'sctv':
            return `\t\t[ SCTV ]\n${ress.join('\n')}`
            break
        case 'rtv':
            return `\t\t[ RTV ]\n${ress.join('\n')}`
            break
        case 'trans7':
            return `\t\t[ Trans7 ]\n${ress.join('\n')}`
            break
        case 'transtv':
            return `\t\t[ TransTV ]\n${ress.join('\n')}`
            break
        default:
            return '[ ERROR ] Channel TV salah! silahkan cek list channel dengan mengetik perintah *!listChannel*'
            break
    }
}

const random = (subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['dankmemes', 'wholesomeanimemes', 'wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'memes', 'terriblefacebookmemes', 'teenagers', 'historymemes']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for memes on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

//FUNCTION CLIENT
        // Function NameTag
        const setNameTag = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "nametag.list": "Free" } })
        }
        
        // db nametag
        const getNameTag = (_userDb) => {
            return _userDb.nametag
        }

        // db nametag.list
        const getNameTagList = (_userDb) => {
            return _userDb.nametag.list
        }

        const replaceNameTag = async (userId, tag) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "nametag.select": tag } })
        }

        const addNameTag_tag = async (userId, name) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "nametag.list": name } })
        }

        /*const isWhite = (chatId) => adminNumber.includes(chatId) ? true : false
        const isWhiteList = (chatId) => {
            if(adminNumber.includes(sender.id)){
                if(muted.includes(chatId)) return false
                return true
            }else{
                return false
            }
        }*/
        //FUNCTION ACHIEVEMENT
        // const getAchievements = (_userDb) => {
        //     return _userDb.achievements
        // }

        //FUNCTION AFINITAS
        const getAfinitas = (_userDb) => {
            return _userDb.rl?.afinitas || {
                lover: null,
                saudara: { list: [] },
                sahabat: { list: [] },
                kepercayaan: { list: [] },
                mantanrl: [],
                requests: []
            }
        }

        const getAfinitasLover = (_userDb) => {
            return _userDb.rl?.afinitas?.lover || null
        }

        const getAfinitasSaudara = (_userDb) => {
            return _userDb.rl?.afinitas?.saudara?.list || []
        }

        const getAfinitasSahabat = (_userDb) => {
            return _userDb.rl?.afinitas?.sahabat?.list || []
        }

        const getAfinitasKepercayaan = (_userDb) => {
            return _userDb.rl?.afinitas?.kepercayaan?.list || []
        }

        const checkAfinitasLimit = (_userDb, type) => {
            if (!_userDb.rl?.afinitas) return true
            
            switch (type) {
                case 'lover':
                    return _userDb.rl.afinitas.lover === null
                case 'saudara':
                    return !_userDb.rl.afinitas.saudara?.list || _userDb.rl.afinitas.saudara.list.length < 5
                case 'sahabat':
                    return !_userDb.rl.afinitas.sahabat?.list || _userDb.rl.afinitas.sahabat.list.length < 5
                case 'kepercayaan':
                    return !_userDb.rl.afinitas.kepercayaan?.list || _userDb.rl.afinitas.kepercayaan.list.length < 5
                default:
                    return false
            }
        }

        const sendAfinitasRequest = async (userId, targetId, type) => {
            const requestId = GenerateSerialNumber("00000")
            const requestObj = {
                id: requestId, 
                from: userId, 
                type: type, 
                status: 'pending', 
                timestamp: Date.now(),
                expired: Date.now() + toMs('5m') // exp in 5 minutes
            }
            
            //add req to target req
            await _mongo_UserSchema.updateOne(
                { iId: targetId }, 
                { $push: { "rl.afinitas.requests": requestObj } }
            )
            
            return requestId
        }

        const getAfinitasRequests = (_userDb) => {
            return _userDb.rl?.afinitas?.requests || []
        }

        const acceptAfinitas = async (userId, requestId) => {
            //find req
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            if (!_userDb || !_userDb.rl?.afinitas?.requests) return { success: false, message: 'Request tidak ditemukan' }
            
            const requestIndex = _userDb.rl.afinitas.requests.findIndex(req => req.id === requestId)
            if (requestIndex === -1) return { success: false, message: 'Request tidak ditemukan' }
            
            const request = _userDb.rl.afinitas.requests[requestIndex]
            if (request.status !== 'pending') return { success: false, message: 'Request sudah ditanggapi sebelumnya' }
            if (request.expired < Date.now()) return { success: false, message: 'Request telah kadaluarsa' }
            
            //update set req
            await _mongo_UserSchema.updateOne(
                { iId: userId, "rl.afinitas.requests.id": requestId },
                { $set: { "rl.afinitas.requests.$.status": 'accepted' } }
            )
            
            //add connection
            switch (request.type) {
                case 'lover':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $set: { "rl.afinitas.lover": request.from } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: request.from },
                        { $set: { "rl.afinitas.lover": userId } }
                    )
                    break
                case 'saudara':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $push: { "rl.afinitas.saudara.list": request.from } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: request.from },
                        { $push: { "rl.afinitas.saudara.list": userId } }
                    )
                    break
                case 'sahabat':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $push: { "rl.afinitas.sahabat.list": request.from } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: request.from },
                        { $push: { "rl.afinitas.sahabat.list": userId } }
                    )
                    break
                case 'kepercayaan':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $push: { "rl.afinitas.kepercayaan.list": request.from } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: request.from },
                        { $push: { "rl.afinitas.kepercayaan.list": userId } }
                    )
                    break
            }
            return { success: true, message: 'Permintaan afinitas telah diterima', type: request.type, from: request.from }
        }

        const rejectAfinitas = async (userId, requestId) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            if (!_userDb || !_userDb.rl?.afinitas?.requests) return { success: false, message: 'Request tidak ditemukan' }
            
            const requestIndex = _userDb.rl.afinitas.requests.findIndex(req => req.id === requestId)
            if (requestIndex === -1) return { success: false, message: 'Request tidak ditemukan' }
            
            const request = _userDb.rl.afinitas.requests[requestIndex]
            if (request.status !== 'pending') return { success: false, message: 'Request sudah ditanggapi sebelumnya' }
            if (request.expired < Date.now()) return { success: false, message: 'Request telah kadaluarsa' }
            
            //update req status
            await _mongo_UserSchema.updateOne(
                { iId: userId, "rl.afinitas.requests.id": requestId },
                { $set: { "rl.afinitas.requests.$.status": 'rejected' } }
            )
            
            return { success: true, message: 'Permintaan afinitas telah ditolak', type: request.type, from: request.from }
        }

        const removeAfinitas = async (userId, targetId, type) => {
            switch (type) {
                case 'lover':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $set: { "rl.afinitas.lover": null } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: targetId },
                        { $set: { "rl.afinitas.lover": null } }
                    )
                    break
                case 'saudara':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $pull: { "rl.afinitas.saudara.list": targetId } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: targetId },
                        { $pull: { "rl.afinitas.saudara.list": userId } }
                    )
                    break
                case 'sahabat':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $pull: { "rl.afinitas.sahabat.list": targetId } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: targetId },
                        { $pull: { "rl.afinitas.sahabat.list": userId } }
                    )
                    break
                case 'kepercayaan':
                    await _mongo_UserSchema.updateOne(
                        { iId: userId },
                        { $pull: { "rl.afinitas.kepercayaan.list": targetId } }
                    )
                    await _mongo_UserSchema.updateOne(
                        { iId: targetId },
                        { $pull: { "rl.afinitas.kepercayaan.list": userId } }
                    )
                    break
            }
            return { success: true, message: `Afinitas ${type} telah dihapus` }
        }

        //mantan rl
            const setUserMantanPasrl = async (userId, targetId) => {
                await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.afinitas.mantanrl": [targetId] } })
            }

            const getUserMantanPasrl = (_userDb) => {
                let _mantanrl = _userDb.rl.pasanganrl.mantanrl
                if (JSON.stringify(_mantanrl) != '[]') {
                    return _mantanrl
                }
            }

            const addUserMantanPasrl = async (userId, targetId) => {
                await _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "rl.afinitas.mantanrl": targetId } })
            }
    

        //FUNCTION PASANGAN REAL LIFE
        const getUser_pasanganrl = (_userDb) => {
            return _userDb.rl?.pasanganrl || null
        }

        const getPartner_pasanganrl_Money = async (_mentionUserDb) => {
            return _mentionUserDb.economy.money || 0
        }

        const getUser_pasanganrl_Img = (_userDb) => {
            return _userDb.rl?.pasanganrl?.img || './media/img/images_pp_blank.png'
        }

        //cowo
        const setUser_pasanganrl = async (_userId, gender, imgUrl) => {
            let objPasrl = {
                nama: getNama(partnerUserDb) || pushname,   
                gender: gender,
                umurpasangan: Date.now(),
                img: imgUrl || './media/img/images_pp_blank.png',
                level: 1,
                xp: 0,
                hubungan: 50,
                uang: 0,
                status: 'Pacaran',
                status2: 'none',
                anak: getPartnerAnak(_userDb) || []
            }
            await _mongo_UserSchema.updateOne({ iId: _userId }, { $set: { "rl.pasanganrl": objPasrl } })
        }

        //cewe
        const setPartner_pasanganrl = async (_userId, gender, imgUrl) => {
            let objPartnerPasrl = {
                nama: getNama(partnerUserDb) || pushname,
                gender: gender,
                umurpasangan: Date.now(),
                img: imgUrl || './media/img/images_pp_blank.png',
                level: 1,
                xp: 0,
                hubungan: 50,
                uang: 0,
                status: 'Pacaran',
                status2: 'none',
                anak: []
            }
            await _mongo_UserSchema.updateOne({ iId: _userId }, { $set: { "rl.pasanganrl": objPartnerPasrl } })
        }

        const addUser_pasanganrl_Xp = async (userId, amount) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "rl.pasanganrl.xp": amount } })
        }

        const addUser_pasanganrl_Level = async (userId, amount) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "rl.pasanganrl.level": amount } })
        }

        const replaceUser_pasanganrl_umur = async (userId, text) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.umurpasangan": text } })
        }

        const replaceUser_pasanganrl_img = async (userId, imgUrl) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.img": imgUrl } })
        }

        const replaceUser_pasanganrl_putus = async (userId, _mentionUserDb) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl": {} } })
            await _mongo_UserSchema.updateOne({ iId: _mentionUserDb.iId }, { $set: { "rl.pasanganrl": {} } })
        }

        const replaceUser_pasanganrl_status = async (userId, text) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.status": text } })
        }

        const replaceUser_pasanganrl_status2 = async (userId, text) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.status2": text } })
        }

        const replaceUser_pasanganrl_hubungan = async (userId, CalculateAmount) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.hubungan": CalculateAmount } })
            const _pasanganrl = await _mongo_UserSchema.findOne({ iId: userId })
            let pasrl = _pasanganrl.rl.pasanganrl
            if (JSON.stringify(pasrl) != '{}') {
                
                if(pasrl.status == 'Pacaran') {
                    if(CalculateAmount >= 100) {
                        var inputDataPasrlValue = 100
                    } else {
                        var inputDataPasrlValue = CalculateAmount
                    }
                } else if(pasrl.status == 'Menikah') {
                    if(CalculateAmount >= 500) {
                        var inputDataPasrlValue = 500
                    } else {
                        var inputDataPasrlValue = CalculateAmount
                    }
                } else if(pasrl.status == 'Berkeluarga') {
                    if(CalculateAmount >= 1000) {
                        var inputDataPasrlValue = 1000
                    } else {
                        var inputDataPasrlValue = CalculateAmount
                    }
                } else {
                    if(CalculateAmount >= 100) {
                        var inputDataPasrlValue = 100
                    }
                }
                await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pasanganrl.hubungan": inputDataPasrlValue } })
            }
        }



        //FUNCTION POINT EVENET EASTER
        const addPoint = async (userId, amount, _userDb = undefined) => {
            const pointDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = pointDb.economy.point += amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber += amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber += amount)

            !isFinite(pointDb.economy.point - amount) || isNaN(pointDb.economy.point - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.point": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.point": amount } })
        }

        const MinPoint = async (userId, amount, _userDb = undefined) => {
            const pointDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = pointDb.economy.point -= amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber -= amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber -= amount)
            return !isFinite(pointDb.economy.point - amount) || isNaN(pointDb.economy.point - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.point": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.point": -amount } })
        }

        const getPoint = (_userDb) => {
            return _userDb.economy.point
        }

        const setPoint = async (userId) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.point": 0 } })
        }
        
        // FUNCTION EVENT CHRISTMAS
        // FUNCTION TOKEN
        const addToken = async (userId, amount, _userDb = undefined) => {
            const tokenDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = tokenDb.economy.evntChristmas.token += amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber += amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber += amount)
            !isFinite(tokenDb.economy.evntChristmas.token - amount) || isNaN(tokenDb.economy.evntChristmas.token - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.token": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.token": amount } })
        }

        const MinToken = async (userId, amount, _userDb = undefined) => {
            const tokenDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = tokenDb.economy.evntChristmas.token -= amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber -= amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber -= amount)
            return !isFinite(tokenDb.economy.evntChristmas.token - amount) || isNaN(tokenDb.economy.evntChristmas.token - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.token": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.token": -amount } })
        }

        const getToken = (_userDb) => {
            return _userDb?.economy?.evntChristmas?.token || 0
        }

        const setToken = async (userId) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.token": 0 } })
        }

        // FUNCTION FRAG CHRISTMAS

        const addFrag = async (userId, amount, _userDb = undefined) => {
            const fragDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = fragDb.economy.evntChristmas.frag += amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber += amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber += amount)
            !isFinite(fragDb.economy.evntChristmas.frag - amount) || isNaN(fragDb.economy.evntChristmas.frag - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.frag": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.frag": amount } })
        }

        const MinFrag = async (userId, amount, _userDb = undefined) => {
            const fragDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = fragDb.economy.evntChristmas.frag -= amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber -= amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber -= amount)
            return !isFinite(fragDb.economy.evntChristmas.frag - amount) || isNaN(fragDb.economy.evntChristmas.frag - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.frag": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.frag": -amount } })
        }

        const getFrag = (_userDb) => {
            return _userDb?.economy?.evntChristmas?.frag || 0
        }

        const setFrag = async (userId) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.frag": 0 } })
        }

        // FUNCTION SPENT TOKEN CHRISTMAS

        const addSpentToken = async (userId, amount, _userDb = undefined) => {
            const stDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = stDb.economy.evntChristmas.frag += amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber += amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber += amount)
            !isFinite(stDb.economy.evntChristmas.spentToken - amount) || isNaN(stDb.economy.evntChristmas.spentToken - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.spentToken": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.spentToken": amount } })
        }

        const MinSpentToken = async (userId, amount, _userDb = undefined) => {
            const stDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = stDb.economy.evntChristmas.frag -= amount
            if(isNaN(check)) check = 0
            if(!isFinite(check) && check >= 0) check = (infinityNumber -= amount)
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber -= amount)
            return !isFinite(stDb.economy.evntChristmas.spentToken - amount) || isNaN(stDb.economy.evntChristmas.spentToken - amount) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.spentToken": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.evntChristmas.spentToken": -amount } })
        }

        const getSpentToken = (_userDb) => {
            return _userDb?.economy?.evntChristmas?.spentToken || 0
        }

        const setSpentToken = async (userId) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.spentToken": 0 } })
        }

        // CHRISTMAS EVENT HELPERS

        const getChristmasLeaderboard = async (limit = 10) => {
            const config = require('../config')
            const ownerIds = [config.ownerNumber2, config.sideOwnerNumber]
            
            const leaderboard = await _mongo_UserSchema.find(
                { 
                    "economy.evntChristmas.spentToken": { $gt: 0 },
                    "iId": { $nin: ownerIds }
                },
                { iId: 1, "economy.evntChristmas.spentToken": 1 }
            ).sort({ "economy.evntChristmas.spentToken": -1 }).limit(limit)
            return leaderboard
        }

        const getChristmasShopInventory = async () => {
            const botDb = await _mongo_BotSchema.findOne({ iId: 'default' })
            const now = Date.now()
            const dayResetTime = now - (now % 86400000)
            
            if (!botDb?.christmasShop) {
                const defaultShop = {
                    lastReset: dayResetTime,
                    items: {
                        token_10: { name: 'Token x10', qty: 999, price: 25000 },
                        token_50: { name: 'Token x50', qty: 999, price: 25000 },
                        frag_10: { name: 'Fragment x10', qty: 999, price: 25000 },
                        limit_200: { name: 'Limit x200', qty: 999, price: 80 },
                        xp_5000: { name: 'XP x5000', qty: 999, price: 25000 },
                    }
                }
                await _mongo_BotSchema.updateOne({ iId: 'default' }, { $set: { christmasShop: defaultShop } }, { upsert: true })
                return defaultShop
            }
            
            // reset upto 24h
            const shopLastReset = botDb.christmasShop.lastReset || dayResetTime
            if (now - shopLastReset >= 86400000) {
                const resetShop = {
                    lastReset: dayResetTime,
                    items: {
                        token_10: { name: 'Token x10', qty: 999, price: 50000 },
                        token_50: { name: 'Token x50', qty: 999, price: 50000 },
                        frag_10: { name: 'Fragment x10', qty: 999, price: 50000 },
                        limit_200: { name: 'Limit x200', qty: 999, price: 80 },
                        xp_5000: { name: 'XP x5000', qty: 999, price: 50000 },
                    }
                }
                await _mongo_BotSchema.updateOne({ iId: 'default' }, { $set: { christmasShop: resetShop } })
                return resetShop
            }
            return botDb.christmasShop
        }

        const buyChristmasShopItem = async (itemId, quantity = 1) => {
            const shop = await getChristmasShopInventory()
            if (!shop.items[itemId]) return { success: false, message: 'Item tidak ditemukan' }
            if (shop.items[itemId].qty < quantity) return { success: false, message: 'Stok tidak cukup' }
            
            const totalPrice = shop.items[itemId].price * quantity
            shop.items[itemId].qty -= quantity
            
            await _mongo_BotSchema.updateOne({ iId: 'default' }, { $set: { christmasShop: shop } })
            return { success: true, message: 'Pembelian berhasil', totalPrice, item: shop.items[itemId], quantity }
        }

        const generateChristmasReward = (boxType) => {
            const rand = Math.random() * 100
            let token, frag, money, xp, limit
            
            if(boxType === 'premium' || boxType === 'remcomp') {
                // Premium/RemComp Box - Best Rewards
                if(rand < 1) {
                    // Ultra Rare - 1%
                    token = Math.floor(Math.random() * 1500) + 2500
                    frag = Math.floor(Math.random() * 50) + 100
                    money = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                    xp = Math.floor(Math.random() * 10000) + 20000 
                    limit = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                } else if(rand < 8) {
                    // Very Rare - 7%
                    token = Math.floor(Math.random() * 1000) + 1500
                    frag = Math.floor(Math.random() * 40) + 80
                    money = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                    xp = Math.floor(Math.random() * 10000) + 15000
                    limit = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                } else if(rand < 25) {
                    // Rare - 17%
                    token = Math.floor(Math.random() * 1000) + 1200
                    frag = Math.floor(Math.random() * 30) + 70
                    money = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                    xp = Math.floor(Math.random() * 10000) + 15000
                    limit = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                } else {
                    // Common - 75%
                    token = Math.floor(Math.random() * 500) + 1000
                    frag = Math.floor(Math.random() * 20) + 60
                    money = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                    xp = Math.floor(Math.random() * 10000) + 15000
                    limit = Math.floor(Math.random() * 100000000000000000000000000000000) + 100000000000000000000000000000000000000
                }
            } else if(boxType === 'standard' || boxType === 'golden') {
                // Standard/Golden Box - Medium Rewards
                if(rand < 3) {
                    // Very Rare - 3%
                    token = Math.floor(Math.random() * 500) + 900
                    frag = Math.floor(Math.random() * 18) + 50
                    money = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                    xp = Math.floor(Math.random() * 5000) + 10000
                    limit = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                } else if(rand < 15) {
                    // Rare - 12%
                    token = Math.floor(Math.random() * 500) + 800
                    frag = Math.floor(Math.random() * 16) + 40
                    money = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                    xp = Math.floor(Math.random() * 5000) + 10000
                    limit = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                } else if(rand < 50) {
                    // Uncommon - 35%
                    token = Math.floor(Math.random() * 200) + 500
                    frag = Math.floor(Math.random() * 14) + 30
                    money = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                    xp = Math.floor(Math.random() * 5000) + 10000
                    limit = Math.floor(Math.random() * 1000000000000000000000000) + 100000000000000000000000000000000
                } else {
                    // Common - 50%
                    token = 0
                    frag = 0
                    money = Math.floor(Math.random() * 100000000000000) + 1000000000000000000000000
                    xp = Math.floor(Math.random() * 5000) + 10000
                    limit = Math.floor(Math.random() * 100000000000000) + 1000000000000000000000000
                }
            } else if(boxType === 'lucky' || boxType === 'silver') {
                // Lucky/Silver Box - Low Cost, Mixed Rewards
                if(rand < 5) {
                    // Rare - 5%
                    token = Math.floor(Math.random() * 200) + 500
                    frag = Math.floor(Math.random() * 12) + 20
                    money = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                    xp = Math.floor(Math.random() * 1000) + 5000
                    limit = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                } else if(rand < 25) {
                    // Uncommon - 20%
                    token = Math.floor(Math.random() * 200) + 300
                    frag = Math.floor(Math.random() * 10) + 18
                    money = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                    xp = Math.floor(Math.random() * 1000) + 5000
                    limit = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                } else {
                    // Common - 75%
                    token = 0
                    frag = 0
                    money = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                    xp = Math.floor(Math.random() * 1000) + 5000
                    limit = Math.floor(Math.random() * 100000000000000) + 100000000000000000
                }
            }
            
            return { token, frag, money, xp, limit }
        }

        const addChristmasSpentToken = async (userId, amount) => {
            const userDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = (userDb?.economy?.evntChristmas?.spentToken || 0) + amount
            if(isNaN(check)) check = amount
            if(!isFinite(check) && check >= 0) check = (infinityNumber + amount)
            if(!isFinite(check) && check <= 0) check = amount
            
            if(!userDb?.economy?.evntChristmas) {
                await _mongo_UserSchema.updateOne(
                    { iId: userId },
                    { $set: { "economy.evntChristmas": { token: 0, frag: 0, spentToken: amount } } }
                )
            } else {
                await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.evntChristmas.spentToken": check } })
            }
        }

        //FUNCTION MONEY
        const setMoney = async (userId) => {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.money": 2000 } })
        }

        const getMoney = (_userDb) => {
            const _money = _userDb.economy.money
            let check = _money
            if(isNaN(check)) check = 2000
            if(!isFinite(check) && check >= 0) check = infinityNumber
            if(!isFinite(check) && check <= 0) check = minInfinityNumber

            if(isNaN(_money) || !isFinite(_money)) {
                async function changeValue() {
                    await _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: { "economy.money": check } })
                }
                changeValue()
            }
            return check
        }


        // const getMoneyPosition = (userId) => {
        //     let position = global.db['./lib/database/user/money.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return position
        //     }
        // }

        const MinMoney = async (userId, amount, _userDb = undefined) => {
            const moneyDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = moneyDb.economy.money - Number(amount)
            if(isNaN(check)) check = 2000
            if(!isFinite(check) && check >= 0) check = infinityNumber - Number(amount)
            if(!isFinite(check) && check <= 0) check = minInfinityNumber - Number(amount)

            // await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.money": -amount } })
            return !isFinite(moneyDb.economy.money - Number(amount)) || isNaN(moneyDb.economy.money - Number(amount)) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.money": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.money": -Number(amount) } })
        }

        const addMoney = async (userId, amount, _userDb = undefined) => {
            const moneyDb = !_userDb ? await _mongo_UserSchema.findOne({ iId: userId }) : _userDb
            let check = moneyDb.economy.money += Number(amount)
            if(isNaN(check)) check = 2000
            if(!isFinite(check) && check >= 0) check = (infinityNumber + Number(amount))
            if(!isFinite(check) && check <= 0) check = (minInfinityNumber + Number(amount))

            !isFinite(moneyDb.economy.money - Number(amount)) || isNaN(moneyDb.economy.money - Number(amount)) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.money": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.money": Number(amount) } })
        }

        //MONEY HARAM
        const setMoney_haram = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.moneyharam": 0 } })
        }

        const getMoney_haram = (_userDb) => {
            return _userDb.economy.moneyharam
        }

        const MinMoney_haram = async (userId, amount) => {
            const moneyDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = moneyDb.economy.moneyharam -= amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = minInfinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.moneyharam": check } })
        }

        const addMoney_haram = async (userId, amount) => {
            const moneyDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = moneyDb.economy.moneyharam += amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = infinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.moneyharam": check } })
        }

        //Give Money Limit
        const setMoneyLimitGive = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "limit.lpaym": [] } })
        }
        
        const getMoneyLimitGive = (_userDb, to) => {
            const _limitGiveMoney = _userDb.limit.lpaym
            if (JSON.stringify(_limitGiveMoney) != '[]') {
                let _limitGiveIsAda = 'false'
                for (let a = 0; a < _limitGiveMoney.length; a++) {
                    if(_limitGiveMoney[a].id == to) {
                        _limitGiveIsAda = a
                    }
                }
                return { posLimitMoney: _limitGiveIsAda }
            } else {
                return { posLimitMoney: 'false' }
            }
        }
        
        const addMoneyLimitGive = async (_userDb, userId, to, amount) => {
            const _limitGiveMoney = _userDb.limit.lpaym
            if (_limitGiveMoney != undefined) {
                let _limitGiveIsAda = 'false'
                for (let a = 0; a < _limitGiveMoney.length; a++) {
                    if(_limitGiveMoney[a].id == to) {
                        _limitGiveIsAda = a
                    }
                }
                console.log(_limitGiveIsAda)
                if(_limitGiveIsAda != 'false') {
                    // { limit: { lpaym: { id: 'XXX', limit: 90 }] } }
                    await  _mongo_UserSchema.updateOne({ iId: userId, "limit.lpaym.id": to }, { $inc: { "limit.lpaym.$.limit": amount } })
                } else {
                    await  _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "limit.lpaym": { id: to, limit: amount } } })
                }
            }
        }

        //InvestUser Function
        const setInvest_user = async (userId) => {
            const obj = { coal: 0, copper: 0, iron: 0, gold: 0, diamond: 0, sacoin: 0, naocoin: 0, elacoin: 0, recoin: 0 }
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest": obj } })
        }

        const getInvest_user = (_userDb) => {
            const _investuser = _userDb.invest
            if (JSON.stringify(_investuser) != '{}') {
                return _investuser
            }
        }

        // const getInvest_position = (userId) => {
        //     let position = global.db['./lib/database/user/inuser.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return position
        //     }
        // }

        const MinInvest_user_coal = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.coal - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.coal": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.coal": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_copper = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.copper - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.copper": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.copper": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_iron = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.iron - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.iron": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.iron": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_gold = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.gold - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.gold": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.gold": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_diamond = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.diamond - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.diamond": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.diamond": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_sacoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.sacoin - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.sacoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.sacoin": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_naocoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.naocoin - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.naocoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.naocoin": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_elacoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.elacoin - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.elacoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.elacoin": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const MinInvest_user_recoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.recoin - amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber - amount
            
            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.recoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.recoin": -amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }


        const addInvest_user_coal = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.coal + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.coal": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.coal": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_copper = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.copper + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.copper": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.copper": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_iron = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.iron + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.iron": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.iron": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_gold = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.gold + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.gold": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.gold": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_diamond = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.diamond + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.diamond": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.diamond": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_sacoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.sacoin + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.sacoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.sacoin": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_naocoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.naocoin + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.naocoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.naocoin": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_elacoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.elacoin + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.elacoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.elacoin": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const addInvest_user_recoin = async (userId, amount, _userDb) => {
            let isAmountUndefined = false
            if(!amount) {
                amount = 0
                isAmountUndefined = true
            }
            const investDb = _userDb ? _userDb : await _mongo_UserSchema.findOne({ iId: userId })
            let checkInv = investDb.invest.recoin + amount
            let check = 0
            if(isNaN(checkInv)) check = 0
            if(!isFinite(checkInv)) check = minInfinityNumber + amount

            !isFinite(checkInv) || isNaN(checkInv) ? await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "invest.recoin": check } }) : await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "invest.recoin": amount } })
            if(isAmountUndefined) return { isAmountUndefined }
        }

        const investTransaction = async (userId, typeTrans, investName, investNominal, money, coinPrice, isZeroItemAfterIns = false) => {
            if(!money || !investNominal) return { isAmountUndefined: true }
            let conditionInv = { iId: userId }
            if(typeTrans === 'buy') {
                conditionInv['economy.money'] = { $gte: money }
            } else if(typeTrans === 'sell') {
                conditionInv[`invest.${investName}`] = { $gte: investNominal }
            }

            // push the history to invest handler
            const hash = crypto.createHash('md5').update(`${userId},${typeTrans},${investName},${investNominal},${money}`).digest('hex')
            if((investName === 'naocoin') || (investName === 'elacoin') || (investName === 'recoin')) {
                // hash userId,typeTrans,investName,investNominal,money
                await axios.post(`http://localhost:5153/transaction/${investName}`, {
                    hash: hash,
                    from: userId,
                    to: 'CORE',
                    date: Date.now(),
                    type: typeTrans,
                    content: investNominal.toString()
                })
            } else {
                await _mongo_InvestHistorySchema.create({
                    coin: investName,
                    hash: hash,
                    from: userId,
                    to: 'CORE',
                    date: Date.now(),
                    type: typeTrans,
                    content: investNominal.toString(),
                    price: coinPrice.toString()
                })
            }

            let isSetDateInvestCountReset = {}
            if(isZeroItemAfterIns) {
                isSetDateInvestCountReset.$set = { [`limit.investCounter.resetCounter_${investName}`]: Date.now() }
            }
            const responseDb = await _mongo_UserSchema.updateOne(conditionInv,
                {
                    $inc: {
                       [`invest.${investName}`]: typeTrans === 'sell' ? -investNominal : investNominal,
                       'economy.money': typeTrans === 'sell' ? money : -money
                    },
                    ...isSetDateInvestCountReset
                })
            return responseDb
        }

        const addInvest_counter_market = async (invName, objName, amount) => {
            return await _mongo_BotSchema.updateOne({ iId: 'CORE', [`invest.${invName}`]: { "$type": 'object' } }, { $inc: { [`invest.$.${invName}.${objName}`]: amount } })
        }

        const addInvest_limit = async (userId, _userDb, invName) => {
            // limit.invest.<invName>
            const DateInvestLimit = moment()
            const timeOneMinuteAhead = DateInvestLimit.minutes(DateInvestLimit.get('minutes') + 1).seconds(0).milliseconds(0).valueOf()
            return await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { [`limit.invest.${invName}`]: 1 }, $set: { [`limit.invest.time_limit_reset`]: timeOneMinuteAhead } })
        }

        const getInvest_limit = (_userDb) => {
            return _userDb?.limit?.invest
        }

        //MONEY REN/RPG
        //==========================//
        //const hunt_sort = _hunt
        //hunt_sort.sort((a, b) => (a.poin < b.poin) ? 1 : -1)
        const setHunt_profile = (userId, nama) => {
            const obj = { id: userId, name: nama, poin: 0, level: 1, xp: 0, hp: 100, atk: 10, def: 0, partner: '', area: '', money: 0, weapon: 'tangan', class: '', inventory: '', partinven: '' }
            global.db['./lib/database/user/hunt.json'].push(obj)
        }

        const getHunt = (userId) => {
            const _hunt = global.db['./lib/database/user/hunt.json']
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                return _hunt[position]
            }
        }

        const getHunt_position = (userId) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                return position
            }
        }

        const getDuel_ses = (userId) => {
            const _duelses_hunt = global.db['./lib/database/user/duelses.json']
            let position = global.db['./lib/database/user/duelses.json'].findIndex(object => object.player1 == userId || object.player2 == userId)
            if (position !== -1) {
                return _duelses_hunt[position]
                console.log(_duelses_hunt[position])
            }
        }

        const getDuelses_position = (userId) => {
            let position = global.db['./lib/database/user/duelses.json'].findIndex(object => object.player1 == userId || object.player2 == userId)
            if (position !== -1) {
                return position
            }
        }

        //ATK
        function AnimalAtk_hunt(userId, hp, atk, def) {
            const defPlayer = Math.floor(getHunt(userId).def)
            const atkPlayer = Math.floor(getHunt(userId).atk)
            const hpPlayer = Math.floor(getHunt(userId).hp)
            const hpAnimal = hp
            const atkAnimal = atk
            const defAnimal = def

            var PlayerAtkMinDef = Math.floor(atkPlayer - defAnimal)
            var PlayerVSAnimal = hpAnimal / PlayerAtkMinDef
            var AnimalAtkMinDef = Math.floor(atkAnimal - defPlayer)
            var AnimalVSPlayer = hpPlayer / AnimalAtkMinDef

            const checkPLayerVSAnimal = `${PlayerVSAnimal}`
            if(checkPLayerVSAnimal.includes('.')) { //PLAYER ATK
                const AFilter = checkPLayerVSAnimal.trim().split('.')
                var PlayerVSAnimal_Filter = Math.floor(AFilter[0] + 1)
            } else {
                var PlayerVSAnimal_Filter = Math.floor(PlayerVSAnimal)
            }
            const checkAnimalVSPlayer = `${AnimalVSPlayer}`
            if(checkAnimalVSPlayer.includes('.')) { //Animal ATK
                const AFilter1 = checkAnimalVSPlayer.trim().split('.')
                var AnimalVSPlayer_Filter = Math.floor(AFilter1[0] + 1)
            } else {
                var AnimalVSPlayer_Filter = Math.floor(AnimalVSPlayer)
            }

            if(PlayerVSAnimal_Filter >= AnimalVSPlayer_Filter) {
                var turnBased = PlayerVSAnimal_Filter
            } else if(AnimalVSPlayer_Filter >= PlayerVSAnimal_Filter) {
                var turnBased = AnimalVSPlayer_Filter
            }
            return turnBased
            /*const turnBased_lucky = Math.floor(Math.random() * 2)
            var hpPlayer_turn = hpPlayer
            var hpAnimal_turn = hpAnimal_babih
            if(turnBased_lucky <= 1) {
                for (let i = 0; i < turnBased; i++) {
                    if(hpAnimal_turn >= 0) {
                        hpAnimal_turn -= PlayerAtkMinDef
                    }
                    if(hpPlayer_turn >= 0) {
                        hpPlayer_turn -= AnimalAtkMinDef
                    }
                }
            } else if(turnBased_lucky == 2) {
                for (let i = 0; i < turnBased; i++) {
                    if(hpPlayer_turn >= 0) {
                        hpPlayer_turn -= AnimalAtkMinDef
                    }
                    if(hpAnimal_turn >= 0) {
                        hpAnimal_turn -= PlayerAtkMinDef
                    }
                }
            }*/
            
        }
        //POINT
        const addHunt_Poin = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].poin += amount
            }
        }
        //XP
        const replaceHunt_Xp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].xp = amount
            }
        }

        const minHunt_Xp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].xp -= amount
            }
        }

        const addHunt_Xp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].xp += amount
            }
        }

        const minHunt_Lvl = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].level -= amount
            }
        }

        const addHunt_Lvl = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].level += amount
            }
        }

            //HP
        const replaceHunt_Hp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].hp = amount
            }
        }

        const minHunt_Hp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].hp -= amount
            }
        }

        const addHunt_Hp = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].hp += amount
            }
        }

        //ATK
        const replaceHunt_Atk = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].atk = amount
            }
        }

        const minHunt_Atk = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].atk -= amount
            }
        }

        const addHunt_Atk = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].atk += amount
            }
        }

            //DEF
        const replaceHunt_Def = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].def = amount
            }
        }

        const minHunt_Def = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].def -= amount
            }
        }

        const addHunt_Def = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].def += amount
            }
        }
        
            //Partner
        const replaceHunt_Partner = (userId, chara) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].partner = chara
            }
        }

        //Area
        const replaceHunt_Area = (userId, arean) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].area = arean
            }
        }

            //REN
        const minHunt_renMoney = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].money -= amount
            }
        }

        const addHunt_renMoney = (userId, amount) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].money += amount
            }
        }

            //Weapon
        const replaceHunt_Weapon = (userId, weap) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].weapon = weap
            }
        }
            //CLASS
        const replaceHunt_Class = (userId, clas) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].class = clas
            }
        }

        //Inventory
        const addHunt_Inventory = (userId, isi) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].inventory += ','+isi
            }
        }
        const replaceHunt_Inventory = (userId, inven) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].inventory = inven
            }
        }

        //PartInven
        const addHunt_PartInven = (userId, isi) => {
            let position = global.db['./lib/database/user/hunt.json'].findIndex(object => object.id == userId)
            if (position !== -1) {
                global.db['./lib/database/user/hunt.json'][position].partinven += ','+isi
            }
        }

        // RPG
        const registerRpg = async (userId) => {
            const obj = {
                hp: { value: 100, max: 100 },
                death: { isDeath: false, deathCount: 0, deathCooldown: 0 },
                def: 0,
                atk: 2,
                penetration: 0, // percent
                life_steal: 0, // percent
                dodge: 0, // percent
                crit: 2, // percent
                critDmg: 7,
                economy: { level: 1, xp: 0, money: 0 },
                equipped: { weapon: { id: 0, name: 'Tangan', type: 'weapon', rarity: 'common', attr: { atk: 2 } }, armor: { id: 0, name: 'Baju', type: 'armor', rarity: 'common', attr: { def: 0 } } },
                inventory: [], // { id: 0, name: String, type: String, qty: 0, rarity: 'string', attr: {} }
                world: 'Aincard',
                floor: { select: 1, select_zone: 1, max: 2 }, // { select: 1, select_zone: 1, max: 2 }
                additionalData: { isAllowTp: true },
            }
            return await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rpg": obj } })
        }

        const getRpg = (_userDb) => {
            return _userDb?.rpg
        }

        const actionRpgDb = async (userId, obj) => {
            return await  _mongo_UserSchema.updateOne({ iId: userId }, obj)
        }

        /**
         * description: Add item to inventory
         * @param {String} userId
         * @param {Array} item - { id: 0, name: String, type: String, qty: 0, rarity: 'string', attr: {} }
         */
        const addInventoryRpg = async (userId, item) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            const _inventory = _userDb.rpg.inventory
            let pushToInven = []
            await item.forEach(async (i) => {
                const _findItem = _inventory.find(_i => _i.id == i.id)
                if(_findItem && i.isCanStack) {
                    await _mongo_UserSchema.updateOne({ iId: userId, 'rpg.inventory.id': _findItem.id }, { $inc: { "rpg.inventory.$.qty": i.qty } })
                } else {
                    for(let j = 0; j < i.qty; j++) {
                        pushToInven.push(i)
                    }
                }
            })
            if(pushToInven.length > 0) {
                await _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "rpg.inventory": { $each: pushToInven } } })
            }
        }


        /**
         * description: Remove item from inventory
         * @param {String} userId
         * @param {Array} item - { id: 0, qty: 0 }
         */
        const removeInventoryRpg = async (userId, item) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            const _inventory = _userDb.rpg.inventory
            let pullToInven = []
            item.forEach(async (i) => {
                const _findItem = _inventory.find(_i => _i.id == i.id)
                if(_findItem) {
                    if(_findItem.qty <= i.qty) {
                        pullToInven.push(_findItem)
                    } else {
                        await _mongo_UserSchema.updateOne({ iId: userId, 'rpg.inventory.id': _findItem.id }, { $inc: { "rpg.inventory.$.qty": -i.qty } })
                    }
                }
            }).then(async () => {
                if(pullToInven.length > 0) {
                    await _mongo_UserSchema.updateOne({ iId: userId }, { $pull: { "rpg.inventory": { $each: pullToInven } } })
                }
            })
        }

        /**
         * description: add economy to user
         * @param {String} userId
         * @param {String} arrayObj - { id: String, dbPushType: String, name: String, value: Number }
         */
        const addEconomyDbBatch = async (userId, arrayObj) => {
            const formattedDbPush = []
            for(let i = 0; i < arrayObj.length; i++) {
                if(arrayObj[i].dbPushType == 'add') {
                    if(formattedDbPush.$inc == undefined) formattedDbPush.$inc = {}
                    if(formattedDbPush.$inc.hasOwnProperty(`rpg.economy.${arrayObj[i].id}`)) {
                        formattedDbPush.$inc[`rpg.economy.${arrayObj[i].id}`] += arrayObj[i].value
                    } else {
                        formattedDbPush.$inc[`rpg.economy.${arrayObj[i].id}`] = arrayObj[i].value
                    }
                } else if(arrayObj[i].dbPushType == 'set') {
                    if(formattedDbPush.$set == undefined) formattedDbPush.$set = {}
                    formattedDbPush.$set[`rpg.economy.${arrayObj[i].id}`] = arrayObj[i].value
                }

                if(i == arrayObj.length - 1) {
                    await _mongo_UserSchema.updateOne({ iId: userId }, formattedDbPush)
                }
            }
        }

        /**
         * @param {String} userId
         * @param {String} op - 'add' | 'min' | 'set'
         * @param {Number} amount
         */
        const setMoneyRpg = async (userId, op, amount) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            const _money = _userDb.rpg.economy.money
            let check = _money
            if (op == 'add') check += amount
            if (op == 'min') check -= amount
            if (op == 'set') check = amount
            if(isNaN(check)) check = 0
            if(check == Number.POSITIVE_INFINITY) check = infinityNumber
            if(check == Number.NEGATIVE_INFINITY) check = minInfinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rpg.economy.money": check } })
        }

        /**
         * description: Calculate fight rpg
         * @param {Array} player - Array of Player Object
         * @param {Array} opponent - Array of Player Object
         * @returns {Object} - { winner: Object, dataPlayer: Array, dataOpponent: Array, history: Array }
         * 
         * @example Player Object
         * {
         *      id: 'XXXX',
         *      name: 'Player 1',
         *      hp: { value: 100, max: 100 },
         *      def: 0,
         *      atk: 2,
         *      penetration: 0, // percent
         *      life_steal: 0, // percent
         *      dodge: 0, // percent
         *      crit: 2, // percent
         *      critDmg: 7,
         *      equipped: { weapon: { id: 0, name: 'Tangan', type: 'weapon', rarity: 'common', attr: { atk: 2 } }, armor: { id: 0, name: 'Baju', type: 'armor', rarity: 'common', attr: { def: 0 } } },
         * }
         */
        const calculateFightRpg = (player, opponent) => {
            let loop = 1
            const dataPlayer = player
            const dataOpponent = opponent
            const history = []
            for(let i = 0; i < loop; i++) {
                player.forEach((p, i) => {
                    const posOpponent = Math.floor(Math.random() * opponent.length)
                    const opponentRandom = opponent[posOpponent]

                    if(p.equipped?.weapon?.attr) {
                        const listAttrWeapon = Object.keys(p.equipped.weapon.attr)
                        listAttrWeapon.forEach((attr) => {
                            if(p[attr] != undefined) {
                                p[attr] += p.equipped.weapon.attr[attr]
                            } else {
                                p[attr] = p.equipped.weapon.attr[attr]
                            }
                        })
                    }
                    if(p.equipped?.armor?.attr) {
                        const listAttrArmor = Object.keys(p.equipped.armor.attr)
                        listAttrArmor.forEach((attr) => {
                            if(p[attr] != undefined) {
                                p[attr] += p.equipped.armor.attr[attr]
                            } else {
                                p[attr] = p.equipped.armor.attr[attr]
                            }
                        })
                    }
                    if(opponentRandom.equipped?.weapon?.attr) {
                        const listAttrWeapon = Object.keys(opponentRandom.equipped.weapon.attr)
                        listAttrWeapon.forEach((attr) => {
                            if(opponentRandom[attr] != undefined) {
                                opponentRandom[attr] += opponentRandom.equipped.weapon.attr[attr]
                            } else {
                                opponentRandom[attr] = opponentRandom.equipped.weapon.attr[attr]
                            }
                        })
                    }
                    if(opponentRandom.equipped?.armor?.attr) {
                        const listAttrArmor = Object.keys(opponentRandom.equipped.armor.attr)
                        listAttrArmor.forEach((attr) => {
                            if(opponentRandom[attr] != undefined) {
                                opponentRandom[attr] += opponentRandom.equipped.armor.attr[attr]
                            } else {
                                opponentRandom[attr] = opponentRandom.equipped.armor.attr[attr]
                            }
                        })
                    }

                    let playerAtkFinal = p.atk - opponentRandom.def
                    let opponentAtkFinal = opponentRandom.atk - p.def
                    if(playerAtkFinal <= -1) playerAtkFinal = 1
                    if(opponentAtkFinal <= -1) opponentAtkFinal = 1
                    
                    // Penetration
                    const playerRandomPenetration = Math.floor(Math.random() * 100)
                    const opponentRandomPenetration = Math.floor(Math.random() * 100)
                    let isPlayerPenetration = false
                    let isOpponentPenetration = false
                    if(playerRandomPenetration <= p.penetration) {
                        isPlayerPenetration = true
                        playerAtkFinal = p.atk
                    } else if(opponentRandomPenetration <= opponentRandom.penetration) {
                        isOpponentPenetration = true
                        opponentAtkFinal = opponentRandom.atk
                    }
                    
                    // Crit
                    const playerCritRandom = Math.floor(Math.random() * 100)
                    const opponentCritRandom = Math.floor(Math.random() * 100)
                    let isPlayerCrit = false
                    let isOpponentCrit = false
                    if(playerCritRandom <= p.crit) {
                        isPlayerCrit = true
                        playerAtkFinal += (playerAtkFinal * p.critDmg)
                    }
                    if(opponentCritRandom <= opponentRandom.crit) {
                        isOpponentCrit = true
                        opponentAtkFinal += (opponentAtkFinal * opponentRandom.critDmg)
                    }

                    // check isLose
                    if(p.hp.value <= 0) playerAtkFinal = 0
                    if(opponentRandom.hp.value <= 0) opponentAtkFinal = 0

                    const randomPlayerOrOpponent = Math.floor(Math.random() * 2)
                    let playerHp = p.hp.value
                    let opponentHp = opponentRandom.hp.value
                    if(randomPlayerOrOpponent == 0) { // opponent first
                        if(opponentHp <= 0) playerAtkFinal = 0
                        playerHp -= opponentAtkFinal
                        if(playerHp <= 0) playerAtkFinal = 0
                        opponentHp -= playerAtkFinal
                    } else { // player first
                        if(playerHp <= 0) opponentAtkFinal = 0
                        opponentHp -= playerAtkFinal
                        if(opponentHp <= 0) opponentAtkFinal = 0
                        playerHp -= opponentAtkFinal
                    }
                    console.log(p.name, playerAtkFinal, opponentRandom.name, opponentAtkFinal)
                    
                    // Dodge
                    const playerDodgeRandom = Math.floor(Math.random() * 100)
                    const opponentDodgeRandom = Math.floor(Math.random() * 100)
                    let isPlayerDodge = false
                    let isOpponentDodge = false
                    if((playerDodgeRandom <= p.dodge) && (playerHp > 0)) {
                        isPlayerDodge = true
                        playerHp = p.hp.value
                    }
                    if((opponentDodgeRandom <= opponentRandom.dodge) && (opponentHp > 0)) {
                        isOpponentDodge = true
                        opponentHp = opponentRandom.hp.value
                    }

                    // Life Steal
                    let playerLifeStealTotal = 0
                    let opponentLifeStealTotal = 0
                    if(isPlayerPenetration && playerHp > 0) {
                        const lifeSteal = Math.floor(playerAtkFinal * (p.life_steal / 100))
                        playerHp = ((playerHp + lifeSteal) > p.hp.max ? p.hp.max : (playerHp + lifeSteal))
                        playerLifeStealTotal = lifeSteal
                    } 
                    if(isOpponentPenetration && opponentHp > 0) {
                        const lifeSteal = Math.floor(opponentAtkFinal * (opponentRandom.life_steal / 100))
                        opponentHp = ((opponentHp + lifeSteal) > opponentRandom.hp.max ? opponentRandom.hp.max : (opponentHp + lifeSteal))
                        opponentLifeStealTotal = lifeSteal
                    }

                    const playerHpFinal = playerHp < 0 ? 0 : playerHp
                    const opponentHpFinal = opponentHp < 0 ? 0 : opponentHp

                    let message = []
                    
                    let firstAtk = undefined
                    let firstAtkFinal = undefined
                    let isFirstCrit = false
                    let secondAtk = undefined
                    let secondAtkFinal = undefined
                    let isSecondCrit = false
                    if(randomPlayerOrOpponent == 0) {
                        firstAtk = p.name
                        firstAtkFinal = playerAtkFinal
                        isFirstCrit = isPlayerCrit

                        secondAtk = opponentRandom.name
                        secondAtkFinal = opponentAtkFinal
                        isSecondCrit = isOpponentCrit
                    } else {
                        firstAtk = opponentRandom.name
                        firstAtkFinal = opponentAtkFinal
                        isFirstCrit = isOpponentCrit

                        secondAtk = p.name
                        secondAtkFinal = playerAtkFinal
                        isSecondCrit = isPlayerCrit
                    }
                    if(isFirstCrit && (firstAtkFinal > 0)) {
                        message.push(`🔥 ${firstAtk} melakukan critical hit sebesar ${firstAtkFinal} damage!\n`)
                    } else if(firstAtkFinal > 0) {
                        message.push(`🗡️ ${firstAtk} menyerang ${secondAtk} sebesar ${firstAtkFinal} damage!\n`)
                    }
                    if(isSecondCrit && (secondAtkFinal > 0)) {
                        message.push(`🔥 ${secondAtk} melakukan critical hit sebesar ${secondAtkFinal} damage!\n`)
                    } else if(secondAtkFinal > 0) {
                        message.push(`🗡️ ${secondAtk} menyerang ${firstAtk} sebesar ${secondAtkFinal} damage!\n`)
                    }

                    if(isPlayerPenetration) {
                        message.push(`💥 ${p.name} menembus pertahanan ${opponentRandom.name}${isPlayerPenetration ? ` dan mengcover hp sebesar ${playerLifeStealTotal}` : ''}\n`)
                    }
                    if(isOpponentPenetration) {
                        message.push(`💥 ${opponentRandom.name} menembus pertahanan ${p.name}${isOpponentPenetration ? ` dan mengcover hp sebesar ${opponentLifeStealTotal}` : ''}\n`)
                    }

                    if(isPlayerDodge && (opponentAtkFinal > 0)) {
                        message.push(`👻 ${p.name} menghindari serangan ${opponentRandom.name}!\n`)
                    }
                    if(isOpponentDodge && (playerAtkFinal > 0)) {
                        message.push(`👻 ${opponentRandom.name} menghindari serangan ${p.name}!\n`)
                    }
                    if(playerHpFinal == 0) {
                        message.push(`❌ ${p.name} kalah!\n`)
                    } else {
                        message.push(`❤️ ${p.name} sisa ${playerHpFinal} HP!\n`)
                    }
                    if(opponentHpFinal == 0) {
                        message.push(`❌ ${opponentRandom.name} kalah!\n`)
                    } else {
                        message.push(`❤️ ${opponentRandom.name} sisa ${opponentHpFinal} HP!\n`)
                    }
                    history.push({
                        player: {
                            id: p.id,
                            hp: p.hp,
                            hpFinal: playerHpFinal,
                            atk: p.atk,
                            atkFinal: playerAtkFinal,
                            crit: p.crit,
                            critDmg: p.critDmg,
                            isCrit: isPlayerCrit,
                            penetration: p.penetration,
                            life_steal: p.life_steal,
                            dodge: p.dodge,
                            isPenetration: isPlayerPenetration,
                            isDodge: isPlayerDodge
                        },
                        opponent: {
                            id: opponentRandom.id,
                            hp: opponentRandom.hp,
                            hpFinal: opponentHpFinal,
                            atk: opponentRandom.atk,
                            atkFinal: opponentAtkFinal,
                            crit: opponentRandom.crit,
                            critDmg: opponentRandom.critDmg,
                            isCrit: isOpponentCrit,
                            penetration: opponentRandom.penetration,
                            life_steal: opponentRandom.life_steal,
                            dodge: opponentRandom.dodge,
                            isPenetration: isOpponentPenetration,
                            isDodge: isOpponentDodge
                        },
                        message
                    })
                    player[i].hp.value = playerHpFinal
                    opponent[posOpponent].hp.value = opponentHpFinal

                    dataPlayer[dataPlayer.findIndex(p => p.id == player[i].id)].hp.value = playerHpFinal
                    dataOpponent[dataOpponent.findIndex(o => o.id == opponentRandom.id)].hp.value = opponentHpFinal
                })
                player = player.filter(p => p.hp.value > 0)
                opponent = opponent.filter(o => o.hp.value > 0)
                loop += player.length > 0 && opponent.length > 0 ? 1 : 0
                if(player.length == 0 || opponent.length == 0) loop = 0

                if(loop == 0) {
                    const winner = player.length > 0 ? 'player' : 'opponent'
                    return { winner, dataPlayer, dataOpponent, history }
                }
            }
        }

        /**
         * description: Apply stats rpg
         * @param {String} userId
         * @param {Object} stats - { hp: { value: 100, max: 100 }, def: 0, atk: 2, penetration: 0, life_steal: 0, dodge: 0, crit: 2, critDmg: 7 }
         */
        const setStatsRpg = async (userId, stats) => {
            let formatted = {}
            if(stats.hp) formatted['rpg.hp'] = stats.hp
            if(stats.def) formatted['rpg.def'] = stats.def
            if(stats.atk) formatted['rpg.atk'] = stats.atk
            if(stats.penetration) formatted['rpg.penetration'] = stats.penetration
            if(stats.life_steal) formatted['rpg.life_steal'] = stats.life_steal
            if(stats.dodge) formatted['rpg.dodge'] = stats.dodge
            if(stats.crit) formatted['rpg.crit'] = stats.crit
            if(stats.critDmg) formatted['rpg.critDmg'] = stats.critDmg
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: formatted })
        }

        //
        //Function XP
        function getLevelingXp(_userDb) {
            const _level = _userDb.economy.xp
            let check = _level
            // if(isNaN(check)) check = 2000
            // if(check == Number.POSITIVE_INFINITY) check = infinityNumber
            // if(check == Number.NEGATIVE_INFINITY) check = minInfinityNumber

            // await  _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: { "economy.xp": check } })
            return check
        }

        const getLevelingLevel = (_userDb) => {
            const _level = _userDb.economy.level
            let check = _level
            // if(isNaN(check)) check = 2000
            // if(check == Number.POSITIVE_INFINITY) check = infinityNumber
            // if(check == Number.NEGATIVE_INFINITY) check = minInfinityNumber

            // await  _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: { "economy.level": check } })
            return check
        }

        const getLevelingId = (_userDb) => {
            const _level = _userDb.economy.level
            if (JSON.stringify(_level) != '{}') {
                return _userDb.iId
            }
        }
        
        const replaceLevelingXp = async (userId, xp) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.xp": xp } })
        }

        const addLevelingXp = async (userId, amount) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = _userDb.economy.xp + amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = infinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.xp": check } })
        }

        const MinLevelingXp = async (userId, amount) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = _userDb.economy.xp - amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = minInfinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.xp": check } })
        }

        const addLevelingLevel = async (userId, amount) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = _userDb.economy.level + amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = infinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.level": check } })
        }

        const MinLevelingLevel = async (userId, amount) => {
            const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
            let check = _userDb.economy.level - amount
            if(isNaN(check)) check = 2000
            if(!isFinite(check)) check = minInfinityNumber

            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.level": check } })
        }

        // const getLevelPosition = (userId) => {
        //     let position = global.db['./lib/database/user/level.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return position
        //     }
        // }

        const addLevelingId = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.xp": 0, "economy.level": 1 } })
        }
        
        const getMiningJum = (_userDb) => {
            if(_userDb?.economy?.mining?.jum != undefined) {
                return _userDb?.economy?.mining?.jum
            }
        }

  
        
        const addMining = async (userId, time) => {
            const obj = { jum: 0, time: Date.now() + toMs(time) }
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "economy.mining": obj } })
        }

        async function addJumMining (userId) {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "economy.mining.jum": 1 } })
        }

        const addBg = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "image.bg": './media/img/bg.png' } })
        }

        const getBg = (_userDb) => {
            const _bg = _userDb.image.bg
            if (JSON.stringify(_bg) != '{}') {
                return _bg
            }
        }

        const replaceBg = async (userId, link) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "image.bg": link } })
        }

        const addBgProfile = async (userId) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "image.bgProfile": './media/img/bgProfile.png' } })
        }

        const getBgProfile = (_userDb) => {
            const _bg = _userDb?.image?.bgProfile
            if (JSON.stringify(_bg) != '{}') {
                return _bg
            }
        }

        const replaceBgProfile = async (userId, link) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "image.bgProfile": link } })
        }

        const addAfk = async (userId, time, reason) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { afk: { isAfk: true, time, reason } } })
        }

        const getAfk = (_userDb) => {
            let _afk = _userDb.afk
            if(JSON.stringify(_afk) != '{}') {
                return _afk
            }
        }

        const getAfkReason = (_userDb) => {
            const _afk = _userDb?.afk?.reason
            if (JSON.stringify(_afk) != '{}') {
                return _afk
            }
        }

        const getAfkTime = (_userDb) => {
            const _afk = _userDb?.afk?.time
            if (JSON.stringify(_afk) != '{}') {
                return _afk
            }
        }

        const getAfkId = (_userDb) => {
            const _afk = _userDb?.afk?.id
            if (JSON.stringify(_afk) != '{}') {
                return _afk.id
            }
        }

        // const addReminder = (userId, message, time) => {
        //     const obj = { id: userId, msg: message, time: Date.now() + toMs(time) }
        //     global.db['./lib/database/user/reminder.json'].push(obj)
        // }

        // const getReminderTime = (userId) => {
        //     const _reminder = global.db['./lib/database/user/reminder.json']
        //     let position = global.db['./lib/database/user/reminder.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return _reminder[position].time
        //     }
        // }

        // const getReminderMsg = (userId) => {
        //     const _reminder = global.db['./lib/database/user/reminder.json']
        //     let position = global.db['./lib/database/user/reminder.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return _reminder[position].msg
        //     }
        // }

        // const getReminderPosition = (userId) => {
        //     let position = global.db['./lib/database/user/reminder.json'].findIndex(object => object.id == userId)
        //     if(position != -1) {
        //         return position
        //     }
        // }
        //End AFK FUNCTION        
        
        //Level
        //Function
        const setLevelAntiSpam = (userId) => {
            const a = undefined
            const obj = { id: userId, count: 0, countcmd: 0 }
            global.antispam.push(obj)
        }

        const getLevelAntiSpamId = (userId) => {
            var _levelAntiSpam = global.antispam
            let position = global.antispam.findIndex(object => object.id == userId)
            if (position !== -1) {
                return _levelAntiSpam[position].id
            }
        }

        const addLevelAntiSpamCount = (userId) => {
            let position = global.antispam.findIndex(object => object.id == userId)
            if (position !== -1) {
                global.antispam[position].count += 1
            }
        }
        
        const addLevelAntiSpamCountCmd = (userId) => {
            let position = global.antispam.findIndex(object => object.id == userId)
            if (position !== -1) {
                global.antispam[position].countcmd += 1
            }
        }

        // FUNCTION
        function isLimit(_userDb){
            let limit = _userDb?.limit?.limit

            if (limit <= 0) {
                return true
            } else {
                return false
            }
        }

        async function limitAdd (id) {
            await  _mongo_UserSchema.updateOne({ iId: id }, { $inc: { "limit.limit": -1 } })
        }

        async function limitMin (id, min) {
            await  _mongo_UserSchema.updateOne({ iId: id }, { $inc: { "limit.limit": -min } })
        }

        const getLimit = (_userDb) => {
            let limit = _userDb.limit.limit
            if (JSON.stringify(limit) != '{}') {
                return limit
            }
        }

        async function limitGive (id, give) {
            await  _mongo_UserSchema.updateOne({ iId: id }, { $inc: { "limit.limit": give } })
        }

        // const getLimitPosition = (userId) => {
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return position
        //     }
        // }

        function monospace(string) {
            let _3 = '`'.repeat(3)
            return _3 + string + _3
        }

        //FUNCTION SHOP BY DWIR
            //Limit
        // function limitMin5 (id) { //Buat ngurangin limit 5
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 5
        //     }
        // }

        // function limitMin10 (id) { //Buat ngurangin limit 10
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 10
        //     }
        // }

        // function limitMin15 (id) { //Buat ngurangin limit 15
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 15
        //     }
        // }

        // function limitMin20 (id) { //Buat ngurangin limit 20
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 20
        //     }
        // }

        // function limitMin25 (id) { //Buat ngurangin limit 25
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 25
        //     }
        // }

        // function limitMin30 (id) { //Buat ngurangin limit 30
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 30
        //     }
        // }

        // function limitMin35 (id) { //Buat ngurangin limit 35
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 35
        //     }
        // }

        // function limitMin40 (id) { //Buat ngurangin limit 40
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 40
        //     }
        // }

        // function limitMin45 (id) { //Buat ngurangin limit 45
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 45
        //     }
        // }

        // function limitMin50 (id) { //Buat ngurangin limit 50
        //     let position = global.db['./lib/database/user/limit.json'].findIndex(object => object.id == id)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/limit.json'][position].limit -= 50
        //     }
        // }

            //
            // List item
            const getUserListItem = (_userDb, toObj = false) => {
                const _item = _userDb.item.item
                return !toObj ? (_item || []) : Object.assign({}, ...(_item || []))
            }

            // etc. { level: { level: 1 + level, time: Date.now() + toMs(time) } }
            const addUserListItem = async (userId, item) => {
                await _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "item.item": item } })
            }

            const enableUserListItem = async (userId, item) => {
                const findItemEnable = await _mongo_UserSchema.findOne({ iId: userId }, { "item.item": 1 })
                const _item = getUserListItem(findItemEnable, true)
                if(!_item[item]) return false

                await _mongo_UserSchema.updateOne({ iId: userId }, { $pull: { "item.item": { [item]: _item[item] } }, $set: { [`item.${item}`]: _item[item] } })
                return true
            }

            const disableUserListItem = async (userId, item) => {
                const findItemDisable = await _mongo_UserSchema.findOne({ iId: userId }, { "item": 1 })
                const _item = findItemDisable.item
                if(!_item[item] || JSON.stringify(_item[item]) == '{}') return false

                await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { [`item.${item}`]: {} }, $push: { "item.item": { [item]: _item[item] } } })
                return true
            }

            //ITEM
            const getUserItemId = (_userDb, includeDeactive = false) => {
                const _itemLevel = _userDb.item.level
                if (_itemLevel.time != 0 && JSON.stringify(_itemLevel) != '{}') {
                    return _itemLevel
                }
                if(includeDeactive) {
                    const listDeactive = getUserListItem(_userDb, true)
                    const allKeysDeactive = Object.keys(listDeactive || {})
                    if(allKeysDeactive.includes('level')) return listDeactive.level
                }
            }
                //LEVEL
            /*const getItemLevelPosition = (userId, _dir) => {
                let position = null
                Object.keys(_dir).forEach((i) => {
                    if (_dir[i].id === userId) {
                        position = i
                    }
                })
                if (position !== null) {
                    return position
                }
            }*/

            const getItemJobBoost = (_userDb, includeDeactive = false) => {
                const _itemJobBoost = _userDb.item.jobBoost
                if (_itemJobBoost.time != 0 && JSON.stringify(_itemJobBoost) != '{}') {
                    return _itemJobBoost
                }
                if(includeDeactive) {
                    const listDeactive = getUserListItem(_userDb, true)
                    const allKeysDeactive = Object.keys(listDeactive || {})
                    if(allKeysDeactive.includes('jobBoost')) return listDeactive.jobBoost
                }
            }

            const addItemJobBoost = async (_userDb, xp, time) => {
                const obj = { xp: 1 + xp, time: Date.now() + toMs(time) }
                await _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: { "item.jobBoost": obj } })
            }

            async function addJumItemJobBoost (_userDb, userId, amount) {
                const listDeactive = getUserListItem(_userDb, true)
                const allKeysDeactive = Object.keys(listDeactive || {})
                if(allKeysDeactive.includes('jobBoost')) {
                    await _mongo_UserSchema.updateOne({ iId: userId, "item.item.jobBoost": { $exists: true } }, { $inc: { "item.item.$.jobBoost.xp": amount } })
                } else {
                    await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "item.jobBoost.xp": amount } })
                }
            }

            const getItemLevel = (_userDb, includeDeactive = false) => {
                const _itemLevel = _userDb.item.level
                if (_itemLevel.time != 0 && JSON.stringify(_itemLevel) != '{}') {
                    return _itemLevel
                }
                if(includeDeactive) {
                    const listDeactive = getUserListItem(_userDb, true)
                    const allKeysDeactive = Object.keys(listDeactive || {})
                    if(allKeysDeactive.includes('level')) return listDeactive.level
                }
            }

            const addItemLevel = async (_userDb, level, time) => {
                const obj = { level: 1 + level, time: Date.now() + toMs(time) }
                await  _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: { "item.level": obj } })
            }

            async function addJumItemLevel (_userDb, userId, amount) {
                const listDeactive = getUserListItem(_userDb, true)
                const allKeysDeactive = Object.keys(listDeactive || {})
                if(allKeysDeactive.includes('level')) {
                    await _mongo_UserSchema.updateOne({ iId: userId, "item.item.level": { $exists: true } }, { $inc: { "item.item.$.level.level": amount } })
                } else {
                    await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "item.level.level": amount } })
                }
            }

            const getUserItemIdSpy = (_userDb, includeDeactive = false) => {
                const _itemSpy = _userDb?.item?.spy || {}
                if (_itemSpy?.time != 0 && JSON.stringify(_itemSpy) != '{}') {
                    return _itemSpy
                }
                if(includeDeactive) {
                    const listDeactive = getUserListItem(_userDb, true)
                    const allKeysDeactive = Object.keys(listDeactive || {})
                    if(allKeysDeactive.includes('spy')) return listDeactive.spy
                }
            }

            const addItemSpy = async (userId, time) => {
                const obj = { time: Date.now() + toMs(time) }
                await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "item.spy": obj } })
            }
            

                //
        //End
        //FUNCTION PROFILE BY DWIR
        const getCmd = (userId) => {
            // let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == userId)
            // if(position !== -1) {
            //     return position
            // }
            return undefined
        }

        const addCmd = (userId, time, cmdan) => {
            // if (isPrem) {return;}
            // if (getCmd(userId)) {
            //     let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == userId)
            //     if (position !== -1) {
            //         global.db['./lib/database/user/cmd.json'][position].cmd += ', '+cmdan
            //     }
            // } else {
            //     let obj = {id: `${userId}`, time: `${time}`, cmd: `${cmdan}`, jumlah: 1}
            //     global.db['./lib/database/user/cmd.json'].push(obj)
            // }
        }

        function CmdAddJum (id) {
            // if (isPrem) {return;}
            // let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == id)
            // if (position !== -1) {
            //     global.db['./lib/database/user/cmd.json'][position].jumlah += 1;
            // }
        }
        
        const getCmdmsg = (userId) => {
            // const _cmd = global.db['./lib/database/user/cmd.json']
            // let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == userId)
            // if (position !== -1) {
            //     return _cmd[position].cmd
            // }
            return undefined
        }

        const getCmdjum = (userId) => {
            // const _cmd = global.db['./lib/database/user/cmd.json']
            // let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == userId)
            // if (position !== -1) {
            //     return _cmd[position].jumlah
            // }
            return undefined
        }

        const getCmdPosition = (userId) => {
            // let position = global.db['./lib/database/user/cmd.json'].findIndex(object => object.id == userId)
            // if (position !== -1) {
            //     return position
            // }
            return undefined
        }

        //End
        const replacePref = async (GrupId, prefix) => {
            await _mongo_GroupSchema.updateOne({ iId: GrupId }, { $set: { prefix: prefix } })
        }

        //END
        const addrules = async (GrupId, prefix) => {
            await _mongo_GroupSchema.updateOne({ iId: GrupId }, { $set: { rulesSet:  `*!! Warning !!* setrules kosong || ${prefix || '.'}setrules` } })
        }
        
        const getrules = (_groupDb) => {
            const _rules = _groupDb?.rulesSet
            if (_rules != '') {
                return _rules
            }
        }

        const replaceRules = async (GrupId, rules) => {
            await _mongo_GroupSchema.updateOne({ iId: GrupId }, { $set: { rulesSet: rules } })
        }

        //END
        //FUNCTION SETUSER PROFILE BY DWIR
            //REMIND
        // const addRemind = (userId, time, remind) => {
        //     let obj = {id: `${userId}`, time: `${time}`, remind: `${remind}`}
        //     global.db['./lib/database/user/remind.json'].push(obj)
        // }

        // const replaceRemind = (userId, remind) => {
        //     let position = global.db['./lib/database/user/remind.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/remind.json'][position].remind = remind
        //     }
        // }

        // const replaceRemindTime = (userId, time) => {
        //     let position = global.db['./lib/database/user/remind.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         global.db['./lib/database/user/remind.json'][position].time = time
        //     }
        // }

        // const getRemind = (userId) => {
        //     const _remind =  global.db['./lib/database/user/remind.json']
        //     let position = global.db['./lib/database/user/remind.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return _remind[position].remind
        //     }
        // }

        // const getRemindTime = (userId) => {
        //     const _remind =  global.db['./lib/database/user/remind.json']
        //     let position = global.db['./lib/database/user/remind.json'].findIndex(object => object.id == userId)
        //     if (position !== -1) {
        //         return _remind[position].time
        //     }
        // }

            //END
            //NAMA
        const addNama = async (userId, nama) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.name": nama } })
        }

        const replaceNama = async (userId, nama) => {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.name": nama } })
        }

            //END
            //GENDER
            const addGen = async (userId, gender) => {
                await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.gender": gender } })
            }

            const replaceGen = async (userId, gender) => {
                await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.gender": gender } })
            }

            const getGen = (_userDb) => {
                const _gender = _userDb.rl.gender
                if (_gender != '') {
                    return _gender
                }
            }

            const getGenMention = (_mentionUserDb) => {
                const _gender = _mentionUserDb.rl.gender
                if (_gender != '') {
                    return _gender
            
                }    
            }

            //END
            //IG
            const addIg = async (userId, Ig) => {
                await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ig: Ig } })
            }

            const replaceIg = async  (userId, Ig) => {
                await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ig: Ig } })
            }

            const getIg = (_userDb) => {
                const _setig = _userDb.ig
                if (_setig !== '') {
                    return _setig
                }
            }

            //END
        //END
    //FUNCTION TICTAC
    //PROFILE
    const setTicTac_profile = async (userId) => {
        const obj = {poin: 0, win: 0, lose: 0, draw: 0 }
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { tictac: obj } })
    }

    const getTicTac_profile = (_userDb) => {
        const _tiktakuser = _userDb.tictac
        if (JSON.stringify(_tiktakuser) !== '{}') {
            return _tiktakuser
        }
    }

    // const getTicTac_profile_position = (userId) => {
    //     let position = global.db['./lib/database/user/tictacuser.json'].findIndex(object => object.id == userId)
    //     if (position !== -1) {
    //         return position
    //     }
    // }

    // const replaceTicTac_profile_lastlead = (userId, value) => {
    //     let position = global.db['./lib/database/user/tictacuser.json'].findIndex(object => object.id == userId)
    //     if (position !== -1) {
    //         global.db['./lib/database/user/tictacuser.json'][position].lastlead = value
    //     }
    // }

    const addTicTac_profile = async (userId, property, value) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { ["tictac." + property]: value } })
    }

    // const addTicTacHistory_profile = (userId, value) => {
    //     let position = global.db['./lib/database/user/tictacuser.json'].findIndex(object => object.id == userId)
    //     if (position !== -1) {
    //         global.db['./lib/database/user/tictacuser.json'][position].history.push(value)
    //     }
    // }

    //GAME
    const setTicTac_toe = async (userId, userId2) => {
        const obj = { player1: userId, player2: userId2, "a0": '', "a1": '', "a2": '', "a3": '', "a4": '', "a5": '', "a6": '', "a7": '', "a8": '', status: 'waiting', turn: '', xo: [] }
        await _mongo_UserSchema.updateMany({ $or: [{ iId: userId }, { iId: userId2 }] }, { $set: { tc: obj } })
    }

    const getTicTac_toe = (_userDb) => {
        const _tiktak = _userDb
        if ((JSON.stringify(_tiktak?.tc) !== '{}') && (_tiktak?.tc != null) && (_tiktak?.tc != undefined)) {
            // console.log(_tiktak)
            return Object.assign(_tiktak?.tc, { iId: _tiktak?.iId })
        }
    }
    
    // const getTicTac_toe_position = (userId) => {
    //     let position = global.db['./lib/database/user/tictac.json'].findIndex(object => object.player1 == userId || object.player2 == userId)
    //     if (position !== -1) {
    //         return position
    //     }
    // }

    const replaceTicTac_xo = async (userId, xo1) => {
        await _mongo_UserSchema.updateMany({ $or: [{ "tc.player1": userId }, { "tc.player2": userId }] }, { $set: { "tc.xo": xo1 } })
    }

    const replaceTicTac_status = async (userId, statusid) => {
        await _mongo_UserSchema.updateMany({ $or: [{ "tc.player1": userId }, { "tc.player2": userId }] }, { $set: { "tc.status": statusid } })
    }

    const replaceTicTac_turn = async (userId, giliran) => {
        await _mongo_UserSchema.updateMany({ $or: [{ "tc.player1": userId }, { "tc.player2": userId }] }, { $set: { "tc.turn": giliran } })
    }

    const replaceTicTac_toe_game = async (userId, symboll, id) => {
        await _mongo_UserSchema.updateMany({ $or: [{ "tc.player1": userId }, { "tc.player2": userId }] }, { $set: { ["tc." + id]: symboll } })
    }

    const getPref = (_groupDb) => {
        return _groupDb.prefix || '.'
    }

    /**
     * {
        "id": "2037FYG4Y2X4",
        "groupId": "6281358181668-1621640771@g.us",
        "roomMaster": "6281358181668@s.whatsapp.net",
        "player": [{
            "number": "62859131338352@s.whatsapp.net",
            "status": "alive",
            "role": "wolf"
            "act": false,
            "options": {}
        }],
        "listVote": [{
            "round": 1,
            "vote": ["62xxx@s.whatsapp.net", "62xxx@s.whatsapp.net"]
        }],
        "isAfterVote": false,
        "isAfterAct": false,
        "round": 0,
        "status": "waiting"
        "client": "botClient"
     * }
     */
    //ww
    const setWW_game = (id, groupId, roomMaster, client) => {
        const obj = { id, groupId, roomMaster, player: [], listVote: [], status: 'waiting', client }
        global.ww.push(obj)
    }

    const getWW_game = (id) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            return position
        }
    }

    const replaceWWValue_game = (id, params, value) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            global.ww[position][params] = value
        }
    } 

    const addWWPlayer_game = (id, number, role) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            global.ww[position].player.push({ number, role, status: 'alive', act: false, options: {} })
        }
    }

    const removeWWPlayer_game = (id, number) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            let posPlayer = global.ww[position].player.findIndex(all => all.number == number)
            if(posPlayer != -1) {
                global.ww[position].player.splice(posPlayer, 1)
            }
        }
    }

    const getWWPlayer_game = (id, number) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            let posPlayer = global.ww[position].player.findIndex(all => all.number == number)
            if(posPlayer != -1) {
                return posPlayer
            }
        }
    }

    const replaceWWPlayer_status = (id, number, status) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            let posPlayer = global.ww[position].player.findIndex(all => all.number == number)
            if(posPlayer != -1) {
                global.ww[position].player[posPlayer].status = status
            }
        }
    }

    const replaceWWPlayer_value = (id, number, params, value) => {
        let position = global.ww.findIndex(object => object.id == id || object.groupId == id)
        if (position !== -1) {
            let posPlayer = global.ww[position].player.findIndex(all => all.number == number)
            if(posPlayer != -1) {
                global.ww[position].player[posPlayer][params] = value
            }
        }
    }

    function remGetContactInitialize (rem, jid) {
        return rem.contacts(jid)
    }

    async function remSendInitialize (rem, isJadibot, idJadibot = undefined, params, from, content, options = []) {
        if(rem.isStop) {
            await sleep(10000)
            rem = isJadibot ? global.jadibot[global.jadibot.findIndex(object => object.virtualBotId == idJadibot)].access : global.remOutsideAccess
        }

        let response = undefined
        try {
            response = await rem[params](from, content, ...options)
        } catch (err) {
            console.error('remSendInitialize', err)
            await sleep(10000)
            rem = isJadibot ? global.jadibot[global.jadibot.findIndex(object => object.virtualBotId == idJadibot)].access : global.remOutsideAccess

            response = await rem[params](from, content, ...options)
        }

        return response
    }

    //WW State Start
    const stateWWGame_starting = async (id, rem, isJadibot = false, idJadibot = undefined) => {
        replaceWWValue_game(id, 'status', 'playing_starting')

        let position = global.ww.findIndex(object => object.id == id)
        let wwPlayDbWWGame = global.ww[position]

        if(wwPlayDbWWGame.isStop) return

        const roleValue7 = ['wolf', 'pemburu', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'warga']
        const roleValue12 = ['wolf', 'wolf', 'pemburu', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue13 = ['wolf', 'wolf', 'pemburu', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue14 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue15 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue16 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue17 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penyihir', 'penculik', 'penculik',  'warga', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue18 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penjaga', 'penjaga', 'penyihir', 'penculik', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue19 = ['wolf', 'wolf', 'pemburu', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penjaga', 'penjaga', 'penyihir', 'penculik', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']
        const roleValue20 = ['wolf', 'wolf', 'pemburu', 'wolf', 'pemburu', 'pemburu', 'penerawang', 'penerawang', 'penjaga', 'penjaga', 'penyihir', 'penculik', 'penculik', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga', 'warga']

        let roleValue = []
        if(wwPlayDbWWGame.player.length == 12) {
            roleValue = roleValue12
        } else if(wwPlayDbWWGame.player.length == 13) {
            roleValue = roleValue13
        } else if(wwPlayDbWWGame.player.length == 14) {
            roleValue = roleValue14
        } else if(wwPlayDbWWGame.player.length == 15) {
            roleValue = roleValue15
        } else if(wwPlayDbWWGame.player.length == 16) {
            roleValue = roleValue16
        } else if(wwPlayDbWWGame.player.length == 17) {
            roleValue = roleValue17
        } else if(wwPlayDbWWGame.player.length == 18) {
            roleValue = roleValue18
        } else if(wwPlayDbWWGame.player.length == 19) {
            roleValue = roleValue19
        } else if(wwPlayDbWWGame.player.length == 20) {
            roleValue = roleValue20
        } else if(wwPlayDbWWGame.player.length == 7) {
            roleValue = roleValue7
        }

        remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Game Starting...*`)
        remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'announcement')

        for(let i = 0; i < wwPlayDbWWGame.player.length; i++) {
            let role = roleValue[Math.floor(Math.random() * roleValue.length)]
            console.log(roleValue)
            const numberPlayer = wwPlayDbWWGame.player[i].number

            // if(numberPlayer == '6281358181668@s.whatsapp.net') {
            //     roleValue.splice(roleValue.indexOf('wolf'), 1)
            //     replaceWWPlayer_value(id, numberPlayer, 'role', 'wolf')
            //     await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', numberPlayer, `*Role kamu adalah ${capitalizeFirstLetter('wolf')}*`)
            // } else {
            //     roleValue.splice(roleValue.indexOf(role), 1)
            //     replaceWWPlayer_value(id, numberPlayer, 'role', role)
            //     await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', numberPlayer, `*Role kamu adalah ${capitalizeFirstLetter(role)}*`)
            // }
            roleValue.splice(roleValue.indexOf(role), 1)
            replaceWWPlayer_value(id, numberPlayer, 'role', role)
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', numberPlayer, `*Role kamu adalah ${capitalizeFirstLetter(role)}*`)
        }

        remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `Role telah dibagikan\n\n@${wwPlayDbWWGame.player.map(all => all.number).join(' @').replace(/@s.whatsapp.net/g, '')}\n\nSilahkan Cek Role Kamu di Private Chat dengan Bot`)

        const listWolf = global.ww[position].player.filter(all => all.role == 'wolf')
        for(let i = 0; i < listWolf.length; i++) {
            const numberPlayer = listWolf[i].number
            remSendInitialize(rem, isJadibot, idJadibot, 'sendText', numberPlayer, `*List Wolf Player*\n\nwa.me/${listWolf.map(all => all.number).join('\nwa.me/').replace(/@s.whatsapp.net/g, '')}`)
        }

        await sleep(5000)

        return stateWWGame_night(id, rem, isJadibot, idJadibot)
    }

    async function stateWWGame_night(id, rem, isJadibot = false, idJadibot = undefined) {
        replaceWWValue_game(id, 'status', 'playing_night')

        let position = global.ww.findIndex(object => object.id == id)
        let wwPlayDbWWGame = global.ww[position]

        if(wwPlayDbWWGame.isStop) return

        wwPlayDbWWGame.player = wwPlayDbWWGame.player.filter(all => all.status == 'alive')

        await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `Malam Hari Telah Tiba...\n\nBagi yang memiliki kemampuan khusus\nSilahkan Cek Dm Bot untuk memulai aksi\n*Kamu memiliki waktu 30 detik*`)

        for(let i = 0; i < wwPlayDbWWGame.player.length; i++) {
            if(wwPlayDbWWGame.player[i].status != 'alive') continue;
            const prefixPlayerWW = getPref(wwPlayDbWWGame.player[i].number) || '.'

            // set act to false, after vote
            global.ww[position].player[i].act = false

            if(wwPlayDbWWGame.player[i].role == 'wolf') {
                const getPlayerName = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Kill @${number.replace('@s.whatsapp.net', '')}`, description: `Membunuh ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixPlayerWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, r: wwPlayDbWWGame.round, t: number })} kill` }))
                console.log(getPlayerName)
                const sections = [{ title: "Bunuh Player", rows: getPlayerName }]
                const button = {
                    text: "Werewolf Game Action",
                    footer: '@dwirizqi.h',
                    title: 'Werewolf',
                    buttonText: 'Action',
                    sections
                }
                // remSendInitialize(rem, isJadibot, idJadibot, 'sendMessage', wwPlayDbWWGame.player[i].number, button)
                remSendInitialize(rem, isJadibot, idJadibot, 'sendList', wwPlayDbWWGame.player[i].number, button.text, [sections, button.title, button.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
            } else if(wwPlayDbWWGame.player[i].role == 'penerawang') {
                const getPlayerName = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Terawang @${number.replace('@s.whatsapp.net', '')}`, description: `Menerawang ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixPlayerWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, r: wwPlayDbWWGame.round, t: number })} inspect` }))
                const sections = [{ title: "Lihat Role Player", rows: getPlayerName }]
                const button = {
                    text: "Werewolf Game Action",
                    footer: '@dwirizqi.h',
                    title: 'Penerawang',
                    buttonText: 'Action',
                    sections
                }
                remSendInitialize(rem, isJadibot, idJadibot, 'sendList', wwPlayDbWWGame.player[i].number, button.text, [sections, button.title, button.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
            } else if(wwPlayDbWWGame.player[i].role == 'penjaga') {
                const getPlayerName = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Jaga @${number.replace('@s.whatsapp.net', '')}`, description: `Menjaga ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixPlayerWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, r: wwPlayDbWWGame.round, t: number })} protect` }))
                const sections = [{ title: "Lindungi Player", rows: getPlayerName }]
                const button = {
                    text: "Werewolf Game Action",
                    footer: '@dwirizqi.h',
                    title: 'Penjaga',
                    buttonText: 'Action',
                    sections
                }
                remSendInitialize(rem, isJadibot, idJadibot, 'sendList', wwPlayDbWWGame.player[i].number, button.text, [sections, button.title, button.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
            } /*else if(wwPlayDbWWGame.player[i].role == 'penyihir') {
                const getPlayerName = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Kill @${number.replace('@s.whatsapp.net', '')}`, description: `Membunuh ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixPlayerWW}wwplay {"i":"${wwPlayDbWWGame.id}","t":"${number}","asWitch":true} kill` }))
                const sections = [{ title: "Bunuh Player", rows: getPlayerName }]
                const button = {
                    text: "Werewolf Game Action",
                    footer: '@dwirizqi.h',
                    title: 'Penyihir',
                    buttonText: 'Action',
                    sections
                }
                remSendInitialize(rem, isJadibot, idJadibot, 'sendMessage', wwPlayDbWWGame.player[i].number, button)
            }*/ else if(wwPlayDbWWGame.player[i].role == 'penculik') {
                if(wwPlayDbWWGame.round > 2 && !wwPlayDbWWGame.player[i].options.isStealed) {
                    const getPlayerName = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Culik Role @${number.replace('@s.whatsapp.net', '')}`, description: `Menculik ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixPlayerWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, r: wwPlayDbWWGame.round, t: number })} steal` }))
                    const sections = [{ title: "Culik Role Player", rows: getPlayerName }]
                    const button = {
                        text: "Werewolf Game Action",
                        footer: '@dwirizqi.h',
                        title: 'Penculik',
                        buttonText: 'Action',
                        sections
                    }
                    remSendInitialize(rem, isJadibot, idJadibot, 'sendList', wwPlayDbWWGame.player[i].number, button.text, [sections, button.title, button.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
                }
            }
        }

        await sleep(30000)
        global.ww[position].isAfterAct = true

        return stateWWGame_midnight(id, rem, isJadibot, idJadibot)
    }

    async function stateWWGame_midnight(id, rem, isJadibot = false, idJadibot = undefined) {
        replaceWWValue_game(id, 'status', 'playing_midnight')

        let position = global.ww.findIndex(object => object.id == id)
        let wwPlayDbWWGame = global.ww[position]

        if(wwPlayDbWWGame.isStop) return

        wwPlayDbWWGame.player = wwPlayDbWWGame.player.filter(all => all.status == 'alive')

        let isDeathPlayer = false
        for(let i = 0; i < wwPlayDbWWGame.player.length; i++) {
            if(wwPlayDbWWGame.player[i].status != 'alive') continue;

            global.ww[position].player[i].act = false

            const number = wwPlayDbWWGame.player[i].number
            const prefixPlayerWW = getPref(number) || '.'
            if(wwPlayDbWWGame.player[i].role == 'wolf') {
                if(wwPlayDbWWGame.player[i]?.options?.isKill) {
                    const killedPlayer = wwPlayDbWWGame.player[i].options.kill
                    const searchPlayer = wwPlayDbWWGame.player.findIndex(object => object.number == killedPlayer)
    
                    if(wwPlayDbWWGame.player[searchPlayer]?.options?.protected) {
                        remSendInitialize(rem, isJadibot, idJadibot, 'sendText', number, `Player tersebut telah dilindungi oleh penjaga, Kamu tidak bisa membunuhnya!`)
                    } else if(searchPlayer != -1) {
                        isDeathPlayer = true
                        global.ww[position].player[searchPlayer].status = 'death'

                        const searchPenyihirPlayer = wwPlayDbWWGame.player.findIndex(object => object.role == 'penyihir')
    
                        await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `Terdengar suara minta tolong, dari rumah @${killedPlayer.replace('@s.whatsapp.net', '')}\n\n*Penyihir segera ambil aksi!* Kamu mempunyai waktu 30 detik!`)
                        remSendInitialize(rem, isJadibot, idJadibot, 'sendButtons', wwPlayDbWWGame.player[searchPenyihirPlayer].number, 'Tolong atau tidak', [[{ id: `${prefixPlayerWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, t: killedPlayer })} help`, text: 'Tolong' }, { id: `blankButtons`, text: 'Abaikan' }]])
                        
                        await sleep(30000)

                        if(global.ww[position].player[searchPlayer].status == 'death') {
                            await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `Player @${killedPlayer.replace('@s.whatsapp.net', '')} Telah mati!`)
                            remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.player[searchPlayer].number, `Kamu telah mati, Karena tidak ditolong oleh penyihir`)
                        }
                    }

                    global.ww[position].player[i].options.isKill = false
                }
            } else if(wwPlayDbWWGame.player[i].role == 'penjaga') {
                global.ww[position].player[i].options.protect = ''
            } else if(wwPlayDbWWGame.player[i]?.options?.protected) {
                global.ww[position].player[i].options.protected = false
            }
        }

        if(!isDeathPlayer) await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `Malam yang damai\nWerewolf tidak membunuh siapapun!`)

        replaceWWValue_game(id, 'round', wwPlayDbWWGame.round + 1)
        global.ww[position].isAfterAct = false
        return stateWWGame_day(id, rem, isJadibot, idJadibot)
    }

    async function stateWWGame_day(id, rem, isJadibot = false, idJadibot = undefined) {
        replaceWWValue_game(id, 'status', 'playing_day')

        let position = global.ww.findIndex(object => object.id == id)
        let wwPlayDbWWGame = global.ww[position]

        if(wwPlayDbWWGame.isStop) return

        //Winning Condition
        const getPlayerAliveWolf = wwPlayDbWWGame.player.filter(all => all.role == 'wolf')
        const getPlayerAliveNotWolf = wwPlayDbWWGame.player.filter(all => all.role != 'wolf')

        if(getPlayerAliveWolf.length == 0) {
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Semua Werewolf telah mati!*\n*Penduduk menang!*`)

            const textListAllPlayerAndRole = global.ww[position].player.map((all, index) => `${index + 1}. @${all.number.replace('@s.whatsapp.net', '')} - *(${all.role})*`).join('\n')
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `*List Player dan Role*\n\n${textListAllPlayerAndRole}`)

            await remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')
            return global.ww.splice(position, 1)
        } else if(getPlayerAliveNotWolf.length == 0) {
            remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Semua Penduduk telah mati!*\n*Werewolf menang!*`)

            const textListAllPlayerAndRole = global.ww[position].player.map((all, index) => `${index + 1}. @${all.number.replace('@s.whatsapp.net', '')} - *(${all.role})*`).join('\n')
            remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `*List Player dan Role*\n\n${textListAllPlayerAndRole}`)

            remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')
            return global.ww.splice(position, 1)
        }

        const listPlayerAlive = wwPlayDbWWGame.player.filter(all => all.status == 'alive')
        await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `Pagi Hari Telah Tiba...\n\n*List Player Hidup\n@${listPlayerAlive.map(all => all.number).join('\n@').replace(/@s.whatsapp.net/g, '')}\n\nSilahkan berdiskusi\n*Waktu 1 menit*`)
        await remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')
        await sleep(60000)

        await remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'announcement')
        await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `Waktu diskusi telah berakhir!\n\nSilahkan vote player yang akan di bunuh!\n*Waktu 1 menit*`)

        const prefixGrupWW = getPref(wwPlayDbWWGame.groupId) || '.'

        wwPlayDbWWGame.player = wwPlayDbWWGame.player.filter(all => all.status == 'alive')

        let getPlayerName = [{ title: `Lewati`, description: `Tidak Memilih Siapapun`, rowId: `${prefixGrupWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, t: 'skip' })} vote` }]
        getPlayerName.push(...wwPlayDbWWGame.player.map(({ number }) => ({ title: `Vote @${number.replace('@s.whatsapp.net', '')}`, description: `Vote ${number.replace('@s.whatsapp.net', '')}`, rowId: `${prefixGrupWW}wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, r: wwPlayDbWWGame.round, t: number})} vote` })))
        const sections = [{ title: "Vote Player", rows: getPlayerName }]
        const button = {
            text: "Vote player yang di curigai",
            footer: '@dwirizqi.h',
            title: 'Voting',
            buttonText: 'Vote',
            sections
        }
        // remSendInitialize(rem, isJadibot, idJadibot, 'sendMessage', wwPlayDbWWGame.groupId, button)
        remSendInitialize(rem, isJadibot, idJadibot, 'sendList', wwPlayDbWWGame.groupId, button.text, [sections, button.title, button.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
        remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')

        await sleep(60000)

        global.ww[position].isAfterVote = true
        remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'announcement')

        let voteResult = []
        const findRoundVote = global.ww[position].listVote.findIndex(all => all.round == wwPlayDbWWGame.round)

        if(findRoundVote != -1) {
            global.ww[position].listVote[findRoundVote].vote.forEach(function (x) { voteResult[x] = (voteResult[x] || 0) + 1; });

            const voteResultEntries = Object.entries(voteResult).sort((a, b) => b[1] - a[1])
            const selectedVoteToKilled = voteResultEntries[0]
    
            const textResult = `Hasil Vote:\n\n${voteResultEntries.map((key, index) => `${index + 1}. ${voteResultEntries[index][0].replace('@s.whatsapp.net', '')} - ${voteResultEntries[index][1]} Vote`).join('\n')}`
        
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, textResult)

            const getPlayerVoted = global.ww[position].player.findIndex(object => object.number == selectedVoteToKilled[0])
            if(wwPlayDbWWGame.player[getPlayerVoted].role == 'pemburu') {
                const getPlayerNamePemburu = wwPlayDbWWGame.player.map(({ number }) => ({ title: `Kill @${number.replace('@s.whatsapp.net', '')}`, description: `Membunuh ${number.replace('@s.whatsapp.net', '')}`, rowId: `.wwplay ${JSON.stringify({ i: wwPlayDbWWGame.id, t: number, isPemburu: true })} kill` }))
                const sectionsPemburu = [{ title: "Bunuh Player", rows: await getPlayerNamePemburu }]
                const buttonPemburu = {
                    text: "Vote Player Yang Ingin di Tembak\nJika salah menembak kamu akan mati\nJika benar, maka kamu akan di bebaskan\n*Waktu 10 detik*",
                    footer: '@dwirizqi.h',
                    title: 'Pemburu',
                    buttonText: 'Action',
                    sections: sectionsPemburu
                }
                // remSendInitialize(rem, isJadibot, idJadibot, 'sendMessage', selectedVoteToKilled[0], buttonPemburu)
                remSendInitialize(rem, isJadibot, idJadibot, 'sendList', selectedVoteToKilled[0], buttonPemburu.text, [sections, buttonPemburu.title, buttonPemburu.footer, {}, { mentions: wwPlayDbWWGame.player.map(number => number.number) }])
            } else {
                const tempDuplicateCheck = voteResultEntries.splice(1, 1)
                const isDuplicate = voteResultEntries.length > 1 ? tempDuplicateCheck.some(all => all[1] === selectedVoteToKilled[1]) : false
                if(isDuplicate) {
                    remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `Hasil Vote: \n\nTerdapat vote yang seri!`)
                } else {
                    global.ww[position].player[getPlayerVoted].status = 'death'
                    remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `@${selectedVoteToKilled[0].replace('@s.whatsapp.net', '')}\n\n*Player tersebut telah dihukum mati!*\n*Role: _${wwPlayDbWWGame.player[getPlayerVoted].role}_*`)
                }
            }
        } else {
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `Hasil Vote: \n\nTidak ada yang mem vote!`)
        }

        await sleep(10000)

        global.ww[position].isAfterVote = false
        
        //Winning Condition
        const getPlayerAliveWolf1 = global.ww[position].player.filter(all => all.role == 'wolf')
        const getPlayerAliveNotWolf1 = global.ww[position].player.filter(all => all.role != 'wolf')

        remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Tersisa _${getPlayerAliveWolf1.length} wolf_*`)

        if(getPlayerAliveWolf1.length == 0) {
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Semua Werewolf telah mati!*\n*Penduduk menang!*`)

            const textListAllPlayerAndRole = global.ww[position].player.map((all, index) => `${index + 1}. @${all.number.replace('@s.whatsapp.net', '')} - *(${all.role})*`).join('\n')
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `*List Player dan Role*\n\n${textListAllPlayerAndRole}`)

            await remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')
            return global.ww.splice(position, 1)
        } else if(getPlayerAliveNotWolf1.length == 0) {
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendText', wwPlayDbWWGame.groupId, `*Semua Penduduk telah mati!*\n*Werewolf menang!*`)

            const textListAllPlayerAndRole = global.ww[position].player.map((all, index) => `${index + 1}. @${all.number.replace('@s.whatsapp.net', '')} - *(${all.role})*`).join('\n')
            await remSendInitialize(rem, isJadibot, idJadibot, 'sendTextWithMentions', wwPlayDbWWGame.groupId, `*List Player dan Role*\n\n${textListAllPlayerAndRole}`)

            await remSendInitialize(rem, isJadibot, idJadibot, 'groupSettingUpdate', wwPlayDbWWGame.groupId, 'not_announcement')
            return global.ww.splice(position, 1)
        }

        await sleep(5000)
        return stateWWGame_night(id, rem, isJadibot, idJadibot)
    }

    // Function to start a new TOD game
    if (!global.todTimeouts) {
        global.todTimeouts = {}
    }

    async function startTodGame(rem, gameId, prefix) {
        try {
            const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { content: { $elemMatch: { id: gameId } } })
            const game = game0?.content[0]
            if (!game) return { success: false, message: "Game tidak ditemukan" }

            if (game.players.length < 2) {
                return { success: false, message: "Minimal diperlukan 3 pemain untuk memulai permainan" }
            }

            await _mongo_CommandSchema.updateOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { $set: { 'content.$.status': 'playing', 'content.$.remainingPlayers': game.players } })
            
            await rem.sendText(game.from, `*🎮 TRUTH OR DARE DIMULAI! 🎮*\n\nPemain: ${game.players.length} orang\n\nPermainan akan segera dimulai...`)
            
            // Select first player after a short delay
            setTimeout(() => {
                selectNextTodPlayer(rem, gameId, prefix)
            }, 2000)
            
            return { success: true }
        } catch (error) {
            console.error("Error starting TOD game:", error)
            return { success: false, message: "Terjadi kesalahan saat memulai permainan" }
        }
    }

    // Function to select the next player
    async function selectNextTodPlayer(rem, gameId, prefix) {
        try {
            // const game = global.todGames[gameId]
            const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { content: { $elemMatch: { id: gameId } } })
            const game = game0?.content[0]
            if (!game) return

            // If no players left in rotation, reset the remaining players list
            if (game.remainingPlayers.length === 0) {
                // game.remainingPlayers = [...game.players]
                await _mongo_CommandSchema.updateOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { $set: { 'content.$.remainingPlayers': game.players } })
                game.players = game.players.sort(() => Math.random() - 0.5)
                game.remainingPlayers = game.players
            }

            // Randomly select a player from remaining players
            const randomIndex = Math.floor(Math.random() * game.remainingPlayers.length);
            const selectedPlayerId = game.remainingPlayers[randomIndex]
            
            // Remove selected player from remainingPlayers
            // game.remainingPlayers.splice(randomIndex, 1)
            
            // game.currentPlayer = selectedPlayerId
            // game.lastActionTime = Date.now()
            await _mongo_CommandSchema.updateOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { $set: { 'content.$.currentPlayer': selectedPlayerId, 'content.$.lastActionTime': Date.now() }, $pull: { 'content.$.remainingPlayers': selectedPlayerId } })
            // Get player name
            const selectedPlayerNumber = selectedPlayerId.split('@')[0]
            
            // Send message to group that player has been selected
            await rem.sendText(game.from, `*🎮 TRUTH OR DARE 🎮*\n\n@${selectedPlayerNumber} telah terpilih!\nSilahkan pilih *TRUTH* atau *DARE*?\n\nWaktu: 2 menit`, { mentions: [selectedPlayerId] })
            
            // Send buttons to the player
            const buttons = [
                { id: `${prefix}todans truth ${gameId}`, text: '*TRUTH*' },
                { id: `${prefix}todans dare ${gameId}`, text: '*DARE*' }
            ]
            
            await rem.sendButtons(
                game.from,
                'Pilih salah satu:',
                buttons,
                '',
                '',
                {},
                { mentions: [selectedPlayerId] }
            )
            
            // Set timeout for player's response
            global.todTimeouts[selectedPlayerId] = setTimeout(() => {
                handleTodTimeout(rem, gameId, selectedPlayerId, prefix)
            }, 2 * 60 * 1000) // 2 minutes timeout

            
        } catch (error) {
            console.error("Error selecting next TOD player:", error)
        }
    }

    // Handle timeout for player not answering
    async function handleTodTimeout(rem, gameId, playerId, prefix) {
        try {
            // const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { from: from } } }, { content: { $elemMatch: { from: from } } } )
            const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { content: { $elemMatch: { id: gameId } } })
            const game = game0?.content[0]
            if (!game) return
            
            // Check if this player is still the current player
            if (game.currentPlayer !== playerId) return
            
            const playerNumber = playerId.split('@')[0]
            
            // Inform the group that player didn't respond
            await rem.sendText(game.from, `*⏰ WAKTU HABIS! ⏰*\n\n@${playerNumber} tidak menjawab dan dikeluarkan dari permainan.\nDenda: 100,000 💰`, { mentions: [playerId] })
            
            // Remove player from game
            // const playerIndex = game.players.indexOf(playerId)
            // if (playerIndex > -1) {
            //     game.players.splice(playerIndex, 1)
            // }
            await _mongo_CommandSchema.updateOne({ cId: 'tod', 'content.id': game.id }, { $pull: { 'content.$.players': playerId } })
            await _mongo_CommandSchema.updateOne({ cId: 'tod', 'content.id': game.id }, { $pull: { 'content.$.remainingPlayers': playerId } })

            // Deduct money from player
            await MinMoney(playerId, 100000)
            
            // Check if game can continue
            if (game.players.length < 3) {
                await rem.sendText(game.from, `*🛑 PERMAINAN BERAKHIR 🛑*\n\nJumlah pemain kurang dari 3 orang.`)
                await _mongo_CommandSchema.updateOne({ cId: 'tod' }, { $pull: { content: { id: game.id } } })
                // delete global.todGames[gameId]

                return
            }
            
            // Continue with next player
            continueTodGame(rem, gameId, prefix)
            
        } catch (error) {
            console.error("Error handling TOD timeout:", error)
        }
    }

    // Continue the game after a player has answered
    async function continueTodGame(rem, gameId, prefix) {
        try {
            // const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { from: from } } }, { content: { $elemMatch: { from: from } } } )
            const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { content: { $elemMatch: { id: gameId } } })
            const game = game0?.content[0]
            if (!game) return
            
            // Clear any existing timeout for the current player

            if (global.todTimeouts[game.currentPlayer]) {
                clearTimeout(global.todTimeouts[game.currentPlayer])
                delete global.todTimeouts[game.currentPlayer]
            }
            
            // Select the next player after a delay
            setTimeout(() => {
                selectNextTodPlayer(rem, gameId, prefix)
            }, 3000)
            
        } catch (error) {
            console.error("Error continuing TOD game:", error)
        }
    }

    // Handle player choice (Truth or Dare)
    async function handleTodChoice(rem, from, sender, gameId, selectedChoice, prefix) {
        try {
            console.log('c')
            const game0 = await _mongo_CommandSchema.findOne({ cId: 'tod', content: { $elemMatch: { id: gameId } } }, { content: { $elemMatch: { id: gameId } } })
            const game = game0?.content[0]
            if (!game) {
                return rem.sendText(from, "Game tidak ditemukan.")
            }
            
            // Check if sender is the current player
            if (game.currentPlayer !== sender) {
                return rem.sendText(from, "Bukan giliranmu untuk menjawab.")
            }
            
            // Clear timeout for this player

            // if (global.todTimeouts[sender]) {
            //     clearTimeout(global.todTimeouts[sender])
            //     delete global.todTimeouts[sender]
            // }

            // Get questions from database
            const todData0 = await _mongo_CommandSchema.findOne({ cId: 'tod' }, { options: 1 })
            const todData = todData0?.options
            
            const questions = todData[`questions${[capitalizeFirstLetter(selectedChoice)]}`]
            const playerNumber = sender.split('@')[0]
            const buttonAnswerReply = [
                // { id: `${prefix}todans ${selectedChoice} ${gameId}`, text: `*${selectedChoice.toUpperCase()}*` },
                { id: `${prefix}todanschoice ${selectedChoice} ${gameId}`, text: 'Jawab' }
            ]

            if (selectedChoice === 'truth') {
                // Select random truth question
                const truthQuestion = questions[Math.floor(Math.random() * questions.length)]
                await rem.sendButtons(from, `*🔵 TRUTH 🔵*\n\n@${playerNumber} memilih TRUTH!\n\nPertanyaan: *${truthQuestion}*\n\nSilahkan jawab dalam 10 menit...`, buttonAnswerReply, '', '', {}, { mentions: [sender] })


            } else if (selectedChoice === 'dare') {
                // Select random dare challenge
                const dareChallenge = questions[Math.floor(Math.random() * questions.length)]
                await rem.sendButtons(from, `*🔴 DARE 🔴*\n\n@${playerNumber} memilih DARE!\n\nTantangan: *${dareChallenge}*\n\nSilahkan lakukan dalam 10 menit...`, buttonAnswerReply, '', '', {}, { mentions: [sender] })
            }
            
            // Set timeout for player to respond to truth/dare
            global.todTimeouts[sender] = setTimeout(() => {
                handleTodTimeout(rem, gameId, sender, prefix)
            }, 10 * 60 * 1000) // 10 Minutes

            // Add collector for next message

            await addCollectorMessage(from, `${prefix}todanschoice ${gameId}`, (Date.now() + 10 * 60 * 1000))
        } catch (error) {
            console.error("Error handling TOD choice:", error)
            await rem.sendText(from, "Terjadi kesalahan saat memproses pilihan.")
        }
    }


    //FUNCTION ANTISIDER
    const setMcount = (groupId, time) => {
        const obj = { id: groupId, time: Date.now() + toMs(time), set: '-' }
        global.db['./lib/database/group/antisider/sider.json'].push(obj)
    }
    
    const setMcountData = (groupId, userId) => {
        if(global.db[`./lib/database/group/antisider/database/${groupId}.json`] == undefined) global.db[`./lib/database/group/antisider/database/${groupId}.json`] = JSON.parse(fs.readFileSync(`./lib/database/group/antisider/database/${groupId}.json`))
        const obj = { id: userId, msg: 0, last: '-'}
        global.db[`./lib/database/group/antisider/database/${groupId}.json`].push(obj)
    }
    
    const addMcountData = (groupId, userId) => {
        if(global.db[`./lib/database/group/antisider/database/${groupId}.json`] == undefined) global.db[`./lib/database/group/antisider/database/${groupId}.json`] = JSON.parse(fs.readFileSync(`./lib/database/group/antisider/database/${groupId}.json`))
        let position = global.db[`./lib/database/group/antisider/database/${groupId}.json`].findIndex(object => object.id == userId)
        if (position !== -1) {
            global.db[`./lib/database/group/antisider/database/${groupId}.json`][position].msg += 1
        }
    }

    const replaceLastMsg = (groupId, userId, last) => {
        if(global.db[`./lib/database/group/antisider/database/${groupId}.json`] == undefined) global.db[`./lib/database/group/antisider/database/${groupId}.json`] = JSON.parse(fs.readFileSync(`./lib/database/group/antisider/database/${groupId}.json`))
        let position = global.db[`./lib/database/group/antisider/database/${groupId}.json`].findIndex(object => object.id == userId)
        if (position !== -1) {
            global.db[`./lib/database/group/antisider/database/${groupId}.json`][position].last = last
        }
    }

    const replaceSiderSet = (groupId, setting) => {
        let position = global.db['./lib/database/group/antisider/sider.json'].findIndex(object => object.id == groupId)
        if (position !== -1) {
            global.db['./lib/database/group/antisider/sider.json'][position].set = setting
        }
    }

    const getMcountDataGroupSet = (groupId) => {
        let _sider = global.db['./lib/database/group/antisider/sider.json']
        let position = global.db['./lib/database/group/antisider/sider.json'].findIndex(object => object.id == groupId)
        if (position !== -1) {
            return _sider[position].set
        }
    }

    const getMcountData = (userId, groupId) => {
        if(global.db[`./lib/database/group/antisider/database/${groupId}.json`] == undefined) global.db[`./lib/database/group/antisider/database/${groupId}.json`] = JSON.parse(fs.readFileSync(`./lib/database/group/antisider/database/${groupId}.json`))
        const countMData = global.db[`./lib/database/group/antisider/database/${groupId}.json`]
        let position = global.db[`./lib/database/group/antisider/database/${groupId}.json`].findIndex(object => object.id == userId)
        if (position !== -1) {
            return countMData[position].msg
        }
    }

    const getMcountDataId = (sider, _dir) => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (_dir[i].msg < sider) {
                position = i
            }
        })
        if (position !== null) {
            var i;
            for(i=0;i<_dir.length;i++){
                if(_dir[i].msg < sider){
                    //console.log(_dir[i].id)
                    return(_dir[i].id);
                }
            }
            //return Object.keys(_dir[position].id);
           // return _dir[position].id
        }
    }

    /*const getMcountLastData = (userId, _dir) => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (_dir[i].id === userId) {
                position = i
            }
        })
        if (position !== null) {
            return _dir[position].last
        }
    }*/

    const getMCountPosition = (groupId) => {
        let position = global.db['./lib/database/group/antisider/sider.json'].findIndex(object => object.id == groupId)
        if (position !== -1) {
            return position
        }
    }
          
    //FUNCTION JOIN
    const addJoinTime = async (groupId, time, key) => {
        const obj = { time: Date.now() + toMs(time), key: key, isChecked: false }
        await _mongo_GroupSchema.updateOne({ iId: groupId }, { $set: { join: obj } })
    }

    const getJoinGroup = (_groupDb) => {
        return _groupDb.join
    }
    /*const getJoinKey = (groupId) => {
        const _join = JSON.parse(fs.readFileSync('./lib/database/group/join.json'))
        let position = null
        Object.keys(_join).forEach((i) => {
            if (_join[i].id === groupId) {
                position = i
            }
        })
        if (position !== null) {
            return _join[position].key
        }
    }
    const getJoinTime = (groupId) => {
        const _join = JSON.parse(fs.readFileSync('./lib/database/group/join.json'))
        let position = null
        Object.keys(_join).forEach((i) => {
            if (_join[i].id === groupId) {
                position = i
            }
        })
        if (position !== null) {
            return _join[position].time
        }
    }
    const getJoinId = (groupId) => {
        const _join = JSON.parse(fs.readFileSync('./lib/database/group/join.json'))
        let position = null
        Object.keys(_join).forEach((i) => {
            if (_join[i].id === groupId) {
                position = i
            }
        })
        if (position !== null) {
            return _join[position].id
        }
    }*/

    const adduserKeyTime = async (userId, time) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "item.joinkey": Date.now() + toMs(time) } })
    }

    const getuserKeyId = (_userDb) => {
        let _joinclaimed = _userDb.item.joinkey
        if (_joinclaimed != 0) {
            return _joinclaimed
        }
    }

    //RANDOM
    function GenerateRandomNumber(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Generates a random alphanumberic character
    function GenerateRandomChar() {
        var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
        var randomNumber = GenerateRandomNumber(0,chars.length - 1);
        return chars[randomNumber];
    }
    function GenerateSerialNumber(mask){
        var serialNumber = "";
        if(mask != null){
            for(var i=0; i < mask.length; i++){
                var maskChar = mask[i];
                serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
            }
        }
        return serialNumber;
    }

    const addTimeBackup = (time) => {
        const obj = { time: Date.now() + toMs(time) }
        global.db['./lib/database/bot/backup.json'].push(obj)
    }
    
    /**
     * description: ban with time
     * @param {String} userId
     * @param {Number} time - h = hours, d = days, m = minutes, s = seconds
     * @param {String} reason - optional
     */
    const setTempBan = async (_userDb, time, reason, listCmdBan = [], senderBanned) => {
        let formattedTime = 0
        if(_userDb.timeBanned > 0) {
            formattedTime = _userDb.timeBanned + toMs(time)
        } else {
            formattedTime = Date.now() + toMs(time)
        }
        return await _mongo_UserSchema.updateOne({ iId: _userDb.iId }, { $set: listCmdBan.length > 0 ? { timeBanned: formattedTime, listCmdBan, bannedReason: reason, senderBanned } : { timeBanned: formattedTime, isBanned: true, bannedReason: reason, senderBanned } })
    }
    
    const getTempBanUser = (_userDb) => {
        if (_userDb.timeBanned != 0) {
            return _userDb.timeBanned
        }
    }

    const addWarn = async (userId, reason, count = null) => {
        const _userDb = await _mongo_UserSchema.findOne({ iId: userId })
        
        let newCount = 1
        if (_userDb?.rl?.warning?.count) {
            newCount = count !== null ? count : _userDb.rl.warning.count + 1
        }
        
        const obj = { 
            isWarn: true, 
            reason: reason || 'No reason', 
            count: newCount
        }
        
        return await _mongo_UserSchema.updateOne(
            { iId: userId }, 
            { $set: { "rl.warning": obj } } 
        )
    }

    const getWarn = (_userDb) => {
        return _userDb.rl?.warning || {
            isWarn: false,
            reason: '',
            count: 0
        }
    }
    
    const removeWarn = async (userId) => {
        const obj = { 
            isWarn: false, 
            reason: '', 
            count: 0
        }
            
        return await _mongo_UserSchema.updateOne(
            { iId: userId }, 
            { $set: { "rl.warning": obj } }
        )
    }

    //
    function numberWithCommas(x) {
        if(global?.isFalseCommas?.includes(senderFunction)) return x.toString()
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function numberWithCommas2(x) {
        return x.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ".");
    }
    const addHitsCount = (parameter) => {
        _mongo_BotSchema.updateOne({ iId: "CORE" }, { $inc: { ["hits." + parameter]: 1, ["hits." + parameter]: 1 } })
    }

    const getHitsCount = (parameter, _botDb) => {
        return _botDb.hits[parameter]
    }
    
    const clacSize_kb = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function GIGA (a,c,b) {c=Math.pow(10,c);a=Math.round(a*c)/c;(void 0===b?0:b)&&999<a&&(b=a.toString().replace(/(\\.[0-9]+)$/,""),b=b.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,","),a=-1!=a.toString().search(/([,0-9]+\\.)/)?a.toString().replace(/([,0-9]+\\.)/,b+"."):b);return a}

    function bytestobits(input) {
        return GIGA(Number(input) * 8, 4);
    }

//SCRAPER    
//Zippy
//const _proggers = require('cli-progress'),
const GetLink = async (u) => {
    console.log('⏳  ' + `Get Page From : ${u}`)

    const sendToPuppeteerZippy = `module.exports = async (browser, res, req) => {
        const page = await browser.newPage();

        await page.goto('${u}', { waitUntil: 'networkidle0' });

        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        await page.close();

        return data
    }`

    const zippy = (await requestPuppeteer(sendToPuppeteerZippy)).result
    if(zippy.error) return { error: true, message: 'Failed fetch page' }

    console.log('✅  ' + 'Done')
    const $ = cheerio.load(zippy)
    if (!$('#dlbutton').length) {
        return { error: true, message: $('#lrbox>div').first().text().trim() }
    }
    console.log('⏳  ' + 'Fetch Link Download...')
    const filename = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(4)').text()
    // const url = _url.parse($('.flagen').attr('href'), true)
    const urlori = $('meta[property="og:url"]').attr('content').split('/')[2]
    // const key = url.query['key']
    // let time;
    // let dlurl;
    // try {
    //     time = /var b = ([0-9]+);$/gm.exec($('#dlbutton').next().html())[1]
    //     dlurl = 'http:' + '//' + urlori + '/d/' + key + '/' + (2 + 2 * 2 + parseInt(time)) + '3/DOWNLOAD'
    // } catch (error) {
    //     time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($('#dlbutton').next().html())[1])
    //     dlurl = 'http:' + '//' + urlori + '/d/' + key + '/' + (time) + '/DOWNLOAD'
    // }

    // let getId = $('#lrbox > div:nth-child(2) > div:nth-child(2) > div > script').text()
    // getId = getId.replace("var d = document.getElementById('omg').getAttribute('class');", `var d = ${$('#omg').attr('class')}`)
    // getId = getId.replace("document.getElementById('dlbutton').href", "dlurl")
    // getId = getId.split("if (document.getElementById('fimage'))")[0]
    // eval(getId)

    console.log('✅  ' + 'Done')
    return { error: false, url: `http://${urlori}${$(`a#dlbutton`).attr('href')}`, name: filename }
}
//END
//Racaty
const getLinkRacaty = async (url, isFollow = false) => {
    console.log('a')
    if(isFollow) {
        const tempGetPage = await axios.get(url)
        const $ = cheerio.load(tempGetPage.data)
        url = $('a.abutton.copy').attr('data-clipboard-text')
        if(url == undefined) return { error: true, errId: 'deleted' }
    }

    const tempGetPage = await axios.get(url)
    url = tempGetPage.request.res.responseUrl.replace('.com', '.io')
    console.log(url, url.split('/')[3])

    try {
        console.log('b')
        const formdata = new FormData()
        formdata.append('op', 'download2')
        formdata.append('id', url.split('/')[3])
        formdata.append('rand', '')
        formdata.append('referer', '')
        formdata.append('method_free', '')
        formdata.append('method_premium', '')
        
        let result = undefined
        const fetchRequest = await fetch(url, {
            method: "POST",
            body: formdata,
            headers: formdata.getHeaders() 
        })
        const resTextFetch = await fetchRequest.text()
        const $ = cheerio.load(resTextFetch)
        if($('a#uniqueExpirylink').attr('href') == undefined) return { error: true, errId: 'missingTagHtml' }
        result =  { error: false, title: $('div.name > strong').text().trim(), link: $('a#uniqueExpirylink').attr('href') }
        console.log($('a#uniqueExpirylink').attr('href'))

        return result
    } catch (err) {
        console.error(err)
        return { error: true, errId: 'unknown', err: err }
    }
}

async function getBufferMega (url, isFollow = false) {
    if(isFollow) {
        const tempGetPage = await axios.get(url)
        url = tempGetPage.request._redirectable._options.href
    }

    try {
        const file = megajs.File.fromURL(url)

        const attrMega = await file.loadAttributes()
        const data = await file.downloadBuffer()

        return { error: false, attrMega, data }
    } catch (err) {
        console.error(err)
        return { error: true, err }
    }
}

/**
 * @param {String} url
 * https://otakufiles.net/
 */
async function getBufferOtakuFiles (url, isFollow = false) {
    const tempGetPage = await axios.get(url)
    if(tempGetPage.data.includes('No such file with this filename')) return { error: true, errId: 'deleted' }

    try {
        const formdata = new FormData()
        formdata.append('op', 'download2')
        formdata.append('id', url.split('/')[3].split('/')[0].trim())
        formdata.append('rand', '')
        formdata.append('referer', '')
        formdata.append('method_free', '')
        formdata.append('method_premium', '')

        const $ = cheerio.load(tempGetPage.data)
        const titleOtakuFiles = $('div.dfile > span.dfilename').text().trim()
        
        let requestAxios = await axios({
            method: "post",
            url: url,
            data: formdata,
            headers: formdata.getHeaders(),
            responseType: 'arraybuffer'
        })

        return { error: false, title: titleOtakuFiles, data: requestAxios.data }
    } catch (err) {
        console.error(err)
        return { error: true, errId: 'unknown', err: err }
    }
}

//YT
function post(url, formdata) {
    return fetch(url, {
      method: 'POST',
      headers: {
        accept: "*/*",
        'accept-language': "en-US,en;q=0.9",
        'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: new URLSearchParams(Object.entries(formdata))
    })
  }
  async function yt(url, quality, type, bitrate) { //THANKS Nurutomo
    const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
    const server0 = [`id`/*, `en60`, `en61`*/]
    const server = server0[Math.floor(Math.random() * (server0.length))]
    let ytId = ytIdRegex.exec(url)
    if(url.includes('/shorts/')) {
        url = url
        var ytId2 = url.split('/')[4].split('?')[0]
    } else {
        url = 'https://youtu.be/' + ytId[1]
        var ytId2 = ytId[1]
    }
    let res = await post(`https://www.y2mate.com/mates/${server}/analyze/ajax`, {
      url,
      q_auto: 0,
      ajax: 1
    })
    let json = await res.json()
    let { document } = (new JSDOM(json.result)).window
    let tables = document.querySelectorAll('table')
    let table = tables[{ mp4: 0, mp3: 1 }[type] || 0]
    let list
    switch (type) {
      case 'mp4':
        list = Object.fromEntries([...table.querySelectorAll('td > a[href="#"]')].filter(v => !/\.3gp/.test(v.innerHTML)).map(v => [v.innerHTML.match(/.*?(?=\()/)[0].trim(), v.parentElement.nextSibling.nextSibling.innerHTML]))
        break
      case 'mp3':
        list = {
          '128kbps': table.querySelector('td > a[href="#"]').parentElement.nextSibling.nextSibling.innerHTML
        }
        break
      default:
        list = {}
    }
    let filesize = list[quality]
    let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
    let thumb = document.querySelector('img').src
    let title = document.querySelector('b').innerHTML
    let res2 = await post(`https://www.y2mate.com/mates/convert`, {
      type: 'youtube',
      _id: id[1],
      v_id: ytId2,
      ajax: '1',
      token: '',
      ftype: type,
      fquality: bitrate
    })
    let json2 = await res2.json()
    let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
    return {
      dl_link: /<a.+?href="(.+?)"/.exec(json2.result)[1],
      thumb,
      title,
      filesizeF: filesize,
      filesize: KB
    }
  }

async function yt2 (url) {
    const response = await axios.post('https://x2mate.com/api/ajaxSearch', { q: url, vt: 'home' })
    if(response.data.vid == undefined) return { err: true }

    return response.data
}

//END            
const getWebUser = (senderid) => {
    const _userWeb = global.db['./lib/database/web/user.json']
    let position = global.db['./lib/database/web/user.json'].findIndex(object => object.id == senderid)
    if (position !== -1) {
        return _userWeb[position]
    } else {
        return position
    }
}

const setWebUser = (Userid, pwd) => {
    const obj = { id: Userid.replace('@c.us', ''), password: pwd }
    global.db['./lib/database/web/user.json'].push(obj)
}

const addCodeRedeem = async (payload) => {
    const validatedTypeReward = payload.reward.map(all => all.type)
    if(validatedTypeReward.includes('push') || validatedTypeReward.includes('add') || validatedTypeReward.includes('set')) {
        await _mongo_UserSchema.updateOne({ iId: payload.from }, { $inc: { "limit.createredeem": 1 } })
        // return await _mongo_BotSchema.updateOne({ iId: 'redeemDb' }, { $push: { "listRedeem": payload } })
        return await _mongo_RedeemSchema.create(payload)
    } else {
        console.log({ error: true, errId: 'l/export/AsyncFunctions.addCodeRedeem.else.return', err: 'Invalid type reward, type must: ["push", "add", "set"]' })
        return { error: true, errId: 'l/export/AsyncFunctions.addCodeRedeem.else.return', err: 'Invalid type reward, type must: ["push", "add", "set"]' }
    } 
}

const getRedeemed = (_redeemDb, userId) => {
    return _redeemDb.claimedBy.includes(userId)
}

const addUserRedeemed = async (kode, userId) => {
    // await _mongo_BotSchema.updateOne({ iId: 'redeemDb', "listRedeem.code": kode }, { $inc: { "listRedeem.$.claimed": 1 }, $push: { "listRedeem.$.claimedBy": userId } })
    await _mongo_RedeemSchema.updateOne({ code: kode }, { $inc: { claimed: 1 }, $push: { claimedBy: userId } })
}

//GiveLimit
const setLimitGive_invest = async (userId) => {
    await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "limit.lgivein": [] } })
}

const getLimitGive_invest = (_userDb, to) => {
    const _limitGiveInvest = _userDb.limit.lgivein
    if (JSON.stringify(_limitGiveInvest) != '[]') {
        let _limitGiveIsAda = 'false'
        for (let a = 0; a < _limitGiveInvest.length; a++) {
            if(_limitGiveInvest[a].id == to) {
                _limitGiveIsAda = a
            }
        }
        return { idgivein: _limitGiveIsAda }
    } else {
        return { idgivein: 'false' }
    }
}

const addLimitGive_invest = async (_userDb, userId, to, amount) => {
    const _limitGiveInvest = _userDb.limit.lgivein
    if (JSON.stringify(_limitGiveInvest) != '{}') {
        let _limitGiveIsAda = 'false'
        for (let a = 0; a < _limitGiveInvest.length; a++) {
            if(_limitGiveInvest[a].id == to) {
                _limitGiveIsAda = a
            }
        }
        console.log(_limitGiveIsAda)
        if(_limitGiveIsAda != 'false') {
            // { limit: { lgivein: { id: 'XXX', limit: 90 }] } }
            await  _mongo_UserSchema.updateOne({ iId: userId, "limit.lgivein.id": to }, { $inc: { "limit.lgivein.$.limit": amount } })
        } else {
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "limit.lgivein": { id: to, limit: amount } } })
        }
    }
}

//Get and Set Zerochan Cache
const setZerochan_cache = async (waifu, value) => {
    const obj = { waifu: waifu, array: value }
    await _mongo_CommandSchema.updateOne({ cId: 'zerochan' }, { $push: { "content": obj } }, { upsert: true })
}

const getZerochan_cache = (value, _db) => {
    let position = _db.content.findIndex(object => object.waifu == value)
    if (position !== -1) {
        return position
    }
}

//ROLEPLAY
    //Makan Bang
    const setUserMakanan = async (userId) => { //crid = current Rumah Id || orid = own Rumah Id
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { rl: { food: 100, stamina: 100 } } })
    }

    const getUserMakan = (_userDb) => {
        return { food: _userDb.rl.food, stamina: _userDb.rl.stamina }
    }

    const replaceUserMakan = async  (userId, input, value) => {
        await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ["rl." + input]: value } })
    }

    const minUserMakan = async (_userDb, userId, input, value) => {
        const _makan = _userDb.rl[input]
        const calculateValueInput = Math.floor(_makan - value)
        if(calculateValueInput <= 0) {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ["rl." + input]: 0 } })
        } else {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { ["rl." + input]: -value } })
        }
    }

    const addUserMakan = async (_userDb, userId, input, value) => {
        const _makan = _userDb.rl[input]
        const calculateValueInput = Math.floor(_makan + value)
        if(calculateValueInput >= 200) {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ["rl." + input]: 200 } })
        } else {
            await _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { ["rl." + input]: value } })
        }
    }

    //Rumah
const setUserRoleplay_rumah = async (userId, lahanid, rumahid, rumahnumber) => { //crid = current Rumah Id || rid = Nomor Rumah/Alamat || lahan = Lahan Ya Lahan
    let obj = { crid: rumahid, rid: rumahnumber, lahan: lahanid, autolistrik: 'true', listrikstatus: 'dibayar', lastlistrikbayar: [] }
    await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.rumah": obj } })
}

const getUserRoleplay_rumah = (_userDb) => {
    let _rumah = _userDb.rl.rumah
    if (JSON.stringify(_rumah) != '{}') {
        return _rumah
    }
}

const replaceUserRoleplay_rumah = async (userId, lahanid, rumahid, rumahnumber) => {
    await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.rumah": { crid: rumahid, rid: rumahnumber, lahan: lahanid } } })
}

/*const addUserRoleplay_rumah = (userId, rumahid) => {
    const _rumah = JSON.parse(fs.readFileSync('./lib/database/user/rl/rumah.json'))
    let position = false
        Object.keys(_rumah).forEach((i) => {
        if (_rumah[i].id === userId) {
            position = i
        }
    })
    if (position !== false) {
        _rumah[position].orid.push(rumahid)
        fs.writeFileSync('./lib/database/user/rl/rumah.json', JSON.stringify(_rumah))
    }
}*/

    const setUserRoleplay_mobil = async (userId, mobilId) => { //crid = current Rumah Id || rid = Nomor Rumah/Alamat || lahan = Lahan Ya Lahan || orid = own Rumah Id
        let obj = { id: mobilId, condition: 100, modif: [] }
        await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.mobil": { listMobil: [obj] } } })
    }

    const getUserRoleplay_mobil = (_userDb) => {
        let _mobil = _userDb.rl.mobil
        if (JSON.stringify(_mobil) != '{}') {
            return _mobil
        }
    }

    const getUserRoleplay_listMobil = (_userDb) => {
        let _mobil = _userDb.rl?.mobil?.listMobil
        if (JSON.stringify(_mobil) != '{}') {
            return _mobil
        }
    }

    const addUserRoleplay_mobil = async (userId, mobilId) => {
        await _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "rl.mobil.listMobil": { id: mobilId, condition: 100, modif: [] } } })
    }

    const selectRoleplay_mobilUtama = async (userId, mobilId) => {
        await _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.mobil.selected": mobilId } })
    }

    /**
     * description: add modif mobil
     * @param {String} userId
     * @param {String} mobilId
     * @param {Object} modif
     * 
     * @example modif Object
     * {
     *    id: 'XXXXXXX',
     *    name: 'Turbo',
     *    stats: [{ type: 'add or set', stats: 'speed', value: 100 or -100 }]
     * }
     */
    const addUserRoleplay_mobilModif = async (userId, mobilId, modif) => {
        await _mongo_UserSchema.updateOne({ iId: userId, "rl.mobil.listMobil.id": mobilId }, { $push: { "rl.mobil.listMobil.$.modif": modif } })
    }

    const calculateMobilModif = (carDatabaseModif, _mobil) => {
        let carSpecs = carDatabaseModif[_mobil.id]
        let carModif = _mobil.modif

        for (let i = 0; i < carModif.length; i++) {
            for (let j = 0; j < carModif[i].stats.length; j++) {
                let stat = carModif[i].stats[j]
                if(stat.type === 'add') {
                    // stats[stat.stats] += stat.value
                    carSpecs[stat.stats] += stat.value
                } else if(stat.type === 'set') {
                    carSpecs[stat.stats] = stat.value
                }
            }
        }

        return carSpecs
    }

    const metersToKm = (meters) => {
        return meters / 1000
    }

    const kmHrMSec = (kmHr) => {
        // 1km == 1000m
        return (kmHr * 1000) / 3600
    }
    
    // km/h to m/s
    const kmHrToMSec = (kmHr) => {
        return kmHr / 3.6
    }

    // convert px/s to km/h
    const pxToMeters = (px) => {
        // 1km == 1000m
        let meterAsPx = 1 * 100;
        return (px * 1) / meterAsPx;
    }
    

    //Mantan
    const setUserRoleplayMantan_pasangan = async (userId, mal_id) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.mantan": [mal_id] } })
    }

    const getUserRoleplayMantan_pasangan = (_userDb) => {
        let _mantan = _userDb.rl.mantan
        if (JSON.stringify(_mantan) != '[]') {
            return _mantan
        }
    }

    const addUserRoleplayMantan_pasangan = async (userId, textId) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "rl.mantan": textId } })
    }

    //Pasangan
    /* 
    mal = url Myanimelist
    img = url Image
    nama = Nama Character
    hubungan = Persen Keharmonisan/Keromantisan
    status = Pacaran | Menikah | Berkeluarga.<jumlah anak>.<gender anak> (Untuk Visual Text)
    status2 = none | Hamil.<umur>
    anak = ID anak, anak, lahir sejak, gender
            {id: XXXXXXXXX, nama: 'blablaba', lahir: <format Date.now()>, gender: 'Cowo/Cewe'}
    nkkand = Anak lahir Perlu Confirm
            {id: XXXXXXXXX, lahir: <format Date.now()>, gender: 'Cowo/Cewe'}
    */  
    const setUserRoleplay_pasangan = async (userId, nama, gender, imgUrl, MALid, MALurl) => {
        let obj = { nama: nama, gender, umurpd: Date.now(), img: imgUrl, mal_id: MALid, mal_url: MALurl, level: 0, xp: 0, food: 100, hubungan: 6, uang: 0, status: 'Pacaran', status2: 'none', anak: [], nkkand: [] }
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd": obj } })
    }
    
    const getUserRoleplay_pasangan = (_userDb) => {
        let _pasangan = _userDb.rl?.pd
        if(_pasangan?.mal_id == undefined) return undefined
        if (JSON.stringify(_pasangan) != '{}') {
            return _pasangan
        }
    }
    
    const addUserRoleplayXP_pasangan = async (userId, amount) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "rl.pd.xp": amount } })
    }

    const addUserRoleplayLevel_pasangan = async (userId, amount) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $inc: { "rl.pd.level": amount } })
    }

    const replaceUserRoleplayFood_pasangan = async (userId, CalculateAmount) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.food": CalculateAmount } })
    }

    const multiplierHubunganBurukMin = 0.9
    const replaceUserRoleplayHubungan_pasangan = async (userId, CalculateAmount) => {
        const _pasangan = await _mongo_UserSchema.findOne({ iId: userId })
        let pd = _pasangan.rl.pd
        if (JSON.stringify(pd) != '{}') {

            // if((pd.hubungan < CalculateAmount) && pd.mood === 'Buruk 😡') {
            //     CalculateAmount = Math.floor(CalculateAmount * multiplierHubunganBurukMin)
            // }

            if(pd.status == 'Pacaran') {
                if(CalculateAmount >= 100) {
                    var inputDataValue = 100
                } else {
                    var inputDataValue = CalculateAmount
                }
            } else if(pd.status == 'Menikah') {
                if(CalculateAmount >= 300) {
                    var inputDataValue = 300
                } else {
                    var inputDataValue = CalculateAmount
                }
            } else if(pd.status.startsWith('Berkeluarga')) {
                if(CalculateAmount >= 500) {
                    var inputDataValue = 500
                } else {
                    var inputDataValue = CalculateAmount
                }
            } else {
                if(CalculateAmount >= 100) {
                    var inputDataValue = 100
                } else {
                    var inputDataValue = CalculateAmount
                }
            }
            await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.hubungan": inputDataValue } })
        }
    }

    const replaceUserRoleplayMood_pasangan = async (userId, change) => {
        if(!['Buruk 😡', 'Biasa 😐', 'Baik 😊'].includes(change)) return

        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.mood": change } })
    }

    const replaceUserRoleplayHubungan_pasangan_force = async (userId, CalculateAmount) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.hubungan": CalculateAmount } })
    }

    const replaceUserRoleplayUang_pasangan = async (userId, CalculateAmount) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.uang": CalculateAmount } })
    }

    const replaceUserRoleplayStatus_pasangan = async (userId, text) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.status": text } })
    }

    const replaceUserRoleplayStatus2_pasangan = async (userId, text) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "rl.pd.status2": text } })
    }

    const replaceUserRoleplayValue_pasangan = async (userId, input, textOrNumber) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { ["rl.pd." + input]: textOrNumber } })
    }

    /*const addUserRoleplayAnakKandungan_pasangan = (userId, waktu) => {
        const _pasangan = JSON.parse(fs.readFileSync('./lib/database/user/rl/pasangan.json'))
        let position = false
        Object.keys(_pasangan).forEach((i) => {
            if (_pasangan[i].id === userId) {
                position = i
            }
        })
        if (position !== false) {
            _pasangan[position].nkkand.push({ id: GenerateSerialNumber("000000000000000"), status: 'kandungan', time: waktu, ttllahir: '' })
            fs.writeFileSync('./lib/database/user/rl/pasangan.json', JSON.stringify(_pasangan))
        }
    }

    const getUserRoleplayAnakKandungan_pasangan = (id) => {
        const _pasangan = JSON.parse(fs.readFileSync('./lib/database/user/rl/pasangan.json'))
        let position = false
        Object.keys(_pasangan).forEach((i) => {
            if (_pasangan.nkkand[i].id === userId) {
                position = i
            }
        })
        if (position !== false) {
            return position
        }
    }*/

    const addUserRoleplayAnak_pasangan = async (userId, idAnak, nama, waktuLahir, gender) => {
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $addToSet: { "rl.pd.anak": { id: idAnak, nama: nama, lahir: waktuLahir, gender: gender } } })
    }

    //BUGREPORT
    const addBugReport = (from, time, bug) => {
        let obj = { from: from, time: time, bug: bug }
        global.db['./lib/database/bot/bug.json'].push(obj)
    }

    //InvDiscount-item
    const addDiscInv = async (userId, discount_buy, discount_sell, waktu) => {
        let obj = { buy: discount_buy, sell: discount_sell, time: waktu }
        await  _mongo_UserSchema.updateOne({ iId: userId }, { $set: { "item.dscinv": obj } })
    }

    const getDscInv = (_userDb) => {
        let _dscInv = _userDb.item.dscinv
        if (JSON.stringify(_dscInv) != '{}') {
            return _dscInv
        }
    }

    const delDscInvTimeCheck = async () => {
        _mongo_UserSchema.updateMany({ "item.dscinv": { $lte: Date.now() } }, { $set: { "item.dscinv": {} } })
    }

    //AutoDelete
    const createAutoDelete = async (MessageKey, id, from, participant = undefined) => {
        const obj = { Msgkey: MessageKey, msgId: id, msgFrom: from, prtcp: participant }
        await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { $push: { "msgDel": obj } })
    }

    const getAutoDelete = (_botDb, MessageKey) => {
        let position = _botDb.msgDel.find(object => object.Msgkey == MessageKey)
        if (position !== undefined) {
            return position
        }
    }

    //WEB
    const addDelTime = (file, time) => { //server.js
        let _delTime = undefined
        try {
            _delTime = JSON.parse(fs.readFileSync('./lib/database/web/deltime.json'))
        } catch (err) {
            if(err.message?.includes('Unexpected end of JSON input')) {
                _delTime = []
                fs.writeFileSync('./lib/database/web/deltime.json', JSON.stringify(_delTime))
            }
        }
        const obj = { file: file, time: Date.now() + toMs(time) }
        _delTime.push(obj)
        fs.writeFileSync('./lib/database/web/deltime.json', JSON.stringify(_delTime))
    }   

function shuffleArray(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}       

// Countdown Function
function getTimeRemaining(endtime){ //Format '12/31/2007' (Day/Month/Year)
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
  
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

  

  /**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
    const archiver = require('archiver')
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  }

function timeConvert(input, now = new Date().getTime()) {
    var timeleft = input - now;

    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    return {day: days, hour: hours, minute: minutes, second: seconds}
}

async function webp2mp4(source) { //By Nurutomo
    let form = new FormData
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
    form.append('new-image-url', isUrl ? source : '')
    form.append('new-image', isUrl ? '' : source, 'image.webp')
    let res = await fetch('https://ezgif.com/webp-to-mp4', {
      method: 'POST',
      body: form
    })
    let html = await res.text()
    let { document } = new JSDOM(html).window
    let form2 = new FormData
    let obj = {}
    for (let input of document.querySelectorAll('form input[name]')) {
      obj[input.name] = input.value
      form2.append(input.name, input.value)
    }
    let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
      method: 'POST',
      body: form2
    })
    let html2 = await res2.text()
    let { document: document2 } = new JSDOM(html2).window
    return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
  }

  async function webp2jpg(source) { //By Nurutomo
    let form = new FormData
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
    form.append('new-image-url', isUrl ? source : '')
    form.append('new-image', isUrl ? '' : source, 'image.webp')
    let res = await fetch('https://ezgif.com/webp-to-jpg', {
      method: 'POST',
      body: form
    })
    let html = await res.text()
    let { document } = new JSDOM(html).window
    let form2 = new FormData
    let obj = {}
    for (let input of document.querySelectorAll('form input[name]')) {
      obj[input.name] = input.value
      form2.append(input.name, input.value)
    }
    let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
      method: 'POST',
      body: form2
    })
    let html2 = await res2.text()
    let { document: document2 } = new JSDOM(html2).window
    return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
  }

  async function gif2mp4(source) {
    let form = new FormData
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
    form.append('new-image-url', isUrl ? source : '')
    form.append('new-image', isUrl ? '' : source, 'image.gif')
    let res = await fetch('https://ezgif.com/gif-to-mp4', {
      method: 'POST',
      body: form
    })
    let html = await res.text()
    let { document } = new JSDOM(html).window
    let form2 = new FormData
    let obj = {}
    for (let input of document.querySelectorAll('form input[name]')) {
      obj[input.name] = input.value
      form2.append(input.name, input.value)
    }
    let res2 = await fetch('https://ezgif.com/gif-to-mp4/' + obj.file, {
      method: 'POST',
      body: form2
    })
    let html2 = await res2.text()
    let { document: document2 } = new JSDOM(html2).window
    return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
  }

  const responseToReadable = async (response) => {
    const reader = response.body.getReader();
    const rs = new Readable();
    rs._read = async () => {
        const result = await reader.read();
        if(!result.done){
            rs.push(Buffer.from(result.value));
        }else{
            rs.push(null);
            return;
        }
    };
    return rs;
};

function stripBad(string) {
    for (var i=0, output='', valid="eE-0123456789."; i<string.length; i++)
        if (valid.indexOf(string.charAt(i)) != -1)
        output += string.charAt(i)
        return output;
	}

function fixNumberEPlus(number) {
    var data = number.toString().split(/[eE]/);
    if (data.length == 1) return data[0];
  
    let z = '',
    sign = number < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1;
  
    if (mag < 0) {
      z = sign + '0.';
      while (mag++) z += '0';
      return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

const showElapsedTime = (timestamp) => {
    if (typeof timestamp !== 'number') return 'NaN'        

    const SECOND = 1000
    const MINUTE = 1000 * 60
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const MONTH = 1000 * 60 * 60 * 24 * 30
    const YEAR = 1000 * 60 * 60 * 24 * 30 * 12
    
    const elapsed = ((new Date()).valueOf() - timestamp)
    
    if (elapsed <= MINUTE) return `${Math.round(elapsed / SECOND)} Detik`
    if (elapsed <= HOUR) return `${Math.round(elapsed / MINUTE)} Menit`
    if (elapsed <= DAY) return `${Math.round(elapsed / HOUR)} Jam`
    if (elapsed <= MONTH) return `${Math.round(elapsed / DAY)} Hari`
    if (elapsed <= YEAR) return `${Math.round(elapsed / MONTH)} Bulan`
    return `${Math.round(elapsed / YEAR)} Tahun`
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

  function _notFoundQualityHandler(res,num) {
    const $ = cheerio.load(res)
    const download_links = []
    const element = $('.download')
    const title = $('div.venutama > h1.posttl').text()
    let response;
  
    element.filter(function(){
        if($(this).find('.anime-box > .anime-title').eq(0).text() === '') {
            $(this).find('.yondarkness-box').filter(function() {
                const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0]
                const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1]
                $(this).find('.yondarkness-item').eq(num).find('a').each((idx, el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    }
                    download_links.push(_list)
                    response = { title, quality, size, download_links }
                })
            })
        } else {
            $(this).find('.anime-box').filter(function() {
                const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0]
                const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1]
                $(this).find('.anime-item').eq(num).find('a').each((idx, el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    }
                    download_links.push(_list)
                    response = { title, quality, size, download_links }
                })
            })
        }
    })
    return response
}

function _epsQualityFunction(res, num) {
    const $ = cheerio.load(res)
    const element = $(".download")
    const download_links = []
    const title = $('div.venutama > h1.posttl').text()
    let response;
  
    element.find("ul:nth-child(2)").filter(function () {
        const quality = $(this).find("li").eq(num).find("strong").text()
        const size = $(this).find("li").eq(num).find("i").text()
        $(this).find("li").eq(num).find("a").each(function () {
            const _list = {
                host: $(this).text(),
                link: $(this).attr("href"),
            }
            download_links.push(_list)
            response = { title, quality, size, download_links }
          
        })
    })
    return response
}

function getQualityOtakudesu (res) {
    const $ = cheerio.load(res)
    let result = []
    $('div.download > *ul > *li').each(function (a, b) {
        const textQuality = $(b).find('strong').text()
        const listLinkDownload = $(b).find('a').map(function (c, d) { return { linkDownload: $(d).attr('href'), textDownload: $(d).text() } }).get()
        result.push({ textQuality, listLinkDownload })
    })
    return result
}

async function requestPuppeteer(sc, customip = 'localhost:8067') {
    const body = `content=${encodeURIComponent(sc)}`
    const response = await fetch(`http://${customip}/req`, {
        method: 'post',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    const res = await response.json()

    return res
}
async function html2img(sc, customip = 'localhost:8067', element = false, viewport = { width: 1920, height: 1080 }) {
    // const body = `content=${encodeURIComponent(sc)}` + (element ? `&element=${element}` : '')
    const body = `content=${encodeURIComponent(sc)}&viewport=${JSON.stringify(viewport)}` + (element ? `&element=${element}` : '')
    const response = await fetch(`http://${customip}/html2img`, {
        method: 'post',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    const res = await response.json()

    return res
}

function mobileLegendsWinRate(tMatch, tWr, wrReq) {
    let tWin = tMatch * (tWr / 100);
    let tLose = tMatch - tWin;
    let sisaWr = 100 - wrReq;
    let wrResult = 100 / sisaWr;
    let seratusPersen = tLose * wrResult;
    let final = seratusPersen - tMatch;
    return Math.round(final);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const storeNameMsg = async (rem, msg, _contactDb) => {
    if(!msg.sender) return // Safety check

    const findName = _contactDb
    let updateData = {}

    // Always set the iId to ensure it exists
    updateData.iId = msg.sender

    // Update name if different or if contact doesn't exist
    if((!findName?.name && msg.pushName) || (findName?.name != msg.pushName && msg.pushName)) {
        updateData.name = msg.pushName
    }

    // Update lid if not present
    if(!findName?.lid && (msg.key?.senderLid || msg.key?.participantLid)) {
        updateData.lid = msg.key?.senderLid || msg.key?.participantLid
    } else if(!findName?.lid && !(msg.key?.senderLid || msg.key?.participantLid) && findName?.iId) {
        try {
            const getLid = await rem.onWhatsApp(findName.iId)
            if(getLid && getLid.length > 0 && getLid[0].lid) {
                updateData.lid = getLid[0].lid
            }
        } catch (err) {
            console.error('Error getting lid:', err)
        }
    }

    // Use upsert to prevent race conditions and duplicates
    try {
        await _mongo_ContactSchema.updateOne(
            { iId: msg.sender }, 
            { $set: updateData }, 
            { upsert: true }
        )
    } catch (err) {
        console.error('Error storing contact:', err)
        // If there's a duplicate key error, try to update existing record
        if(err.code === 11000) {
            try {
                await _mongo_ContactSchema.updateOne(
                    { iId: msg.sender }, 
                    { $set: { name: updateData.name } }
                )
            } catch (updateErr) {
                console.error('Error updating existing contact:', updateErr)
            }
        }
    }
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
 function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.', cb = () => { }) {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            cb(module)
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

async function getAnimePlanetChara (name) {
    // Deprecated
    const get = await axios.get(`https://www.anime-planet.com/characters/all?name=${name}`)
    const cheerioLoad = cheerio.load(get.data)

    if(cheerioLoad('#siteContainer > div.error > p').text() == 'No results found') return false

    const getCharaUrl = cheerioLoad('#siteContainer > table.pure-table.stickyHeader.striped > tbody').length
    let $ = ''
    if(getCharaUrl != 0) {
        //select 0
        $ = cheerio.load((await axios.get('https://www.anime-planet.com' + cheerioLoad('#siteContainer > table.pure-table.stickyHeader.striped > tbody > tr:nth-child(1) > td.tableAvatar > a').attr('href'))).data)
    } else {
        $ = cheerioLoad
    }

    const nameChara = $('#siteContainer > h1[itemprop="name"]').text()
    const nameAKA = $('#siteContainer > h2.aka').text()

    const gender = $('#siteContainer > section.pure-g.entryBar > div:nth-child(1)').text().trim().split(' ')[1]
    const hair = $('#siteContainer > section.pure-g.entryBar > div:nth-child(2)').text().trim().split(' ')[2]

    return { nameChara, nameAKA, gender, hair }
}

async function getAniListChara (name) { 
    try {
        const queryGraphql = `query(
            $id: Int
            $search: String
            $sort: [CharacterSort] = [SEARCH_MATCH]
          ) {
            Character(id: $id, search: $search, sort: $sort) {
              id
              name {
                userPreferred
              }
              gender
              age
              dateOfBirth {
                year
                month
                day
              }
            }
          }`
    
        const requestAniList = await axios.post('https://graphql.anilist.co', { query: queryGraphql, variables: { search: name, sort: 'SEARCH_MATCH' } })
        const data = requestAniList?.data?.data?.Character
        return data
    } catch (err) {
        return false
    }
}

function getArrayDoubleTop (array, size, isPercent = false) {
    const arrCount = array.reduce((acc, curr) => {
        if (typeof acc[curr] == 'undefined') {
            acc[curr] = 1
        } else {
            acc[curr] += 1
        }
        return acc
    }, {})
    const arrCountSort = Object.entries(arrCount).sort((a, b) => b[1] - a[1])
    const arrCountSortTop = arrCountSort.slice(0, size)

    if(!isPercent) return arrCountSortTop

    const arrCountPercent = arrCountSort.map((x) => {
    const percent = (x[1] / array.length) * 100
        return [x[0], percent.toFixed(2)]
    })
    const arrCountPercentTop = arrCountPercent.slice(0, size)

    return arrCountPercentTop
}

async function requestWithProxyRandom (url, options = {}, method = 'get', country = 'all', ssl = 'yes') {
    const getListProxy = (await axios.get(`https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=${country}&ssl=${ssl}&anonymity=all`)).data.split('\n').map(all => all.replace('\r', '').trim())

    // console.log(getListProxy)
    let result = {}
    for(let i = 0; i < getListProxy.length; i++) {
        // console.log('checking proxy', getListProxy[i])
        try {
            const httpsAgent = new SocksProxyAgent(`socks5://${getListProxy[i]}`)
            const get = await axios[method](url, { httpsAgent, ...options, validateStatus: () => true  })
            if(get.status == 200) {
                console.log('success')
                result = get
                break
            } else if(get.status == 404) {
                console.log('404')
                result = get
                break
            } else {
                //ignore
            }
        } catch (e) {
            console.log('failed', e)
            // ignore
        }
    }
    return result
}

async function requestWithProxy (url, options = {}, method = 'get', country = 'all', ssl = 'yes') {
    // return await axios[method](url, { proxy: { protocol: 'http', host: '147.139.213.134', port: 7109, auth: { username: 'remcp', password: 'HfIZo7GuwoYhlkqIsPpD' } }, ...options, validateStatus: () => true  })
    const httpsProxy = new HttpsProxyAgent('http://remcp:HfIZo7GuwoYhlkqIsPpD@147.139.213.134:7109')
    return await axios[method](url, { httpsAgent: httpsProxy, ...options, validateStatus: () => true  })
}


//
function encryptValue(value) {
    const object = { isEnc: true, content: {} }

    const random = Math.floor(Math.random() * 3) + 3

    let enc = []
    enc["enc1"] = GenerateSerialNumber("0".repeat(random))
    enc["enc2"] = GenerateSerialNumber("0".repeat(random))
    enc["enc3"] = GenerateSerialNumber("0".repeat(random))

    //random number 1 - 3
    const randomBegin = Math.floor(Math.random() * 3) + 1
    const cryptr = new Cryptr(enc["enc" + randomBegin] + enc["enc3"] + enc["enc1"])

    const encValue = cryptr.encrypt(value)

    const randomUseless = Math.floor(Math.random() * 3) + 3 + 10

    object.metadata = { k: [random, randomUseless], b: [randomBegin, randomBegin + randomBegin * 2], e: [enc["enc3"].toLowerCase(), enc["enc2"].toLowerCase(), enc["enc1"].toLowerCase()] }
    object.content = { type: 'enc', content: encValue }

    return object
}

function decryptValue(object) {
    if (object?.isEnc == undefined) return object?.content || false

    const enc = object.metadata.e
    const randomBegin = object.metadata.b[0]

    let encV = []
    encV["enc3"] = enc[0].toUpperCase()
    encV["enc2"] = enc[1].toUpperCase()
    encV["enc1"] = enc[2].toUpperCase()

    const cryptr = new Cryptr(encV["enc" + randomBegin] + encV["enc3"] + encV["enc1"])

    const decValue = cryptr.decrypt(object.content.content)

    return decValue
}

/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
    const webp = require('node-webpmux') // Optional Feature
    const img = new webp.Image();
    const stickerPackId = crypto.randomBytes(32).toString('hex');
    const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra };
    let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    let exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    await img.load(webpSticker)
    img.exif = exif
    return await img.save(null)
}

async function gif2webpFfmpeg(buffer, packname, author) {
    return new Promise(async (resolve, reject) => {
        const randomIdSgif = GenerateSerialNumber("0000000000")
        const fileNameInputSgif = `./lib/cache/ffmpeg/${randomIdSgif}.mp4`
        const fileNameOutputSgif = `./lib/cache/ffmpeg/${randomIdSgif}.webp`
        await fs.writeFileSync(fileNameInputSgif, buffer)
    
        let stickerResult = false
        //mp4 to webp using spawn and reduce the filesize
        const generateSticker = spawn('ffmpeg', [
            '-threads', '1',
            // '-y',
            '-i', fileNameInputSgif,
            // '-vf', `scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
            '-vcodec', 'libwebp',
            '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            fileNameOutputSgif
        ])
        generateSticker.on('error', async (err) => {
            console.error(err)
            // isFailedSticker = true
            reject(err)
        })
        generateSticker.on('exit', async () => {
            fs.unlinkSync(fileNameInputSgif)
            try {
                stickerResult = await addExif(fileNameOutputSgif, packname, author)
                fs.unlinkSync(fileNameOutputSgif)
                return resolve({ isExif: true, isNoFfmpeg: false, stickerResult })
            } catch (err) {
                console.error(err)
                try {
                    fs.unlinkSync(fileNameOutputSgif)
                    return resolve({ isExif: false, isNoFfmpeg: false, stickerResult })
                } catch (errIn) {
                    console.error('inside sticker', errIn)
                    fs.unlinkSync(fileNameOutputSgif)
                    const stickerOptions = {
                        pack: packname, // The pack name
                        author, // The author name
                        type: StickerTypes.FULL, // The sticker type
                        quality: 1,
                    }
                    const generateSticker = await createSticker(buffer, stickerOptions)
                    return resolve({ isExif: true, isNoFfmpeg: true, stickerResult: generateSticker })
                }
            }
        })
    })
}

async function getAllJadibotFromAPI() {
    return new Promise(async (resolve, reject) => {
        let _jadibot1 = undefined
        let _jadibot2 = undefined
        let _jadibot3 = undefined
        let _jadibot4 = undefined
        let _jadibot5 = undefined
        // let _jadibot6 = undefined
        // let _jadibot7 = undefined
        // let _jadibot8 = undefined
        // let _jadibot9 = undefined
        // let _jadibot10 = undefined
        let countAllJadibot = 0
        async function getJadibot1 () {
            try {
                const temp_jadibot1 = (await axios.post('http://localhost:9027/get-jadibot'))?.data
                _jadibot1 = { server: 'jadibot1', port: 9027, data: temp_jadibot1 }
                countAllJadibot += temp_jadibot1.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot2 () {
            try {
                const temp_jadibot2 = (await axios.post('http://localhost:7027/get-jadibot'))?.data
                _jadibot2 = { server: 'jadibot2', port: 7027, data: temp_jadibot2 }
                countAllJadibot += temp_jadibot2.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot3 () {
            try {
                const temp_jadibot3 = (await axios.post('http://localhost:5027/get-jadibot'))?.data
                _jadibot3 = { server: 'jadibot3', port: 5027, data: temp_jadibot3 }
                countAllJadibot += temp_jadibot3.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot4 () {
            try {
                const temp_jadibot4 = (await axios.post('http://localhost:3027/get-jadibot'))?.data
                _jadibot4 = { server: 'jadibot4', port: 3027, data: temp_jadibot4 }
                countAllJadibot += temp_jadibot4.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot5 () {
            try {
                const temp_jadibot5 = (await axios.post('http://localhost:1027/get-jadibot'))?.data
                _jadibot5 = { server: 'jadibot5', port: 1027, data: temp_jadibot5 }
                countAllJadibot += temp_jadibot5.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot6 () {
            try {
                const temp_jadibot6 = (await axios.post('http://localhost:1127/get-jadibot'))?.data
                _jadibot6 = { server: 'jadibot6', port: 1127, data: temp_jadibot6 }
                countAllJadibot += temp_jadibot6.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot7 () {
            try {
                const temp_jadibot7 = (await axios.post('http://localhost:2027/get-jadibot'))?.data
                _jadibot7 = { server: 'jadibot7', port: 2027, data: temp_jadibot7 }
                countAllJadibot += temp_jadibot7.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot8 () {
            try {
                const temp_jadibot8 = (await axios.post('http://localhost:4027/get-jadibot'))?.data
                _jadibot8 = { server: 'jadibot8', port: 4027, data: temp_jadibot8 }
                countAllJadibot += temp_jadibot8.length
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot9 () {
            try {
                const temp_jadibot9 = (await axios.post('http://localhost:6027/get-jadibot'))?.data
                _jadibot9 = { server: 'jadibot9', port: 6027, data: temp_jadibot9 }
                countAllJadibot += temp_jadibot9.length
            } catch (err) {
                console.error(err)
            }
        }
        // async function getJadibot10 () {
        //     try {
        //         const temp_jadibot10 = (await axios.post('http://localhost:8027/get-jadibot'))?.data
        //         _jadibot10 = { server: 'jadibot10', port: 8027, data: temp_jadibot10 }
        //         countAllJadibot += temp_jadibot10.length
        //     } catch (err) {
        //         console.error(err)
        //     }
        // }
        Promise.all([getJadibot1(), getJadibot2(), getJadibot3(), getJadibot4(), getJadibot5()]).then(() => {
            _jadibot1?.data != undefined && (global.jadibot1 = _jadibot1.data)
            _jadibot2?.data != undefined && (global.jadibot2 = _jadibot2.data)
            _jadibot3?.data != undefined && (global.jadibot3 = _jadibot3.data)
            _jadibot4?.data != undefined && (global.jadibot4 = _jadibot4.data)
            _jadibot5?.data != undefined && (global.jadibot5 = _jadibot5.data)
            // _jadibot6?.data != undefined && (global.jadibot6 = _jadibot6.data)
            // _jadibot7?.data != undefined && (global.jadibot7 = _jadibot7.data)
            // _jadibot8?.data != undefined && (global.jadibot8 = _jadibot8.data)
            // _jadibot9?.data != undefined && (global.jadibot9 = _jadibot9.data)
            // _jadibot10?.data != undefined && (global.jadibot10 = _jadibot10.data)
            resolve({ _jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, countAllJadibot })
        }).catch((err) => {
            console.error(err)
            resolve({ _jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, countAllJadibot })
        })
    })
}

const clientHandlerRequire = require('./clientHandler_whatsmeow')
async function getAllJadibotNewFromAPI() {
    const getAllJadibot = (await axios.get(`${process.env.CLIENT_GOLANG_URL}/admin/users`)).data.filter(x => x.loggedIn)
    // { id: req.body.sender, virtualBotId: req.body.id, isStop: false, retryCount: 0, isMobile: req.body.isMobile || false, dbVer: req.body.dbVer || '1.0' }
    // global.jadibot = getAllJadibot.map((x) => { return { id: x.name, virtualBotId: x.token, dataId: x.id } })
    for(let i = 0; i < getAllJadibot.length; i++) {
        if(!global.jadibot) global.jadibot = []
        global.jadibot[getAllJadibot[i].token] = { token: getAllJadibot[i].token, id: getAllJadibot[i].name, virtualBotId: getAllJadibot[i].token, dataId: getAllJadibot[i].id, access: { user: {
            id: getAllJadibot[i].jid,
            jid: getAllJadibot[i].jid.split('@')[0].split(':')[0] + '@s.whatsapp.net'
        } }, user: {
            id: getAllJadibot[i].jid,
            jid: getAllJadibot[i].jid.split('@')[0].split(':')[0] + '@s.whatsapp.net'
        } }

        if(!global.jadibot[getAllJadibot[i].token]?.sendText) {
            const clientHandler = clientHandlerRequire(global.jadibot[getAllJadibot[i].token].token, global.jadibot[getAllJadibot[i].token].user.id, {})
            global.jadibot[getAllJadibot[i].token].sendText = clientHandler.sendText
            global.jadibot[getAllJadibot[i].token].sendTextWithMentions = clientHandler.sendTextWithMentions
            global.jadibot[getAllJadibot[i].token].sendFileAuto = clientHandler.sendFileAuto
            global.jadibot[getAllJadibot[i].token].sendFile = clientHandler.sendFile
            global.jadibot[getAllJadibot[i].token].sendButtons = clientHandler.sendButtons
            global.jadibot[getAllJadibot[i].token].sendList = clientHandler.sendList
            global.jadibot[getAllJadibot[i].token].sendButtonsImage = clientHandler.sendButtonsImage
            global.jadibot[getAllJadibot[i].token].sendReact = clientHandler.sendReact
            global.jadibot[getAllJadibot[i].token].sendContact = clientHandler.sendContact
            global.jadibot[getAllJadibot[i].token].sendEditMessage = clientHandler.sendEditMessage
            global.jadibot[getAllJadibot[i].token].deleteMessage = clientHandler.deleteMessage
            global.jadibot[getAllJadibot[i].token].readMessages = clientHandler.readMessages
            global.jadibot[getAllJadibot[i].token].groupMetadata = clientHandler.groupMetadata
            global.jadibot[getAllJadibot[i].token].groupAcceptInvite = clientHandler.groupAcceptInvite
            global.jadibot[getAllJadibot[i].token].groupInviteCode = clientHandler.groupInviteCode
            global.jadibot[getAllJadibot[i].token].groupGetInviteInfo = clientHandler.groupGetInviteInfo
            global.jadibot[getAllJadibot[i].token].groupRevokeInvite = clientHandler.groupRevokeInvite
            global.jadibot[getAllJadibot[i].token].groupParticipantsUpdate = clientHandler.groupParticipantsUpdate
            global.jadibot[getAllJadibot[i].token].groupSettingUpdate = clientHandler.groupSettingUpdate
            global.jadibot[getAllJadibot[i].token].groupUpdateSubject = clientHandler.groupUpdateSubject
            global.jadibot[getAllJadibot[i].token].groupUpdateDescription = clientHandler.groupUpdateDescription
            global.jadibot[getAllJadibot[i].token].updateProfilePicture = clientHandler.updateProfilePicture
            global.jadibot[getAllJadibot[i].token].groupFetchAllParticipating = clientHandler.groupFetchAllParticipating
            global.jadibot[getAllJadibot[i].token].groupLeave = clientHandler.groupLeave
            global.jadibot[getAllJadibot[i].token].profilePictureUrl = clientHandler.profilePictureUrl
            global.jadibot[getAllJadibot[i].token].fetchStatus = clientHandler.fetchStatus
            global.jadibot[getAllJadibot[i].token].onWhatsApp = clientHandler.onWhatsApp
            global.jadibot[getAllJadibot[i].token].sendPresenceUpdate = clientHandler.sendPresenceUpdate

            global.jadibot[getAllJadibot[i].token].contacts = (jid, _contactDbE) => {
                if(!jid.includes('@s.whatsapp.net')) return jid
                const findName = _contactDbE?.name
                if(findName == undefined || findName == null || findName == '') {
                    return PhoneNumber(`+${jid.replace('@s.whatsapp.net', '')}`).getNumber('international')
                } else {
                    return findName
                }
            }
        }
    
        if((getAllJadibot[i].token === 'CORE') && !global.remOutsideAccess) {
            global.remOutsideAccess = global.jadibot[getAllJadibot[i].token]
        } else if(!global.jadibot[getAllJadibot[i].token].access) {
            global.jadibot[getAllJadibot[i].token].access = global.jadibot[getAllJadibot[i].token]
        }
    }
    return global.jadibot
}

async function sendRequestRandomJadibotNew(method, data) {
    // random global.jadibot, then global.jadibot[random].access[method](...data)
    const randomJadibot = Object.keys(global.jadibot)[Math.floor(Math.random() * Object.keys(global.jadibot).length)]
    try {
        return await clientHandlerRequire(global.jadibot[randomJadibot].token, global.jadibot[randomJadibot].user.id)[method](...data)
    } catch (err) {
        console.error(err)
        return { status: false, data: { message: 'jadibot not found' } }
    }
}

async function sendRequestRandomJadibot (method, data) {
    if(!Array.isArray(data)) data = [data]

    console.log('start refresh sendRequestRandomJadibot')
    let { _jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5 } = await getAllJadibotFromAPI()
    console.log('success refresh sendRequestRandomJadibot')
    // let { _jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5 } = await getAllJadibotFromAPI()
    // console.log(_jadibot1)

    let jadibot = undefined
    // select random from jadibot1 jadibot2 jadibot3 jadibot4
    // if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4][Math.floor(Math.random() * 4)]
    // } else if (_jadibot1 && _jadibot2) {
    //     jadibot = [_jadibot1, _jadibot2][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1 && _jadibot3) {
    //     jadibot = [_jadibot1, _jadibot3][Math.floor(Math.random() * 2)]
    // } else if (_jadibot2 && _jadibot3) {
    //     jadibot = [_jadibot2, _jadibot3][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1 && _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot2 && _jadibot4) {
    //     jadibot = [_jadibot2, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot3 && _jadibot4) {
    //     jadibot = [_jadibot3, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1) {
    //     jadibot = _jadibot1
    // } else if (_jadibot2) {
    //     jadibot = _jadibot2
    // } else if (_jadibot3) {
    //     jadibot = _jadibot3
    // } else if(_jadibot4) {
    //     jadibot = _jadibot4
    // } else {
    //     return { status: false, data: { message: 'jadibot not found' } }
    // }
    // select random from jadibot1 jadibot2 jadibot3 jadibot4 jadibot5
    if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5) {
        jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5][Math.floor(Math.random() * 5)]
    } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4) {
        jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4][Math.floor(Math.random() * 4)]
    } else if (_jadibot1 && _jadibot2 && _jadibot3) {
        jadibot = [_jadibot1, _jadibot2, _jadibot3][Math.floor(Math.random() * 3)]
    } else if (_jadibot1 && _jadibot2 && _jadibot4) {
        jadibot = [_jadibot1, _jadibot2, _jadibot4][Math.floor(Math.random() * 3)]
    } else if (_jadibot1 && _jadibot3 && _jadibot4) {
        jadibot = [_jadibot1, _jadibot3, _jadibot4][Math.floor(Math.random() * 3)]
    } else if (_jadibot2 && _jadibot3 && _jadibot4) {
        jadibot = [_jadibot2, _jadibot3, _jadibot4][Math.floor(Math.random() * 3)]
    } else if (_jadibot1 && _jadibot2) {
        jadibot = [_jadibot1, _jadibot2][Math.floor(Math.random() * 2)]
    } else if (_jadibot1 && _jadibot3) {
        jadibot = [_jadibot1, _jadibot3][Math.floor(Math.random() * 2)]
    } else if (_jadibot1 && _jadibot4) {
        jadibot = [_jadibot1, _jadibot4][Math.floor(Math.random() * 2)]
    } else if (_jadibot2 && _jadibot3) {
        jadibot = [_jadibot2, _jadibot3][Math.floor(Math.random() * 2)]
    } else if (_jadibot2 && _jadibot4) {
        jadibot = [_jadibot2, _jadibot4][Math.floor(Math.random() * 2)]
    } else if (_jadibot3 && _jadibot4) {
        jadibot = [_jadibot3, _jadibot4][Math.floor(Math.random() * 2)]
    } else if (_jadibot1 && _jadibot5) {
        jadibot = [_jadibot1, _jadibot5][Math.floor(Math.random() * 2)]
    } else if (_jadibot2 && _jadibot5) {
        jadibot = [_jadibot2, _jadibot5][Math.floor(Math.random() * 2)]
    } else if (_jadibot3 && _jadibot5) {
        jadibot = [_jadibot3, _jadibot5][Math.floor(Math.random() * 2)]
    } else if (_jadibot4 && _jadibot5) {
        jadibot = [_jadibot4, _jadibot5][Math.floor(Math.random() * 2)]
    } else if (_jadibot1) {
        jadibot = _jadibot1
    } else if (_jadibot2) {
        jadibot = _jadibot2
    } else if (_jadibot3) {
        jadibot = _jadibot3
    } else if(_jadibot4) {
        jadibot = _jadibot4
    } else if(_jadibot5) {
        jadibot = _jadibot5
    } else {
        return { status: false, data: { message: 'jadibot not found' } }
    }
    // select random from jadibot1 jadibot2 jadibot3 jadibot4 jadibot5 jadibot6 jadibot7 jadibot8 jadibot9
    // if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5 && _jadibot6 && _jadibot7 && _jadibot8 && _jadibot9) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, _jadibot6, _jadibot7, _jadibot8, _][Math.floor(Math.random() * 9)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5 && _jadibot6 && _jadibot7 && _jadibot8) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, _jadibot6, _jadibot7, _jadibot8][Math.floor(Math.random() * 8)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5 && _jadibot6 && _jadibot7) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, _jadibot6, _jadibot7][Math.floor(Math.random() * 7)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5 && _jadibot6) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5, _jadibot6][Math.floor(Math.random() * 6)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4 && _jadibot5) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4, _jadibot5][Math.floor(Math.random() * 5)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3 & _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3, _jadibot4][Math.floor(Math.random() * 4)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot3) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot3][Math.floor(Math.random() * 3)]
    // } else if (_jadibot1 && _jadibot2 && _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot2, _jadibot4][Math.floor(Math.random() * 3)]
    // } else if (_jadibot1 && _jadibot3 && _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot3, _jadibot4][Math.floor(Math.random() * 3)]
    // } else if (_jadibot2 && _jadibot3 && _jadibot4) {
    //     jadibot = [_jadibot2, _jadibot3, _jadibot4][Math.floor(Math.random() * 3)]
    // } else if (_jadibot1 && _jadibot2) {
    //     jadibot = [_jadibot1, _jadibot2][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1 && _jadibot3) {
    //     jadibot = [_jadibot1, _jadibot3][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1 && _jadibot4) {
    //     jadibot = [_jadibot1, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot2 && _jadibot3) {
    //     jadibot = [_jadibot2, _jadibot3][Math.floor(Math.random() * 2)]
    // } else if (_jadibot2 && _jadibot4) {
    //     jadibot = [_jadibot2, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot3 && _jadibot4) {
    //     jadibot = [_jadibot3, _jadibot4][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1 && _jadibot5) {
    //     jadibot = [_jadibot1, _jadibot5][Math.floor(Math.random() * 2)]
    // } else if (_jadibot2 && _jadibot5) {
    //     jadibot = [_jadibot2, _jadibot5][Math.floor(Math.random() * 2)]
    // } else if (_jadibot3 && _jadibot5) {
    //     jadibot = [_jadibot3, _jadibot5][Math.floor(Math.random() * 2)]
    // } else if (_jadibot4 && _jadibot5) {
    //     jadibot = [_jadibot4, _jadibot5][Math.floor(Math.random() * 2)]
    // } else if (_jadibot1) {
    //     jadibot = _jadibot1
    // } else if (_jadibot2) {
    //     jadibot = _jadibot2
    // } else if (_jadibot3) {
    //     jadibot = _jadibot3
    // } else if(_jadibot4) {
    //     jadibot = _jadibot4
    // } else if(_jadibot5) {
    //     jadibot = _jadibot5
    // } else {
    //     return { status: false, data: { message: 'jadibot not found' } }
    // }

    const randomDataJadibot = jadibot.data[Math.floor(Math.random() * jadibot.data.length)]
    let result = undefined
    try {
        const sendBody = { id: randomDataJadibot.virtualBotId, key: 'OIAHOIFBAPW790709ba', method, content: data }
        result = await axios.post(`http://localhost:${jadibot.port}/access`, sendBody)
    } catch (err) {
        console.error(err)
        return { status: false, data: { message: 'jadibot error' } }
    }
    return { status: true, data: { server: jadibot.server, port: jadibot.port, virtualBotId: randomDataJadibot.virtualBotId, result: result.data } }

}

/**
 * content must array []
 */
async function sendReqToGroupJadibot (from, method, content) {
    if(global.allListGroup == undefined) return { status: false, msg: 'no allListGroup obj' }

    //allListGroup = { id: String_jadibotId, group_id: String_groupId }
    const groupJadibot = global.allListGroup.find((item) => item.group_id == from)
    if(groupJadibot == undefined) return { status: false, msg: 'no groupJadibot obj' }
    
    if(global.jadibot == undefined && global.remOutsideAccess != undefined) return await global.remOutsideAccess[method](groupJadibot.group_id, ...content)
    if(global.jadibot == undefined) return { status: false, msg: 'no jadibot obj_1' }

    const position = Object.values(global.jadibot).findIndex((item) => item.virtualBotId == groupJadibot.id)
    if(position == -1) return { status: false, msg: 'no jadibot obj' }
    const accessBot = await Object.values(global.jadibot)[position][method](groupJadibot.group_id, ...content)
    return { status: true, data: accessBot }
}

function arrayFindStartsWith (array, startsWith) {
    for (let i = 0; i < array.length; i++) {
        if (startsWith.startsWith(array[i])) {
            return array[i]
        }
    }
    return undefined
}

async function addCollectorMessage (userId, from, id, timeout, isReply, messageReply) {
    return await _mongo_UserSchema.updateOne({ iId: userId }, { $push: { "collectMessage": { id, from, timeout, isReply, messageReply } } })
}

/**
 * Create a text progress bar
 * @param {Number} value - The value to fill the bar
 * @param {Number} maxValue - The max value of the bar
 * @param {Number} size - The bar size (in letters)
 * @return {String} - The bar
 * credit to : https://github.com/Mw3y/Text-ProgressBar/blob/master/ProgressBar.js
 */
function textProgressBar (value, maxValue, size, isPercentage = true) {
    const percentageCountText = value / maxValue; // Calculate the percentage of the bar
    if(value > maxValue) value = maxValue; // If the current value is bigger than the max, just set it to the max.
    const percentage = value / maxValue
    const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.
  
    const progressText = '▇'.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
    const percentageText = Math.round(percentageCountText * 100) + '%'; // Displaying the percentage of the bar
  
    const bar = '```[' + progressText + emptyProgressText + ']' + (isPercentage ? percentageText : '') + '```'; // Creating the bar
    return bar;
}

async function saveFormIgDown (url) {
    return (await requestPuppeteer(`new Promise(async (resolve, reject) => {
        const page = await global.browserPup.newPage()
        await page.goto('https://savefrom.app')
        await page.waitForSelector('input[name=value]')
        await page.type('input[name=value]', '${url}')
        await page.click('#search-form > div.search__form-header > button.search__form-btn')
        page.on('response', async (response) => {
            if (response.url().endsWith("/api/convert")) {
                if(Number(response.status()) === 503) {
                    await page.type('input[name=value]', '${url}')
                    await page.click('#search-form > div.search__form-header > button.search__form-btn')
                } else {
                    resolve(await response.json())
                    await page.close()
                }
            }
        })
    })`, 'localhost:8067')).result
}

async function checkImageNsfw (buffer) {
    // const dataCheckNsfw = new FormData();
    // dataCheckNsfw.append('image', buffer, 'image.jpg');
    
    // const optionsCheckNsfw = {
    //   method: 'POST',
    //   url: 'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content-file',
    //   headers: {
    //     'X-RapidAPI-Key': 'cd7089164emshfa567324d583076p1a3617jsn8fca0a26f1e1',
    //     'X-RapidAPI-Host': 'nsfw-images-detection-and-classification.p.rapidapi.com',
    //     ...dataCheckNsfw.getHeaders(),
    //   },
    //   data: dataCheckNsfw
    // }

    // const listAnotherKey = ["51d6482f9fmshc1b3379c7126c19p105dd4jsnad07597fc45e", "d9c139e4abmsh91a5e238e9b98dep1a014djsn5ea7733f4ac7", "0f67eed5ecmshc8e1206cca6c769p186e7ejsn47882742cade"]

    // try {
    //     async function requestCheckNsfw (posKey = 0) {
    //         return await axios.request(optionsCheckNsfw).catch((err) => {
    //             if(posKey == listAnotherKey.length - 1) return { status: false, msg: err.message }
    //             optionsCheckNsfw.headers['X-RapidAPI-Key'] = listAnotherKey[posKey]
    //             return requestCheckNsfw(posKey + 1)
    //         }).then((res) => res)
    //     }
    //     const responseCheckNsfw = await requestCheckNsfw()
    //     return responseCheckNsfw.data;
    // } catch (error) {
    //     console.error(error);
    //     return { status: false, msg: error.message }
    // }

    //buffer to base64
    // const dataCheckNsfw = Buffer.from(buffer).toString('base64')
    // const optionsCheckNsfw = {
    //     method: 'POST',
    //     url: 'https://mizukidesuu-nsfw-detector-api.hf.space/predict_data',
    //     headers: {
    //         Authorization: 'Bearer sViVF90EvQJABBs9HFcYjzzvRnU8bROL',
    //         'Content-Type': 'application/json'
    //     },
    //     data: { data: dataCheckNsfw }
    // }
    // try {
    //     const responseCheckNsfw = await axios.request(optionsCheckNsfw).catch((err) => {
    //         console.error(err.response.data);
    //         return { status: false, msg: err.response.data }
    //     });
    //     return responseCheckNsfw.data;
    // } catch (error) {
    //     console.error(error);
    //     return { status: false, msg: error.message }
    // }

    const response = await axios.post('https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection', buffer, {
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
    })

    console.log(response.data)
    return response.data
}

function initLogCrashData () {
	if(!fs.existsSync(path.join(process.cwd(), 'log'))) fs.mkdirSync(path.join(process.cwd(), 'log'))
	const transport = pino.transport({
		targets: [
			{
				level: 'fatal',
				target: 'pino/file',
				options: {
			  		destination: path.join(process.cwd(), 'log', 'crash.log')
				}
		  	},
			{
				level: 'warn',
				target: 'pino/file',
				options: {
					destination: path.join(process.cwd(), 'log', 'crash.log')
				}
			},
			{
				level: 'error',
				target: 'pino/file',
				options: {
					destination: path.join(process.cwd(), 'log', 'crash.log')
				}
			}
		]
	})
	global.logPush = pino(transport)
}

function fetchFromObject(obj, prop) {

    if(typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if(_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}

function getLevelImageTemplate(avatar, status, displayName, username, title, svgIcon, roundStyle, level, xp, requiredXp, rank) {
    const percentage = Math.floor((xp / requiredXp) * 100);
    if (displayName && displayName.length > 30) {
        displayName = displayName.substring(0, 30) + '...';
    }
    if (username && username.length > 30) {
        username = username.substring(0, 30) + '...';
    }

    const fixed = (v) => {
        if(v.toString().includes('e')) {
            const vString = v.toString();
            const betweenNumberToE = vString.split('e')
            // if betweenNumberToE[0] text length > 5 replace text so on with ...
            if(betweenNumberToE[0].length > 8) {
                return betweenNumberToE[0].substring(0, 8) + '...' + 'e' + betweenNumberToE[1];
            }
            return betweenNumberToE[0] + 'e' + betweenNumberToE[1];
        }
        const formatter = new Intl.NumberFormat('en-US', { notation: 'compact' });
        return formatter.format(v);
    };

    const colors = {
        LightGray: '#A0A1A3',
        Gray: '#474B4E',
        DarkGray: '#272A2D',
        White: '#FFFFFF',
        Green: '#22A559',
        Yellow: '#F0B332',
        Red: '#F24043',
        Blue: '#8ACDFF'
    }
    const statusColor =
        status === 'online'
            ? colors.Green
            : status === 'idle'
                ? colors.Yellow
                : status === 'dnd'
                    ? colors.Red
                    : colors.Gray;
    
    const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 100 100" style="display:block; margin:auto">${svgIcon}</svg>`
    svgIcon = convertStringToJSX(finalSvg)
    
    // //  set background image and set background size to cover and no repeat
    return (canvas.JSX.createElement("div", { tw: `flex bg-[#2F3136]/80 h-[80%] w-[95%] items-center justify-around rounded-3xl` },
    canvas.JSX.createElement("div", { tw: "flex relative" },
        canvas.JSX.createElement("img", { src: avatar, alt: "avatar", tw: `h-[311px] w-[311px] rounded-full mr-8 border-[#272A2D]/80 border-8` }),
        canvas.JSX.createElement("div", { tw: `bg-[${statusColor}] h-20 w-20 rounded-full flex absolute bottom-3 right-7 border-[#272A2D]/80 border-8` })),
    canvas.JSX.createElement("div", { tw: "flex flex-col" },
        canvas.JSX.createElement("div", { tw: "flex items-center justify-between" },
            canvas.JSX.createElement("div", { tw: "flex flex-col" },
                canvas.JSX.createElement("div", { tw: "flex flex-wrap items-center justify-center" },
                    canvas.JSX.createElement("h1", { tw: `text-white text-6xl mr-5` }, displayName),
                    title && canvas.JSX.createElement("span", { tw: 'ml-8 px-2.5 py-0.5 ' + roundStyle },
                        svgIcon,
                        canvas.JSX.createElement("span", { tw: "ml-2" }, title))),
                username && canvas.JSX.createElement("div", { tw: "flex text-[#A7A7A7] text-4xl mb-4" },
                    "@",
                    username)),
            canvas.JSX.createElement("h1", { tw: "text-[#A7A7A7] text-6xl" },
                percentage,
                "%")),
        canvas.JSX.createElement("div", { tw: "flex bg-[#292929]/70 h-[50px] w-[1413px] rounded-full" },
            canvas.JSX.createElement("div", { tw: `flex bg-[#5865F2] h-[50px] w-[${percentage}%] rounded-full` })),
        canvas.JSX.createElement("div", { tw: "flex justify-between w-[55%] font-bold" },
            canvas.JSX.createElement("h1", { tw: "text-[45px] mr-16" },
                canvas.JSX.createElement("span", { tw: "text-[#A7A7A7] mr-2" }, "LEVEL:"),
                canvas.JSX.createElement("span", { tw: "text-white" }, level)),
            canvas.JSX.createElement("h1", { tw: "text-[45px] mr-16" },
                canvas.JSX.createElement("span", { tw: "text-[#A7A7A7] mr-2" }, "XP:"),
                canvas.JSX.createElement("span", { tw: "text-white" },
                    fixed(xp),
                    "/",
                    fixed(requiredXp))),
            canvas.JSX.createElement("h1", { tw: "text-[45px]" },
                canvas.JSX.createElement("span", { tw: "text-[#A7A7A7] mr-2" }, "RANK:"),
                canvas.JSX.createElement("span", { tw: "text-white" },
                    "#",
                    rank))))));
}

function convertStringToJSX(string, options) {
    if(!string) return undefined
    return htmlToJsx(string, options)
}

async function getProfileBgTemplate(nameMe, bgImage, profileImage, titleName, roundStyle, svgIcon) {
    // const templateBg = `<!DOCTYPE html>
    // <html>
    //   <head>
    //     <meta charset="utf-8" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //     <title>Preview</title>
    //     <script src="https://cdn.tailwindcss.com"></script>
    //     <style>
    //       html, body {
    //         display: flex;
    //         flex-direction: column;
    //         flex: 1;
    //         width: 100%;
    //         height: 100%;
    //         -webkit-font-smoothing: antialiased;
    //         -moz-osx-font-smoothing: grayscale;
    //       }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="w-[400px] h-[200px] relative">
    //       <svg
    //         width="400"
    //         height="150"
    //         viewBox="0 0 400 150"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //         xmlns:xlink="http://www.w3.org/1999/xlink"
    //         class="absolute left-[-1px] top-[-1px]"
    //         preserveAspectRatio="none"
    //       >
    //         <path
    //           d="M400 0H0V150H150.5C150.5 150 156 105.5 199.5 105.5C243 105.5 250 150 250 150H400V0Z"
    //           fill="url(#pattern0_18_186)"
    //         ></path>
    //         <defs>
    //           <pattern
    //             id="pattern0_18_186"
    //             patternContentUnits="objectBoundingBox"
    //             width="1"
    //             height="1"
    //           >
    //             <use
    //               xlink:href="#image0_18_186"
    //               transform="matrix(0.000596659 0 0 0.00159109 0 -0.243039)"
    //             ></use>
    //           </pattern>
    //           <image
    //             id="image0_18_186"
    //             width="1676"
    //             height="934"
    //             xlink:href="data:image/png;base64,${bgImage}"
    //           ></image>
    //         </defs>
    //       </svg>
    //       <div
    //         class="w-[95px] h-5 absolute left-1.5 top-[122px] overflow-hidden rounded-[50px] bg-[#384251] border border-[#ea747b]"
    //       >
    //         <p
    //           class="w-[95px] h-[18px] absolute left-0 top-px text-sm font-semibold text-center text-[#4fdff2]"
    //         >
    //         ${nameMe.length > 11 ? nameMe.substring(0, 11) + '...' : nameMe}
    //         </p>
    //       </div>
    //       <img class="absolute left-[154px] top-[109px]" src="${profileImage}" />
    //       <div
    //         class="w-[95px] h-5 absolute left-[299px] top-[122px] ${roundStyle}"
    //       >
    //         ${svgIcon}
    //         <p
    //           class="w-[60px] h-[15px] absolute left-6 top-0.5 text-xs font-semibold text-center text-[#ee727e]"
    //         >
    //             ${titleName}
    //         </p>
    //       </div>
    //     </div>
    //   </body>
    // </html>
    // `
    const templateBg = `
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <style>
        html * {
            font-family: "Inter", sans-serif !important;
            font-optical-sizing: auto !important;
            font-weight: 600 !important;
            font-style: normal !important;
            font-variation-settings !important:
            "slnt" 0 !important;
        }
    </style>      
    <div class="w-[400px] h-[200px] relative">
        <svg
          width="400"
          height="150"
          viewBox="0 0 400 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          class="absolute left-[-1px] top-[-1px]"
          preserveAspectRatio="none"
        >
          <path
            d="M400 0H0V150H150.5C150.5 150 156 105.5 199.5 105.5C243 105.5 250 150 250 150H400V0Z"
            fill="url(#pattern0_18_186)"
          ></path>
          <defs>
            <pattern id="pattern0_18_186" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use
                xlink:href="#image0_18_186"
                transform="matrix(0.000596659 0 0 0.00159109 0 -0.243039)"
              ></use>
            </pattern>
            <image
              id="image0_18_186"
              width="1676"
              height="934"
              viewBox="0 0 400 150"
              preserveAspectRatio="none"
              xlink:href="data:image/png;base64,${bgImage}"
            ></image>
          </defs>
        </svg>
        <div
          class="w-[95px] h-[18px] absolute flex flex-nowrap left-1.5 justify-center items-center top-[122px] overflow-hidden ${roundStyle}"
        >
          <span class="text-xs text-center">
            ${nameMe.length > 11 ? nameMe.substring(0, 11) + '...' : nameMe}
          </span>
        </div>
        <div class="w-[90px] h-[90px] absolute left-[155px] top-[110px]">
          <img class="absolute left-[-1px] top-[-1px]" style="border-radius: 50%;" src="${profileImage}" />
        </div>
        ${titleName && svgIcon ? `<div
        class="absolute flex flex-nowrap items-center justify-center w-[95px] h-5 left-[299px] top-[122px] overflow-hidden ${roundStyle}"
      >
        <div class="w-[18px] h-[18px]">
          ${svgIcon}
        </div>
        <span class="text-xs text-center">
          ${titleName}
        </span>
      </div>` : ''}
      </div>
    `
    fs.writeFileSync('templateBg.html', templateBg)

    return await html2img(templateBg, 'localhost:8067', false, { width: 400, height: 200 })
}

function toArrayBuffer(buffer) {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function urlFileSize(url) {
    return new Promise(async (res, rej) => {
        let req = url.startsWith('https://') ? https.get(url) : http.get(url);
        req.once("response", r => {
            req.destroy();
            if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
                if (maxRedirects === 0) {
                    return rej(new Error('Too many redirects'));
                }
                return res(ufs(r.headers.location, timeout, maxRedirects - 1));
            }
            let c = parseInt(r.headers['content-length']);
            if (!isNaN(c)) res(c);
            else rej("Couldn't get file size");
        });
        req.once("error", e => {
            req.destroy();
            rej(e);
        });
        req.once("timeout", e => {
            req.destroy();
            rej(e);
        });
    })
}

// jadibot new client function
async function addUserAndConnectClientJadibot(ownerBot, idBot) {
    const responseAddUser = await axios.post(`${process.env.CLIENT_GOLANG_URL}/admin/users`, { name: ownerBot, token: idBot, webhook: 'http://192.18.129.58:7517/v3/webhook/message', events: 'Message,GroupInfo,GroupJoined,PairSuccess' }, { headers: { 'Content-Type': 'application/json' }, validateStatus: false })

    // get status
    const getStatusClient = await checkConnectClientJadibot(idBot)
    if(!getStatusClient.status) return { status: false, err: 'status' }
    if(getStatusClient?.data?.LoggedIn) return { status: false, err: 'already_connected' }

    if(!getStatusClient?.data?.data?.Connected) {
        const connectClient = await axios.post(`${process.env.CLIENT_GOLANG_URL}/session/connect`, { Subscribe: ["Message", "PairSuccess", "GroupJoined", "GroupInfo"] }, { headers: { Token: idBot, 'Content-Type': 'application/json' }, validateStatus: false })
        console.log('connect', connectClient.data)
        if(connectClient.status === 401) return { status: false, err: 'connect' }
    }

    return { status: true, data: typeof responseAddUser.data === 'string' ? JSON.parse(responseAddUser.data) : responseAddUser.data }
}

async function requestPairPhoneClientJadibot(idBot, phone) {
    const pairPhoneCode = await axios.post(`${process.env.CLIENT_GOLANG_URL}/session/pairphone`, { Phone: phone }, { headers: { Token: idBot, 'Content-Type': 'application/json' }, validateStatus: false })
    if(pairPhoneCode.status === 401) return { status: false, err: 'pairphone_401' }
    if(pairPhoneCode.status === 500) return { status: false, err: 'pairphone_not_connected' }
    return { status: true, data: pairPhoneCode.data?.data?.LinkingCode }
}

async function getQrClientJadibot(idBot) {
    const qrCode = await axios.get(`${process.env.CLIENT_GOLANG_URL}/session/qr`, { headers: { Token: idBot }, validateStatus: false })
    if(qrCode.status === 401) return { status: false, err: 'qr_401' }
    if(qrCode.status === 500) return { status: false, err: 'qr_not_connected' }
    return { status: true, data: qrCode.data?.data?.QRCode }
}

async function checkConnectClientJadibot(idBot) {
    const getStatusClient = await axios.get(`${process.env.CLIENT_GOLANG_URL}/session/status`, { headers: { Token: idBot }, validateStatus: false })
    if(getStatusClient.status === 401) return { status: false, err: 'status_401' }
    return { status: true, data: getStatusClient.data?.data }
}

// Fungsi untuk mendapatkan mood acak
function getRandomMood() {
    const moods = ['Buruk 😡', 'Biasa 😐', 'Baik 😊']
    const shuffledMoods = shuffleArray(moods)
    return shuffledMoods[0] // Mengembalikan mood pertama setelah diacak
}

/**
 * Downloads media using the Cobalt API
 * @param {string} url - URL to download from
 * @param {('auto'|'audio'|'mute')} [mode='auto'] - Download mode
 * @param {('144'|'240'|'360'|'480'|'720'|'1080'|'1440'|'2160'|'4320'|'max')} [videoQuality='1080'] - Video quality
 * @param {('320'|'256'|'128'|'96'|'64'|'8')} [audioBitrate='320'] - Audio bitrate
 * @param {boolean} [tiktokFullAudio=false] - Whether to download original TikTok audio
 * @returns {Promise<{success: boolean, message: string, filePath?: string}>}
 */
async function downloadWithCobalt(url, mode = 'auto', videoQuality = '1080', audioBitrate = '320', tiktokFullAudio = false, tiktokIsH265 = false, isEditProgress = false, rem = undefined, from) {
    const COBALT_API = process.env.COBALT_API_URL; // Replace with your API instance
    const API_KEY = process.env.COBALT_API_KEY; // Get API key from environment variable
    const randomIdRequest = Math.floor(Math.random() * 1000000000)

    try {
        if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Initializing download...")
        // Validate inputs
        if (!url) throw new Error('URL is required');
        if (!['auto', 'audio', 'mute'].includes(mode)) {
            throw new Error('Invalid mode. Must be auto, audio, or mute');
        }

        if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Requesting Cobalt API...")
        // Make request to Cobalt API
        let builderBodyCobalt = {
            url,
            downloadMode: mode,
            youtubeVideoCodec: 'h264',
            videoQuality: videoQuality.toString(),
            // audioFormat: 'best',
            audioBitrate: audioBitrate.toString(),
            tiktokFullAudio,
            filenameStyle: 'pretty',
            allowH265: tiktokIsH265,
            youtubeHLS: true
        }
        if(url.includes('tiktok.com') && url.includes('photo')) {
            builderBodyCobalt = {
                url,
                downloadMode: mode,
                filenameStyle: 'pretty'
            }
        }
        const response = await axios.post(COBALT_API, builderBodyCobalt, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${API_KEY}`
            }
        });

        let progressEventLoad = {}
        let isDownloadProgress = false
        let timeIntervalEveryUpdateProgress = 1.5 * 1000
        function downloadProgress() {
            if(isDownloadProgress) return
            isDownloadProgress = setInterval(async () => {
                if((progressEventLoad.loaded === progressEventLoad.total) && isDownloadProgress) {
                    clearInterval(isDownloadProgress)
                    isDownloadProgress = undefined
                    return
                }

                if(isEditProgress) {
                    let textEdit = `Download progress: ${((progressEventLoad.loaded / progressEventLoad.total) * 100).toFixed(1)}%`
                    if(!progressEventLoad.total) textEdit = 'Download progress: ' + clacSize_kb(progressEventLoad.loaded) + ' ' + clacSize_kb(progressEventLoad.rate) + '/s'
                    rem.sendEditMessage(from, isEditProgress.key, textEdit)
                }
            }, timeIntervalEveryUpdateProgress)
        }

        // Handle different response types
        switch (response.data.status) {
            case 'redirect':
            case 'tunnel': {
                let { url: downloadUrl, filename } = response.data;
                // add random id in the end of filename before the extension
                const splitFilename = filename.split('.')
                const extension = splitFilename.pop()
                filename = splitFilename.join('.') + `_${randomIdRequest}.${extension}`
                
                if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Starting file download...")
                // Download the file with progress tracking
                
                const fileResponse = await axios({
                    method: 'GET',
                    url: downloadUrl,
                    responseType: 'stream',
                    onDownloadProgress: (progressEvent) => {
                        progressEventLoad = progressEvent
                        if(isEditProgress && !isDownloadProgress) {
                            downloadProgress()
                        }
                    }
                });

                // Create downloads directory if it doesn't exist
                const downloadDir = path.join(process.cwd(), 'lib', 'cache', 'downloads');
                if (!fs.existsSync(downloadDir)) {
                    fs.mkdirSync(downloadDir);
                }

                // Save the file
                const filePath = path.join(downloadDir, filename);
                const writer = fs.createWriteStream(filePath);

                fileResponse.data.pipe(writer);

                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        if(isDownloadProgress) {
                            clearInterval(isDownloadProgress)
                            isDownloadProgress = undefined
                        }
                        if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Download completed!")

                        // fix all type video or music
                        // if type is audio or video and not image
                        const extension = path.extname(filePath)
                        if(!extension.endsWith('.jpg') && !extension.endsWith('.jpeg') && !extension.endsWith('.png') && !extension.endsWith('.webp')) {
                            if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Fixing video/audio content...")
                            const fixVideoAudioContent = spawn('ffmpeg', ['-i', filePath, '-c', 'copy', '-y', filePath + '.fixed' + extension])
                            // on output
                            fixVideoAudioContent.stdout.on('data', (data) => {
                                console.log(`ffmpeg stdout: ${data}`);
                            })
                            fixVideoAudioContent.on('close', () => {
                                if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Video/audio content fixed!")
                                fs.unlinkSync(filePath)
                                // fs.renameSync(filePath + '.fixed.mp4', filePath)
                                try {
                                    fs.renameSync(filePath + '.fixed' + extension, filePath)
                                } catch (error) {
                                    // ignore
                                }
                                resolve({
                                    success: true,
                                    message: 'Download completed successfully',
                                    filePath: [filePath]
                                })
                            })
                        } else {
                            resolve({
                                success: true,
                                message: 'Download completed successfully',
                                filePath: [filePath]
                            })
                        }
                    });
                    writer.on('error', (error) => {
                        if(isDownloadProgress) {
                            clearInterval(isDownloadProgress)
                            isDownloadProgress = undefined
                        }
                        reject(error);
                    });
                });
            }

            case 'picker': {
                if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Processing multiple files...")
                // Handle multiple files
                const downloads = [];
                
                // Download audio if present
                if (response.data.audio) {
                    downloads.push({
                        url: response.data.audio,
                        // filename: response.data.audioFilename add unique id in the end of filename
                        filename: `${Date.now()}_${response.data.audioFilename}`
                    });
                }

                // Add all picker items
                response.data.picker.forEach(item => {
                    downloads.push({
                        url: item.url,
                        filename: `${randomIdRequest}_${Math.floor(Math.random() * 1000000000)}${path.extname(item.url.split('?')[0])}` // Generate unique filename
                    });
                });

                // Download all files
                const downloadDir = path.join(process.cwd(), 'lib', 'cache', 'downloads');
                if (!fs.existsSync(downloadDir)) {
                    fs.mkdirSync(downloadDir);
                }

                if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Starting multiple file downloads...")
                const downloadPromises = downloads.map(async ({ url, filename }) => {
                    const fileResponse = await axios({
                        method: 'GET',
                        url,
                        responseType: 'stream'
                    });

                    const filePath = path.join(downloadDir, filename);
                    const writer = fs.createWriteStream(filePath);
                    fileResponse.data.pipe(writer);

                    return new Promise((resolve, reject) => {
                        // writer.on('finish', () => resolve(filePath)); fix all type video or music
                        writer.on('finish', () => {
                            const extension = path.extname(filePath)
                            if(!extension.endsWith('.jpg') && !extension.endsWith('.jpeg') && !extension.endsWith('.png') && !extension.endsWith('.webp')) {
                                const fixVideoAudioContent = spawn('ffmpeg', ['-i', filePath, '-c', 'copy', '-y', filePath + '.fixed' + extension])
                                fixVideoAudioContent.on('close', () => {
                                    fs.unlinkSync(filePath)
                                    fs.renameSync(filePath + '.fixed' + extension, filePath)
                                    resolve(filePath)
                                })
                            } else {
                                resolve(filePath)
                            }
                        });
                        writer.on('error', reject);
                    });
                });

                const filePaths = await Promise.all(downloadPromises);
                if(isEditProgress) rem.sendEditMessage(from, isEditProgress.key, "Status: Download completed!")
                return {
                    success: true,
                    message: 'Multiple files downloaded successfully',
                    filePath: filePaths
                };
            }

            case 'error': {
                throw new Error(`Cobalt API Error: ${JSON.stringify(response.data.error)}`);
            }

            default: {
                throw new Error(`Unknown response status: ${response.data.status}`);
            }
        }
    } catch (error) {
        if (error.response) {
            console.error(`Cobalt API Error: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Cobalt API Error`, error);
        }
        return {
            success: false,
            message: error.message
        };
    }
}

return {
    liriklagu,
    processTime,
    sleep,
    randomNimek,
    jadwalTv,
    random,
    //Nametag
    setNameTag,
    getNameTag,
    getNameTagList,
    replaceNameTag,
    addNameTag_tag,
    //Achievements
    // getAchievements,
    //Afinitas
    getAfinitas,
    getAfinitasLover,
    getAfinitasSaudara,
    getAfinitasSahabat,
    getAfinitasKepercayaan,
    checkAfinitasLimit,
    sendAfinitasRequest,
    getAfinitasRequests,
    acceptAfinitas,
    rejectAfinitas,
    removeAfinitas,
    //Mantan Afinitas Lover
    getUserMantanPasrl,
    setUserMantanPasrl,
    addUserMantanPasrl,
    //truth or dare
    startTodGame,
    selectNextTodPlayer,
    handleTodTimeout,
    continueTodGame,
    handleTodChoice,
    //EASTER EGG
    addPoint,
    MinPoint,
    getPoint,
    setPoint,
    //CHRISTMAS EVENT
    addToken,
    getToken,
    setToken,
    MinToken,
    addFrag,
    getFrag,
    setFrag,
    MinFrag,
    addSpentToken,
    MinSpentToken,
    getSpentToken,
    setSpentToken,
    getChristmasLeaderboard,
    getChristmasShopInventory,
    buyChristmasShopItem,
    generateChristmasReward,
    addChristmasSpentToken,
    //WARN
    addWarn,
    getWarn,
    removeWarn,
    //MONEY
    setMoney,
    getMoney,
    MinMoney,
    addMoney,
    setMoney_haram,
    getMoney_haram,
    MinMoney_haram,
    addMoney_haram,
    //Give Money Limit
    setMoneyLimitGive,
    getMoneyLimitGive,
    addMoneyLimitGive,
    //InvestUser
    setInvest_user,
    getInvest_user,
    MinInvest_user_coal,
    MinInvest_user_copper,
    MinInvest_user_iron,
    MinInvest_user_gold,
    MinInvest_user_diamond,
    MinInvest_user_sacoin,
    MinInvest_user_naocoin,
    MinInvest_user_elacoin,
    MinInvest_user_recoin,
    addInvest_user_coal,
    addInvest_user_copper,
    addInvest_user_iron,
    addInvest_user_gold,
    addInvest_user_diamond,
    addInvest_user_sacoin,
    addInvest_user_naocoin,
    addInvest_user_elacoin,
    addInvest_user_recoin,
    investTransaction,
    addInvest_counter_market,
    addInvest_limit,
    getInvest_limit,
    //Money Ren/RPG
    setHunt_profile,
    getHunt,
    getHunt_position,
    getDuel_ses,
    AnimalAtk_hunt,
    addHunt_Poin,
    replaceHunt_Xp,
    minHunt_Xp,
    addHunt_Xp,
    minHunt_Lvl,
    addHunt_Lvl,
    replaceHunt_Hp,
    minHunt_Hp,
    addHunt_Hp,
    replaceHunt_Atk,
    minHunt_Atk,
    addHunt_Atk,
    replaceHunt_Def,
    minHunt_Def,
    addHunt_Def,
    replaceHunt_Partner,
    replaceHunt_Area,
    minHunt_renMoney,
    addHunt_renMoney,
    replaceHunt_Weapon,
    replaceHunt_Class,
    addHunt_Inventory,
    replaceHunt_Inventory,
    addHunt_PartInven,
    // RPG
    registerRpg,
    getRpg,
    actionRpgDb,
    addInventoryRpg,
    removeInventoryRpg,
    addEconomyDbBatch,
    setMoneyRpg,
    calculateFightRpg,
    setStatsRpg,
    //XP
    getLevelingXp,
    getLevelingLevel,
    getLevelingId,
    getItemLevel,
    replaceLevelingXp,
    addLevelingXp,
    MinLevelingXp,
    addLevelingLevel,
    MinLevelingLevel,
    addLevelingId,
    //MINING
    getMiningJum,
    addMining,
    addJumMining,
    //BG
    addBg,
    getBg,
    replaceBg,
    //BGPROFILE
    addBgProfile,
    getBgProfile,
    replaceBgProfile,
    //AFK
    addAfk,
    getAfk,
    getAfkReason,
    getAfkTime,
    getAfkId,
    //ANTISPAM
    setLevelAntiSpam,
    getLevelAntiSpamId,
    addLevelAntiSpamCount,
    addLevelAntiSpamCountCmd,
    //TIME REMAINING
    getTimeRemaining,
    //LIMIT
    isLimit,
    limitAdd,
    limitMin,
    getLimit,
    limitGive,
    monospace,
    // LIST ITEM
    getUserListItem,
    addUserListItem,
    enableUserListItem,
    disableUserListItem,
    //ITEM
    getUserItemId,
    //ITEM LEVEL
    addItemLevel,
    addJumItemLevel,
    //ITEM JOB BOOST
    addItemJobBoost,
    addJumItemJobBoost,
    getItemJobBoost,
    // spy
    getUserItemIdSpy,
    addItemSpy,
    //PROFILE
    getCmd,
    addCmd,
    CmdAddJum,
    getCmdmsg,
    getCmdjum,
    getCmdPosition,
    //PREFIX
    replacePref,
    //SET RULES
    addrules,
    getrules,
    replaceRules,
    //SETUSER NAMA
    addNama,
    replaceNama,
    //SETUSER GENDER
    addGen,
    replaceGen,
    getGen,
    getGenMention,
    //SETUSER IG
    addIg,
    replaceIg,
    getIg,
    //TICTAC
        //Profile
    setTicTac_profile,
    getTicTac_profile,
    addTicTac_profile,
        //Game
    setTicTac_toe,
    getTicTac_toe,
    replaceTicTac_xo,
    replaceTicTac_status,
    replaceTicTac_turn,
    replaceTicTac_toe_game,
    //ww
    setWW_game,
    getWW_game,
    replaceWWValue_game,
    addWWPlayer_game,
    removeWWPlayer_game,
    getWWPlayer_game,
    replaceWWPlayer_status,
    replaceWWPlayer_value,
    stateWWGame_starting,
    stateWWGame_night,
    stateWWGame_midnight,
    stateWWGame_day,
    //ANTISIDER
    setMcount,
    setMcountData,
    addMcountData,
    replaceLastMsg,
    replaceSiderSet,
    getMcountDataGroupSet,
    getMcountData,
    getMcountDataId,
    //getMcountLastData,
    getMCountPosition,
    //GROUP JOIN TIME
    addJoinTime,
    getJoinGroup,
    //getJoinKey,
    //getJoinTime,
    //getJoinId,
    adduserKeyTime,
    getuserKeyId,
    //RANDOM
    GenerateRandomNumber,
    GenerateRandomChar,
    GenerateSerialNumber,
    //BACKUP
    addTimeBackup,
    //BANTEMP
    setTempBan,
    getTempBanUser,
    //,
    numberWithCommas,
    numberWithCommas2,
    //HITS
    addHitsCount,
    getHitsCount,
    //Convert Size
    clacSize_kb,
    bytestobits,
    //ZIPPY
    GetLink,
    getLinkRacaty,
    getBufferMega,
    getBufferOtakuFiles,
    //YT
    yt,
    //WEB
    getWebUser,
    setWebUser,
    //Redeem
    addCodeRedeem,
    getRedeemed,
    addUserRedeemed,
    //Limit Give
    setLimitGive_invest,
    getLimitGive_invest,
    addLimitGive_invest,
    //Zerochan Cache
    setZerochan_cache,
    getZerochan_cache,
    //Roleplay
    setUserMakanan,
    getUserMakan,
    replaceUserMakan,
    minUserMakan,
    addUserMakan,
    //Roleplay - Rumah
    setUserRoleplay_rumah,
    getUserRoleplay_rumah,
    replaceUserRoleplay_rumah,
    //addUserRoleplay_rumah,
    //Roleplay - Mobil
    setUserRoleplay_mobil,
    getUserRoleplay_mobil,
    getUserRoleplay_listMobil,
    addUserRoleplay_mobil,
    selectRoleplay_mobilUtama,
    addUserRoleplay_mobilModif,
    calculateMobilModif,
    metersToKm,
    kmHrMSec,
    pxToMeters,
    //Mantan
    setUserRoleplayMantan_pasangan,
    getUserRoleplayMantan_pasangan,
    addUserRoleplayMantan_pasangan,
    //Pasangan
    setUserRoleplay_pasangan,
    getUserRoleplay_pasangan,
    addUserRoleplayXP_pasangan,
    addUserRoleplayLevel_pasangan,
    replaceUserRoleplayFood_pasangan,
    replaceUserRoleplayHubungan_pasangan,
    replaceUserRoleplayHubungan_pasangan_force,
    replaceUserRoleplayUang_pasangan,
    replaceUserRoleplayStatus_pasangan,
    replaceUserRoleplayStatus2_pasangan,
    replaceUserRoleplayValue_pasangan,
    /*addUserRoleplayAnakKandungan_pasangan,
    getUserRoleplayAnakKandungan_pasangan,*/
    addUserRoleplayAnak_pasangan,
    //InvDiscount-item
    addDiscInv,
    getDscInv,
    delDscInvTimeCheck,
    //AutoDelete
    createAutoDelete,
    getAutoDelete,
    //WEB
    addDelTime,
    shuffleArray,
    zipDirectory,
    timeConvert,
    //WebpToMp4
    webp2mp4,
    webp2jpg,
    gif2mp4,
    //WriteStreamFetch
    responseToReadable,
    //FixE+
    fixNumberEPlus,
    showElapsedTime,
    decodeBase64Image,
    _notFoundQualityHandler,
    _epsQualityFunction,
    getQualityOtakudesu,
    requestPuppeteer,
    html2img,
    mobileLegendsWinRate,
    capitalizeFirstLetter,
    storeNameMsg,
    nocache,
    uncache,
    timeDifference,
    getAnimePlanetChara,
    getAniListChara,
    getArrayDoubleTop,
    requestWithProxyRandom,
    requestWithProxy,
    encryptValue,
    decryptValue,
    addExif,
    gif2webpFfmpeg,
    getAllJadibotFromAPI,
    getAllJadibotNewFromAPI,
    sendRequestRandomJadibotNew,
    sendRequestRandomJadibot,
    sendReqToGroupJadibot,
    arrayFindStartsWith,
    addCollectorMessage,
    textProgressBar,
    saveFormIgDown,
    checkImageNsfw,
    initLogCrashData,
    fetchFromObject,
    getLevelImageTemplate,
    convertStringToJSX,
    getProfileBgTemplate,
    toArrayBuffer,
    urlFileSize,
    addUserAndConnectClientJadibot,
    requestPairPhoneClientJadibot,
    getQrClientJadibot,
    checkConnectClientJadibot,
    downloadWithCobalt,
    getRandomMood
}
}