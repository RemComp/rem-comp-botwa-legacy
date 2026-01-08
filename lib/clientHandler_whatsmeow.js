const fs = require('fs')
const fetch = require('node-fetch')
const snappy = require('snappy')
const { createHash, randomBytes } = require('crypto')

const ffmpeg = require('fluent-ffmpeg')
const { Readable } = require('stream');

const axios = require('axios')
const FileType = require('file-type')
const path = require('path')

function generateIdMsg(userId) {
    const data = Buffer.alloc(8 + 20 + 16)
	data.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000)))

	if (userId) {
		const id = jidDecode(userId)
		if (id?.user) {
			data.write(id.user, 8)
			data.write('@c.us', 8 + id.user.length)
		}
	}

	const random = randomBytes(16)
	random.copy(data, 28)

    const hash = createHash('sha256').update(data).digest()
    return 'RMCP' + hash.toString('hex').toUpperCase().substring(0, 18)
}

function jidDecode (jid) {
	const sepIdx = typeof jid === 'string' ? jid.indexOf('@') : -1
	if(sepIdx < 0) {
		return undefined
	}

	const server = jid.slice(sepIdx + 1)
	const userCombined = jid.slice(0, sepIdx)

	const [userAgent, device] = userCombined.split(':')
	const user = userAgent.split('_')[0]

	return {
		server,
		user,
		domainType: server === 'lid' ? 1 : 0,
		device: device ? +device : undefined
	}
}

function formatResponseFromGoClient (from, responseData, teks = '') {
    const mapReturnData = {
        key: {
            remoteJid: from,
            fromMe: true,
            id: responseData.data?.data?.Id
        },
        message: {
            extendedTextMessage: { text: teks }
        },
        messageTimestamp: new Date(responseData.data?.data?.Timestamp),
    }
    return mapReturnData
}

const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
const isBase64 = (str) => base64RegExp.test(str);

const getTypeFile = async (buffer) => {
    const typeFileRaw = await FileType.fromBuffer(buffer);
    if (!typeFileRaw) return null;
    const [type, subtype] = typeFileRaw.mime.split('/');
    return { type, subtype, mime: typeFileRaw.mime };
};

module.exports = (rem, userId, message) => {

    // Chat Stuff
    async function reply(from, text) {
        if(message?.isConsole) return console.log(text)
        const payloadSend = {
            Phone: from,
            Body: text,
            Id: generateIdMsg(userId),
            ContextInfo: { StanzaId: message.id, Participant: message.sender }
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/text`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, text)
    }

    async function sendText(from, text, optionsText = {}, options = {}) {
        if(message?.isConsole) return console.log(text)
        const payloadSend = {
            Phone: from,
            Body: text,
            Id: generateIdMsg(userId)
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: options.quoted.id, Participant: options.quoted.sender }
        }
        if(optionsText?.mentions) {
            if(!payloadSend.ContextInfo) payloadSend.ContextInfo = {}
            payloadSend.ContextInfo.MentionedJID = optionsText.mentions
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/text`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, text)
    }

    async function sendEventMessage(from, nameEvent, startTime, location, optionsText = {}, options = {}) {
        if(message?.isConsole) return console.log(text)
        const payloadSend = {
            Phone: from,
            Cancel: false,
            NameEvent: nameEvent,
            StartTime: Number(startTime),
            Location: location,
            Id: generateIdMsg(userId)
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/event`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, nameEvent)
    }

    async function sendTextWithMentions (from, teks, isReply = '') {
        const payloadSend = {
            Phone: from,
            Body: teks,
            Id: generateIdMsg(userId)
        }
        let responseData = undefined
        if(!teks.includes('@')) {
            if(message?.isConsole) return console.log(teks)
        } else {
            let teks2 = teks.replace(/\n/g, " ");
            const testTags = teks2.trim().split(' ')
            let tags = []
            for(let i = 0; i < testTags.length; i++) {
                if(testTags[i].includes('@')) {
                    const testTags2 = testTags[i].replace('@', '') + '@s.whatsapp.net'
                    if(!isNaN(testTags2.split('@')[0])) {
                       tags.push(testTags2)
                    }
                }
            }

            payloadSend.ContextInfo = { MentionedJID: tags }
            if(isReply != '') {
                payloadSend.ContextInfo.StanzaId = isReply?.id
                payloadSend.ContextInfo.Participant = isReply?.sender
            }

            if(message?.isConsole) return console.log(teks)
        }

        responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/text`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, teks)
    }

    async function sendFileAuto(from, file, title = '', caption = '', isReply = '', option = {}) {
        const isBase64 = (data) => Buffer.from(data, 'base64').toString('base64') === data;
    
        const getTypeFile = async (buffer) => {
            const typeFileRaw = await FileType.fromBuffer(buffer);
            if (!typeFileRaw) return null;
            const [type, subtype] = typeFileRaw.mime.split('/');
            return { type, subtype, mime: typeFileRaw.mime };
        };
    
        const buildBase64Data = (mime, buffer) => {
            const base64Data = buffer.toString('base64');
            return `data:${mime};base64,${base64Data}`;
        };
    
        const buildPayload = (phone, fileData, typeFileRaw, caption, isReply, secondsDuration) => {
            const payload = {
                Phone: phone,
                Id: generateIdMsg(userId),
                Body: caption || title,
                Caption: caption || title
            };
            if (isReply) {
                payload.ContextInfo = { StanzaId: isReply.id, Participant: isReply.sender };
            }
            if(option?.mentions) {
                if(!payload.ContextInfo) payload.ContextInfo = {}
                payload.ContextInfo.MentionedJID = option.mentions
            }
            if (typeFileRaw.type === 'image' || typeFileRaw.type === 'video') {
                payload.Caption = caption;
            }
            if(typeFileRaw.type === 'document') {
                payload.Caption = caption;
                payload.FileName = title
            }
            if(secondsDuration) {
                payload.Seconds = Math.floor(secondsDuration)
            }
            payload[typeFileRaw.type.charAt(0).toUpperCase() + typeFileRaw.type.slice(1)] = fileData;
            return payload;
        };
    
        const sendRequest = async (endpoint, payload) => {
            return await axios.post(`${process.env.CLIENT_GOLANG_URL}${endpoint}`, payload, { headers: { Token: rem } });
        };
    
        const sendMessage = async (buffer) => {
            const typeFileRaw = await getTypeFile(buffer);
            let fileData, endpoint;
    
            let typeFile = ''
            let secondsDuration = 0
            if (typeFileRaw) {
                fileData =undefined
                switch (typeFileRaw.type) {
                    case 'image':
                        // if webp
                        if(typeFileRaw.mime === 'image/webp') {
                            typeFile = 'sticker'
                            fileData = buildBase64Data(typeFileRaw.mime, buffer);
                            endpoint = '/chat/send/sticker';
                        } else {
                            typeFile = 'image'
                            fileData = buildBase64Data(typeFileRaw.mime, buffer);
                            endpoint = '/chat/send/image';
                        }
                        break;
                    case 'video':
                        typeFile = 'video'
                        fileData = buildBase64Data(typeFileRaw.mime, buffer);
                        endpoint = '/chat/send/video';
                        break;
                    case 'audio':
                        // convert to this ffmpeg -i yourinput -ac 1 -ar 16000 -c:a libopus voicemessage.ogg with buffer result without save file
                        const tmpFolderLocation = `./lib/cache/ffmpeg`
                        const tmpFileLocation = `${tmpFolderLocation}/${Date.now()}.mp3`
                        if(!fs.existsSync(tmpFolderLocation)) fs.mkdirSync(tmpFolderLocation, { recursive: true })
                        fs.writeFileSync(tmpFileLocation, buffer)

                        const resultFileLocation = `${tmpFolderLocation}/result_${Date.now()}.ogg`
                        const promiseFfmpeg = new Promise((resolve, reject) => {
                            ffmpeg(tmpFileLocation)
                                .audioChannels(1)
                                .audioFrequency(16000)
                                .audioCodec('libopus')
                                .format('ogg')
                                .on('end', () => {
                                    resolve()
                                })
                                .on('error', (err) => {
                                    reject(err)
                                })
                                .pipe(fs.createWriteStream(resultFileLocation))
                        })
                        const getSecondsAudio = new Promise((resolve, reject) => {
                            ffmpeg.ffprobe(tmpFileLocation, (err, metadata) => {
                                if(err) reject(err)
                                resolve(metadata.format.duration)
                            })
                        })
                        secondsDuration = await getSecondsAudio
                        await promiseFfmpeg

                        buffer = fs.readFileSync(resultFileLocation)
                        fs.unlinkSync(tmpFileLocation)
                        fs.unlinkSync(resultFileLocation)
                        
                        typeFile = 'audio'
                        fileData = buildBase64Data('audio/ogg', buffer);
                        endpoint = '/chat/send/audio';
                        break;
                    default:
                        // Fallback to document if the type is not handled
                        typeFile = 'document'
                        fileData = buildBase64Data('application/octet-stream', buffer);
                        endpoint = '/chat/send/document';
                }
            } else {
                // Fallback to sending as document when type is not detected
                typeFile = 'document'
                fileData = buildBase64Data('application/octet-stream', buffer);
                endpoint = '/chat/send/document';
            }
    
            const payload = buildPayload(from, fileData, { type: typeFile, mime: typeFileRaw.mime }, caption, isReply, secondsDuration);
            const requestData = await sendRequest(endpoint, payload);
            return formatResponseFromGoClient(from, requestData, caption)
        };
    
        // Handle URL-based file, base64 string, and buffer data
        if (file?.url) {
            const response = await fetch(file.url);
            const buffer = await response.buffer();
            return await sendMessage(buffer);
        } else if (Buffer.isBuffer(file) || isBase64(file)) {
            const buffer = isBase64(file) ? Buffer.from(file, 'base64') : file;
            return await sendMessage(buffer);
        } else if (file.startsWith('https://') || file.startsWith('http://')) {
            const response = await fetch(file);
            const buffer = await response.buffer();
            return await sendMessage(buffer);
        } else {
            const buffer = await fs.readFileSync(file);
            return await sendMessage(buffer);
        }
    }

    async function sendFile(from, file, title = '', caption = '', isReply = '', type = '', mimetype = '', isBufferBeforeSend = false, option = {}) {
        const isBase64 = (data) => Buffer.from(data, 'base64').toString('base64') === data;
    
        const getTypeFile = async (buffer) => {
            const typeFileRaw = await FileType.fromBuffer(buffer);
            return { type: type.replace('Message', ''), mime: mimetype || typeFileRaw.mime };
        };
    
        const buildBase64Data = (mime, buffer) => {
            const base64Data = buffer.toString('base64');
            return mime ? `data:${mime};base64,${base64Data}` : base64Data;
        };
    
        const buildPayload = (phone, fileData, typeFileRaw, caption, isReply, secondsDuration) => {
            const payload = {
                Phone: phone,
                Id: generateIdMsg(userId),
                Body: caption || title,
            };
            if (isReply) {
                payload.ContextInfo = { StanzaId: isReply.id, Participant: isReply.sender };
            }
            if(option?.mentions) {
                if(!payload.ContextInfo) payload.ContextInfo = {}
                payload.ContextInfo.MentionedJID = option.mentions
            }
            if (typeFileRaw.type === 'image' || typeFileRaw.type === 'video') {
                payload.Caption = caption;
            }
            if(typeFileRaw.type === 'document') {
                payload.FileName = title
                payload.Caption = caption;
            }
            if(secondsDuration) {
                payload.Seconds = Math.floor(secondsDuration)
            }
            payload[typeFileRaw.type.charAt(0).toUpperCase() + typeFileRaw.type.slice(1)] = fileData;
            return payload;
        };
    
        const sendRequest = async (endpoint, payload) => {
            return await axios.post(`${process.env.CLIENT_GOLANG_URL}${endpoint}`, payload, { headers: { Token: rem } });
        };
    
        const sendMessage = async (buffer) => {
            const typeFileRaw = await getTypeFile(buffer);
            let fileData, endpoint;
    
            let typeFile = ''
            let secondsDuration = 0
            console.log('typeFileRaw', typeFileRaw, type)
            if (typeFileRaw) {
                fileData = undefined
                switch (typeFileRaw.type) {
                    case 'image':
                        // if webp
                        if(typeFileRaw.mime === 'image/webp') {
                            typeFile = 'sticker'
                            fileData = buildBase64Data(typeFileRaw.mime, buffer);
                            endpoint = '/chat/send/sticker';
                        } else {
                            typeFile = 'image'
                            fileData = buildBase64Data(typeFileRaw.mime, buffer);
                            endpoint = '/chat/send/image';
                        }
                        break;
                    case 'sticker':
                        typeFile = 'sticker'
                        fileData = buildBase64Data(typeFileRaw.mime, buffer);
                        endpoint = '/chat/send/sticker';
                        break;
                    case 'video':
                        typeFile = 'video'
                        fileData = buildBase64Data(typeFileRaw.mime, buffer);
                        endpoint = '/chat/send/video';
                        break;
                    case 'audio':
                        // convert to this ffmpeg -i yourinput -ac 1 -ar 16000 -c:a libopus voicemessage.ogg with buffer result without save file
                        const tmpFolderLocation = `./lib/cache/ffmpeg`
                        const tmpFileLocation = `${tmpFolderLocation}/${Date.now()}.mp3`
                        if(!fs.existsSync(tmpFolderLocation)) fs.mkdirSync(tmpFolderLocation, { recursive: true })
                        fs.writeFileSync(tmpFileLocation, buffer)

                        const resultFileLocation = `${tmpFolderLocation}/result_${Date.now()}.ogg`
                        const promiseFfmpeg = new Promise((resolve, reject) => {
                            ffmpeg(tmpFileLocation)
                                .audioChannels(1)
                                .audioFrequency(16000)
                                .audioCodec('libopus')
                                .format('ogg')
                                .on('end', () => {
                                    resolve()
                                })
                                .on('error', (err) => {
                                    reject(err)
                                })
                                .pipe(fs.createWriteStream(resultFileLocation))
                        })
                        const getSecondsAudio = new Promise((resolve, reject) => {
                            ffmpeg.ffprobe(tmpFileLocation, (err, metadata) => {
                                if(err) reject(err)
                                resolve(metadata.format.duration)
                            })
                        })
                        secondsDuration = await getSecondsAudio
                        await promiseFfmpeg

                        buffer = fs.readFileSync(resultFileLocation)
                        fs.unlinkSync(tmpFileLocation)
                        fs.unlinkSync(resultFileLocation)
                        
                        typeFile = 'audio'
                        fileData = buildBase64Data('audio/ogg', buffer);
                        endpoint = '/chat/send/audio';
                        break;
                    default:
                        // Fallback to document if the type is not handled
                        typeFile = 'document'
                        fileData = buildBase64Data('application/octet-stream', buffer);
                        endpoint = '/chat/send/document';
                }
            } else {
                // Fallback to sending as document when type is not detected
                typeFile = 'document'
                fileData = buildBase64Data('application/octet-stream', buffer);
                endpoint = '/chat/send/document';
            }
    
            const payload = buildPayload(from, fileData, { type: typeFile, mime: typeFileRaw.mime }, caption, isReply, secondsDuration);
            const requestData = await sendRequest(endpoint, payload);
            return formatResponseFromGoClient(from, requestData, caption)
        };
    
        // Handle URL-based file, base64 string, and buffer data
        if (file?.url) {
            const response = await fetch(file.url);
            const buffer = await response.buffer();
            return await sendMessage(buffer);
        } else if (Buffer.isBuffer(file) || isBase64(file)) {
            const buffer = isBase64(file) ? Buffer.from(file, 'base64') : file;
            return await sendMessage(buffer);
        } else if (file.startsWith('https://') || file.startsWith('http://')) {
            const response = await fetch(file);
            const buffer = await response.buffer();
            return await sendMessage(buffer);
        } else {
            const buffer = await fs.readFileSync(file);
            return await sendMessage(buffer);
        }
    }

    async function sendButtons (from, body, button, header = '', footer = '', options = {}, optionsText = {}, getMetadata = false, isSendNewButton = true) {
        if(message?.isConsole) return console.log('unsupported format | buttons')

        let arrayButton = button
        const textId = `${arrayButton.map((button) => button.id).join('|r|')}`
        const idMetadata = snappy.compressSync(textId)
        const textBodyButtons = `${body}\n\n${arrayButton.map((button, i) => `${i + 1}. ${button.text}`).join('\n')}\n\nmetadata:${Buffer.from(idMetadata).toString('base64')}`
        if(getMetadata) return textBodyButtons

        const payloadSend = {
            Phone: from,
            Body: textBodyButtons,
            Id: generateIdMsg(userId)
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: options.quoted.id, Participant: options.quoted.sender }
        }
        if(optionsText?.mentions) {
            if(!payloadSend.ContextInfo) payloadSend.ContextInfo = {}
            payloadSend.ContextInfo.MentionedJID = optionsText.mentions
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/text`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, textBodyButtons)
    }

    async function sendList (from, body, button, header = '', footer = '', options = {}, optionsText = {}) {
        if(message?.isConsole) return console.log('unsupported format | listButtons')

        let arraySections = button

        let textFormat = ''
        let idButtonFormat = ''
        let countNumber = 1
        for(let i = 0; i < arraySections.length; i++) {
            let insideRow = `\n*${arraySections[i].title}*`
            let idInsideRow = ''
            for(let j = 0; j < arraySections[i].rows.length; j++) {
                insideRow += `\n   ${countNumber}. ${arraySections[i].rows[j].title}`
                idInsideRow += `${arraySections[i].rows[j].rowId}|r|`
                countNumber++
            }
            textFormat += insideRow
            idButtonFormat += idInsideRow
        }
    
        const idMetadata = snappy.compressSync(idButtonFormat)
        const textBodyButtons = `--${header}--\n\n${body}\n${textFormat}\n\nlmeta:${Buffer.from(idMetadata).toString('base64')}`

        const payloadSend = {
            Phone: from,
            Body: textBodyButtons,
            Id: generateIdMsg(userId)
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: options.quoted.id, Participant: options.quoted.sender }
        }
        if(optionsText?.mentions) {
            if(!payloadSend.ContextInfo) payloadSend.ContextInfo = {}
            payloadSend.ContextInfo.MentionedJID = optionsText.mentions
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/text`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, textBodyButtons)
    }
    
    async function sendButtonsImage (from, body, imageFile, button, header = '', footer = '', options = {}) {
        if(message?.isConsole) return console.log('unsupported format | buttonsImage')

        let imageFileFilter = undefined
        let imageTypeButton = undefined
        if(Buffer.isBuffer(imageFile)) {
            // to base64
            imageTypeButton = await getTypeFile(imageFile)
            imageFileFilter = imageFile.toString('base64')
        } else if(imageFile.startsWith('https://') || imageFile.startsWith('http://')) {
            var response = await fetch(imageFile)
            // to base64
            const bufferResponse = await response.buffer()
            imageTypeButton = await getTypeFile(bufferResponse)
            imageFileFilter = bufferResponse.toString('base64')
        } else if(isBase64(imageFile)) {
            imageFileFilter = imageFile

            const bufferResponse = Buffer.from(imageFile, 'base64')
            imageTypeButton = await getTypeFile(bufferResponse)
        } else {
            const fsBuffer = fs.readFileSync(imageFile)
            imageTypeButton = await getTypeFile(fsBuffer)
            imageFileFilter = fsBuffer.toString('base64')
        }

        imageFileFilter = `data:${imageTypeButton.mime};base64,${imageFileFilter}`

        let arrayButton = button
    
        const textId = `${arrayButton.map((button) => button.id).join('|r|')}`
        const idMetadata = snappy.compressSync(textId)
        const textBodyButtons = `${body}\n\n${arrayButton.map((button, i) => `${i + 1}. ${button.text}`).join('\n')}\n\nmetadata:${Buffer.from(idMetadata).toString('base64')}`
        
        const payloadSend = {
            Phone: from,
            Caption: textBodyButtons,
            Image: imageFileFilter,
            Id: generateIdMsg(userId)
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: options.quoted.id, Participant: options.quoted.sender }
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/image`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, textBodyButtons)
    }

    async function sendReact(from, key, reaction) {
        if(message?.isConsole) return console.log('unsupported format | sendReact')

        const payloadSend = {
            Phone: from,
            Body: reaction,
            Id: key?.id || key
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/react`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData)
    }

    async function sendContact(from, name, vcard, options = {}) {
        if(message?.isConsole) return console.log('unsupported format | sendContact')

        const payloadSend = {
            Phone: from,
            Name: name,
            Vcard: vcard,
            Id: generateIdMsg(userId)
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: options.quoted.id, Participant: options.quoted.sender }
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/contact`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData)
    }

    async function sendEditMessage (from, key, text, optionsText = {}, options = {}) {
        if(message?.isConsole) return console.log('unsupported format | editMessage')

        const payloadSend = {
            Phone: from,
            Body: text,
            Id: key?.id ? key.id : key
        }
        if(options?.quoted) {
            payloadSend.ContextInfo = { StanzaId: optionsText.quoted.id, Participant: optionsText.quoted.sender }
        }
        if(optionsText?.mentions) {
            if(!payloadSend.ContextInfo) payloadSend.ContextInfo = {}
            payloadSend.ContextInfo.MentionedJID = optionsText.mentions
        }

        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/edit`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData, text)
    }

    async function deleteMessage (from, payload) {
        if(message?.isConsole) return console.log('unsupported format | deleteMessage')

        let payloadSend = {}
        if(payload.fromMe != undefined) {
            payloadSend = {
                Chat: from,
                Phone: payload.participant || from,
                Id: payload.id
            }
        } else {
            payloadSend = {
                Chat: from,
                Phone: payload.key.participant || from,
                Id: payload.key.id
            }
        }

        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/send/delete`, payloadSend, { headers: { Token: rem } })
        return formatResponseFromGoClient(from, responseData)
    }

    async function readMessages (payload) {
        if(message?.isConsole) return console.log('unsupported format | readMessages')

        const from = payload.remoteJid
        let payloadSend = {}
        if(payload.fromMe != undefined) {
            payloadSend = {
                Chat: from,
                Sender: payload.participant || from,
                Id: Array.isArray(payload.id) ? payload.id : [payload.id]
            }
        } else {
            payloadSend = {
                Chat: from,
                Sender: payload.key.participant || from,
                Id: Array.isArray(payload.key.id) ? payload.key.id : [payload.key.id]
            }
        }

        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/markread`, payloadSend, { headers: { Token: rem } })
        return true
    }

    // Group Stuff
    async function groupMetadata(from) {
        if(message?.isConsole) return console.log('unsupported format | groupMetadata')

        const payloadSend = {
            groupJID: from
        }
        const responseData = await axios.get(`${process.env.CLIENT_GOLANG_URL}/group/info`, { headers: { Token: rem }, params: payloadSend })
        const formattedData = {
            id: responseData.data?.data?.JID,
            subject: responseData.data?.data?.Name,
            subjectOwner: responseData.data?.data?.NameSetByPN,
            subjectTime: responseData.data?.data?.NameSetAt,
            size: responseData.data?.data?.Participants.length,
            creation: responseData.data?.data?.GroupCreated,
            owner: responseData.data?.data?.OwnerPN,
            desc: responseData.data?.data?.Topic,
            descId: responseData.data?.data?.TopicID,
            linkedParent: responseData.data?.data?.LinkedParentJID,
            restrict: responseData.data?.data?.IsLocked,
            announce: responseData.data?.data?.IsAnnounce,
            isCommunity: responseData.data?.data?.IsDefaultSubGroup,
            isCommunityAnnounce: responseData.data?.data?.IsAnnounce,
            joinApprovalMode: responseData.data?.data?.MemberAddMode,
            memberAddMode: responseData.data?.data?.MemberAddMode,
            participants: responseData.data?.data?.Participants.map((participant) => ({ jid: participant.PhoneNumber, admin: participant.IsAdmin ? 'admin' : null })),
            ephemeralDuration: responseData.data?.data?.DisappearingTimer
        }
        return formattedData
    }

    async function groupAcceptInvite(code) {
        if(message?.isConsole) return console.log('unsupported format | groupAcceptInvite')

        const payloadSend = {
            Code: code
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/join`, payloadSend, { headers: { Token: rem } })
        return true
    }

    async function groupInviteCode(from) {
        if(message?.isConsole) return console.log('unsupported format | groupInviteCode')

        const payloadSend = {
            groupJID: from
        }
        const responseData = await axios.get(`${process.env.CLIENT_GOLANG_URL}/group/invitelink`, { headers: { Token: rem }, params: payloadSend })
        return responseData.data?.data?.InviteLink.split('/')[3]
    }

    async function groupGetInviteInfo(code) {
        if(message?.isConsole) return console.log('unsupported format | groupGetInviteInfo')

        const payloadSend = {
            Code: code
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/inviteinfo`, payloadSend, { headers: { Token: rem } })
        const formattedData = {
            id: responseData.data?.data?.JID,
            subject: responseData.data?.data?.Name,
            subjectOwner: responseData.data?.data?.NameSetBy,
            subjectTime: responseData.data?.data?.NameSetAt,
            size: responseData.data?.data?.Participants.length,
            creation: responseData.data?.data?.GroupCreated,
            owner: responseData.data?.data?.OwnerJID,
            desc: responseData.data?.data?.Topic,
            descId: responseData.data?.data?.TopicID,
            linkedParent: responseData.data?.data?.LinkedParentJID,
            restrict: responseData.data?.data?.IsLocked,
            announce: responseData.data?.data?.IsAnnounce,
            isCommunity: responseData.data?.data?.IsDefaultSubGroup,
            isCommunityAnnounce: responseData.data?.data?.IsAnnounce,
            joinApprovalMode: responseData.data?.data?.MemberAddMode,
            memberAddMode: responseData.data?.data?.MemberAddMode,
            participants: responseData.data?.data?.Participants.map((participant) => ({ id: participant.JID, admin: participant.IsSuperAdmin ? 'superadmin' : participant.IsAdmin ? 'admin' : null })),
            ephemeralDuration: responseData.data?.data?.DisappearingTimer
        }
        return formattedData
    }

    async function groupRevokeInvite(from) {
        if(message?.isConsole) return console.log('unsupported format | groupRevokeInvite')

        const payloadSend = {
            groupJID: from,
            reset: true
        }
        await axios.get(`${process.env.CLIENT_GOLANG_URL}/group/invitelink`, { headers: { Token: rem }, params: payloadSend })
        return true
    }

    async function groupParticipantsUpdate(from, participants, action) {
        if(message?.isConsole) return console.log('unsupported format | groupParticipantsUpdate')

        const payloadSend = {
            GroupJID: from,
            Phone: Array.isArray(participants) ? participants : [participants],
            Action: action
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/updateparticipants`, payloadSend, { headers: { Token: rem } })
        return true
    }

    async function groupSettingUpdate(from, value) {
        if(message?.isConsole) return console.log('unsupported format | groupSettingUpdate')

        const payloadSend = {
            GroupJID: from,
            Announce: value === 'announcement' ? true : false,
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/announce`, payloadSend, { headers: { Token: rem } })
        return true
    }

    async function groupUpdateSubject(from, subject) {
        if(message?.isConsole) return console.log('unsupported format | groupUpdateSubject')

        const payloadSend = {
            GroupJID: from,
            Name: subject
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/name`, payloadSend, { headers: { Token: rem } })
        return true
    }

    async function groupUpdateDescription(from, desc) {
        if(message?.isConsole) return console.log('unsupported format | groupUpdateDescription')

        const payloadSend = {
            GroupJID: from,
            Topic: desc
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/topic`, payloadSend, { headers: { Token: rem } })
        return true
    }

    async function updateProfilePicture(from, image) {
        if(message?.isConsole) return console.log('unsupported format | updateProfilePicture')

        const payloadSend = {
            GroupJID: from,
            Image: image.toString('base64')
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/photo`, payloadSend, { headers: { Token: rem } })
        return true
    }

    // get all group list
    async function groupFetchAllParticipating() {
        if(message?.isConsole) return console.log('unsupported format | groupFetchAllParticipating')

        const responseData = await axios.get(`${process.env.CLIENT_GOLANG_URL}/group/list`, { headers: { Token: rem } })
        const formattedData = responseData.data?.data?.Groups.map((group) => ({
            id: group.JID,
            subject: group.Name,
            subjectOwner: group.NameSetBy,
            subjectTime: group.NameSetAt,
            size: group.Participants.length,
            creation: group.GroupCreated,
            owner: group.OwnerJID,
            desc: group.Topic,
            descId: group.TopicID,
            linkedParent: group.LinkedParentJID,
            restrict: group.IsLocked,
            announce: group.IsAnnounce,
            isCommunity: group.IsDefaultSubGroup,
            isCommunityAnnounce: group.IsAnnounce,
            joinApprovalMode: group.MemberAddMode,
            memberAddMode: group.MemberAddMode,
            participants: group.Participants.map((participant) => ({ id: participant.JID, admin: participant.IsSuperAdmin ? 'superadmin' : participant.IsAdmin ? 'admin' : null })),
            ephemeralDuration: group.DisappearingTimer
        }))
        return formattedData
    }

    // leave group
    async function groupLeave(from) {
        if(message?.isConsole) return console.log('unsupported format | groupLeave')

        const payloadSend = {
            GroupJID: from
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/group/leave`, payloadSend, { headers: { Token: rem } })
        return true
    }

    // Avatar Stuff
    async function profilePictureUrl(from, hd = false) {
        if(message?.isConsole) return console.log('unsupported format | profilePictureUrl')

        const payloadSend = {
            Phone: from,
            Preview: !hd
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/user/avatar`, payloadSend, { headers: { Token: rem } })
        return responseData.data?.data?.url
    }

    // User Stuff
    async function fetchStatus(from) {
        if(message?.isConsole) return console.log('unsupported format | fetchStatus')

        const payloadSend = {
            Phone: Array.isArray(from) ? from : [from]
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/user/info`, payloadSend, { headers: { Token: rem } })
        return responseData.data?.data?.Users
    }

    async function onWhatsApp(from) {
        if(message?.isConsole) return console.log('unsupported format | onWhatsApp')

        const payloadSend = {
            Phone: Array.isArray(from) ? from : [from]
        }
        const responseData = await axios.post(`${process.env.CLIENT_GOLANG_URL}/user/check`, payloadSend, { headers: { Token: rem } })
        return responseData.data?.data?.Users.map((user) => ({ exists: user.IsInWhatsapp, jid: user.JID }))
    }

    async function sendPresenceUpdate(type, from) {
        if(message?.isConsole) return console.log('unsupported format | sendPresenceUpdate')

        const payloadSend = {
            Phone: from,
            State: type
        }
        await axios.post(`${process.env.CLIENT_GOLANG_URL}/chat/presence`, payloadSend, { headers: { Token: rem } })
        return true
    }

    return {
        reply,
        sendText,
        sendEventMessage,
        sendTextWithMentions,
        sendFileAuto,
        sendFile,
        sendButtons,
        sendList,
        sendButtonsImage,
        sendReact,
        sendContact,
        sendEditMessage,
        deleteMessage,
        readMessages,
        groupMetadata,
        groupAcceptInvite,
        groupInviteCode,
        groupGetInviteInfo,
        groupRevokeInvite,
        groupParticipantsUpdate,
        groupSettingUpdate,
        groupUpdateSubject,
        groupUpdateDescription,
        updateProfilePicture,
        groupFetchAllParticipating,
        groupLeave,
        profilePictureUrl,
        fetchStatus,
        onWhatsApp,
        sendPresenceUpdate
    }
}