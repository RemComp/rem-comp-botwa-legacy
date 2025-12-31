"use strict";

const argv = require('minimist')(process.argv.slice(2));
if(argv.key == undefined || argv.key != 'OIBARPOINAIWRH9QONWI097124AOIHWFO' || (argv.server == undefined || typeof argv.server != 'number') || (argv.serverPort == undefined || typeof argv.serverPort != 'number')) return console.error('Invalid Argument!')

require('dotenv').config()

// const { default: BaileysBottle } = require('baileys-bottle')
const listIgnoreMessageType = ['reactionMessage', 'messageContextInfo', 'pinInChatMessage', 'protocolMessage', 'scheduledCallEditMessage', 'scheduledCallCreationMessage', 'keepInChatMessage', 'requestPhoneNumberMessage', 'stickerSyncRmrMessage', 'fastRatchetKeySenderKeyDistributionMessage', 'senderKeyDistributionMessage']
const MessageType = { "document": "documentMessage", "video": "videoMessage", "image": "imageMessage", "audio": "audioMessage", "sticker": "stickerMessage", "buttonsMessage": "buttonsMessage", "extendedText": "extendedTextMessage", "contact": "contactMessage", "location": "locationMessage", "liveLocation": "liveLocationMessage", "product": "productMessage" }
const color = require('./lib/color')
const cron = require('node-cron');
const figlet = require('figlet')
const moment = require('moment-timezone')
const fs = require('fs-extra')
const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const cnvs = require('canvas')
const toMs = require('ms')
const PhoneNumber = require('awesome-phonenumber');
const { sleep, GenerateSerialNumber, getrules, addrules, nocache, stateWWGame_starting, stateWWGame_night, stateWWGame_midnight, stateWWGame_day, sendReqToGroupJadibot, initLogCrashData, getAllJadibotNewFromAPI, sendReqToGroupJadibotNew, checkConnectClientJadibot } = require('./lib/functions')(false)
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const canvasRenderService1 = new ChartJSNodeCanvas({ width: 1920, height: 1080, chartCallback: (ChartJS) => {
    ChartJS.defaults.color = '#FFF';
}});

const snappy = require('snappy')

//Load File
global.ww = JSON.parse(fs.readFileSync('./lib/database/group/ww/jadibot_1.json', 'utf8'))

// global.countDatabaseChanged = Number(fs.readFileSync('./lib/database/bot/dbcount.json', 'utf8'))
global.serverJadibot = argv.server
// global.jadibot = JSON.parse(fs.readFileSync(`./lib/database/jadibot/jadibot${argv.server}.json`))
axios.post('http://localhost:7516/api/v2/get/global/core_bot_user', { validateStatus: () => true }).then(data => {
    if(data?.data?.jid !== undefined) global.coreBotNumber = data?.data?.jid
})
global.botNumber = []
global.antispam = []

let clientjs = fs.readFileSync('./client_whatsmeow.js', 'utf8')
require(process.cwd() + '/client_whatsmeow')
nocache(process.cwd() + '/client_whatsmeow', module => {
    console.log(`'${module}' Updated!`)
    clientjs = fs.readFileSync('./client.js', 'utf8')
})

require(process.cwd() + '/lib/functions')
nocache(process.cwd() + '/lib/functions', module => {
    console.log(`'${module}' Updated!`)
})

require(process.cwd() + '/lib/Message-whatsmeow')
nocache(process.cwd() + '/lib/Message-whatsmeow', module => {
    console.log(`'${module}' Updated!`)
})

global.jadibot = []
global.startupTime = Date.now()

//groupMetadata Cache
global.allListGroup = []
let groupMetadata_cache = []

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
let msgRetryCounterMap = { }

// Socket.io Connection
// const io = require('socket.io-client')
// const socket = io('http://localhost:8880', { path: '/jadibot' })

const { Swiftcord } = require("swiftcord");
const { _mongo_GroupSchema, _mongo_UserSchema, _mongo_BotSchema, _mongo_ContactSchema, _mongo_JadibotSchema, _mongo_CommandMessageSchema } = require('./lib/dbtype')(false)
const cord = new Swiftcord();

const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.connect(process.env.MONGODB_PRODUCTION_URI)
mongoose.pluralize(null);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Behasil menghubungkan database mongo ✓!');
})

moment.tz.setDefault('Asia/Jakarta').locale('id')

const browserSS = undefined

const isVirtualBot = true
const width = 400
const height = 200
const canvass = cnvs.createCanvas(width, height); //FOR REUSE CANVAS

async function handlePairSuccess(token, data) {
    console.log('handlePairSuccess', data)
    if(!global.jadibot[token]) global.jadibot[token] = {}
    if(!global.jadibot[token].token) global.jadibot[token].token = token
    global.jadibot[token].user = {
        id: data.JID,
        jid: data.JID.split('@')[0].split(':')[0] + '@s.whatsapp.net',
        lid: data.LID
    }

    if(global.jadibot[token].user?.lid) {
        // check is contactSchema has iId rem.user.jid, if no create
        const contact = await _mongo_ContactSchema.findOne({ iId: global.jadibot[token].user.jid })
        if(!contact) {
            await _mongo_ContactSchema.create({ iId: global.jadibot[token].user.jid, name: global.jadibot[token].user.name, lid: (global.jadibot[token].user.lid.split('@')[0].split(':')[0] + '@lid') })
        }
    }

    if(token === 'CORE') {
        global.coreBotNumber = global.jadibot[token].user.jid
    } else {
        global.botNumber.push(global.jadibot[token].user.jid)
    }
    if(!global.jadibot[token].access) global.jadibot[token].access = { user: global.jadibot[token].user }

    if(global.officialLinkInfoGroup == undefined) global.officialLinkInfoGroup = ''
    if(global.lastMessages == undefined) global.lastMessages = []

    const clientHandler = require('./lib/clientHandler_whatsmeow')(global.jadibot[token].token, global.jadibot[token].user.id, {})
    const listGroup = Object.values(await clientHandler.groupFetchAllParticipating())
    listGroup.forEach((group) => {
        global.allListGroup.push({ id: token, group_id: group.id })
    })
}

const start = async (token, name) => {
    const rem = { id: name, token: token, virtualBotId: token }

    let getSessionStatus = await axios.get(`${process.env.CLIENT_GOLANG_URL}/session/status`, { params: { token: token }, validateStatus: false })
    if(!getSessionStatus?.data?.data?.Connected) {
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/session/connect`, { Subscribe: ['Message', 'GroupInfo', 'GroupJoined', 'PairSuccess'] }, { headers: { Token: token } })
        getSessionStatus = await axios.get(`${process.env.CLIENT_GOLANG_URL}/session/status`, { params: { token: token } })
    }
    if((token === 'CORE') && !getSessionStatus?.data?.data?.LoggedIn) {
        let filteredPhoneNumber = undefined
        const phoneNumber = await question('Please enter mobile phone number:\n')
        filteredPhoneNumber = (phoneNumber.startsWith('08') ? phoneNumber.replace('08', '628') : phoneNumber)?.replace(/\+|@s.whatsapp.net|@|-| /gi, '')?.replace(/\s/g, '')?.trim()
        console.log(filteredPhoneNumber)
    
        const codePairPhone = await axios.post(`${process.env.CLIENT_GOLANG_URL}/session/pairphone`, { Phone: filteredPhoneNumber }, { headers: { Token: token } })
        if(codePairPhone?.data?.data?.LinkingCode) {
            console.log(`Pairing code: ${codePairPhone?.data?.data?.LinkingCode}`)
        }
    }

    console.log('------------------------------------------------')
    console.log(color(figlet.textSync('Rem Bot', { horizontalLayout: 'full' })))
    console.log('------------------------------------------------')
    console.log('[DEV] Mizuki')
    console.log('[SERVER] Server Started!')

    global.jadibot[token] = rem
    
    global.jadibot[token].contacts = (jid, _contactDbE) => {
        if(!jid.includes('@s.whatsapp.net')) return jid
        const findName = _contactDbE?.name
        if(findName == undefined || findName == null || findName == '') {
            return PhoneNumber(`+${jid.replace('@s.whatsapp.net', '')}`).getNumber('international')
        } else {
            return findName
        }
    }

    global.jadibot[token].battery = 'unavailable'

    if(!global.jadibot[token].user) handlePairSuccess(token, { JID: getSessionStatus?.data?.data?.JID, LID: getSessionStatus?.data?.data?.LID })
}

async function handleMessage(token, messageData) {
    let message = messageData
    let messageRaw = messageData

    if(message.key.remoteJid == 'status@broadcast' || message.key.remoteJid == undefined) return
    if((token != 'CORE') && message.key.id.startsWith('RMCP')) return
    // if(config.isPublic && message.key.fromMe) return 'fromMe'

    if(message == {} || message == undefined || message == [] || message == '' || !message) return

    if(listIgnoreMessageType.includes(message.type) || message.type == 'protocolMessage' || message.type == 'pollUpdateMessage') return

    if(!isNaN(parseInt(message.body)) && message?.quotedMsg != undefined && message?.quotedMsg?.id?.startsWith('RMCP') && message.quotedMsg.body.includes('metadata:')) {
        const metadata = message.quotedMsg.body.split('metadata:')[1]
        const decryptMetadata = await snappy.uncompressSync(Buffer.from(metadata, 'base64'))
        const buttonParse = Buffer.from(decryptMetadata).toString('utf-8')
        const buttonSplit = buttonParse.split('|r|')
        const selectedButtonId = buttonSplit[Number(parseInt(message.body)) - 1]
        message.selectedButtonId = selectedButtonId
        message.rawType = message.type
        message.type = 'buttonsResponseMessage'
    } else if(!isNaN(parseInt(message.body)) && message?.quotedMsg != undefined && message?.quotedMsg?.id?.startsWith('RMCP') && message.quotedMsg.body.includes('lmeta:')) {
        const Lmetadata = message.quotedMsg.body.split('lmeta:')[1]
        const LdecryptMetadata = await snappy.uncompressSync(Buffer.from(Lmetadata, 'base64'))
        const ListParse = Buffer.from(LdecryptMetadata).toString('utf-8')
        const ListSplit = ListParse.split('|r|')
        const selectedRowId = ListSplit[Number(parseInt(message.body)) - 1]
        message.selectedRowId = selectedRowId
        message.rawType = message.type
        message.type = 'listResponseMessage'
    }

    // reply,
    // sendText,
    // sendTextWithMentions,
    // sendFileAuto,
    // sendFile,
    // sendButtons,
    // sendList,
    // sendButtonsImage,
    // sendReact,
    // sendContact,
    // sendEditMessage,
    // deleteMessage,
    // readMessages,
    // groupMetadata,
    // groupAcceptInvite,
    // groupInviteCode,
    // groupGetInviteInfo,
    // groupRevokeInvite,
    // groupParticipantsUpdate,
    // groupSettingUpdate,
    // groupUpdateSubject,
    // groupUpdateDescription,
    // updateProfilePicture,
    // groupFetchAllParticipating,
    // groupLeave,
    // profilePictureUrl,
    // fetchStatus,
    // onWhatsApp,
    // sendPresenceUpdate
    const clientHandler = require('./lib/clientHandler_whatsmeow')(global.jadibot[token].token, global.jadibot[token].user.id, message)
    if(!global.jadibot[token]?.sendText) {
        global.jadibot[token].sendText = clientHandler.sendText
        global.jadibot[token].sendEventMessage = clientHandler.sendEventMessage
        global.jadibot[token].sendTextWithMentions = clientHandler.sendTextWithMentions
        global.jadibot[token].sendFileAuto = clientHandler.sendFileAuto
        global.jadibot[token].sendFile = clientHandler.sendFile
        global.jadibot[token].sendButtons = clientHandler.sendButtons
        global.jadibot[token].sendList = clientHandler.sendList
        global.jadibot[token].sendButtonsImage = clientHandler.sendButtonsImage
        global.jadibot[token].sendReact = clientHandler.sendReact
        global.jadibot[token].sendContact = clientHandler.sendContact
        global.jadibot[token].sendEditMessage = clientHandler.sendEditMessage
        global.jadibot[token].deleteMessage = clientHandler.deleteMessage
        global.jadibot[token].readMessages = clientHandler.readMessages
        global.jadibot[token].groupMetadata = clientHandler.groupMetadata
        global.jadibot[token].groupAcceptInvite = clientHandler.groupAcceptInvite
        global.jadibot[token].groupInviteCode = clientHandler.groupInviteCode
        global.jadibot[token].groupGetInviteInfo = clientHandler.groupGetInviteInfo
        global.jadibot[token].groupRevokeInvite = clientHandler.groupRevokeInvite
        global.jadibot[token].groupParticipantsUpdate = clientHandler.groupParticipantsUpdate
        global.jadibot[token].groupSettingUpdate = clientHandler.groupSettingUpdate
        global.jadibot[token].groupUpdateSubject = clientHandler.groupUpdateSubject
        global.jadibot[token].groupUpdateDescription = clientHandler.groupUpdateDescription
        global.jadibot[token].updateProfilePicture = clientHandler.updateProfilePicture
        global.jadibot[token].groupFetchAllParticipating = clientHandler.groupFetchAllParticipating
        global.jadibot[token].groupLeave = clientHandler.groupLeave
        global.jadibot[token].profilePictureUrl = clientHandler.profilePictureUrl
        global.jadibot[token].fetchStatus = clientHandler.fetchStatus
        global.jadibot[token].onWhatsApp = clientHandler.onWhatsApp
        global.jadibot[token].sendPresenceUpdate = clientHandler.sendPresenceUpdate

        const listGroup = Object.values(await global.jadibot[token].groupFetchAllParticipating())
        listGroup.forEach((group) => {
            global.allListGroup.push({ id: token, group_id: group.id })
        })
    }

    if((token === 'CORE') && !global.remOutsideAccess) {
        global.remOutsideAccess = global.jadibot[token]
    } else if(!global.jadibot[token].access) {
        global.jadibot[token].access = global.remOutsideAccess
    }

    const rem = global.jadibot[token]
    const reply = clientHandler.reply

    // groupMetadata
    let groupMetadata = undefined
    let findGroupMetadata = message.isGroupMsg && !message?.isConsole ? groupMetadata_cache[message.from] : undefined
    if((findGroupMetadata != undefined) || Date.now() <= findGroupMetadata?.cacheTs + toMs('10m')) {
        groupMetadata = findGroupMetadata
    } else {
        const temp_getGroupMetadata = message.isGroupMsg ? await rem.groupMetadata(message.from) : undefined
        if(temp_getGroupMetadata != undefined) {
            groupMetadata = temp_getGroupMetadata
            groupMetadata_cache[message.from] = Object.assign({ cacheTs: Date.now() }, temp_getGroupMetadata)
        }
    }
    if(groupMetadata?.id) {
        if(!global.allListGroup.find(all => all.group_id === groupMetadata.id)) global.allListGroup.push({ id: token, group_id: groupMetadata.id })
    }

    require('./client_whatsmeow')(rem, reply, messageRaw, message, MessageType, undefined, canvass, canvasRenderService1, clientjs, isVirtualBot, undefined, undefined, cord, undefined, groupMetadata, undefined)
}

async function handleReaction(message) {
    if(message.fromMe) return

    // // //Giveaway
    const dbGiveAway = await _mongo_GroupSchema.find({ iId: message.key.remoteJid })

    if(JSON.stringify(dbGiveAway) == '{}') return

    if(message.body == '👍') await _mongo_GroupSchema.updateOne({ iId: message.key.remoteJid }, { $addToSet: { "giveaway.participant": message.key.remoteJid.endsWith('@g.us') ? message.key.participant : message.key.remoteJid } })
}

async function handleGroupJoined(token, data) {
    const getListJoinGroupCmd = await _mongo_BotSchema.findOne({ iId: 'CORE' }, { listJoinGroup: 1, _id: 0 })
    
    const isJoinGroup = getListJoinGroupCmd?.listJoinGroup?.find((value) => value?.id == data?.JID)
    if(isJoinGroup) {
        const rem = global.jadibot[token]
        await rem.sendTextWithMentions(data.JID, `Hai, Aku Rem Bot\nAku telah dimasukkan oleh @${isJoinGroup.by.replace('@s.whatsapp.net', '')}\n\nKetik _.menu_ atau _.help_ untuk melihat menu bot`)
        await rem.sendFile(data.JID, './media/img/warning.png', 'warning.png', '*!! WARNING !!*\n*Mohon dibaca terlebih dahulu*\n\nHati-hati ketika meng admin group kan Bot\nKarena bot ini adalah *Bot Jadibot, atau Nomer Whatsapp Bot ini dipegang oleh Orang Lain*, Bukan oleh Pembuat Bot\n\nJika terjadi hal yang tidak diinginkan dengan Jadibot ini, Laporkan ke *_.reportjadibot_*', '', 'image')
        await _mongo_BotSchema.updateOne({ iId: 'CORE' }, { $pull: { listJoinGroup: { id: data.JID } } })
    }
}

async function handleGroupParticipantsUpdate(token, data) {
    let groupMetadataWelcome = undefined

    let _groupDb = await _mongo_GroupSchema.findOne({ iId: data.JID })
    const isWelcomeEnable = _groupDb.isJoinMsg

    if(data.Join?.[0]) {
        if(!isWelcomeEnable) return
        const rem = global.jadibot[token]

        //Date Format
        const monthsDate = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','October','November','Desember'];
        const daysDate = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

        const dateNow = new Date()
        if(groupMetadataWelcome == undefined) groupMetadataWelcome = await rem.groupMetadata(data.JID)
        let groupPicWelcome = './media/img/images_pp_blank.png'
        try {
            groupPicWelcome = await rem.profilePictureUrl(data.JID, 'image')
        } catch (err) {
            console.error(err)
        }

        const prefixGroup = _groupDb.prefix
        let getRulesWelcome = getrules(_groupDb)
        if (getRulesWelcome === undefined) {
            await addrules(data.JID, prefixGroup?.prefix || '.')
            _groupDb = await _mongo_GroupSchema.findOne({ iId: data.JID })
            getRulesWelcome = getrules(_groupDb)
        }

        for(let i = 0; i < data.Join.length; i++) {
            const participantsWelcome = data.Join
            let participantsImageWelcome = './media/img/images_pp_blank.png'
            try {
                participantsImageWelcome = await rem.profilePictureUrl(participantsWelcome[i], 'image')
            } catch (err) {
                console.error(err)
            }
            const dbParticipant = await _mongo_UserSchema.findOne({ iId: participantsWelcome[i] })
            const nameParticipants = dbParticipant?.rl?.name

            let _contactDb = await _mongo_ContactSchema.findOne({ iId: participantsWelcome[i] })
            let image = await cord.Welcome()
            .setUsername(nameParticipants || await rem.contacts(participantsWelcome[i], _contactDb))
            .setDiscriminator(participantsWelcome[i].substring(5, 9))
            .setMemberCount(groupMetadataWelcome.participants.length)
            .setGuildName(groupMetadataWelcome.subject)
            .setGuildIcon(groupPicWelcome)
            .setAvatar(participantsImageWelcome)
            .setBackground("./media/img/bgProfile.png")
            .toAttachment();

            const img = cord.write(image, "welcome.png");

            await rem.sendFile(data.JID, img.files[0].attachment, img.files[0].name, '', '', MessageType.image, 'image/x-png')

            let namePushUser = nameParticipants || ''
            if(getRulesWelcome.includes('{name}')) {
                namePushUser = (await _mongo_ContactSchema.findOne({ iId: participantsWelcome[i] }))?.name || ''
            }

            //Format Rules Welcome
            getRulesWelcome = getRulesWelcome.replace(/{mentions}/g, `@${participantsWelcome[i].replace('@s.whatsapp.net', '')}`)
            getRulesWelcome = getRulesWelcome.replace(/{name}/g, nameParticipants || namePushUser)
            getRulesWelcome = getRulesWelcome.replace(/{group}/g, groupMetadataWelcome.subject)

            getRulesWelcome = getRulesWelcome.replace(/{days}/g, daysDate[dateNow.getDay()])
            getRulesWelcome = getRulesWelcome.replace(/{month}/g, monthsDate[dateNow.getMonth()])
            getRulesWelcome = getRulesWelcome.replace(/{years}/g, dateNow.getFullYear())

            getRulesWelcome = getRulesWelcome.replace(/{date_days}/g, dateNow.getDate())
            getRulesWelcome = getRulesWelcome.replace(/{date_month}/g, dateNow.getMonth() + 1)
            getRulesWelcome = getRulesWelcome.replace(/{date_years}/g, dateNow.getFullYear())

            getRulesWelcome = getRulesWelcome.replace(/{time_hours}/g, dateNow.getHours())
            getRulesWelcome = getRulesWelcome.replace(/{time_minute}/g, dateNow.getMinutes())
            getRulesWelcome = getRulesWelcome.replace(/{time_seconds}/g, dateNow.getSeconds())

            getRulesWelcome = getRulesWelcome.replace(/{count}/g, groupMetadataWelcome.participants.length)
            

            if (getRulesWelcome == undefined) {
                rem.sendText(data.JID, `*!! Warning !!* setrules kosong || ${prefixGroup?.prefix || '.'}setrules`)
            } else {
                rem.sendTextWithMentions(data.JID, getRulesWelcome)
            }
        }
    }
}

const getAllCachedJadibot = JSON.parse(fs.readFileSync(`./lib/database/jadibot/jadibot_new.json`))
for(let i = 0; i < getAllCachedJadibot.length; i++) {
    const virtualBotId = getAllCachedJadibot[i].virtualBotId
    console.log('Starting', virtualBotId)

    // await sleep(1000)
    setTimeout(() => {
        start(virtualBotId) 
    }, 1000);
}

// checkWWGame()

// const promises = []
process.on('message', async function(msg) {
    console.log('jadibot', msg)
    if(msg == 'shutdown') {
        try {
            console.log('jadibot', 'Saving Data')
            await fs.writeFileSync(`./lib/database/jadibot/jadibot_new.json`, JSON.stringify(global.jadibot.map(({id, virtualBotId, dataId}) => ({id, virtualBotId, dataId}))))
            // await fs.writeFileSync(`./lib/database/group/ww/jadibot_${argv.server}.json`, JSON.stringify(global.ww))

            // for(let i = 0; i < global.jadibot.length; i++) {
            //     await global.jadibot[i].access.end()
            // }
            
            process.exit()
        } catch (err) {
            await console.error(err)
            process.exit()
        }
    }
})

module.exports = {
    start
}


// API        
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 5000000000 }));
app.use(bodyParser.json({ limit: "500mb", parameterLimit: 5000000000 }));

router.get('/', (req,res) => {
    return res.send('JadiBot API v2')
})

router.post('/v3/webhook/message', async (req, res, next) => {
    if(!req.body?.jsonData) return res.status(400).send({ err: true, message: 'Invalid Request' })

    const { token } = req.body
    if(!token) return res.status(400).send({ err: true, message: 'Invalid Token' })
    if(!global.jadibot[token]) {
        await getAllJadibotNewFromAPI()
    }

    const parseJsonData = JSON.parse(req.body.jsonData)
    const { event, type } = parseJsonData

    // console.log('Webhook Event Received:', type, 'for token:', token)
    if(type === 'Message') {
        const messageBeautify = require('./lib/Message-whatsmeow')
        const message = messageBeautify(token, { event }, { event }, (global.jadibot[token].user || global.jadibot[token].access.user))
        if(message === 'ignore_type') return res.send({ err: false, message: 'ignore_type' })
        // filter message.t not exceed global.startupTime
        if(message.t && (message.t < (global.startupTime / 1000))) return res.send({ err: false, message: 'expired_time' })

        if(message.type === 'reactionMessage') {
            handleReaction(token, message)
        } else {
            handleMessage(token, message)
        }
    } else if(type === 'GroupInfo') {
        handleGroupParticipantsUpdate(token, event)
    } else if(type === 'GroupJoined') {
        handleGroupJoined(token, event)
    } else if(type === 'PairSuccess') {
        if(!global.handlePairSuccess) global.handlePairSuccess = []
        if(global.handlePairSuccess[token]) {
            global.handlePairSuccess[token](event).then(() => {
                delete global.handlePairSuccess[token]
            })
        }
        handlePairSuccess(token, event)
    }
    res.send({ err: false })
})

router.post('/stop', async (req, res) => {
    try {
        const position = global.jadibot.findIndex(object => object.id == req.body.sender)
        if(position == -1) return res.send({ status: false, msg: 'not_found' })

        console.log(global.jadibot[position])

        const virtualBotIdStop = global.jadibot[position]?.virtualBotId
        await axios.delete(`${process.env.CLIENT_GOLANG_URL}/admin/users/${global.jadibot[position].dataId}`)
        await _mongo_JadibotSchema.deleteOne({ iId: virtualBotIdStop })

        return res.send({ status: true })
    } catch (err) {
        console.error(err)
        return res.send({ status: false })
    }
})

router.post('/access', async (req, res) => {
    if(req.body.id == undefined) return res.send({ status: false, msg: 'INVALID_BODY_ID' })
    if(req.body.key == undefined || req.body.key != 'OIAHOIFBAPW790709ba') return res.send({ status: false, msg: 'INVALID_BODY_KEY' })
    if(req.body.method == undefined) return res.send({ status: false, msg: 'INVALID_BODY_METHOD' })
    if(req.body.content == undefined || !Array.isArray(req.body.content)) return res.send({ status: false, msg: 'INVALID_BODY_CONTENT' })
    try {
        const position = global.jadibot.findIndex(object => object.virtualBotId == req.body.id)
        if(position == -1) return res.send({ status: false, msg: 'POS_VIRTUALBOTID_JADIBOT_NOT_FOUND' })
        const accessBot = await global.jadibot[position].access[req.body.method](...req.body.content)
        return res.send({ status: true, data: accessBot })
    } catch (err) {
        console.error(err)
    }
})

router.post('/access/sendReqToGroupJadibot', async (req, res) => {
    if(req.body.id == undefined) return res.send({ status: false, msg: 'INVALID_BODY_ID' })
    if(req.body.key == undefined || req.body.key != 'OV5B1ON5O46BP23N3pa') return res.send({ status: false, msg: 'INVALID_BODY_KEY' })
    if(req.body.method == undefined) return res.send({ status: false, msg: 'INVALID_BODY_METHOD' })
    if(req.body.content == undefined || !Array.isArray(req.body.content)) return res.send({ status: false, msg: 'INVALID_BODY_CONTENT' })
    try {
        const accessBot = await sendReqToGroupJadibotNew(req.body.id, req.body.method, req.body.content)
        return res.send(accessBot)
    } catch (err) {
        console.error(err)
    }
})

app.use('/', router);
app.set('port', (argv.serverPort))
app.listen(app.get('port'), () => {
    console.log('App Started on PORT', app.get('port'));
})

cron.schedule("*/1 * * * *", function () {
    global.textTestInternetCache = undefined
    global.antispam = []
})
