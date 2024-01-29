//---------------------------------------------------------
// الاساسيات في البروجكت
//---------------------------------------------------------
const express = require('express');
const app = express();
const fs = require('fs');
const { prefix } = require('../config.json');
const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

app.listen(3000, () => console.log('Hi.'));

app.use('/ping', (req, res) => {
  res.send({ embeds: [new Date()] });
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`I am Here...`);

  client.user.setStatus('online');
  client.user.setActivity(`${prefix}help`, {
    type: 'PLAYING'
  });
});
const allowedRoleIds = ['1198939720940527616', '1192593384481755296'];
const adminRole = '1192593384481755296';
const owners = '232323123123132132132';
client.login(process.env.TOKEN);
// نهاية الاساسيات
//---------------------------------------------------------
// كود الهيلب
client.on('messageCreate', (itsx) => {
  if (itsx.content === prefix + 'bot') {
    let embed = new MessageEmbed()

      .setColor('#e9b813')
      .setTitle('اوامر البوت :')
      .setDescription(`**
          ** ✨الأوامر العامة ✨  **

          ${prefix}vote       | ${prefix}server
          ${prefix}uptime     | ${prefix}ping
          ${prefix}info-chat  
          ${prefix}avatar     
          ${prefix}info-bot 
          **  

          ** ✨أوامر المشرفين و الادارة ✨ **

           ${prefix}add | ${prefix}mute
           ${prefix}all-bans | ${prefix}unmute
           ${prefix}clear | ${prefix}ban
           ${prefix}setname-room | ${prefix}unban
           ${prefix}show | ${prefix}poll
           ${prefix}hide | ${prefix}lock
           ${prefix}kick | ${prefix}unlock 
           **

           ** ✨أوامر الالعاب ✨**
           **
           ${prefix}cut
           ${prefix}kill   | ${prefix}meme
           ${prefix}love   | ${prefix}nokta
           ${prefix}math   | ${prefix}flag
           ${prefix}brand  | ${prefix}hug
           ${prefix}sara7a | ${prefix}zaf7  
           **

           ** ✨أوامر التذاكر ✨**
           **
           ${prefix}new | create ticket
           ${prefix}ch  | Delete ticket or Close chat ticket
           **

           ** ✨أوامر البودكاست ✨**
         
           ${prefix}bc
           ${prefix}obc
           ${prefix}ebc 
           **

          `);

    itsx.channel.send({ embeds: [embed] });
  }
});
// نهاية الهيلب
//---------------------------------------------------------
// بداية معلومات البوت
client.on('messageCreate', (msg) => {
  if (msg.content === prefix + 'info-bot') {
    const embed = new MessageEmbed()
      .setColor('bleu')
      .setTitle(` ${client.user.username} `)
      .addField('``My Name``', ` ${client.user.tag} `, true)
      .addField('``servers``', ` ${client.guilds.cache.size} `, true)
      .addField('``channels``', ` ${client.channels.cache.size} `, true)
      .addField('``Users``', ` ${client.users.cache.size} `, true)
      .addField('``My ID``', ` ${client.user.id} `, true)
      .setFooter('Code By moath');

    msg.channel.send({ embeds: [embed] });
  }
});
// نهاية معلومات البوت
//---------------------------------------------------------
// كود لمعرفة كم اشتغل البوت في السيرفر
client.on('messageCreate', (msg) => {
  if (msg.content === prefix + 'uptime') {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    const up = new MessageEmbed()
      .setColor('#44ff00')
      .setThumbnail(client.user.avatarURL())
      .setTitle('**__Uptime :__**')
      .setAuthor(client.user.username, client.user.avatarURL())
      .addField('**-**', `**${seconds}**` + ' **seconds**')
      .addField('**-**', `**${minutes}**` + ' **minutes**')
      .addField('**-**', `**${hours}**` + ' **hours**')
      .addField('**-**', `**${days}**` + ' **days**');
    msg.channel.send({ embeds: [up] });
  }
});
// نهاية كود لمعرفة كم اشتغل البوت في السيرفر
//---------------------------------------------------------
// كود اضافة ايموجي ل سيرفرك
const { parse } = require('twemoji-parser');
client.on('messageCreate', (niro) => {
  if (niro.content.startsWith(prefix + 'add')) {
    const args = niro.content.split(' ').slice(1);
    if (!niro.member.permissions.has('MANAGE_EMOJIS')) {
      return niro.channel.send({ content: '**`You dont have permission to add emojis 😐`**' });
    }

    if (!niro.guild.me.permissions.has('MANAGE_EMOJIS')) {
      return niro.channel.send({ content: '**`I need permission to add emojis 😐`**' });
    }

    const emoji = args.join('');
    if (!emoji) return niro.channel.send({ content: '**`Please type the emoji to add 😃`**' });

    let the_typed_emoji = parse(emoji, { assetType: 'png' });

    if (the_typed_emoji.id) {
      const link = `https://cdn.discordapp.com/emojis/${the_typed_emoji.id}.${
        the_typed_emoji.animated ? 'gif' : 'png'
      }`;
      const name = args.slice(1).join(' ');

      niro.guild.emojis.create(`${link}`, `${name || `${the_typed_emoji.name}`}`);
      const done = new MessageEmbed()
        .setTitle('Emoji has been added')
        .setColor('RED')
        .setFooter('SOLAY COMMUNITY')
        .setDescription(`Add emojie ${name || `${the_typed_emoji.name}`} preview emojie (${link})`);
      return niro.channel.send({ embeds: [done] });
    } else {
      let CheckEmoji = parse(emoji, { assetType: 'png' });
      if (!CheckEmoji[0]) return niro.channel.send({ content: 'Invalid emojiev' });
      niro.channel.send({ content: 'unknown 🤷' });
    }
  }
});
// نهاية كود اضافة ايموجي ل سيرفرك
//---------------------------------------------------------
// كود الرياكشنات التلقائيه
client.on('messageCreate', (message) => {
  if (message.channel.id === '875711402499788820') return message.react('👀');

  if (message.channel.id === '875711797775175720') return message.react('👀');
});
// نهاية الرياكشنات التلقائيه
//---------------------------------------------------------
// كود التصويت
client.on('messageCreate', (message) => {
  if (message.content.startsWith(prefix + 'vote')) {
    const args = message.content.split(' ').slice(1);
    const embed = new MessageEmbed()
      .setTitle('Vote')
      .setColor('RANDOM')
      .setDescription(`****The vote****\n${args}\nby ${message.author.tag}`)
      .setTimestamp();
    message.channel.send({ embeds: [embed] }).then((msg) => {
      msg.react('✅');
      msg.react('❌');
    });
  }
});
// نهاية كود التصويت
//---------------------------------------------------------
// كود معلومات الشات
client.on('messageCreate', (message) => {
  if (message.content.startsWith(prefix + 'info-chat')) {
    const chme = message.mentions.channels.first() || message.channel;
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('**CHANNEL INFO**')
      .setDescription(`Id Channel \n${chme.id}\nName Channel\n${chme.name}\nMention Channel \n<#${chme.id}>`);
    message.channel.send({ embeds: [embed] });
  }
});
// نهاية كود معلومات الشات
//-------------------------------------------------------------
// كود يظهر الافتار
client.on('messageCreate', (message) => {
  if (message.content.startsWith(prefix + 'avatar')) {
    if (!message.channel.guild) return message.reply({ content: '** <a:emoji_67:834728402773999618 > This Command For Servers Only ** ' });
    let args = message.content.split(' ');
    let user = message.mentions.users.first() || client.users.cache.find((u) => u.id === args[1]);
    var embed = new MessageEmbed()
      .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
      .setColor('RANDOM')
      .setFooter(`${message.author.tag} `, message.author.avatarURL({ dynamic: true }))
      .setImage(user.avatarURL({ dynamic: true, size: 1024 }));
    message.channel.send({ embeds: [embed] });
  }
});
// كود الافتار ..................
//-------------------------------------------------------------
// كود معرفه عدد المتبندين من السيرفر
client.on('messageCreate', async (message) => {
  if (message.content.startsWith(prefix + 'all-bans')) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply({ content: ' ** You dont have `MANAGE_CHANNELS` permission **' });

    try {
      const bans = await message.guild.bans.fetch();
      message.channel.send({ content: `🔸 **Server Ban:** ${bans.size} ` });
    } catch (error) {
      console.error(error);
    }
  }
});
// نهاية كود معرفه عدد المتبندين من السيرفر
//-------------------------------------------------------------
// كود حذف السب
client.on('messageCreate', async (message) => {
  if (
    message.content.includes('كلب') ||
    message.content.includes('غبي') ||
    message.content.includes('كل زق') ||
    message.content.includes('قي') ||
    message.content.includes('الوان') ||
    message.content.includes('كس') ||
    message.content.includes('fuck') ||
    message.content.includes('عرص') ||
    message.content.includes('زب') ||
    message.content.includes('زبي') ||
    message.content.includes('اللعنه') ||
    message.content.includes('انيك') ||
    message.content.includes('نيك') ||
    message.content.includes('gay') ||
    message.content.includes('Gay') ||
    message.content.includes('حوثي') ||
    message.content.includes('زغب') ||
    message.content.includes('ازغبك') ||
    message.content.includes('ديد') ||
    message.content.includes('العن') ||
    message.content.includes('يلعن') ||
    message.content.includes('يلعنكم') ||
    message.content.includes('يلعنك') ||
    message.content.includes('كرستيانو') ||
    message.content.includes('cr7') ||
    message.content.includes('CR7') 
    
    
    
  ) {
    await message.reply({ content : "تم حذف رسالتك لاحتوائها على كلمات محظورة.", ephemeral: true });
    message.delete();
  }
});
// نهاية حذف السب
//------------------------------------------------------------------
// كود معلومات السيرفر
client.on('messageCreate', (russi) => {
  if (russi.content === prefix + 'server') {
    let embed = new MessageEmbed()
      .setTitle(`${russi.guild.name}`)
      .setThumbnail(client.user.avatarURL())
      .setColor('#3a6bff')
      .setFooter('Requested معلومات السيرفر  }', russi.author.avatarURL())
      .addField('> :star: ID Server :', `${russi.guild.id}`)
      .addField('> :crown: Owner Server :', `${russi.guild.ownerId}`)
      .addField('> :calendar: Created : ', `${russi.guild.createdAt.toLocaleString()}`)
      .addField('> :busts_in_silhouette: Members : ', `${russi.guild.memberCount}`)
      .addField('> :speech_balloon: Channels : ', `${russi.guild.channels.cache.size}`)
      .addField('> :earth_americas: Region : ', `${russi.guild.region}`)
      .setTimestamp();
    russi.channel.send({ embeds: [embed] });
  }
});
// نهاية معلومات السيرفر
//--------------------------------------------------------------
// كود افتار السيرفر
client.on('messageCreate', (itsx) => {
  if (itsx.content === prefix + 'server-avatar') {
    let embed = new MessageEmbed()
      .setColor('RANDOM')
      .setAuthor(itsx.author.username, itsx.author.avatarURL())
      .setImage(itsx.guild.iconURL())
      .setFooter(client.user.username, client.user.avatarURL());

    itsx.channel.send({ embeds: [embed] });
  }
});
// نهايه كود افتار سيرفر 
//--------------------------------------------------------------
// كود يوزر 
client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "user") {
    // أمر يوزر
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(message.author.username, message.author.avatarURL())
      .setThumbnail(message.author.avatarURL())
      .setTitle("Info User")
      .addField('Name', ` ${message.author.tag} `, true)
      .addField('ID', ` ${message.author.id} `, true)
      .setTimestamp(); 
    message.channel.send({ embeds: [embed] });
  }
});
  // كود يوزر 
//--------------------------------------------------------------
// code ping 
client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send({ content: 'pong' }).then(sentMessage => {
      sentMessage.edit(`\`\`\`js\nPing: ${client.ws.ping} ms\`\`\``);
    });
  }
});
// code ping 
//------------------------------------------------------------------
// warn Command

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "warn") {
    if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send({ content: `>>> \`\`\`You Don't have the permission ` });

    let args = message.content.split(" ").slice(1);
    var user = message.mentions.users.first();
    var reason = args.slice(1).join(' ');

    const embed = new MessageEmbed()
      .setColor('#0083ff')
      .setTimestamp();

    if (!user) {
      embed.addField("**منشن الشخص** ", ` ${message.author.tag}?`)
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    if (!reason) {
      embed.addField("**لماذا تريد اعطاء الشخص أنذار** ? ", ` ${user.tag}?`);
      return message.channel.send({ embeds: [embed] });
    }

    embed.addField("**تم ارسال الانذار** ", ` ${user.tag}!`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });

    const embed1 = new MessageEmbed()
      .setColor('#0083ff')
      .setTimestamp()
      .addField("لقد اخذت انذار", `السبب : **${reason}**`)
      .setFooter(`انذار بواسطة ${message.author.tag}.`);

    user.send({ embeds: [embed1] });
    message.delete();
  }
});
// end warn 
//---------------------------------------------------
// clear command
client.on("messageCreate", async message => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "clear" || command === "مسح") {
    if (!message.channel.guild) {
      return message.reply({ content: `** هذا الأمر مخصص للسيرفرات فقط**` });
    }

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      return message.reply({ content: `> ** ليس لديك الصلاحية لإدارة الرسائل :x:**` });
    }

    if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
      return message.reply({ content: `> ** ليس لدي الصلاحية لإدارة الرسائل :x:**` });
    }

    let messagecount = parseInt(args[0]) || 100;
    messagecount = Math.min(messagecount, 100); // لضمان عدم تجاوز الحد الأقصى

    try {
      const fetchedMessages = await message.channel.messages.fetch({ limit: messagecount });
      await message.channel.bulkDelete(fetchedMessages);
      const replyMsg = await message.channel.send(`🧹 **تم مسح ${fetchedMessages.size} رسائل!**`);
      setTimeout(() => replyMsg.delete(), 5000);
    } catch (error) {
      console.error(error);
      message.reply('حدث خطأ أثناء محاولة حذف الرسائل في هذه القناة!');
    }
  }
});
// clear command
//-----------------------------------------------------------------------------------
// gams 2 
const cuttweet = [
  "كت تويت ‏| تخيّل لو أنك سترسم شيء وحيد فيصبح حقيقة، ماذا سترسم؟",
  "كت تويت | أكثر شيء يُسكِت الطفل برأيك؟",
  "كت تويت | الحرية لـ ... ؟",
  "كت تويت | قناة الكرتون المفضلة في طفولتك؟",
  "كت تويت ‏| كلمة للصُداع؟",
  "كت تويت ‏| ما الشيء الذي يُفارقك؟",
  "كت تويت | موقف مميز فعلته مع شخص ولا يزال يذكره لك؟",
  "كت تويت ‏| أيهما ينتصر، الكبرياء أم الحب؟",
  "كت تويت | بعد ١٠ سنين ايش بتكون ؟",
  "كت تويت ‏| مِن أغرب وأجمل الأسماء التي مرت عليك؟",
  "‏كت تويت | عمرك شلت مصيبة عن شخص برغبتك ؟",
  "كت تويت | أكثر سؤال وجِّه إليك مؤخرًا؟",
  "‏كت تويت | ما هو الشيء الذي يجعلك تشعر بالخوف؟",
  "‏كت تويت | وش يفسد الصداقة؟",
  "‏كت تويت | شخص لاترفض له طلبا ؟",
  "‏كت تويت | كم مره خسرت شخص تحبه؟.",
  "‏كت تويت | كيف تتعامل مع الاشخاص السلبيين ؟",
  "‏كت تويت | كلمة تشعر بالخجل اذا قيلت لك؟",
  "‏كت تويت | جسمك اكبر من عٌمرك او العكسّ ؟!",
  "‏كت تويت |أقوى كذبة مشت عليك ؟",
  "‏كت تويت | تتأثر بدموع شخص يبكي قدامك قبل تعرف السبب ؟",
  "كت تويت | هل حدث وضحيت من أجل شخصٍ أحببت؟",
  "‏كت تويت | أكثر تطبيق تستخدمه مؤخرًا؟",
  "‏كت تويت | ‏اكثر شي يرضيك اذا زعلت بدون تفكير ؟",
  "‏كت تويت | وش محتاج عشان تكون مبسوط ؟",
  "‏كت تويت | مطلبك الوحيد الحين ؟",
  "‏كت تويت | هل حدث وشعرت بأنك ارتكبت أحد الذنوب أثناء الصيام؟"
];

client.on("messageCreate", niro_games => {
  if (niro_games.content.startsWith(prefix + "cut") || niro_games.content.startsWith(prefix + "كت")) {
    if (!niro_games.channel.guild)
      return niro_games.reply({ content: "** This command only for servers**" });

    var embed = new MessageEmbed()
      .setThumbnail(niro_games.author.avatarURL())
      .addField("لعبه كت تويت", `${cuttweet[Math.floor(Math.random() * cuttweet.length)]}`);

    niro_games.reply({ embeds: [embed] });
    console.log("[id] Send By: " + niro_games.author.username);
  }
});

client.on("messageCreate", niro_games => {
  if (niro_games.content == prefix + "flag" || niro_games.content == prefix + "اعلام") {
    var x = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/256px-Flag_of_Jordan.svg.png",
      "https://cdn.discordapp.com/attachments/756329106953601225/776908227476062258/images_4.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/1200px-Flag_of_Senegal.svg.png"
    ];
    var x2 = ["البرازيل", "الاردن", "مصر", "السنغال"];
    var x3 = Math.floor(Math.random() * x.length);
    var flag = new MessageEmbed()
      .setImage(`${x[x3]}`)
      .setTitle(`**اسرع شخص يرسل العلم خلال __10__ ثواني**`);

    niro_games.reply({ embeds: [flag] }).then(msg1 => {
      var r = niro_games.channel.awaitMessages({
        filter: msg => msg.content == x2[x3],
        max: 1,
        time: 10000,
        errors: ["time"]
      });

      r.catch(() => {
        return niro_games.channel.send(
          new MessageEmbed()
            .setTitle(`لقد انتهى الوقت ولم يقم أحد بالأجابة بشكل صحيح الصحيحةة هيا ***${x2[x3]}***`)
        );
      });

      r.then(collected => {
        niro_games.reply(
          new MessageEmbed()
            .setTitle(`لقد قمت بالاجابه بشكل صحيح`)
        );
      });
    });
  }
});

client.on("messageCreate", niro_games => {
  if (niro_games.content == prefix + "brand" || niro_games.content == prefix + "شعار") {
    var x = [
      "https://cdn.discordapp.com/attachments/756329106953601225/776584216161812490/jW4dnFtA_400x400.png",
      "https://cdn.discordapp.com/attachments/756329106953601225/776589087997296691/InCS8dvy_400x400.png",
      "https://cdn.discordapp.com/attachments/756329106953601225/776590445622329344/ocZKRu9P_400x400.png",
      "https://cdn.discordapp.com/attachments/756329106953601225/776591027943243776/aCWlGSZF_400x400.png"
    ];
    var x2 = ["جافا", "ريزر", "يوتيوب", "جوجل كروم"];
    var x3 = Math.floor(Math.random() * x.length);
    var brand = new MessageEmbed()
      .setImage(`${x[x3]}`)
      .setTitle(`**اسرع شخص يرسل الاشعار خلال __10__ ثواني**`);

    niro_games.reply({ embeds: [brand] }).then(msg1 => {
      var r = niro_games.channel.awaitMessages({
        filter: msg => msg.content == x2[x3],
        max: 1,
        time: 10000,
        errors: ["time"]
      });

      r.catch(() => {
        return niro_games.channel.send(
          new MessageEmbed()
            .setTitle(`لقد انتهى الوقت ولم يقم أحد بالأجابة بشكل صحيح الصحيحة ***${x2[x3]}***`)
        );
      });

      r.then(collected => {
        niro_games.reply(
          new MessageEmbed()
            .setTitle(`لقد قمت ب أرسال الشعار في الوقت المناسب`)
        );
      });
    });
  }
});

const x2_math = ["2000", "26", "14", "5.3", "12"];

client.on("messageCreate", async (niro_games) => {
  if (
    niro_games.content === prefix + "math" ||
    niro_games.content === prefix + "رياضيات"
  ) {
    const x_math = [
      "https://cdn.discordapp.com/attachments/798926497490010112/798949965610090567/2021-21-13_06__21__41.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798950267521466398/2021-23-13_06__23__00.png",
      "https://media.discordapp.net/attachments/798926497490010112/798950456050843668/2021-23-13_06__23__41.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798950748809461770/2021-24-13_06__24__51.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798950982905888809/2021-25-13_06__25__50.png",
    ];
    const x3_math = Math.floor(Math.random() * x_math.length);
    const brand_math = new MessageEmbed()
      .setImage(x_math[x3_math])
      .setTitle("**أسرع شخص يرسل الحل خلال 10 ثواني**");

    try {
      const r_math = await niro_games.channel.awaitMessages({
        filter: (msg) => msg.content === x2_math[x3_math],
        max: 1,
        time: 20000,
        errors: ["time"],
      });

      niro_games.reply(
        new MessageEmbed()
          .setTitle("**لقد قمت بإرسال الحل في الوقت المناسب**")
      );
    } catch (error) {
      niro_games.channel.send(
        new MessageEmbed()
          .setTitle(
            `**${error} لقد انتهى الوقت ولم يقم أحد بالإجابة بشكل صحيح. الإجابة الصحيحة هي ${x2_math[x3_math]}**`
          )
      );
    }
  }
});

const x2_capitals = ["القاهرة", "برازيليا", "اوتاوا", "الرياض", "دمشق", "القدس"];

client.on("messageCreate", async (niro_games) => {
  if (
    niro_games.content === prefix + "capitals" ||
    niro_games.content === prefix + "عواصم"
  ) {
    const x_capitals = [
      "https://cdn.discordapp.com/attachments/798926497490010112/798951739687960646/2021-28-13_06__28__29.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798952044719243304/2021-30-13_06__30__03.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798951871486099516/2021-28-13_06__28__29.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798951510582886420/2021-27-13_06__27__49.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798951367917174874/2021-27-13_06__27__18.png",
      "https://cdn.discordapp.com/attachments/798926497490010112/798951194633699359/2021-26-13_06__26__36.png",
    ];
    const x3_capitals = Math.floor(Math.random() * x_capitals.length);
    const brand_capitals = new MessageEmbed()
      .setImage(x_capitals[x3_capitals])
      .setTitle("**أسرع شخص يرسل العاصمة خلال 10 ثواني**");

    try {
      const r_capitals = await niro_games.channel.awaitMessages({
        filter: (msg) => msg.content === x2_capitals[x3_capitals],
        max: 1,
        time: 20000,
        errors: ["time"],
      });

      niro_games.reply(
        new MessageEmbed().setTitle("**لقد قمت بإرسال العاصمة في الوقت المناسب**")
      );
    } catch (error) {
      niro_games.channel.send(
        new MessageEmbed().setTitle(
          `**${error} لقد انتهى الوقت ولم يقم أحد بالإجابة بشكل صحيح. الإجابة الصحيحة هي ${x2_capitals[x3_capitals]}**`
        )
      );
    }
  }
});
// end game 2
//---------------------------------------------------------------------------------------------
// كود اخفاء شات و اظهاره

client.on("messageCreate", message => {
  // قائمة بأيدي الرتب المسموح لها باستخدام الأمر

  if (message.content === prefix + "show" || message.content === prefix + "hide") {
    // التحقق من إذا كان العضو يحمل إحدى الرتب المسموح بها
    const memberRoles = message.member.roles.cache.map(role => role.id);
    const hasAllowedRole = memberRoles.some(roleId => allowedRoleIds.includes(roleId));

    if (!hasAllowedRole) {
      return message.reply({ content: ' **لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
    }

    let everyone = message.guild.roles.everyone;

    // تحقق من نوع الأمر
    const isShowCommand = message.content === prefix + "show";

    message.channel.permissionOverwrites.edit(everyone, {
      VIEW_CHANNEL: isShowCommand
    }).then(() => {
      const action = isShowCommand ? "إظهار" : "إخفاء";

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`> **تم ${action} هذه الغرفة ${message.channel}**`)
        .setFooter(`بواسطة ${message.author.username}`);

      message.channel.send({ embeds: [embed] });
    });
  }
});
  // ----------------------------------------------------------------------------------------------
  
  // code mute / unmute 
  
  client.on("messageCreate", async message => {
    if (message.content.startsWith(prefix + 'mute')) {
  
      if (!message.member.permissions.has("MUTE_MEMBERS") && !allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId))) {
        return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
      }
  
      var args = message.content.split(" ").slice(2).join(" ");
      let mention = message.mentions.members.first();
      let member = message.mentions.members.first();
      let role = message.guild.roles.cache.find(ro => ro.name == 'Muted');
  
      if (!role) {
        role = await message.guild.roles.create({
          name: 'Muted',
          permissions: [],
          color: 'GREY'
        });
      }
  
      if (!mention) {
        return message.channel.send({ content: `**Usage: ${prefix}mute \`<@user>\` <Reason> **` });
      }
  
      if (member.user.id === message.author.id || member.user.id === client.user.id) {
        return message.channel.send({ content: `**لا استطيع اعطائه ميوت **` });
      }
  
      message.guild.channels.cache.forEach(c => {
        c.permissionOverwrites.edit(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
  
      mention.roles.add(role);
  
      message.channel.send({ content: `**✅ - تم بنجاح ${mention.user.tag} , ${args || "No reason provided."}**` });
  
      let mens = new MessageEmbed()
        .setThumbnail(message.guild.iconURL())
        .setTitle(`لقد تم كتمك`)
        .setDescription(`**
         في السيرفر : ${message.guild.name}
         بسبب : ${args || "لم يتم توفير سبب."}
         بواسطة : ${message.author}
        **`)
        .setColor("#0083ff")
        .setFooter('Id ' + message.author.id, message.author.avatarURL());
  
      member.send({ embeds: [mens] });
    }
  });
  
  
  client.on("messageCreate", async message => {
    if (message.content.startsWith(prefix + 'unmute')) {
  
      if (!message.member.permissions.has("MUTE_MEMBERS") && !allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId))) {
        return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
      }
  
      let mention = message.mentions.members.first();
      var args = message.content.split(" ").slice(2).join(" ");
      let member = message.mentions.members.first();
      let role = message.guild.roles.cache.find(ro => ro.name == 'Muted');
  
      if (!mention) {
        return message.channel.send({ content: `**Usage: ${prefix}unmute \`<@user>\` **` });
      }
  
      if (member.user.id === client.user.id) {
        return message.channel.send({ content: `**لم أجد الشخص**` });
      }
  
      mention.roles.remove(role);
  
      message.channel.send({ content: `**✅ - تم بنجاح ${mention.user.tag} **` });
  
      let mens = new MessageEmbed()
        .setThumbnail(message.guild.iconURL())
        .setTitle(`تم فك الكتم`)
        .setDescription(`**
         في السيرفر : ${message.guild.name}
         بواسطة : ${message.author}
        **`)
        .setColor("GREY")
        .setFooter('Id ' + message.author.id, message.author.avatarURL());
  
      member.send({ embeds: [mens] });
    }
  });
  //----------------------------------------------------------------------------------------------------
  

  client.on("messageCreate", message => {
    if (!message.guild) return;
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'kick') {
      if (!message.member.permissions.has("KICK_MEMBERS"))
        return message.reply({ content: "**ليس لديك إذن `KICK_MEMBERS`**" });
      if (!message.guild.me.permissions.has("KICK_MEMBERS"))
        return message.reply({ content: "**لا يوجد لدي إذن `KICK_MEMBERS`**" });
  
      // الرمز هنا لفحص الرتب
      if (!allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId))) {
        return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
      }
  
      const user = message.mentions.users.first();
      if (user) {
        const member = message.guild.members.cache.get(user.id);
        if (member) {
          member
            .kick('سبب اختياري سيظهر في السجلات')
            .then(() => {
              const embed = new MessageEmbed()
                .setColor("0F750E")
                .setTitle(`تم طرد ${user.tag} بنجاح`);
                
              message.channel.send({ embeds: [embed] });
            })
            .catch(err => {
              message.reply({ content: 'لم أتمكن من طرد العضو' });
              console.error(err);
            });
        } else {
          message.reply({ content: "هذا العضو ليس في هذا السيرفر!" });
        }
      } else {
        const embed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("``لم تذكر العضو الذي تريد طرده!`` ❌");
          
        message.channel.send({ embeds: [embed] });
      }
    }
  });
  
 
client.on("messageCreate", message => {
  if (!message.guild) return;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ban') {
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply({ content: "**ليس لديك إذن `BAN_MEMBERS`**" });
    if (!message.guild.me.permissions.has("BAN_MEMBERS"))
      return message.reply({ content: "**لا يوجد لدي إذن `BAN_MEMBERS`**" });

    // الرمز هنا لفحص الرتب
    if (!allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId))) {
      return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
    }

    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.cache.get(user.id);
      if (member) {
        member
          .ban({
            reason: 'كانوا سيئين!',
          })
          .then(() => {
            const embed = new MessageEmbed()
              .setColor("0F750E")
              .setTitle(`تم حظر ${user.tag} بنجاح`);
              
            message.channel.send({ embeds: [embed] });
          })
          .catch(err => {
            message.reply({ content: 'لم أتمكن من حظر العضو' });
            console.error(err);
          });
      } else {
        message.reply({ content: "هذا العضو ليس في هذا السيرفر!" });
      }
    } else {
      const embed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("``لم تذكر العضو الذي تريد حظره!`` ❌");
        
      message.channel.send({ embeds: [embed] });
    }
  }
});
  // كود الاداره
  //-------------------------------------------------------------------------------------------
  // poll

  client.on("messageCreate", message => {
    if (message.content.startsWith(prefix + 'poll')) {
      // التحقق مما إذا كان لديه إحدى الرتب المسموح بها
      const hasPermission = allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId));
      if (!hasPermission) 
          return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });

  
      let args = message.content.split(' ').slice(1).join(" ");
      if (!args) return message.channel.send({ content: 'يرجى كتابة رسالة للتصويت عليها' });
  
      const pollEmbed = new Discord.MessageEmbed()
        .setDescription(`**استطلاع جديد :** \n \`${args}\``)
        .setColor('BLACK')
        .setThumbnail(message.guild.iconURL())
        .setFooter(`استطلاع من قبل : ${message.author.tag}`);
  
      message.delete();
      message.channel.send({ embeds: [pollEmbed] });
    }
  });
  
  // love
  
  client.on("messageCreate", message => {
    if (message.content.startsWith(prefix + "love")) {
        let user = message.mentions.users.first();
        if (!user) return message.reply({ content: '**الرجاء منشن شخص**' });
        if (user.id == message.author.id) return message.reply({ content: "**طبعا أنت تحب نفسك**" });

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setFooter(`طلب بواسطة ${message.author.username}`)
                    .setTitle(`${message.author.username} يحب ${user} \`${Math.floor(Math.random() * 100)}\`%`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
});
  
  /////////////////////////////////////////////////////////////////////////////
  
  // kil game 
  
  client.on("messageCreate", message => {
    if (message.content.startsWith(prefix + 'kill')) {
        let user = message.mentions.users.first();
        if (!user) {
            message.reply({ content: `يجب عليك منشن الشخص الذي تريد قتله.` })
        }

        let killImages = [
            'https://steamuserimages-a.akamaihd.net/ugc/782985908083449716/7D8D3247449A582D75182D76E083F3C11F7A9A1F/',
            'ضع الصورة التي تريدها هنا',
            // يمكنك إضافة المزيد من الصور حسب الرغبة
        ];

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`${message.author} قتل **${user}**`)
                    .setImage(
                        killImages[Math.floor(Math.random() * killImages.length)]
                    )
            ]
        });
    }
});
  
  
  client.on("messageCreate",badboy => {
    if(badboy.content.startsWith(prefix + "meme")){
      let reply =[
        'https://pm1.narvii.com/7630/ca050d19dc9832424a888f017e6f1c28762d8f17r1-863-540v2_hq.jpg',
        'https://i.pinimg.com/originals/9a/b7/b7/9ab7b7e225f2cc5ee190e8a67c126c66.jpg',
        'https://pbs.twimg.com/media/Ecq6FxYWkAIQ8pE.jpg',
        'https://i.ytimg.com/vi/sm6z50Qoxqg/maxresdefault.jpg',
        'https://64.media.tumblr.com/tumblr_m7mw1u9vb81rr8kmyo1_1280.jpg',
        'https://i.ytimg.com/vi/7lTvO9wxqPw/hqdefault.jpg',
        'https://pm1.narvii.com/7723/6ed7ca7c14b84d2f36a9383ba01751a600e537f8r1-799-624v2_uhq.jpg',
        'https://i.pinimg.com/564x/04/80/c8/0480c863e93e5f83f3eb087c0579961a.jpg',
        'https://i.ytimg.com/vi/rlOT3GCBVjE/hqdefault.jpg',
        'https://i.ytimg.com/vi/C7-hq9Ffcj8/maxresdefault.jpg',
        'https://pbs.twimg.com/media/ESnM7BbXQAAb0w2.jpg',
        'https://i.ytimg.com/vi/0Hp2a-lrm_o/hqdefault.jpg',
        'https://i.ytimg.com/vi/SRrIcSkwYGQ/mqdefault.jpg',
        'https://stepcdn.com/assets/2019-04/18/11/43vc5/55944951_2568294106575830_8991684621687062528_n-700x.jpg',
        'https://i.pinimg.com/originals/cb/bf/da/cbbfdaf0da7743a491e832cb86e95ea3.jpg',
        'https://i.pinimg.com/736x/09/01/e3/0901e327b98ca708b81e64917a02d2a0.jpg',
        'https://i.pinimg.com/originals/df/91/4e/df914ee1f44c13ad4e7a1a472bf582c3.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8p_FAfFjnwjtMTPBLPINsIurByWcBYziQIQ&usqp=CAU',
        'https://64.media.tumblr.com/48616c5f37aa9b702b0838a8cfff058f/9663137ce20047ec-52/s1280x1920/77f01452f0473b4edf142cfd8649a8bb2b8a2f40.png',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPFTRZcVlYXkAQYa0dEYuUHgYoFHbCAE7Zw&usqp=CAU',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0BkWoPcUKvxRJY1mQk87ST2d-zPxc89Epiw&usqp=CAU',
       
        ];
  let an = reply[Math.floor(Math.random() * reply.length)];
  badboy.reply({ content: `${an}` });    }
  });
  
  client.on("messageCreate",badboy => {
    if(badboy.content.startsWith(prefix + "nokta")){
      let reply =[
        'https://i.pinimg.com/originals/90/4a/e9/904ae9fdd07d8d7afbd3b89c0067a24e.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlE0X6Q3y_CXhdJThWUnVvwKQQZOS_PBu_MQ&usqp=CAU',
        'https://i.pinimg.com/564x/4f/c3/d0/4fc3d08016a6398836d7c64c7d64d7ba.jpg',
        'https://www.aljawab24.com/wp-content/uploads/2020/10/%D9%86%D9%83%D8%AA-1-1-1-6-845x475.jpg',
        'https://i.pinimg.com/564x/ed/14/bf/ed14bfbcbfaeef8afdcf399f9c81681b.jpg',
        'https://m7et.com/wp-content/uploads/2020/04/dd78334190a889394039a9a72ea07c40.jpg',
        'https://i.pinimg.com/474x/90/92/d2/9092d2e5586919b5c4892a1f99a95ace.jpg',
        'https://www.i7lm.com/wp-content/uploads/2019/04/%D9%86%D9%83%D8%AA-%D9%85%D8%B6%D8%AD%D9%83%D8%A9.png',
        'https://www.eqrae.com/wp-content/uploads/2020/09/%D9%83-3.jpg',
        'https://media.gemini.media/img/large/2017/3/23/2017_3_23_16_51_15_362.jpg',
        'https://www.meshwarmedia.com/wp-content/uploads/2017/10/%D9%86%D9%83%D8%AA%D8%A9-12.jpg',
        'https://womenss.net/wp-content/uploads/2020/02/1713.jpg',
        'https://www.nsowo.com/wp-content/uploads/2019/02/%D9%86%D9%83%D8%AA-%D9%85%D8%B6%D8%AD%D9%83%D8%A9-%D9%85%D8%B9-%D9%86%D9%83%D8%AA%D9%87-%D8%B4%D8%B1%D8%B7%D9%8A-300x224.jpg',
        'https://www.i7lm.com/wp-content/uploads/2020/03/3333-5.jpg',
        'https://pbs.twimg.com/profile_images/378800000670246023/33e11a886fb45f462552bfdde1a5c40b_400x400.jpeg',
        
        ];
  let an = reply[Math.floor(Math.random() * reply.length)];
  badboy.reply({ content: `${an}` });
    }
  });
  
  client.on("messageCreate", message => {
    if (message.author.bot) return;

    var command = message.content.split(" ")[0];
    if (command == prefix + 'ebc') {
        // فحص الرتب
        const hasAllowedRole = message.member.roles.cache.some(role => allowedRoleIds.includes(role.id));
        if (!hasAllowedRole)
            return message.channel.send({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });


        var args = message.content.split(' ').slice(1).join(' ');
        if (!args)
            return message.channel.send({ content: `**➥ الاستخدام:** ${prefix} ebc رسالتك` });

        let bcSure = new MessageEmbed()
            .setTitle(`:mailbox_with_mail: **هل أنت متأكد أنك تريد إرسال رسالتك إلى** ${message.guild.memberCount} **عضو؟**`)
            .setThumbnail(client.user.avatarURL())
            .setColor('RANDOM')
            .setDescription(`**\n:envelope: ➥ رسالتك**\n\n${args}`)
            .setTimestamp()
            .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send({ embeds: [bcSure] }).then(msg => {
            msg.react('✅').then(() => msg.react('❎'));
            message.delete();

            let yesEmoji = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
            let noEmoji = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id;

            let sendBC = msg.createReactionCollector({ filter: yesEmoji, time: 60000 });
            let dontSendBC = msg.createReactionCollector({ filter: noEmoji, time: 60000 });

            sendBC.on('collect', r => {
                message.guild.members.cache.forEach(member => {
                    if (member.user.bot) return;
                    var bc = new MessageEmbed()
                        .addField('» السيرفر:', `${message.guild.name}`)
                        .addField('» المرسل:', `${message.author.username}#${message.author.discriminator}`)
                        .addField('» الرسالة:', args)
                        .setColor('#000000');
                    member.send({ embeds: [bc] });
                });
                message.channel.send({ content: `:timer: **يتم الآن الإرسال إلى** \`${message.guild.memberCount}\` **عضو**` })
                    .then(m => m.delete({ timeout: 5000 }));
                msg.delete();
            });

            dontSendBC.on('collect', r => {
                msg.delete();
                message.reply({ content: ':white_check_mark: **تم إلغاء الإرسال بنجاح**' })
                    .then(m => m.delete({ timeout: 5000 }));
            });
        });
    }
});

  client.on("messageCreate", async message => {
    if(message.channel.type === "UNKNOWN") return;
    if(message.author.bot) return;
    let args = message.content.split(' ');
    if(args[0] === `${prefix}obc`) {
      const hasAllowedRole = message.member.roles.cache.some(role => allowedRoleIds.includes(role.id));
      if (!hasAllowedRole)
          return message.channel.reply({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });

        if(!args[1]) 
            return message.channel.send({ content: '- **يجب عليك كتابة الرسالة بعد الأمر**' });

        let msgCount = 0;
        let errorCount = 0;
        let successCount = 0;
        
        const statusMsg = await message.channel.send({ content: `**- [ 🔖 :: ${msgCount} ] ・عدد الرسائل المرسلة**\n**- [ 📥 :: ${successCount} ] ・عدد الرسائل المستلمة**\n**- [ 📤 :: ${errorCount} ]・عدد الرسائل الغير مستلمة\n- [ ▫ :: Sending ]・حالة الرسائل المرسلة**` });

        message.guild.members.cache.forEach(member => {
            if (member.user.bot) return;
            member.send(args.slice(1).join(' '))
                .then(() => {
                    successCount++;
                    msgCount++;
                    statusMsg.edit({ content: `**- [ 🔖 :: ${msgCount} ] ・عدد الرسائل المرسلة**\n**- [ 📥 :: ${successCount} ] ・عدد الرسائل المستلمة**\n**- [ 📤 :: ${errorCount} ]・عدد الرسائل الغير مستلمة\n- [ ▫ :: Sending ]・حالة الرسائل المرسلة**` });
                })
                .catch(e => {
                    errorCount++;
                    msgCount++;
                    statusMsg.edit({ content: `**- [ 🔖 :: ${msgCount} ] ・عدد الرسائل المرسلة**\n**- [ 📥 :: ${successCount} ] ・عدد الرسائل المستلمة**\n**- [ 📤 :: ${errorCount} ]・عدد الرسائل الغير مستلمة\n- [ ▫ :: Sending ]・حالة الرسائل المرسلة**` });
                });
        });
    }
});
  
client.on("messageCreate", async (prof) => {
  if (prof.content.startsWith(prefix + 'lock')) {
    const memberRoles = prof.member.roles.cache.map(role => role.id);
    if (!allowedRoleIds.some(roleId => memberRoles.includes(roleId))) {
      return prof.reply({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
    }

    await prof.channel.permissionOverwrites.edit(prof.guild.id, {
      SEND_MESSAGES: false,
    });

    const professor = new MessageEmbed()
      .setColor('#0083ff')
      .setThumbnail(client.user.avatarURL())
      .setTitle(`تم قفل ${prof.channel.name}`)
      .setDescription(`هذه القناة <#${prof.channel.id}> تم قفلها`);
    prof.channel.send({ embeds: [professor] });
  }

  if (prof.content.startsWith(prefix + 'unolck')) {
    const memberRoles = prof.member.roles.cache.map(role => role.id);
    if (!allowedRoleIds.some(roleId => memberRoles.includes(roleId))) {
      return prof.reply({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });
    }

    await prof.channel.permissionOverwrites.edit(prof.guild.id, {
      SEND_MESSAGES: true,
    });

    const professor = new MessageEmbed()
      .setColor('#0083ff')
      .setThumbnail(client.user.avatarURL())
      .setTitle(`تم فتح ${prof.channel.name}`)
      .setDescription(`هذه القناة <#${prof.channel.id}> تم فتحها`);
    prof.channel.send({ embeds: [professor] });
  }
});

client.on("messageCreate", async message => {
  let command = message.content.split(" ")[0];
  
  if (command == prefix + "unban") {
    // تحقق من وجود الرتبة المسموح بها
    if (!message.member.roles.cache.has(adminRole)) {
      return message.reply({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });

    }

    let args = message.content.split(" ").slice(1).join(" ");

    if (!args) {
      return message.reply({ content: "**يرجى تقديم معرف العضو أو 'all'.**" });
    }

    if (args.toLowerCase() === "all") {
      try {
        const bans = await message.guild.bans.fetch();
        bans.forEach(async bannedUser => {
          await message.guild.members.unban(bannedUser.user.id);
        });
        return message.reply({ content: "**✅ تم رفع الحظر عن جميع الأعضاء.**" });
      } catch (error) {
        console.error(error);
        return message.reply({ content: "**حدث خطأ أثناء رفع الحظر عن جميع الأعضاء.**" });
      }
    }

    try {
      const user = await client.users.fetch(args);
      await message.guild.members.unban(user.id);
      return message.reply({ content: `**✅ تم رفع الحظر عن ${user.tag}.**` });
    } catch (error) {
      console.error(error);
      return message.reply({ content: `**🙄 - لا يمكنني العثور على \`${args}\` في قائمة الحظر.**` });
    }
  }
});

  
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + 'bc')) {
    if (!message.member.roles.cache.has(allowedRoleIds)) {
      return message.reply({ content: '**لا تستطيع استخدام هذا الامر فقط المشرفين و الادارة وحدهم من يستطيعون فعل ذلك .**', ephemeral: true });

    }

      const args = message.content.split(" ").slice(1).join(" ");
      if (!args) {
          return message.reply({ content: ':x: **يجب عليك كتابة رسالة لإرسال البودكاست**' });
      }

      const BcList = new MessageEmbed()
          .setColor("#ffff")
          .setThumbnail(message.author.avatarURL())
          .setAuthor(`محـتوى الرسالة : ${args}`)
          .setDescription(`**أضــغط على ✅ لإرسال البودكاست**`);

      const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
                  .setCustomId('confirm')
                  .setLabel('✅')
                  .setStyle('SUCCESS'),
              new MessageButton()
                  .setCustomId('cancel')
                  .setLabel('❎')
                  .setStyle('DANGER'),
          );

      message.reply({ embeds: [BcList], components: [row] }).then(msg => {
          const filter = i => i.customId === 'confirm' || i.customId === 'cancel';
          const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

          collector.on('collect', (i) => {
              if (i.customId === 'confirm') {
                  message.guild.members.cache.forEach(member => {
                      if (member.user.bot) return;
                      const bc = new MessageEmbed()
                          .addFields(
                              { name: '» السيرفر:', value: `${message.guild.name}` },
                              { name: '» المرسل:', value: `${message.author.username}#${message.author.discriminator}` },
                              { name: '» الرسالة:', value: args }
                          )
                          .setColor('#000000');
                      member.reply({ embeds: [bc] }).catch(() => {});
                  });

                  const successBc = new MessageEmbed()
                      .setColor("#008000")
                      .setTitle('تم إرسال البودكاست بنجاح')
                      .setDescription('لقد تم إرسال البودكاست إلى جميع الأعضاء');

                  msg.edit({ embeds: [successBc], components: [] });
              } else if (i.customId === 'cancel') {
                  const canceledBc = new MessageEmbed()
                      .setColor("#ff0000")
                      .setTitle('تم إلغاء البودكاست')
                      .setDescription('لقد تم إلغاء عملية إرسال البودكاست');

                  msg.edit({ embeds: [canceledBc], components: [] });
              }
          });

          collector.on('end', () => {
              if (msg && !msg.deleted && msg.components.length > 0) {
                  msg.edit({ components: [] });
              }
          });

          collector.on("collect", (reaction) => {
            if (reaction.emoji.name === '✅') {
                message.channel.reply({ content: `✅**تـــم الإرسال**` }).then(m => m.delete({ timeout: 5000 }));

                message.guild.members.cache.forEach(member => {
                    if (!member.user.bot) {
                        var bc = new MessageEmbed()
                            .setColor('#ffff')
                            .setAuthor(`Server: ${message.guild.name}`)
                            .setDescription(`✉️ **الرسالة :** \n**${args}**\n\n:hammer_pick:  **من قبل :** \n**${message.author.username}**`)
                            .setFooter(client.user.tag, client.user.avatarURL())
                            .setThumbnail(client.user.avatarURL());

                        member.reply({ embeds: [bc] }).catch(e => console.log(`لا يمكن أرسال الرسالة الى ${member.user.tag}.`));
                    }
                });

                msg.delete();
            } else {
                msg.delete();
                message.reply({ content: ':white_check_mark: **تم إلغاء الإرسال بنجاح**' }).then(m => m.delete({ timeout: 5000 }));
            }
          });

          collector.on("end", () => {
            msg.delete();
          });
        });
      }
    });
  
  //ticket
  
  
  
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "new")) {
      // تحميل رقم التذكرة من الملف
      let ticketNumber = parseInt(fs.readFileSync('ticketNumber.txt', 'utf8'));
      const embed1 = new MessageEmbed()
          .setColor("GREY")
          .setTitle("هل انت متأكد من أنشاء تذكرة ؟🎟️")
          .setDescription(" اذا كنت متأكد يرجى الضغط على✅\nوللإلغاءاضغط على ❎");

      const msg = await message.channel.send({ embeds: [embed1] });
      await msg.react('✅');
      await msg.react('❎');

      const filter = (reaction, user) => ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on('collect', async (reaction, user) => {
          if (reaction.emoji.name === '✅') {
              message.reply("تم إنشاء تذكرتك بنجاح! ✅");
              try {
                  const formattedTicketNumber = ticketNumber.toString().padStart(5, '0');
                  const channel = await message.guild.channels.create(`ticket-${formattedTicketNumber}`, { type: "GUILD_TEXT" });
                  await channel.permissionOverwrites.create(message.guild.id, {
                      VIEW_CHANNEL: false,
                      SEND_MESSAGES: false
                  });
                  await channel.permissionOverwrites.create(message.author.id, {
                      VIEW_CHANNEL: true,
                      SEND_MESSAGES: true
                  });
                  const welcomeEmbed = new MessageEmbed()
                      .setTitle(" مرحبًا بك في التذكرة! أخبرنا عن مشكلتك أو سبب فتح التذكرة وسنرد في أقرب وقت :hammer_pick: \n ان رغبت في الغاء التيكت او حذف التيكت الرجاء كتابة الامر التالي : -ch ")
                      .setColor("GREEN");

                  channel.send({ content: `<@${message.author.id}>`, embeds: [welcomeEmbed] });
                  
                  msg.delete();

                  // زيادة رقم التذكرة وحفظه في الملف
                  ticketNumber++;
                  fs.writeFileSync('ticketNumber.txt', ticketNumber.toString(), 'utf-8');

                  const log = message.guild.channels.cache.find(channel => channel.name === 'ticket-log');
                  if (log) {
                      const logEmbed = new MessageEmbed()
                          .setThumbnail(client.user.avatarURL())
                          .setColor("GREEN")
                          .setTitle("تم إنشاء تذكرة 🎟️")
                          .addFields(
                              { name: "تم إنشائها بواسطة :", value: `${message.author.username}` },
                              { name: "رقم التذكرة", value: `${formattedTicketNumber}`, inline: true }
                          )
                          .setFooter({ text: "صورة البروفايل", iconURL: message.author.avatarURL() });

                      log.send({ embeds: [logEmbed] });
                  } else {
                      console.error("Could not find 'ticket-log' channel.");
                      message.reply("روم التيكتات غير موجود");
                  }
              } catch (error) {
                  console.error("Error creating ticket channel or deleting message : ", error);
                  message.reply("خطأ في إنشاء قناة التذاكر");
              }
          } else if (reaction.emoji.name === '❎') {
              msg.delete();
              message.reply("تم إلغاء فتح تذكرة.");
          }
      });

      collector.on('end', async collected => {
        try {
            // تحقق من وجود الرسالة وأنها ليست محذوفة
            if (msg && !msg.deleted) {
                // حاول حذف الرسالة
                await msg.delete();
            }
        } catch (error) {
            // التعامل مع أي أخطاء خلال محاولة الحذف
            console.error("Error deleting message:", error);
        }
    
        // تحقق من أن هناك ردود تم جمعها
        if (collected.size > 0) {
            // تعديل الرسالة لإزالة الأزرار
            msg.edit({ components: [] }).catch(error => {
                console.error("Error editing message:", error);
            });
        }
    })
  }
});

  
  /*
  - [ Copyright youssefgames ] -
  */
  
  
  
  client.on("messageCreate", message => {
  
    if (message.content === prefix + "ch") {
      if (!message.member.permissions.has("MANAGE_MESSAGES"))
        return message.channel.send({ content: "ليس لديك صلاحية **MANAGE_MESSAGES**!" });
      if (!message.channel.name.includes("ticket-"))
        return message.channel.send({ content: "**❌ | هذه ليست قناة تذكرة**" });
  
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('cancel_ticket')
            .setLabel('إلغاء التذكرة')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('delete_ticket')
            .setLabel('حذف التذكرة')
            .setStyle('DANGER'),
        );
  
      message.reply({ content: 'الرجاء اختيار الإجراء المناسب:', components: [row] });
    }
  });
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
  
    const member = interaction.guild.members.cache.get(interaction.user.id);
  
    if (interaction.customId === 'cancel_ticket') {
      interaction.reply({ content: 'تم إلغاء التذكرة بنجاح!', ephemeral: true });
  
      if (!interaction.channel.name.includes("ticket-"))
        return interaction.channel.send({ content: "**❌ | هذا ليس قناة تذكرة**" });
  
      interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false
      });
  
      interaction.channel.permissionOverwrites.edit(interaction.user.id, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false
      });
  
      const log = client.channels.cache.find(channel => channel.name === 'ticket-log');
      if (log) {
        const embed = new MessageEmbed()
          .setThumbnail(client.user.avatarURL())
          .setColor("GREEN")
          .setTitle("تذكرة مغلقة 🔒")
          .addField("تم إغلاقها بواسطة:", `${interaction.user.username}`)
          .setFooter(interaction.user.id, interaction.user.avatarURL());
  
        log.send({ embeds: [embed] });
      } else {
        console.error("لم يتم العثور على روم 'ticket-log'.");
        interaction.user.send({ content: "**لا يوجد روم لوق. الرجاء إنشاء روم لوق.**" });
      }
    }
  
    if (interaction.customId === 'delete_ticket') {
      interaction.reply({ content: 'تم حذف التذكرة بنجاح!', ephemeral: true });
  
      const log = client.channels.cache.find(channel => channel.name === 'ticket-log');
      if (log) {
        const embed = new MessageEmbed()
          .setThumbnail(client.user.avatarURL())
          .setColor("GREEN")
          .setTitle("تذكرة تم حذفها 🗑️")
          .addField("تم الحذف بواسطة:", `${interaction.user.username}`)
          .setFooter(interaction.user.id, interaction.user.avatarURL());
        log.send({ embeds: [embed] });
      } else {
        console.error("لم يتم العثور على روم 'ticket-log'.");
        interaction.user.send({ content: "**لا يوجد روم لوق. الرجاء إنشاء روم لوق.**" });
      }
  
      interaction.channel.delete();
    }
  });
  
  
  client.on("messageCreate", message => {
    const Sra7a = [
      'صراحه  |  صوتك حلو؟',
      'صراحه  |  التقيت بناس ابو وجوهين؟',
      'صراحه  |  شيء وكنت تحقق اللسان؟',
      'صراحه  |  أنا شخص ضعيف عندما؟',
      'صراحه  |  هل ترغب في إظهار حبك ومرفق لشخص أو رؤية هذا الضعف؟',
      'صراحه  |  يدل على أن الكذب مرات تكون ضرورية شي؟',
      'صراحه  |  أشعر بالوحدة على الرغم من أنني تحيط بك كثيرا؟',
      'صراحه  |  كيفية الكشف عن من يكمن عليك؟',
      'صراحه  |  إذا حاول شخص ما أن يكرهه أن يقترب منك ويهتم بك تعطيه فرصة؟',
      'صراحه  |  أشجع شيء حلو في حياتك؟',
      'صراحه  |  طريقة جيدة يقنع حتى لو كانت الفكرة خاطئة" توافق؟',
      'صراحه  |  كيف تتصرف مع من يسيئون فهمك ويأخذ على ذهنه ثم ينتظر أن يرفض؟',
      'صراحه  |  التغيير العادي عندما يكون الشخص الذي يحبه؟',
      'صراحه  |  المواقف الصعبة تضعف لك ولا ترفع؟',
      'صراحه  |  نظرة و يفسد الصداقة؟',
      'صراحه  |  ‏‏إذا أحد قالك كلام سيء بالغالب وش تكون ردة فعلك؟',
      'صراحه  |  شخص معك بالحلوه والمُره؟',
      'صراحه  |  ‏هل تحب إظهار حبك وتعلقك بالشخص أم ترى ذلك ضعف؟',
      'صراحه  |  تأخذ بكلام اللي ينصحك ولا تسوي اللي تبي؟',
      'صراحه  |  وش تتمنى الناس تعرف عليك؟',
      'صراحه  |  ابيع المجرة عشان؟',
      'صراحه  |  أحيانا احس ان الناس ، كمل؟',
      'صراحه  |  مع مين ودك تنام اليوم؟',
      'صراحه  |  صدفة العمر الحلوة هي اني؟',
      'صراحه  |  الكُره العظيم دايم يجي بعد حُب قوي " تتفق؟',
      'صراحه  |  صفة تحبها في نفسك؟',
      'صراحه  |  ‏الفقر فقر العقول ليس الجيوب " ، تتفق؟',
      'صراحه  |  تصلي صلواتك الخمس كلها؟',
      'صراحه  |  ‏تجامل أحد على راحتك؟',
      'صراحه  |  اشجع شيء سويتة بحياتك؟',
      'صراحه  |  وش ناوي تسوي اليوم؟',
      'صراحه  |  وش شعورك لما تشوف المطر؟',
      'صراحه  |  غيرتك هاديه ولا تسوي مشاكل؟',
      'صراحه  |  ما اكثر شي ندمن عليه؟',
      'صراحه  |  اي الدول تتمنى ان تزورها؟',
      'صراحه  |  متى اخر مره بكيت؟',
      'صراحه  |  تقيم حظك ؟ من عشره؟',
      'صراحه  |  هل تعتقد ان حظك سيئ؟',
      'صراحه  |  شـخــص تتمنــي الإنتقــام منـــه؟',
      'صراحه  |  كلمة تود سماعها كل يوم؟',
      'صراحه  |  **هل تُتقن عملك أم تشعر بالممل؟',
      'صراحه  |  هل قمت بانتحال أحد الشخصيات لتكذب على من حولك؟',
      'صراحه  |  متى آخر مرة قمت بعمل مُشكلة كبيرة وتسببت في خسائر؟',
      'صراحه  |  ما هو اسوأ خبر سمعته بحياتك؟',
      '‏صراحه | هل جرحت شخص تحبه من قبل ؟',
      'صراحه  |  ما هي العادة التي تُحب أن تبتعد عنها؟',
      '‏صراحه | هل تحب عائلتك ام تكرههم؟',
      '‏صراحه  |  من هو الشخص الذي يأتي في قلبك بعد الله – سبحانه وتعالى- ورسوله الكريم – صلى الله عليه وسلم؟',
      '‏صراحه  |  هل خجلت من نفسك من قبل؟',
      '‏صراحه  |  ما هو ا الحلم  الذي لم تستطيع ان تحققه؟',
      '‏صراحه  |  ما هو الشخص الذي تحلم به كل ليلة؟',
      '‏صراحه  |  هل تعرضت إلى موقف مُحرج جعلك تكره صاحبهُ؟',
    '‏صراحه  |  هل قمت بالبكاء أمام من تُحب؟',
      '‏صراحه  |  ماذا تختار حبيبك أم صديقك؟',
      '‏صراحه  | هل حياتك سعيدة أم حزينة؟',
      'صراحه  |  ما هي أجمل سنة عشتها بحياتك؟',
      '‏صراحه  |  ما هو عمرك الحقيقي؟',
      '‏صراحه  |  ما اكثر شي ندمن عليه؟',
    'صراحه  |  ما هي أمنياتك المُستقبلية؟‏',
    ]
  if (message.content.startsWith(prefix + "sara7a")) {
    if (!message.guild) return message.reply({ content: '**هذا الأمر متاح فقط في السيرفرات**' });

    const clientEmbed = new MessageEmbed()
      .setTitle("لعبة صراحة ..")
      .setColor('RANDOM')
      .setDescription(`${Sra7a[Math.floor(Math.random() * Sra7a.length)]}`)
      .setImage("https://cdn.discordapp.com/attachments/371269161470525444/384103927060234242/125.png")
      .setTimestamp();

    message.channel.send({ embeds: [clientEmbed] })
      .then(msg => msg.react("??"))
      .catch(error => console.error('Error reacting to message:', error));
  }
});

client.on("messageCreate", message => {
  const Za7f = [
   "**صورة وجهك او رجلك او خشمك او يدك**.",
   "**اصدر اي صوت يطلبه منك الاعبين**.",
   "**سكر خشمك و قول كلمة من اختيار الاعبين الي معك**.",
   "**روح الى اي قروب عندك في الواتس اب و اكتب اي شيء يطلبه منك الاعبين  الحد الاقصى 3 رسائل**.",
   "**قول نكتة اذا و لازم احد الاعبين يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثانية**.",
   "**سمعنا صوتك و غن اي اغنية من اختيار الاعبين الي معك**.",
   "**ذي المرة لك لا تعيدها**.",
   "**ارمي جوالك على الارض بقوة و اذا انكسر صور الجوال و ارسله في الشات العام**.",
   "**صور اي شيء يطلبه منك الاعبين**.",
   "**اتصل على ابوك و قول له انك رحت مع بنت و احين هي حامل....**.",
   "**سكر خشمك و قول كلمة من اختيار الاعبين الي معك**.",
   "**سو مشهد تمثيلي عن مصرية بتولد**.",
   "**اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك و نبي نسمع صوت الكف**.",
   "**ذي المرة لك لا تعيدها**.",
   "**ارمي جوالك على الارض بقوة و اذا انكسر صور الجوال و ارسله في الشات العام**.",
   "**روح عند اي احد بالخاص و قول له انك تحبه و الخ**.",
   "**اكتب في الشات اي شيء يطلبه منك الاعبين في الخاص**.",
   "**قول نكتة اذا و لازم احد الاعبين يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثانية**.",
   "**سامحتك خلاص مافيه عقاب لك :slight_smile:**.",
   "**اتصل على احد من اخوياك  خوياتك , و اطلب منهم مبلغ على اساس انك صدمت بسيارتك**.",
   "**غير اسمك الى اسم من اختيار الاعبين الي معك**.",
   "**اتصل على امك و قول لها انك تحبها :heart:**.",
   "**لا يوجد سؤال لك سامحتك :slight_smile:**.",
   "**قل لواحد ماتعرفه عطني كف**.",
   "**منشن الجميع وقل انا اكرهكم**.",
   "**اتصل لاخوك و قول له انك سويت حادث و الخ....**.",
   "**روح المطبخ و اكسر صحن او كوب**.",
   "**اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك و نبي نسمع صوت الكف**.",
   "**قول لاي بنت موجود في الروم كلمة حلوه**.",
   "**تكلم باللغة الانجليزية الين يجي دورك مرة ثانية لازم تتكلم اذا ما تكلمت تنفذ عقاب ثاني**.",
   "**لا تتكلم ولا كلمة الين يجي دورك مرة ثانية و اذا تكلمت يجيك باند لمدة يوم كامل من السيرفر**.",
   "**قول قصيدة **.",
   "**تكلم باللهجة السودانية الين يجي دورك مرة ثانية**.",
   "**اتصل على احد من اخوياك  خوياتك , و اطلب منهم مبلغ على اساس انك صدمت بسيارتك**.",
   "**اول واحد تشوفه عطه كف**.",
   "**سو مشهد تمثيلي عن اي شيء يطلبه منك الاعبين**.",
   "**سامحتك خلاص مافيه عقاب لك :slight_smile:**.",
   "**اتصل على ابوك و قول له انك رحت مع بنت و احين هي حامل....**.",
   "**روح اكل ملح + ليمون اذا مافيه اكل اي شيء من اختيار الي معك**.",
   "**تاخذ عقابين**.",
   "**قول اسم امك افتخر بأسم امك**.",
   "**ارمي اي شيء قدامك على اي احد موجود او على نفسك**.",
   "**اذا انت ولد اكسر اغلى او احسن عطور عندك اذا انتي بنت اكسري الروج حقك او الميك اب حقك**.",
   "**اذهب الى واحد ماتعرفه وقل له انا كيوت وابي بوسه**.",
   "**تتصل على الوالده  و تقول لها خطفت شخص**.",
   "** تتصل على الوالده  و تقول لها تزوجت با سر**.",
   "**����تصل على الوالده  و تقول لها  احب وحده**.",
     "**تتصل على شرطي تقول له عندكم مطافي**.",
     "**خلاص سامحتك**.",
     "** تصيح في الشارع انا  مجنوون**.",
     "** تروح عند شخص تقول له احبك**.",
  
  ]
  if (message.content.startsWith(prefix + "za7f")) {
    if (!message.guild) return message.reply({ content: '**هذا الأمر متاح فقط في السيرفرات**' });

    const clientEmbed = new MessageEmbed()
      .setTitle("لعبة زحف ..")
      .setColor('RANDOM')
      .setDescription(`${Za7f[Math.floor(Math.random() * Za7f.length)]}`)
      .setTimestamp();

    message.channel.send({ embeds: [clientEmbed] })
      .then(msg => msg.react("??"))
      .catch(error => console.error('Error reacting to message:', error));
  }
});
