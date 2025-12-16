"use strict";
require('dotenv').config()

const listIgnoreMessageType = ['reactionMessage', 'messageContextInfo', 'pinInChatMessage', 'protocolMessage', 'scheduledCallEditMessage', 'scheduledCallCreationMessage', 'keepInChatMessage', 'requestPhoneNumberMessage', 'stickerSyncRmrMessage', 'fastRatchetKeySenderKeyDistributionMessage', 'senderKeyDistributionMessage']
const MessageType = { "document": "documentMessage", "video": "videoMessage", "image": "imageMessage", "audio": "audioMessage", "sticker": "stickerMessage", "buttonsMessage": "buttonsMessage", "extendedText": "extendedTextMessage", "contact": "contactMessage", "location": "locationMessage", "liveLocation": "liveLocationMessage", "product": "productMessage", "list": "listMessage", "listResponse": "listResponseMessage" }
//const makeWASocket = require('baileys').default
const readline = require('readline')
const color = require('./lib/color')
const figlet = require('figlet')
const moment = require('moment-timezone')
const fs = require('fs-extra')
const express = require('express');
const { exec } = require('child_process');
const cnvs = require('canvas')
const config = require('./config')
const cron = require('node-cron');
const toMs = require('ms')
// const pm2 = require('pm2')
const PhoneNumber = require('awesome-phonenumber');
const { numberWithCommas, sleep, getMoney, getMoney_haram, MinMoney, GenerateSerialNumber, delDscInvTimeCheck, addTimeBackup, zipDirectory, getrules, addrules, nocache, uncache, getLevelingLevel, getLevelingXp, stateWWGame_starting, stateWWGame_night, stateWWGame_midnight, stateWWGame_day, sendReqToGroupJadibot, getAllJadibotFromAPI, sendRequestRandomJadibot, getRedeemed, addUserRedeemed, fetchFromObject, getUserListItem, capitalizeFirstLetter, timeConvert, addCodeRedeem, getAllJadibotNewFromAPI, sendRequestRandomJadibotNew } = require('./lib/functions')(false)
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { default: axios } = require('axios');
const canvasRenderService1 = new ChartJSNodeCanvas({ width: 1920, height: 1080 });
const { Swiftcord } = require("swiftcord");
const cord = new Swiftcord();

const snappy = require('snappy');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

const { _mongo_GroupSchema, _mongo_UserSchema, _mongo_BotSchema, _mongo_ContactSchema, _mongo_AuthSchema, _mongo_RedeemSchema } = require('./lib/dbtype')(false)

// Cache groupMetadata
global.allListGroup = []
let groupMetadata_cache = []

global.ww = JSON.parse(fs.readFileSync('./lib/database/group/ww/core.json', 'utf8'))

global.countDatabaseChanged = 0
global.antispam = []

global.isCheckFreeStorage = true

const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.connect(process.env.MONGODB_PRODUCTION_URI)
mongoose.pluralize(null);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Behasil menghubungkan database mongo ✓!');
})


const isVirtualBot = false
const clientHandlerRequire = require('./lib/clientHandler_whatsmeow')
let clientjs = fs.readFileSync('./client_whatsmeow.js', 'utf8')
const width = 400
const height = 200
const canvass = cnvs.createCanvas(width, height); //FOR REUSE CANVAS
moment.tz.setDefault('Asia/Jakarta').locale('id')

// AUTO UPDATE BY NURUTOMO
// THX FOR NURUTOMO
// Cache handler and check for file change
require(process.cwd() + '/client_whatsmeow')
nocache(process.cwd() + '/client_whatsmeow', module => {
    console.log(`'${module}' Updated!`)
    clientjs = fs.readFileSync('./client_whatsmeow.js', 'utf8')
    if(global.jadibot['CORE']?.sendText) global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us', `'${module}' Updated!`)
})

require(process.cwd() + '/client_beta')
nocache(process.cwd() + '/client_beta', module => {
    console.log(`'${module}' Updated!`)
    if(global.jadibot['CORE']?.sendText)global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us',  `'${module}' Updated!`)
})

require(process.cwd() + '/lib/functions')
nocache(process.cwd() + '/lib/functions', module => {
    console.log(`'${module}' Updated!`)
    if(global.jadibot['CORE']?.sendText)global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us',  `'${module}' Updated!`)
})

require(process.cwd() + '/lib/Message-whatsmeow')
nocache(process.cwd() + '/lib/Message-whatsmeow', module => {
    console.log(`'${module}' Updated!`)
    if(global.jadibot['CORE']?.sendText)global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us',  `'${module}' Updated!`)
})

global.jadibot = []
global.botNumber = []
global.startupTime = Date.now()

async function handlePairSuccess(token, data) {
    console.log('handlePairSuccess', data)
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

const start = async (token) => {
    console.log(`Starting Jadibot with token: ${token}`, process.env.CLIENT_GOLANG_URL)
    const rem = { token: token, virtualBotId: token }

    let getSessionStatus = await axios.get(`${process.env.CLIENT_GOLANG_URL}/session/status`, { params: { token: token }, validateStatus: false })
    console.log('getSessionStatus', getSessionStatus?.data)
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

// const promises = []
process.on('message', async function(msg) {
    console.log(msg)
    if(msg == 'shutdown') {
        try {
            await fs.writeFileSync('./lib/database/group/ww/core.json', JSON.stringify(global.ww))
            process.exit()
        } catch (err) {
            await console.error(err)
            process.exit()
        }
    }
})
start('CORE')
    .catch(error => console.log(error))
    .then(async () => {
        await sleep(10000)

        const filterWWonlyCORE = global.ww.filter(all => all.client == 'CORE')
        for(let i = 0; i < filterWWonlyCORE.length; i++) {
            const statusPlay = filterWWonlyCORE[i].status.split('_')[1]
            if(statusPlay == 'starting') {
                stateWWGame_starting(filterWWonlyCORE[i].id, global.remOutsideAccess, false, undefined)
            } else if(statusPlay == 'night') {
                stateWWGame_night(filterWWonlyCORE[i].id, global.remOutsideAccess, false, undefined)
            } else if(statusPlay == 'midnight') {
                stateWWGame_midnight(filterWWonlyCORE[i].id, global.remOutsideAccess, false, undefined)
            } else if(statusPlay == 'day') {
                stateWWGame_day(filterWWonlyCORE[i].id, global.remOutsideAccess, false, undefined)
            }
        }

        // let delaySeconds = 15000
        
        // const virtualBotSc = require('./jadibot')
        // for(let i = 0; i < global.jadibot.length; i++) {
        //     const virtualBotId = global.jadibot[i].virtualBotId

        //     const jadibotSettings = JSON.parse(fs.readFileSync('./lib/database/jadibot/jadibotSettings.json', 'utf8'))

        //     if(jadibotSettings.findIndex(all => all.id == virtualBotId) == -1) {
        //         jadibotSettings.push({ id: virtualBotId })
        //         fs.writeFileSync('./lib/database/jadibot/jadibotSettings.json', JSON.stringify(jadibotSettings))
        //     }

        //     await sleep(delaySeconds)
        //     await virtualBotSc.start(virtualBotId)
        // }
    })


const countJidEmpty = [] // if count exceed 5, delete
const countConnectedNotLoggedIn = [] // if count exceed 2, delete
const timer = async () => {
    console.log('Timer Started')
    
    // Timer
    cron.schedule("*/1 * * * *", async function () {
        try {
            global.textTestInternetCache = undefined
            global.antispam = []
            
            const getAllJadibotFromGoClient = (await axios.get(`${process.env.CLIENT_GOLANG_URL}/admin/users`))
            const filterNotcoreJadibot = getAllJadibotFromGoClient.data.filter(all => all.token != 'CORE')
            const allJadibotFilterNotLoggedInOrConnected = filterNotcoreJadibot.filter(all => !all.connected || !all.loggedIn)
            const promiseAllJadibot = allJadibotFilterNotLoggedInOrConnected.map(async (jadibot) => {
                const { loggedIn, connected, token, id, jid, pairing } = jadibot;
            
                // if logged in and connected but JID is empty
                if (loggedIn && connected && !jid) {
                    // Increment or initialize the count for the bot
                    countJidEmpty[token] = (countJidEmpty[token] || 0) + 1;
            
                    // Check if the count exceeds the threshold
                    if (countJidEmpty[token] > 5) {
                        console.log('delete', token)
                        return axios.delete(`${process.env.CLIENT_GOLANG_URL}/admin/users/${id}`);
                    } else {
                        await axios.post(`${process.env.CLIENT_GOLANG_URL}/session/disconnect`, {}, { headers: { Token: token } });
                        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate wait
                        return axios.post(`${process.env.CLIENT_GOLANG_URL}/session/connect`, 
                            { Subscribe: ['Message', 'GroupInfo', 'GroupJoined', 'PairSuccess'] }, 
                            { headers: { Token: token } });
                    }
                }
            
                // if connected but not logged in and not pairing
                if (!loggedIn && connected && !pairing) {
                    // Increment or initialize the count for the bot
                    countConnectedNotLoggedIn[token] = (countConnectedNotLoggedIn[token] || 0) + 1;
            
                    // Check if the count exceeds the threshold
                    if (countConnectedNotLoggedIn[token] > 2) {
                        return axios.delete(`${process.env.CLIENT_GOLANG_URL}/admin/users/${id}`);
                    }
                }
            
                // if logged in and not connected, connect
                if (loggedIn && !connected) {
                    return axios.post(`${process.env.CLIENT_GOLANG_URL}/session/connect`, 
                        { Subscribe: ['Message', 'GroupInfo', 'GroupJoined', 'PairSuccess'] },
                        { headers: { Token: token } });
                }
            
                // if not connected and not logged in, connect, to double check is loggedIn
                if (!connected && !loggedIn) {
                    return axios.post(`${process.env.CLIENT_GOLANG_URL}/session/connect`, 
                        { Subscribe: ['Message', 'GroupInfo', 'GroupJoined', 'PairSuccess'] },
                        { headers: { Token: token } });
                }
            
                // default return for items not needing action
                return Promise.resolve();
            });
            
            // Execute all promises
            await Promise.all(promiseAllJadibot);
        } catch (err) {
            console.error(err)
        }
    })
    
    cron.schedule("*/10 * * * *", async function () {
        global.isCheckFreeStorage = true
    })
    
    cron.schedule("10 23 * * *", function () {    
        global.countDatabaseChanged = 0
    })
}

timer()


// API        
const bp = require('body-parser')
const router = express.Router();
const app = express();

app.use(bp.urlencoded({ limit: "500mb", extended: false, parameterLimit: 5000000000 }));
app.use(bp.json({ limit: "500mb", parameterLimit: 5000000000 }));

router.get('/', (req,res) => {
    res.send('App is healthy')
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

router.post('/api/v2/get/user', async (req, res) => {
    try {
        let getEconomy = {}
        let getUser = {}

        if(!req.body.onlyUser) getEconomy = { money: { money: numberWithCommas(getMoney(req.body.number)), moneyharam: numberWithCommas(getMoney_haram(req.body.number)) }, level: { lvl: getLevelingLevel(req.body.number), xp: getLevelingXp(req.body.number) } }
        if(!req.body.onlyEconomy) {
            let getImgUser = undefined
            try {
                getImgUser = await global?.jadibot['CORE']?.profilePictureUrl(req.body.number)
            } catch (err) {
                console.error(err)
            }
            
            getUser = { img: getImgUser, name: global?.jadibot['CORE']?.contacts(req.body.number) }
        }

        return res.send({ err: false, data: Object.assign(getEconomy, getUser) })
    } catch (err) {
        console.error(err)
        return res.status(502).send({ err: true })
    }
})

router.post('/api/v2/post/verifwa', (req, res) => {
    const randomNumber = req.body.code == undefined ? GenerateSerialNumber('00000') : req.body.code

    try {
        global?.jadibot['CORE']?.sendMessage(req.body.number, {
            text: req.body.text,
            footer: '@dwirizqi.h',
            templateButtons: [{ index: 1, urlButton: { displayText: 'Copy', url: `https://www.whatsapp.com/otp/copy/${randomNumber}` } }]
        })

        return res.send({ err: false, code: randomNumber })
    } catch (err) {
        console.error(err)
        return res.status(502).send({ err: true })
    }
})

router.post('/api/v2/get/jadibotlist', (req, res) => {
    res.send(Object.assign(global.jadibot1.map(({id, virtualBotId, isStop, retryCount, access}) => ({id, virtualBotId, isStop, retryCount, access: { user: access.user }})), global.jadibot2.map(({id, virtualBotId, isStop, retryCount, access}) => ({id, virtualBotId, isStop, retryCount, access: { user: access.user }}))) )
})

router.post('/api/v2/get/global/core_bot_user', (req, res) => {
    res.send(global?.jadibot['CORE']?.user)
})

router.post('/api/v2/post/useBotMethod', async (req, res) => {
    try {
        return res.send(await global.jadibot['CORE'][req.body.method](req.body.number, req.body.data, req.body.options || '', req.body.options1 || '', req.body.options2 || '', req.body.options3 || '', req.body.options4 || '', req.body.options5 || '', req.body.options6 || ''))
    } catch (err) {
        console.error(err)
        return res.send({ err: true })
    }
})

// router.post('/api/v2/set/jadibot', (req, res) => {
//     const posJadibotSettings = global.db['./lib/database/jadibot/jadibotSettings.json'].findIndex(all => all.id == req.body.id)

//     switch(req.body.query) {
//         case 'checkJadibotIsSelf':
//             try {
//                 global.db['./lib/database/jadibot/jadibotSettings.json'][posJadibotSettings].selfBot = req.body.act
//                 return res.send({ err: false })
//             } catch (err) {
//                 console.error(err)
//                 return res.send({ err: true })
//             }
//         break
//     }
// })

router.post('/api/post/status', async (req,res) => {
    res.send({ status: '200', status2: 'online' })
})

router.post('/api/post/group/isadmingroupall', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    var isAdminGroupALL = []
    const listGroup = global?.jadibot['CORE']?.chats.filter(all => all.id.endsWith('@g.us'))
    for (let i = 0; i < listGroup.length; i++) {
        const botNumber = global?.jadibot['CORE']?.user.jid
        console.log(listGroup[i].id)
        let groupMetadata = undefined
        try {
            groupMetadata = await global?.jadibot['CORE']?.groupMetadata(listGroup[i].id)
        } catch (err) {
            console.error(err)
            continue;
        }
        const groupMembers = groupMetadata.participants
        const groupAdmins0 = groupMembers.filter(admn => admn.admin != null)
        const groupAdmins = groupAdmins0.map(admn2 => admn2.id)
        if(groupAdmins.includes(botNumber) && groupAdmins.includes(req.body.id)) {
            isAdminGroupALL.push(listGroup[i].id)
        }
    }
    res.send(isAdminGroupALL)
})

router.post('/api/post/group/getgroupname', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    const groupMetadata = await global?.jadibot['CORE']?.groupMetadata(req.body.id)
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc.toString()
    res.send({ title: groupName, description: groupDesc })
})

router.post('/api/post/group/getgrouplink', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    var groupLink = await global?.jadibot['CORE']?.groupInviteCode(req.body.id)
    res.send(groupLink)
})

router.post('/api/post/group/getgroupmember', async (req,res) => {
    if(req.body.id == null) res.send('Invalid')
    const groupMetadata = await global?.jadibot['CORE']?.groupMetadata(req.body.id)
    const groupMembersHehe = groupMetadata.participants
    res.send(groupMembersHehe)
})

router.post('/api/post/group/getgroupadmin', async (req,res) => {
    if(req.body.id == null) res.send('Invalid')
    const groupMetadata = await global?.jadibot['CORE']?.groupMetadata(req.body.id)
    const groupMembers = groupMetadata.participants
    const groupAdmins0 = groupMembers.filter(admn => admn.admin != null)
    const groupAdminHehe = groupAdmins0.map(admn2 => admn2.id)
    res.send(groupAdminHehe)
})

router.post('/api/post/group/editgroupmember', async (req, res) => {
    if(req.body.id == null) return res.send('Invalid')
    if(req.body.list == null) return res.send('Invalid')
    if(req.body.act == null) return res.send('Invalid')
    if(req.body.act == 'kick') {
        try {
            for(let i = 0; i < req.body.list.length; i++) {
                await global?.jadibot['CORE']?.groupParticipantsUpdate(req.body.id, [req.body.list[i].id], "remove")
            }
            res.send('succes')
        } catch (err) {
            console.error(err)
            return res.send('error')
        }
    } else if(req.body.act == 'mkadmin') {
        try {
            for(let i = 0; i < req.body.list.length; i++) {
                await global?.jadibot['CORE']?.groupParticipantsUpdate(req.body.id, [req.body.list[i].id], 'promote')
            }
            res.send('succes')
        } catch (err) {
            console.error(err)
            return res.send('error')
        }
    } else if(req.body.act == 'dmtadmin') {
        try {
            for(let i = 0; i < req.body.list.length; i++) {
                await global?.jadibot['CORE']?.groupParticipantsUpdate(req.body.id, [req.body.list[i].id], 'demote')
            }

            res.send('succes')
        } catch (err) {
            console.error(err)
            return res.send('error')
        }
    }
})

router.post('/api/post/group/setgroupdata', async (req, res) => {
    if(req.body.id == null) return res.send('Invalid')
    if(req.body.name == null) return res.send('Invalid')
    if(req.body.admin == null) return res.send('Invalid')
    try {
        if(req.body.name != 'nodataaougfqbnf92nq8f7bqg38g7y9qu9q7q985uqj9q75gq8thnfyiqhfu') {
            await global?.jadibot['CORE']?.groupUpdateSubject(req.body.id, req.body.name)
        }
        if(req.body.admin == 'true') {
            await global?.jadibot['CORE']?.groupSettingUpdate(req.body.id, 'announcement')
        } else if(req.body.admin == 'false') {
            await global?.jadibot['CORE']?.groupSettingUpdate(req.body.id, 'not_announcement')
        }
        res.send('succes')
    } catch(err) {
        console.error(err)
        return res.send('error')
    }
})

router.post('/api/post/user/getusercontact', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    const contactUser = global?.jadibot['CORE']?.contacts(req.body.id) != undefined ? { id: req.body.id, notify: global?.jadibot['CORE']?.contacts(req.body.id) } : { id: '', notify: '' }
    res.send(contactUser)
})

router.post('/api/post/img/getuserpp', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    try {
        var getPicPP = await global?.jadibot['CORE']?.profilePictureUrl(req.body.id, 'image')
    } catch {
        var getPicPP = 'https://drive.google.com/uc?export=download&id=1X_syuBq1iAte7yDfpcR0EWR7zi2zufVq'
    }
    res.send(getPicPP)
})

router.post('/api/post/img/getgrouppp', async (req,res) => {
    if(req.body.id == null) return res.send('Invalid')
    try {
        var pfp = await global?.jadibot['CORE']?.profilePictureUrl(req.body.id, 'image')
    } catch {
        var pfp = 'https://drive.google.com/uc?export=download&id=1X_syuBq1iAte7yDfpcR0EWR7zi2zufVq'
    }
    res.send(pfp)
})

router.post('/api/post/addClickGamesLeaderboard', async (req, res) => {
    if(req.body.key != 'AOWFBPONOJOBOIBQI5NQ0NW0IN') return res.send('INVALID_BODY_KEY')
    if(req.body.data == undefined) return res.send('INVALID_BODY_DATA')

    const data = req.body.data
    for(let i = 0; i < data.length; i++) {
        const idUser = data[i].idUser
        const score = data[i].score

        const dataUser = await _mongo_UserSchema.findOne({ iId: idUser })
        if(dataUser) {
            if(dataUser?.gameWeb?.highScoreCG == undefined || dataUser?.gameWeb?.highScoreCG < score) {
                await _mongo_UserSchema.updateOne({ iId: idUser }, { $set: { "gameWeb.highScoreCG": score } })
            }
        }
    }
    return res.send('succes')
})

router.post('/access', async (req, res) => {
    if(req.body.id == undefined) return res.send({ status: false, msg: 'INVALID_BODY_ID' })
    if(req.body.key == undefined || req.body.key != 'OIAHOIFBAPW790709ba') return res.send({ status: false, msg: 'INVALID_BODY_KEY' })
    if(req.body.method == undefined) return res.send({ status: false, msg: 'INVALID_BODY_METHOD' })
    if(req.body.content == undefined || !Array.isArray(req.body.content)) return res.send({ status: false, msg: 'INVALID_BODY_CONTENT' })
    try {
        const accessBot = await global?.jadibot['CORE']?.[req.body.method](...req.body.content)
        return res.send({ status: true, data: accessBot })
    } catch (err) {
        console.error(err)
    }
})

router.post('/access/sendReqToGroup', async (req, res) => {
    if(req.body.id == undefined) return res.send({ status: false, msg: 'INVALID_BODY_ID' })
    if(req.body.key == undefined || req.body.key != 'OV5B1ON5O46BP23N3pa') return res.send({ status: false, msg: 'INVALID_BODY_KEY' })
    if(req.body.method == undefined) return res.send({ status: false, msg: 'INVALID_BODY_METHOD' })
    if(req.body.content == undefined || !Array.isArray(req.body.content)) return res.send({ status: false, msg: 'INVALID_BODY_CONTENT' })
    try {
        const accessBot = await sendReqToGroupJadibot(req.body.id, req.body.method, req.body.content)
        return res.send(accessBot)
    } catch (err) {
        console.error(err)
    }
})

// v3 api
router.post('/access/sendRequestRandomJadibot', async (req, res) => {
    if(req.body.apiKey == undefined || req.body.apiKey != 'OIAHOIFBAPW790709ba') return res.send({ status: false, msg: 'INVALID_BODY_KEY' })
    if(req.body.method == undefined) return res.send({ status: false, msg: 'INVALID_BODY_METHOD' })
    if(req.body.content == undefined || !Array.isArray(req.body.content)) return res.send({ status: false, msg: 'INVALID_BODY_CONTENT' })
    try {
        const accessBotSendReqRandomJadibot = await sendRequestRandomJadibotNew(req.body.method, req.body.content)
        return res.send({ status: true, data: accessBotSendReqRandomJadibot })
    } catch (err) {
        console.error(err)
    }
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_OWNCAST}/owncast`, (req, res) => {
    if(!req.body.type) return res.send({ status: false, message: 'INVALID_BODY_TYPE' })
    if(!req.body.eventData) return res.send({ status: false, message: 'INVALID_BODY_DATA' })

    const typeValid = ['CHAT', 'USER_JOINED', 'USER_PARTED']
    if(!typeValid.includes(req.body.type)) return res.send({ status: false, message: 'INVALID_BODY_TYPE' })

    let textFormattedSend = '*[ Owncast ]*\n\n'
    if(req.body.type === 'CHAT') {
        if(!req.body.eventData.rawBody) return res.send({ status: false, message: 'INVALID_BODY_DATA' })
        textFormattedSend += `*${req.body.eventData.user?.displayName}*:\n${req.body.eventData?.rawBody}`
    } else if(req.body.type === 'USER_JOINED') {
        textFormattedSend += `*${req.body.eventData.user?.displayName}* has joined the chat`
    } else if(req.body.type === 'USER_PARTED') {
        textFormattedSend += `*${req.body.eventData.user?.displayName}* has left the chat`
    }

    global?.jadibot['CORE']?.sendText('6281358181668@s.whatsapp.net', textFormattedSend)
    return res.send({ status: true, message: 'Message sent successfully' })
})

const ownerNumber = '6281358181668@s.whatsapp.net, 62856038120076@s.whatsapp.net'
const ownerNumber2 = '6281358181668@s.whatsapp.net, 62856038120076@s.whatsapp.net, 6282229778223@s.whatsapp.net, 6289521748989@s.whatsapp.net'
const sideOwnerNumber = '6281358181668@s.whatsapp.net, 62856038120076@s.whatsapp.net, 6288905861849@s.whatsapp.net, 6288991122630@s.whatsapp.net, 62895352400907@s.whatsapp.net, 6288245479653@s.whatsapp.net, 6281358181668@s.whatsapp.net, 62856038120076@s.whatsapp.net, 6282229778223@s.whatsapp.net, 6289521748989@s.whatsapp.net, 6285858254388@s.whatsapp.net, 6288809279029@s.whatsapp.net'
router.post('/api/v3/getUser', async (req, res) => {
    if(req.body.apiKey == undefined || req.body.apiKey != 'OIAHOIFBAPW790709ba') return res.send({ status: false, message: 'INVALID_BODY_KEY' })
    if(!req.body.type || !['email', 'number'].includes(req.body.type)) return res.send({ status: false, message: 'INVALID_BODY_TYPE' })
    if(!req.body.user) return res.send({ status: false, message: 'INVALID_BODY_USER' })
    if(!req.body.request || !Array.isArray(req.body.request) || req.body.request.length > 10) return res.send({ status: false, message: 'INVALID_BODY_REQUEST' })

    try {
        const requestUser = req.body.request
        for(let i = 0; i < requestUser.length; i++) {
            if(!['iId', 'email', 'name', 'isAdmin', 'isPremium', 'profilePic', 'money'].includes(requestUser[i])) return res.send({ status: false, message: 'INVALID_BODY_REQUEST' })
            
            const getUserData = await _mongo_UserSchema.findOne({ [req.body.type === 'number' ? 'iId' : 'email']: req.body.user })
            if(!getUserData) return res.send({ status: false, message: 'USER_NOT_FOUND' })
            
            let responseData = undefined
            switch(requestUser[i]) {
                case 'iId':
                    responseData = getUserData.iId
                break
                case 'email':
                    responseData = getUserData.email
                break
                case 'name':
                    let nameUser = getUserData?.rl?.name
                    if(!nameUser) {
                        let _contactDb = await _mongo_ContactSchema.findOne({ iId: getUserData.iId })
                        nameUser = await global?.jadibot['CORE']?.contacts(getUserData.iId, _contactDb)
                    }
                    responseData = nameUser
                break
                case 'isAdmin':
                    responseData = getUserData.isAdmin || false
                    if(ownerNumber.includes(getUserData.iId) || ownerNumber2.includes(getUserData.iId) || sideOwnerNumber.includes(getUserData.iId)) {
                        responseData = true
                    }
                break
                case 'isPremium':
                    responseData = getUserData.isPremium || false
                break
                case 'profilePic':
                    let participantsAvatarUserApi = undefined
                    try {
                        participantsAvatarUserApi = await global?.jadibot['CORE']?.profilePictureUrl(getUserData.iId)
                    } catch {
                        //ignore
                    }
                    responseData = participantsAvatarUserApi
                break
                case 'money':
                    responseData = getUserData?.economy?.money
                break
            }

            requestUser[i] = { [requestUser[i]]: responseData }

            if(i == requestUser.length - 1) {
                const assignObjUserAPI = Object.assign({}, ...requestUser)
                return res.send({ status: true, data: assignObjUserAPI })
            }
        }
    } catch (err) {
        console.error(err)
        return res.status(502).send({ status: false, message: 'ERROR' })
    }
})

router.post('/api/v3/redeemCode', async (req, res) => {
    if(req.body.apiKey == undefined || req.body.apiKey != 'OIAHOIFBAPW790709ba') return res.send({ status: false, message: 'INVALID_BODY_KEY' })
    if(req.body.code == undefined) return res.send({ status: false, message: 'INVALID_BODY_CODE' })
    if(req.body.user == undefined) return res.send({ status: false, message: 'INVALID_BODY_USER' })
    
    try {
        const dbRedeem = await _mongo_RedeemSchema.findOne({ code: req.body.code })
        if(!dbRedeem) return res.send({ status: false, message: 'REDEEM_NOT_FOUND' })

        const isUserRedeemed = getRedeemed(dbRedeem, req.body.user)
        if(isUserRedeemed) return res.send({ status: false, message: 'REDEEM_ALREADY_USED' })

        if(Date.now() >= dbRedeem.time.expired) return res.send({ status: false, message: 'REDEEM_EXPIRED' })
        if(Date.now() < dbRedeem.time.date) return res.send({ status: false, message: 'REDEEM_NOT_ACTIVE' })

        if(dbRedeem.claimed > dbRedeem.limit) return res.send({ status: false, message: 'REDEEM_LIMIT' })
        
        let formattedJsonReward = []
        const _userDb = await _mongo_UserSchema.findOne({ iId: req.body.user })
        for(let i = 0; i < dbRedeem.reward.length; i++) {
            const reward = dbRedeem.reward[i]
            if(reward.item < 1) return res.send({ status: false, message: 'REWARD_ITEM_INVALID' })

            let isNotReplaced = false
            if(reward?.isNotReplaced) {
                if(reward.reward.startsWith('item')) {
                    const checkDbTarget = fetchFromObject(_userDb, reward.reward)
                    if(checkDbTarget) {
                        isNotReplaced = true
                    } else {
                        const checkDeactive = getUserListItem(_userDb, true)
                        const splitDotReward = reward.reward.split('.').splice(1).join('.')
                        if(fetchFromObject(checkDeactive, splitDotReward)) isNotReplaced = true
                    }
                } else {
                    const checkDbTarget = fetchFromObject(_userDb, reward.reward)
                    if(checkDbTarget) isNotReplaced = true
                }
            }
            
            if(reward.reward.startsWith('item') && !isNotReplaced) {
                const checkDeactive = getUserListItem(_userDb, true)
                const keysDeactive = Object.keys(checkDeactive)
                const splitDotReward = reward.reward.split('.').splice(1)

                if(keysDeactive.includes(splitDotReward[0])) {
                    await _mongo_UserSchema.updateOne({ iId: req.body.user, [`item.item.${splitDotReward[0]}`]: { $exists: true } }, { [`$${reward.type == 'add' ? 'inc' : reward.type}`]: { [`item.item.$.${splitDotReward.join('.')}`]: reward.item } })
                } else {
                    await _mongo_UserSchema.updateOne({ iId: req.body.user }, { [`$${reward.type == 'add' ? 'inc' : reward.type}`]: { [reward.reward]: reward.item } })
                }
            } else if(!isNotReplaced) {
                await _mongo_UserSchema.updateOne({ iId: req.body.user }, { [`$${reward.type == 'add' ? 'inc' : reward.type}`]: { [reward.reward]: reward.item } })
            }

            const splittedReward = reward.reward.split('.')
            if(splittedReward[splittedReward.length - 1] == 'time') continue;

            let formattedRewardItem = reward.item
            if(reward.reward == 'item.jobBoost' && reward.type == 'set') formattedRewardItem = `x${reward.item?.xp}`

            const formattedPush = {
                type: reward.type,
                item: capitalizeFirstLetter(splittedReward[splittedReward.length - 1] == 'list' ? 'nametag' : splittedReward[splittedReward.length - 1]),
                amount: formattedRewardItem
            }
            if(reward.reward == 'item.level.level') {
                const findItemLevelTimeId = dbRedeem.reward.findIndex(all => all.reward == 'item.level.time')
                formattedPush.expired = moment(dbRedeem.reward[findItemLevelTimeId].item).format('DD/MM/YYYY HH:mm:ss')
                formattedPush.item = 'Double XP'
            }

            formattedJsonReward.push(formattedPush)
        }

        await addUserRedeemed(req.body.code, req.body.user)
        return res.send({ 
            status: true,
            data: {
                statusRedeem: 1,
                codeRedeem: req.body.code,
                ownerRedeem: `${dbRedeem.from ? `wa.me/${dbRedeem.from.replace('@s.whatsapp.net', '')}` : 'SYSTEM' }`,
                usedRedeem: dbRedeem.claimed,
                limitRedeem: dbRedeem.limit,
                timeExpired: moment(dbRedeem.time.expired).format('DD/MM/YYYY HH:mm:ss'),
                itemRedeem: formattedJsonReward
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(502).send({ status: false, message: 'ERROR' })
    }
})

router.post('/api/v3/createRedeemCode', async (req, res) => {
    if(req.body.apiKey == undefined || req.body.apiKey != 'OIAHOIFBAPW790709ba') return res.send({ status: false, message: 'INVALID_BODY_KEY' })
    if(req.body.user == undefined) return res.send({ status: false, message: 'INVALID_BODY_USER' })

    if(!req?.body?.redeemCount || isNaN(req?.body?.redeemCount)) return res.json({ status: false, message: 'Bad Request!' })
    if(!req?.body?.timeRedeem || !['Hari', 'Jam'].includes(req?.body?.timeRedeem)) return res.json({ status: false, message: 'Bad Request!' })
    if(!req?.body?.timeValueRedeem || isNaN(req?.body?.timeValueRedeem)) return res.json({ status: false, message: 'Bad Request!' })
    if(!req?.body?.redeemItems) return res.json({ status: false, message: 'Bad Request!' })
    if(!req?.body?.priceRedeem || isNaN(req?.body?.priceRedeem)) return res.json({ status: false, message: 'Bad Request!' })

    let parsedItems = []
    try {
        parsedItems = JSON.parse(req.body.redeemItems)
        if(!Array.isArray(parsedItems)) throw new Error('Bad Request!')
    } catch (error) {
        console.error('createRedeem Error:', error)
        return res.status(400).json({ status: false, message: 'Bad Request!' })
    }
    if(parsedItems.length < 1) return res.json({ status: false, message: 'Bad Request!' })
    
    try {
        // addCodeRedeem({
        //     code: "hVpDUCHuRHf0",
        //     time: { date: Date.now(), expired: 1672549200000 },
        //     limit: Infinity,
        //     claimed: 0,
        //     claimedBy: [],
        //     // reward: isPremium, invest.<item>, economy.<item>, nametag.list.<new nametag>, rl.<item>.<subitem>, type: push / add / set, item:  /** boolean / string / number */
        //     reward: [
        //         { reward: 'nametag.list', type: 'push', item: '馃獎 鏂板勾銇娿倎銇с仺銇嗮煄�' },
        //         { reward: 'item.level.level', type: 'add', item: 2 },
        //         { reward: 'item.level.time', type: 'set', item: 1672635600000, isNotReplaced: true },
        
        //         { reward: 'item.jobBoost', type: 'set', item: { xp: 2, time: 1672635600000 } },
        
        //         { reward: 'economy.money', type: 'add', item: 50000 },
        //         { reward: 'limit.limit', type: 'add', item: 100 },
        //     ]
        // })
        const codeRedeemCreate = GenerateSerialNumber("0000000000")
        const idRedeemItem = [{
            id: 'money',
            text: 'Money',
            reward: 'economy.money',
            price: 'numbertimeoptions',
            options: {
                type: 'add',
                number: 200000000,
                limitItem: 2_000_000
            }
        }, {
            id: 'xp',
            text: 'XP',
            reward: 'economy.xp',
            price: 'numbertimeoptions',
            options: {
                type: 'add',
                number: 180000000,
                limitItem: 4_000_000
            }
        }, {
            id: 'limit',
            text: 'Limit',
            reward: 'limit.limit',
            price: 200000,
            options: {
                type: 'add',
            }
        }, {
            id: 'doublexp',
            text: 'Double XP',
            reward: 'item.level.level',
            price: 8000000000000,
            options: {
                type: 'add',
                limitItem: 10,
                thenPush: {
                    reward: 'item.level.time',
                    type: 'set',
                    item: Date.now() + toMs('24h'),
                    isNotReplaced: true
                }
            }
        }]

        let formattedRedeemCreate = []
        for(let i = 0; i < parsedItems.length; i++) {
            const itemRedeem = parsedItems[i]
            if(!itemRedeem.name || !itemRedeem.count || isNaN(itemRedeem.count)) return res.json({ status: false, message: 'Bad Request!' })


            const idRedeemItemFind = idRedeemItem.find(all => all.text == itemRedeem.name)
            if(!idRedeemItemFind) continue
            if(idRedeemItemFind.options.limitItem && (itemRedeem.count > idRedeemItemFind.options.limitItem)) return res.json({ status: false, message: 'Bad Request!' })

            formattedRedeemCreate.push({ reward: idRedeemItemFind.reward, type: idRedeemItemFind.options.type, item: itemRedeem.count, isNotReplaced: idRedeemItemFind.options.isNotReplaced || false })
            if(idRedeemItemFind.options.thenPush) {
                formattedRedeemCreate.push(Object.assign(idRedeemItemFind.options.thenPush, { fromThenPush: true }))
            }
        }

        const totalPricePerKey = formattedRedeemCreate.map(all => {
            if(all.fromThenPush) return 0
            const isExistsId = idRedeemItem.find(all2 => all2.reward == all.reward)
            if(isExistsId.price == 'numbertimeoptions') {
                return isExistsId.options.number * all.item
            } else {
                return isExistsId.price * all.item
            }
        }).reduce((a, b) => a + b)

        const allKeyCount = req.body.redeemCount
        const totalPriceAllKey = allKeyCount * totalPricePerKey

        const dayKeyCount = timeConvert(Date.now() + (req.body.timeRedeem == 'Hari' ? Number(req.body.timeValueRedeem) * 86400000 : Number(req.body.timeValueRedeem) * 3600000))
        const totalPriceAllDay = (dayKeyCount.day || 1) * totalPriceAllKey
        console.log('totalPriceAllDay', totalPriceAllDay, dayKeyCount, totalPriceAllKey, req.body, toMs(req.body.timeRedeem == 'Hari' ? Number(req.body.timeValueRedeem) * 86400000 : Number(req.body.timeValueRedeem) * 3600000))

        const getUserDbRedeemCreate = await _mongo_UserSchema.findOne({ iId: req.body.user })
        if(getMoney(getUserDbRedeemCreate) < totalPriceAllDay) return res.send({ status: false, message: 'MONEY_NOT_ENOUGH' })
        if(totalPriceAllDay < 1) return res.send({ status: false, message: 'PRICE_NOT_VALID' })
        if(totalPriceAllDay != Number(req?.body?.priceRedeem)) return res.send({ status: false, message: 'PRICE_NOT_MATCH' })

        const createRedeemTimeAPI = Date.now()
        await MinMoney(req.body.user, totalPriceAllDay)
        await addCodeRedeem({
            code: codeRedeemCreate,
            time: { date: createRedeemTimeAPI, expired: req.body.timeRedeem == 'Hari' ? (Date.now() + Number(req.body.timeValueRedeem) * 86400000) : (Date.now() + Number(req.body.timeValueRedeem) * 3600000) },
            limit: req.body.redeemCount,
            claimed: 0,
            claimedBy: [],
            reward: formattedRedeemCreate,
            from: req.body.user
        })

        const returnValueRedeemCreate = {
            codeRedeem: codeRedeemCreate,
            ownerRedeem: `wa.me/${req.body.user.replace('@s.whatsapp.net', '')}`,
            limitRedeem: req.body.redeemCount,
            timeRedeem: moment(createRedeemTimeAPI).format('DD/MM/YYYY HH:mm:ss'),
            timeExpired: moment(req.body.timeRedeem == 'Hari' ? (Date.now() + Number(req.body.timeValueRedeem * 86400000)) : (Date.now() + Number(req.body.timeValueRedeem) * 3600000)).format('DD/MM/YYYY HH:mm:ss'),
        }
        return res.send({ status: true, data: returnValueRedeemCreate })
    } catch (err) {
        console.error(err)
        return res.status(502).send({ status: false, message: 'ERROR' })
    }
})

router.post('/api/v3/getRedeemCode', async (req, res) => {
    if(req.body.apiKey == undefined || req.body.apiKey != 'OIAHOIFBAPW790709ba') return res.send({ status: false, message: 'INVALID_BODY_KEY' })
    if(req.body.code == undefined) return res.send({ status: false, message: 'INVALID_BODY_CODE' })

    try {
        const dbRedeem = await _mongo_RedeemSchema.findOne({ code: req.body.code })
        if(!dbRedeem) return res.send({ status: false, message: 'REDEEM_NOT_FOUND' })

        let formattedJsonReward = []
        for(let i = 0; i < dbRedeem.reward.length; i++) {
            const reward = dbRedeem.reward[i]
            if(reward.item < 1) return res.send({ status: false, message: 'REWARD_ITEM_INVALID' })

            const splittedReward = reward.reward.split('.')
            if(splittedReward[splittedReward.length - 1] == 'time') continue;

            let formattedRewardItem = reward.item
            if(reward.reward == 'item.jobBoost' && reward.type == 'set') formattedRewardItem = `x${reward.item?.xp}`

            const formattedPush = {
                type: reward.type,
                item: capitalizeFirstLetter(splittedReward[splittedReward.length - 1] == 'list' ? 'nametag' : splittedReward[splittedReward.length - 1]),
                amount: formattedRewardItem
            }
            if(reward.reward == 'item.level.level') {
                const findItemLevelTimeId = dbRedeem.reward.findIndex(all => all.reward == 'item.level.time')
                formattedPush.expired = moment(dbRedeem.reward[findItemLevelTimeId].item).format('DD/MM/YYYY HH:mm:ss')
                formattedPush.item = 'Double XP'
            }
            if(reward.reward == 'economy.xp') {
                formattedPush.item = 'XP'
            }

            formattedJsonReward.push(formattedPush)
        }

        const isExpired = Date.now() >= dbRedeem?.time?.expired ? 0 : 1
        const dataReturnGetRedeem = {
            id: dbRedeem._id,
            statusRedeem: isExpired,
            codeRedeem: req.body.code,
            ownerRedeem: `${dbRedeem.from ? `wa.me/${dbRedeem.from.replace('@s.whatsapp.net', '')}` : 'SYSTEM' }`,
            usedRedeem: dbRedeem.claimed,
            limitRedeem: dbRedeem.limit,
            timeCreated: moment(dbRedeem.time.date).format('DD/MM/YYYY HH:mm:ss'),
            timeExpired: moment(dbRedeem.time.expired).format('DD/MM/YYYY HH:mm:ss'),
            itemRedeem: formattedJsonReward
        }
        return res.send({ status: true, data: dataReturnGetRedeem })
    } catch (err) {
        console.error(err)
        return res.status(502).send({ status: false, message: 'ERROR' })
    }
})

//github
router.post(`/webhook/${process.env.WEBHOOK_SECRET_GITHUBPUSH}/github/:repoName`, async (req, res) => {
    if(req.params.repoName == 'rem-comp-botwa') {
        res.send({ status: true })
    
        const repositoryCommit = req.body.repository
        const authorCommit = req.body.head_commit.author.username
    
        const countCommit = req.body.commits.length
        const fileAdded = req.body.head_commit.added.length > 6 ? req.body.head_commit.added.slice(0, 6).join(', ') + '...' : req.body.head_commit.added.join(', ') || false
        const fileRemoved = req.body.head_commit.removed.length > 6 ? req.body.head_commit.removed.slice(0, 6).join(', ') + '...' : req.body.head_commit.removed.join(', ') || false
        const fileModified = req.body.head_commit.modified.length > 6 ? req.body.head_commit.modified.slice(0, 6).join(', ') + '...' : req.body.head_commit.modified.join(', ') || false
    
        let textFormatted = `*[${repositoryCommit.full_name}]* ${countCommit} new commits`
        for(let i = 0; i < countCommit; i++) {
            textFormatted += `\n${i + 1}. _${req.body.commits[i].message.replace(/[\r\n]/gm, '\n')}_`
        }
    
        textFormatted += '\n' + (fileAdded ? `\nFile Added: ${fileAdded}` : '') + (fileRemoved ? `\nFile Removed: ${fileRemoved}` : '') + (fileModified ? `\nFile Modified: ${fileModified}` : '')
        textFormatted += `\n\nCommit By *_${authorCommit}_*`
        textFormatted += `\nhttps://github.com/${repositoryCommit.full_name}`
    
        let editMessage = undefined
        try {
            await global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us', textFormatted)
            editMessage = await global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us', "Deploying...")
        } catch (err) {
            console.error('Error sending message:', err)
        }

        try {
            if(editMessage) await global.jadibot['CORE'].sendEditMessage('6281358181668-1621640771@g.us', editMessage.key, 'Fetching...')
        } catch (err) {
            console.error('Error editing message:', err)
        }
        exec(`git -c credential.helper='!f() { echo "username=${process.env.GITHUB_USERNAME}"; echo "password=${process.env.GITHUB_SECRET}"; }; f' fetch --all`, { cwd: process.cwd() }
        ,async function(error1, stdout1, stderr1) {
            console.log('fetch', error1, stdout1, stderr1)
            if(error1) {
                try {
                    await global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us', '![ WARNING ]! Fetch Failed\nsee console for log')
                } catch (err) {
                    console.error('Error sending fetch failed message:', err)
                }
            }

            try {
                await global.jadibot['CORE'].sendEditMessage('6281358181668-1621640771@g.us', editMessage.key, 'Updating...')
            } catch (err) {
                console.error('Error editing message for update:', err)
            }
            exec(`git -c credential.helper='!f() { echo "username=${process.env.GITHUB_USERNAME}"; echo "password=${process.env.GITHUB_SECRET}"; }; f' reset --hard origin/master`, { cwd: process.cwd() }
            ,async function(error, stdout, stderr) {
                console.log('update', error, stdout, stderr)
                try {
                    if(error) {
                        await global.jadibot['CORE'].sendEditMessage('6281358181668-1621640771@g.us', editMessage.key, 'Error!')
                        await global.jadibot['CORE'].sendText('6281358181668-1621640771@g.us', '![ ERROR ]! Update Failed\nsee console for log')
                    } else {
                        await global.jadibot['CORE'].sendEditMessage('6281358181668-1621640771@g.us', editMessage.key, 'Success')
                    }
                } catch (err) {
                    console.error('Error sending final message:', err)
                }
            })
        })
    }
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_DONATENOTIF}/donate-notif`, async (req, res) => {
    console.log(req.body)
    const { id, donator_name, amount_raw, message, created_at } = req.body
    const donator_email = req.body.donator_email.toLowerCase()
    if(donator_email == 'someguy@example.com') return res.send({ status: false })
    await _mongo_BotSchema.updateOne({ iId: 'donate' }, { $push: { donate: { id, name: donator_name, email: donator_email, amount: amount_raw, time: Date.parse(created_at), msg: message, after_announce: false } } })

    let isExistsUser = false
    if(donator_email) isExistsUser = await _mongo_UserSchema.findOne({ email: donator_email }, { _id: 0, iId: 1, email: 1 })
    if(isExistsUser) await _mongo_BotSchema.updateOne({ iId: 'donate' }, { $addToSet: { claimed: isExistsUser.email } })
    if(isExistsUser) await _mongo_UserSchema.updateOne({ iId: isExistsUser.iId }, { $set: { isPremium: true }, $addToSet: { "nametag.list": "💫 Premium ✨" } })

    const textFormatted = `【DONATE】
Haik Onii-Chan ada yang donate nih >.<
--------------------------------------------------------
Dari : *${donator_name}* ${isExistsUser ? `@${isExistsUser.iId.replace('@s.whatsapp.net', '')}` : ''}
Nominal : _Rp. ${numberWithCommas(amount_raw)}_
Pesan : ${message}`

    // 120363115657382776@g.us 6281358181668-1621640771@g.us
    const payloadSend = { image: { url: './media/img/donate_image.png' }, caption: textFormatted }
    if(isExistsUser) payloadSend.mentions = [isExistsUser.iId]
    // await global.jadibot['CORE'].sendMessage('120363115657382776@g.us', payloadSend)

    const sendBody = { id: '120363115657382776@g.us', key: 'OV5B1ON5O46BP23N3pa', method: 'sendMessage', content: [payloadSend] }
    const portCoreBot = 7516

    try {
        await axios.post(`http://localhost:${portCoreBot}/access/sendReqToGroup`, sendBody)
    } catch (err) {
        console.error(err)
    }

    await getAllJadibotNewFromAPI()
    global.jadibot.forEach(async (jadibotData) => {
        try {
            await clientHandlerRequire(jadibotData.token, jadibotData.user.id).sendTextWithMentions(sendBody.id, textFormatted)
        } catch (err) {
            console.error(err)
        }
    })
    
    await _mongo_BotSchema.updateMany({ iId: 'donate', 'donate.id': id, 'donate.name': donator_name, 'donate.email': donator_email, 'donate.amount': amount_raw, 'donate.msg': message }, { $set: { 'donate.$.after_announce': true } })
    return res.send({ status: true })
})

app.use('/', router);
app.set('port', (7516))
app.listen(app.get('port'), () => {
    console.log('App Started on PORT', app.get('port'));
})