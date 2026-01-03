const getAllCmd = require('./help')

exports.help = (pushname, roleid, tierTag, levelny, prefix, pd, countdownS5_day, countdownS5_hours, countdownS5_minutes, countdownS5_seconds, top_additional_info = '', center_additional_info = '', bottom_additional_info = '') => {
    return `
«────── ⟨⟨ 𝖚𝖘𝖊𝖗 ⟩⟩ ───────»
${top_additional_info}
➥ Nama: ${pushname}
➥ Nametag : ${roleid}
➥ Level: ${levelny}
➥ Tier: ${tierTag} ${JSON.stringify(pd) != '{}' && pd != undefined && pd?.nama != undefined ? "\n➥ Pasangan: " + pd?.nama : ""}
${center_additional_info}
«───────────────────»

⟨⟨ Untuk Memunculkan Command ⟩⟩
➥ .help
➥ .allcmd
➥ .command

⟨⟨ Untuk mengikuti info terbaru dari Bot. Silahkan ikuti channel ini ⟩⟩

➥ https://whatsapp.com/channel/0029VaBPSBZEFeXjvdEkec0x

╰──────────────────››
${bottom_additional_info}`
}
exports.shopmenu = (xpnya, money, prefix) => {
    return `
Selamat datang di Nomart
*Selamat berbelanja*
━━━━━━━━━━━━━━━━━
Xp: ${xpnya}
━━━━━━━━━━━━━━━━━
LIMIT:
1. 5 limit = 50k XP
2. 10 limit = 100k XP
3. 15 limit = 150k XP
4. 20 limit = 200k XP
5. 25 limit = 250k XP
6. 30 limit = 300k XP
7. 35 limit = 350k XP
8. 40 limit = 400k XP
9. 45 limit = 450k XP
10. 50 limit = 500k XP
━━━━━━━━━━━━━━━━━
BuyAll: ${prefix}buyall

Untuk membeli limit, Ketik
*_${prefix}buy <nomer urut>_*

Contoh: *_${prefix}buy 2_*

━━━━━━━━━━━━━━━━━
Money: $${money}
━━━━━━━━━━━━━━━━━
ITEM:
1. XP X2 1 Hari = $85k
2. XP X3 1 Hari = $110k
3. XP X4 1 Hari = $135k
4. XP X5 1 Hari = $160K

5. Penyamaran 1 Hari = $999K
6. Penyamaran 7 Hari = $6.399K
━━━━━━━━━━━━━━━━━
BuyAllXp: ${prefix}buyallxp
NOTE: JIKA MEMBELI DOUBLE, YANG LAMA TIDAK HANGUS, Waktu mengikuti item XP yang pertama

Untuk membeli, ketik
*_${prefix}buyitem <nomer urut>_*

Contoh: *_${prefix}buyitem 3_*

━━━━━━━━━━━━━━━━━
BARANG:

1. Roti (20 Makanan) | $2k
2. FastFood (30 Makanan) | $5k
3. Nasi & Ayam Goyeng (50 Makanan) | $15k
4. Nasi & Steak (70 Makanan) | $25k
5. Nasi & Nasi & Ikan (100 Makanan) | $40k

Untuk membeli, ketik
*_${prefix}mk <nomer urut>_*

Contoh : *_${prefix}mk 4_*
`
}
exports.premu = (prefix) => {
    return `
╭┈─ 《 𝙿𝚛𝚎𝚖𝚒𝚞𝚖 》
 |
 | 💎 𝚂𝚝𝚊𝚝𝚞𝚜: 𝘗𝘳𝘦𝘮𝘪𝘶𝘮 𝘜𝘴𝘦𝘳
 | ⚜️ 𝙴𝚡𝚙𝚒𝚛𝚎𝚍: PERMANEN
 |
╰┈────────────
𝘛𝘦𝘳𝘪𝘮𝘢𝘬𝘢𝘴𝘪𝘩 𝘴𝘶𝘥𝘢𝘩 𝘮𝘦𝘯𝘫𝘢𝘥𝘪 𝘜𝐬𝘦𝘳 𝐏𝐫𝐞𝐦𝐢𝐮𝐦
𝘜𝘯𝘵𝘶𝘬 𝘮𝘦𝘭𝘪𝘩𝘢𝘵 𝘤𝘮𝘥 ~${prefix}𝘱𝘳𝘦𝘮𝘪𝘶𝘮𝘮𝘦𝘯𝘶~
`
}
exports.nopremu = (prefix) => {
    return `
╭┈─ 《 Free 》
 |
 | 💰 Status: Free User
 |
 | Untuk menjadi user Premium
 |   - Donate Seikhlasnya
╰┈────────────

Jika ingin Donate, ketik _${prefix}donate_

*Terimakasih*
`
}
exports.allcmd = (prefix, nama, level, xp, hitstoday, hitstotal, top_additional_info = '', mid_additional_info = '', bottom_additional_info = '') => {
    return `
𝙷𝚊𝚕𝚘 𝚂𝚊𝚢𝚊 Rem 𝙱𝚘𝚝
${top_additional_info}
╭───────────────────────
│─≽ Username   : ${nama}
│─≽ Level           : ${level}
│─≽ Xp               : ${xp}
╰───────────────────────
${mid_additional_info}
╭──────────────────────
│≽ _${prefix}jadibot_
│≽ _${prefix}listjadibot_
╰──────────────────────͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ 

${getAllCmd.creatormenu(prefix)}

${getAllCmd.bmmenu(prefix)}

${getAllCmd.animecmd(prefix)}

${getAllCmd.mediacmd(prefix)}

${getAllCmd.groupcmd(prefix)}

${getAllCmd.admingroupmenu(prefix)}

${getAllCmd.praycmd(prefix)}

${getAllCmd.gamemenu(prefix, nama, level, xp)}${bottom_additional_info}
`
}

exports.commandd = (prefix, nama, level, xp, sender, speed, ram, hitstoday, hitstotal, top_additional_info = '', mid_additional_info = '', bottom_additional_info = '') => {
    return `
𝙷𝚊𝚕𝚘 𝚂𝚊𝚢𝚊 Rem 𝙱𝚘𝚝
${top_additional_info}
╭──────────────────────
│─≽ Username   : ${nama}
╰──────────────────────

${mid_additional_info}
╭──────────────────────
│≽ _${prefix}creatormenu_
│≽ _${prefix}adminmenu_
│≽ _${prefix}groupmenu_
│≽ _${prefix}praymenu_
│≽ _${prefix}animemenu_
│≽ _${prefix}mediamenu_
│≽ _${prefix}gamemenu_
╰──────────────────────͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ 
╭──────────────────────
│≽ _${prefix}jadibot_
│≽ _${prefix}listjadibot_
╰──────────────────────
╭──────────────────────
│≽ _${prefix}bugreport [teks]_
│≽ _${prefix}listgroup_
│≽ _${prefix}donate_
│≽ _${prefix}ping_
│≽ _${prefix}botstat_
│≽ _${prefix}remgroup_
│≽ _${prefix}info_
│≽ _${prefix}owner_
╰──────────────────────${bottom_additional_info}`
}
exports.creatormenu = (prefix) => {
    return `
╔════「 CREATOR MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}stiker
║│─≽ ${prefix}toimg
║│─≽ ${prefix}ttp <kata2>
║│─≽ ${prefix}tts <bahasa> <kata2>
║│─≽ ${prefix}textmaker <Nama1|Nama2>
║│─≽ ${prefix}smeme <Nama1|Nama2>
║│─≽ ${prefix}qrcode <text>
║│─≽ ${prefix}shorturl <link>
║│─≽ ${prefix}tomp3
║│─≽ ${prefix}removebg
║│─≽ ${prefix}diff
║│    Membuat gambar anime [AI]
║╰───────────────────────
╚════════════════════════`
}
exports.admingroupmenu = (prefix) => {
    return `
╔════「 ADMIN MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}antilink <enable/disable>
║│─≽ ${prefix}welcome <enable/disable>
║│─≽ ${prefix}group <open/close>
║│─≽ ${prefix}setrules <rules>
║│─≽ ${prefix}setprefix <prefix>
║│─≽ ${prefix}add 628xxxxx
║│─≽ ${prefix}kick @tagmember
║│─≽ ${prefix}promote @tagmember
║│─≽ ${prefix}demote @tagmember
║│─≽ ${prefix}setgroupname <nama>
║│─≽ ${prefix}setgroupicon
║│─≽ ${prefix}tagall
║│─≽ ${prefix}linkgroup
║│─≽ ${prefix}resetlinkgroup
║│─≽ ${prefix}out
║│─≽ ${prefix}delete
║│─≽ ${prefix}giveaway
║╰───────────────────────
╚════════════════════════`
}
exports.premcmd = (prefix) => {
    return `
╔════「 PREMIUM MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}premium
║│─≽ ${prefix}pay
║│─≽ ${prefix}createredeem
║│─≽ ${prefix}set_user icmd
║╰───────────────────────
╚════════════════════════
`
}
exports.ownercmd = (prefix) => {
    return `
╭┈─ 『 OWNER 』
 |
 |➥ *${prefix}block 62858xxxxx*
 |➥ *${prefix}unblock 62858xxxxx*
 |➥ *${prefix}addadmin @tagmember*
 |➥ *${prefix}deladmin @tagmember*
 |➥ *${prefix}restart*
 |➥ *${prefix}ekickall*
 |➥ *${prefix}banchat*
 |➥ *${prefix}unbanchat*
 |➥ *${prefix}eval [kode JavaScript]*
 |
╰┈────────────`
}
exports.admincmd = (prefix) => {
    return `
╭┈─ 『 ADMIN 』
 |
 |➥ *${prefix}ban @tagmember*
 |➥ *${prefix}unban @tagmember*
 |➥ *${prefix}set_user unlisted @tagmember*
 |➥ *${prefix}block @tagmember*
 |➥ *${prefix}unblock @tagmember*
 |➥ *${prefix}oout*
 |➥ *${prefix}opromote*
 |➥ *${prefix}odemote*
 |➥ *${prefix}odelete*
 |➥ *${prefix}oadd 62813xxxxx*
 |➥ *${prefix}otagall*
 |
╰┈────────────`
}
exports.bmmenu = (prefix) => {
    return `
╔════「 STAFF REMCOMP 」═════
║╭───────────────────────
║│─≽ ${prefix}ban time <waktu> 628xxxxxx <reason>
║│─≽ ${prefix}unban
║│─≽ ${prefix}ban time <waktu> 628xxxxxx --cmd <cmd, cmd, cmd>
║│─≽ ${prefix}otagall
║│─≽ ${prefix}odemote @tagmember
║│─≽ ${prefix}opromote @tagmember
║│─≽ ${prefix}oadd @tagmember
║│─≽ ${prefix}odel
║│─≽ ${prefix}okick @tagmember
║│─≽ ${prefix}killjb
║│─≽ ${prefix}switchnum <nomor>
║│─≽ ${prefix}odel
║╰───────────────────────
╚════════════════════════`
}
exports.nsfwcmd = (prefix) => {
    return `
╔════「 NSFW MENU 」═════
║╭───────────────────────
║│  -
║╰───────────────────────
╚════════════════════════`
}
exports.praycmd = (prefix) => {
    return `
╔════「 PRAY MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}quran <urutan surah>
║│─≽ ${prefix}surah <nama surah>
║│─≽ ${prefix}infosurah <nama surah>
║│─≽ ${prefix}tafsir <nama surah> <ayat>
║│─≽ ${prefix}listsurah
║╰───────────────────────
╚════════════════════════`
}
exports.mediacmd = (prefix) => {
    return `
╔════「 MEDIA MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}images <query>
║│─≽ ${prefix}ss <link>
║│─≽ ${prefix}ytcari <judul>
║│─≽ ${prefix}ytmp4 <link>
║│─≽ ${prefix}ytmp3 <link>
║│─≽ ${prefix}play <judul>
║│─≽ ${prefix}tiktok <link>
║│─≽ ${prefix}fb <link>
║│─≽ ${prefix}ig <link>
║│─≽ ${prefix}twitter <username>
║│─≽ ${prefix}mod <judul>
║│─≽ ${prefix}vai <text>
║│─≽ ${prefix}hd
║│─≽ ${prefix}neko
║╰───────────────────────
╚════════════════════════`
}
exports.animecmd = (prefix) => {
    return `
╔════「 ANIME MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}waifu <query>
║│─≽ ${prefix}husbu
║│─≽ ${prefix}zerochan <query>
║│─≽ ${prefix}neko
║│─≽ ${prefix}quotesnime
║│─≽ ${prefix}sauce
║│─≽ ${prefix}anime <judul>
║│─≽ ${prefix}character <nama>
║│─≽ ${prefix}osu <nickname>
║│─≽ ${prefix}vai <text>
║│─≽ ${prefix}diff
║│    Membuat gambar anime [AI]
║│─≽ ${prefix}downanime <text>
║│─≽ ${prefix}komiku <text>
║╰───────────────────────
╚════════════════════════
`
}
exports.groupcmd = (prefix) => {
    return `
╔════「 GROUP MENU 」═════
║╭───────────────────────
║│─≽ ${prefix}groupinfo
║│─≽ ${prefix}quote
║│─≽ ${prefix}koin
║│─≽ ${prefix}dadu
║│─≽ ${prefix}kapankah
║│─≽ ${prefix}apakah
║│─≽ ${prefix}bisakah
║│─≽ ${prefix}nilai
║│─≽ ${prefix}getpic @tagmember
║│─≽ ${prefix}hug @tagmember
║│─≽ ${prefix}cry
║│─≽ ${prefix}kiss @tagmember
║│─≽ ${prefix}shy @tagmember
║│─≽ ${prefix}ramalpasangan <Nama1|Nama2>
║│─≽ ${prefix}wiki <kata2>
║│─≽ ${prefix}kbbi <kata2>
║│─≽ ${prefix}igstalk <username>
║│─≽ ${prefix}simi <enable/disable>
║│─≽ ${prefix}checkip <ip>
║│─≽ ${prefix}math <angka>
║│─≽ ${prefix}lirik <lagu>
║│─≽ ${prefix}mod <judul>
║│─≽ ${prefix}heroml <hero>
║│─≽ ${prefix}family100
║│─≽ ${prefix}caklontong
║│─≽ ${prefix}tebakgambar
║│─≽ ${prefix}tebak
║│─≽ ${prefix}susunkata
║│─≽ ${prefix}infogempa
║│─≽ ${prefix}covid <negara>
║│─≽ ${prefix}google
║│─≽ ${prefix}translate <bahasa> <kata2>
║│─≽ ${prefix}tl <bahasa> <kata2>
║│─≽ ${prefix}rulestf
║╰───────────────────────
╚════════════════════════`
}
exports.gamemenu = (prefix, nama, level, xp) => {
    return `
╔════「 GAME MENU 」═════
║╭───────────────────────
║│─≽ Username   : ${nama}
║│─≽ Level           : ${level}
║│─≽ Xp               : ${xp}
║╰───────────────────────
║╭───────────────────────
║│─≽ ${prefix}level
║│─≽ ${prefix}tourl <image>
║│─≽ ${prefix}setbg
║│─≽ ${prefix}setbg2
║│─≽ ${prefix}leaderboard
║│─≽ ${prefix}allvl
║│─≽ ${prefix}slb
║│─≽ ${prefix}hoki
║│─≽ ${prefix}mg
║│─≽ ${prefix}job
║│─≽ ${prefix}work
║│─≽ ${prefix}shop
║│─≽ ${prefix}item
║│─≽ ${prefix}limit
║│─≽ ${prefix}givelimit
║│─≽ ${prefix}inv
║│─≽ ${prefix}ind
║│─≽ ${prefix}pd
║│─≽ ${prefix}setpd
║│─≽ ${prefix}cekpd
║│─≽ ${prefix}wr
║│─≽ ${prefix}hitungwr
║│─≽ ${prefix}slot
║│─≽ ${prefix}togel
║│─≽ ${prefix}pay
║│─≽ ${prefix}createredeem
║│─≽ ${prefix}easterlb
║│─≽ ${prefix}easterhunt
║│─≽ ${prefix}easterinfo
║│─≽ ${prefix}tod
║│─≽ ${prefix}tod join
║│─≽ ${prefix}tod leave
║│─≽ ${prefix}tod start
║│─≽ ${prefix}tod create
║╰───────────────────────
╚════════════════════════`
}
exports.setuser = (prefix) => {
    return `「 SET PROFILE COMMAND 」
➥ *${prefix}set_user nama [nama kalian]*
➥ *${prefix}set_user hidepp [enable|disable]*
➥ *${prefix}set_user converte [enable|disable]*
➥ *${prefix}set_user button [enable|disable]*
➥ *${prefix}set_user gender [Kelamin]*

➥ *${prefix}set_user icmd [text]*

Perubahan akan terlihat di ${prefix}profile
    `
}
exports.readme = (prefix) => {
    return `
            *「 DOWNLOADER 」*

*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *${prefix}ytmp3 https://youtu.be/Bskehapzke8*

*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *${prefix}ytmp4 https://youtu.be/Bskehapzke8*

*[linkTiktok]* Diisi dengan link Tiktok yang valid tanpa tanda “[” dan “]”
Contoh : *${prefix}tiktok https://vt.tiktok.com/yqyjPX/*

*[linkFb]* Diisi dengan link Facebook yang valid tanpa tanda “[” dan “]”
Contoh : *${prefix}fb https://www.facebook.com/EpochTimesTrending/videos/310155606660409*

*[linkTiktok]* Diisi dengan link facebookt Tiktok yang valid tanpa tanda “[” dan “]”
Contoh : *${prefix}tiktok https://vt.tiktok.com/yqyjPX/*

            *「 OTHER 」*

*[query]* Diisi dengan query/pencarian yang valid, tanpa tanda “[” dan “]“
Contoh : *${prefix}google system cardinal*

*[kode bhs]* Diisi dengan kode bahasa, contoh *id*, *en*, dll. Dan *[teks]* Diisi dengan teks yang ingin di jadikan voice, Masih sama seperti di atas tanpa tanda “[” dan “]”
Contoh : *${prefix}tts id Test*
Note : Max 250 huruf

*[optional]* Diisi dengan teks |title lirik lagu, tanpa tanda “[” dan “]”.
Contoh : *${prefix}lirik pain dustcell*

*[ipaddress]* Diisi dengan Ip Address yang valid, tanpa tanda “[” dan “]”.
Contoh : *${prefix}checkip 182.0.144.145*`
}
exports.info = (listContributor) => {
    return `
*⟩⟩ Bot Info ⟨⟨*

Bot ini adalah Bot Komunitas yang bersifat gratis 100% 
    
Bot ini berspesifikasi :
Bahasa Pemrograman= Nodejs/JavaScript
Libary = Baileys
Database Bot = MongoDb
VPS = Ubuntu
*4 core CPU*
Ram = 24GB
Internet speed = 4GB/s
    
Bot ini berjalan selama 24 jam
Dan mempunyai fitur unggulan seperti pasangan roleplay
    
Dengan fitur tersebut User akan dihadirkan dapat berpacaran bahkan menikahi character Anime/Manhwa kesukaannya, fitur roleplay di desain untuk para jones jones yang tidak mempunyai pacar rl dan memilih mencintai anime(Stres sih ya mirip yang desain text ini).

⟨ THANKS TO ⟩
- *Dwi Rizqi* [Developer]
- *Rafid* [Developer & Tester]
- *Naya* [Community Manager & Services]
- *Artha* [Community Manager & Services]
- *Fauzan* [Developer & Bug Hunter]

⟨ CONTRIBUTOR ⟩
${listContributor.map((v, i) => `|➥ ${i + 1}. ${v}`).join('\n')}
`
}
function snk() {
    return `Syarat dan Ketentuan Bot

1. *Dilarang menelpon bot*
2. *Dilarang spam command bot*
    
*_TTD_*
Dwi Rizqi`

}
exports.snk = snk()
function sumbang() {
    return `
╭┈─ 『 DONATE 』
 |
 |➥ *DONASI BISA MELALUI :*
 |➥ *SAWERIA (Gopay/Dana/QRIS/Dll)* : https://saweria.co/DwiRizqi
 |➥ *PULSA : 081358181668*
 |➥ *TERIMA KASIH BANYAK YANG SUDAH MAU MASUK MEMBERSHIP :D*
 |
╰┈────────────

_Note :_
Jika ingin donate pakai *Saweria*
Disarankan set email terlebih dahulu di bot, *_.verifemail <email>_*

Setelah itu silahkan donate melalui saweria
dan isi form email dengan email yang sudah di set di bot sebelumnya
Agar langsung dapat fitur premium

*!! NOTE: JANGAN LOGIN DI SAWERIA! !!*

Untuk donate via *pulsa* silahkan chat Side Owner
dengan mengirimkan bukti transfer dan email yang sudah di verifemail
`
}
// exports.membership = membership()
// function membership() {
//     return `
// ╭┈─ 『 MEMBERSHIP 』
//  |
//  |➥ *MEMBERSHIP 10k 1 BULAN:*
//  |➥ *SAWERIA (Gopay/Dana/QRIS/Dll)* : https://saweria.co/DwiRizqi
//  |➥ *PULSA : 081358181668*
//  |➥ *TERIMA KASIH BANYAK YANG SUDAH MAU JOIN MEMBERSHIP REMCOMP :D*
//  |
// ╰┈────────────

// _Note :_
// Jika ingin donate pakai *Saweria*
// Disarankan set email terlebih dahulu di bot, *_.verifemail <email>_*

// Setelah itu silahkan donate melalui saweria
// dan isi form email dengan email yang sudah di set di bot sebelumnya
// Agar langsung dapat fitur premium

// *!! NOTE: JANGAN LOGIN DI SAWERIA! !!*

// Untuk donate via *pulsa* silahkan chat Side Owner
// dengan mengirimkan bukti transfer dan email yang sudah di verifemail

// ╭┈─ 『 BENEFITS 』
//  |
//  |➥ *1. Sudah pasti dapat mengakses fitur premium di Bot*
//  |➥ *2. Dapat membuat custom nametag limit 3x per-user*
//  |➥ *3. Dapat buff doubleXP dan doubleXP job selama 1 Bulan*
//  |➥ *4. Setiap awal season mendapatkan money 50k*
//  |
// ╰┈────────────
// `    
// }
exports.sumbang = sumbang()
function listChannel() {
    return `Daftar channel: 
1. ANTV
2. GTV
3. Indosiar
4. iNewsTV
5. KompasTV
6. MNCTV
7. METROTV
8. NETTV
9. RCTI
10. SCTV
11. RTV
12. Trans7
13. TransTV`
}
exports.listChannel = listChannel()
function bahasalist() {
    return `*List kode Bahasa*\n
  *Code       Bahasa*
    sq        Albanian
    ar        Arabic
    hy        Armenian
    ca        Catalan
    zh        Chinese
    zh-cn     Chinese (China)
    zh-tw     Chinese (Taiwan)
    zh-yue    Chinese (Cantonese)
    hr        Croatian
    cs        Czech
    da        Danish
    nl        Dutch
    en        English
    en-au     English (Australia)
    en-uk     English (United Kingdom)
    en-us     English (United States)
    eo        Esperanto
    fi        Finnish
    fr        French
    de        German
    el        Greek
    ht        Haitian Creole
    hi        Hindi
    hu        Hungarian
    is        Icelandic
    id        Indonesian
    it        Italian
    ja        Japanese
    ko        Korean
    la        Latin
    lv        Latvian
    mk        Macedonian
    no        Norwegian
    pl        Polish
    pt        Portuguese
    pt-br     Portuguese (Brazil)
    ro        Romanian
    ru        Russian
    sr        Serbian
    sk        Slovak
    es        Spanish
    es-es     Spanish (Spain)
    es-us     Spanish (United States)
    sw        Swahili
    sv        Swedish
    ta        Tamil
    th        Thai
    tr        Turkish
    vi        Vietnamese
    cy        Welsh
      `
}
exports.bahasalist = bahasalist()
