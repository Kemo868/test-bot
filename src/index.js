require('dotenv').config();
const colleges = require('./colleges.json');
const colleges2 = require('./colleges2.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const keep_alive = require('./keep_alive.js')
//const { SlashCommandBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const rules = require('./rules.json');
const { readdirSync } = require('node:fs');
const { token, clientId, guildId, prefix } = require('./config.json');
const antiCrash = require('./handlers/antiCrash');
const eventHandler = require('./handlers/events');
const slashCommandsHandler = require('./handlers/slashcommands');
// const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
  ],
});
/*
client.on("ready", () => {
  setInterval(() => {
    client.user.setActivity(updateUptime());
  }, 60 * 1000);
});

uptime = 0;
function updateUptime() {
  uptime++;
  const days = Math.floor(uptime / 1440);
  const hours = Math.floor((uptime % 1440) / 60);
  const minutes = Math.floor(uptime % 60);
  const uptimeMessage = `  D: ${days} H: ${hours} M: ${minutes}`;

  return uptimeMessage;
}
  */

client.commands = new Collection();
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.interactions = new Collection();
client.events = new Collection();
/*
const handlers = ['events', 'slashcommands', 'prefixcommands'];
handlers.forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
*/
const loadCommands = (commandsDirectory, collection) => {
  if (!fs.existsSync(commandsDirectory)) {
    console.error(`Directory does not exist: ${commandsDirectory}`);
    return;
  }

  const commandFiles = fs.readdirSync(commandsDirectory).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsDirectory, file));
    if (command && command.data && command.data.name) {
      collection.set(command.data.name, command);
    } else {
      console.error(`مشكلة في تحميل الأمر من الملف: ${file}`);
    }
  }
};

// Load prefix commands
const prefixCommandsPath = path.join(__dirname, 'commands/prefixcommands');
loadCommands(prefixCommandsPath, client.prefixCommands);

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  try {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`Loaded event: ${event.name}`);
  } catch (error) {
    console.error(`مشكلة في تحميل الحدث من الملف: ${file}`, error);
  }
}

// Load slash commands
const slashCommandsPath = path.join(__dirname, 'commands/slashcommands');
loadCommands(slashCommandsPath, client.slashCommands);


client.once('ready', async () => {
  const rest = new REST({ version: '9' }).setToken(token);
  const commands = client.slashCommands.map(command => command.data.toJSON ? command.data.toJSON() : command.data);

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`Successfully registered application commands. ✅`);
  } catch (error) {
    console.error(error);
  }
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.prefixCommands.has(commandName)) return;

  const command = client.prefixCommands.get(commandName);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('حدث خطأ أثناء محاولة تنفيذ هذا الأمر!');
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

const handlersPath = path.join(__dirname, 'handlers');
if (fs.existsSync(handlersPath)) {
  const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
  for (const file of handlerFiles) {
    require(path.join(handlersPath, file))(client);
  }
} else {
  console.error(`Directory does not exist: ${handlersPath}`);
}

client.login(token).catch(err => {
  console.error('Failed to login:', err);
});

// تحميل أوامر الـ prefix
const prefixCommandFiles = fs.readdirSync(path.join(__dirname, 'commands/prefixcommands')).filter(file => file.endsWith('.js'));

for (const file of prefixCommandFiles) {
  try {
    const command = require(`./commands/prefixcommands/${file}`);
    client.prefixCommands.set(command.name, command);
    console.log(`Loaded prefix command: ${command.name}`);
  } catch (error) {
    console.error(`مشكلة في تحميل الأمر من الملف: ${file}`, error);
  }
}

// تحميل أوامر الـ slash
const slashCommandFiles = fs.readdirSync(path.join(__dirname, 'commands/slashcommands')).filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
  try {
    const command = require(`./commands/slashcommands/${file}`);
    client.slashCommands.set(command.data.name, command);
    console.log(`Loaded slash command: ${command.data.name}`);
  } catch (error) {
    console.error(`مشكلة في تحميل الأمر من الملف: ${file}`, error);
  }
}


//<-------------------------------------------------------[ الاوامر ]-------------------------------------------------------------------------------->
/*
client.on('messageCreate', async message => {
  client.once("ready", () => {
    console.log(`Bot is Ready قائمة نظام الجامعة! ✅ ${client.user.tag}`);
  });
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة نظام الجامعة العربية المفتوحة')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#002c57')
        .setThumbnail('')
        .setTitle('نظام الجامعة ')
        .setDescription('**الرجاء اختيار احد الانظمه لقرائته من قائمة الاختيارات تحت**')
        .setImage('https://cdn.discordapp.com/attachments/1192593409819549818/1201781067783086181/IMG_0722.png?ex=65cb10d6&is=65b89bd6&hm=0150a7141a83365d5f87e02f3e31147c710845b8c7178c30e2c5392036322703&')

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#002c57')
      .setTitle(rule.title)
      .setDescription(text)

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});
*/
client.on('ready', async () => {
  const channel = client.channels.cache.get('1256343291150995549');
  if (!channel) return console.log('القناة غير موجودة.');

  const studentRoleEmbed = new MessageEmbed()
      .setColor('#1b9430')
      .setTitle('رول خاص للطلاب والطالبات!')
      .setDescription('هناك رول خاصه للطلبه فقط ولها خصائص عديده. لأخذها يجب التأكد انك طالب في الجامعة العربية المفتوحة ولا نستطيع اعطائك الرول من غير ما نتأكد.')
      .setImage('https://i.imgur.com/5xKSOYk.png')
      .addFields(
          { name: 'كيفية الحصول على الرول', 
          value: 'سوف ترسل طلب للمشرفين او منسوبي إدارة السيرفر من خلال الضغط على الزر أدناه ثم راح يتواصلون معك و يطلبون منك بعض الإجراءات التالية للتأكد :\n1- أسمك\n2- رقمك الجامعي \n3- صورة من جدولك آخر ترم سجلت فيه' }
      )
      .setFooter (
         '...يرجى الضغط على زر "طلب" لبدء العملية.', 
        )


  const row = new MessageActionRow()
      .addComponents(
          new MessageButton()
              .setCustomId('request_role')
              .setLabel('طلب')
              .setStyle('PRIMARY'),
      );

  channel.send({ embeds: [studentRoleEmbed], components: [row] });
  
  console.log('Buttons sent to the channel روم التوثيق 3 ✅.');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'request_role') {
      await interaction.reply({ content: 'تم الطلب بنجاح ✅! سوف يتواصلون معك مشرفين السيرفر أو منسوبي إدارة السيرفر في أقرب وقت ممكن.', ephemeral: true });
  }
});

client.on('ready', async () => {
  try {
    const channel = await client.channels.cache.get('1256354380681187441');
    if (!channel) return;

    const exampleEmbed2 = {
      color: 0x0099FF,
      title: '..اختار موادك',
      author: {
        name: ' ',
      },
      description: 'يمكنك كذلك رؤية الخطة الدراسية الخاصة بك ⬇️',
      image: {
        url: 'https://i.imgur.com/1amKAjJ.png',
      },
      footer: {
        text: 'يرجى الضغط على الزر ادناه ...',
      },
    };
    await channel.send({ embeds: [exampleEmbed2] });


    const rows2 = [];

    colleges2.forEach((college, index) => {
      const button2 = new MessageButton()
        .setCustomId(college.id)
        .setLabel(college.label)
        .setStyle('PRIMARY');

      if (index % 5 === 0) {
        rows2.push(new MessageActionRow());
      }

      rows2[rows2.length - 1].addComponents(button2);
    });

    await channel.send({
      content: ' ',
      components: rows2,
      ephemeral: true,
    });

    console.log('Buttons sent to the channel اختار مادتك 2 ✅.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  try {
    const selectedRoleId = interaction.customId;
    const role = interaction.guild.roles.cache.get(selectedRoleId);

    if (role) {
      const hasRole = interaction.member.roles.cache.has(selectedRoleId);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.reply({ content: `تم ازالة مادتك ${role.name} بنجاح ❌.`, ephemeral: true });
      } else {
        await interaction.member.roles.add(role);
        await interaction.reply({ content: `تم اختيار مادتك ${role.name} بنجاح ✅.`, ephemeral: true });
      }
    }
    if (interaction.replied) {
      console.log('تم الرد على هذا التفاعل بالفعل.');
      return;
    }
  } catch (error) {
    console.error('Error handling button click:', error);

  }
});
  

client.on('ready', async () => {
  try {
    const channel = await client.channels.cache.get('1255024372444561490');
    if (!channel) return;
    
    const exampleEmbed = {
      color: 0x0099FF, // تحديد اللون بالرقم العشري أو السداسي عشري
      title: '..اختار كليتك', // تحديد العنوان
      author: {
        name: 'اختار تخصصك هنا ⬇️', // اسم المؤلف
      },
      description: '** كلية دراسات الحاسب الآلي 💻\nكلية دراسات إدارة الأعمال 💼\nكلية الدراسات اللغوية 🗺**', // الوصف
      image: {
        url: 'https://i.imgur.com/ariUwfw.jpg', // الصورة الرئيسية
      },
      footer: {
        text: 'يرجى الضغط على الزر ادناه ...', // نص التذييل
      },
    };
    channel.send({ embeds: [exampleEmbed] }); // إرسال الرسالة المضمنة

    const rows = [];

    colleges.forEach((college, index) => {
      const button = new MessageButton()
        .setCustomId(college.id)
        .setLabel(college.label)
        .setStyle('PRIMARY');

      if (index % 5 === 0) {
        rows.push(new MessageActionRow());
      }

      rows[rows.length - 1].addComponents(button);
    });
  
    await channel.send({
      content: ' ',
      components: rows,
      ephemeral: true
    });

    console.log('Buttons sent to the channel 1 اختار تخصصك ✅.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    const requiredRole = '1255107962708688977'; // استبدل بمعرف الرتبة الخاص بك
    const targetChannelId = '1256343291150995549'; // استبدل بمعرف القناة الخاص بك
    if (!interaction.member.roles.cache.has(requiredRole)) {
      await interaction.reply({
        content: `ليس لديك الرول المطلوب. للضغط على الزر، يرجى الذهاب إلى روم <#${targetChannelId}>, و طلب رول الطلاب و الطالبات `,
        ephemeral: true
      });
      return;
    }

  const selectedCollegeId = interaction.customId;
  const selectedCollege = colleges.find((college) => college.id === selectedCollegeId);

  if (selectedCollege) {
    const subSpecializationRow = new MessageActionRow();

    selectedCollege.subSpecializations.forEach((subSpecialization) => {
      subSpecializationRow.addComponents(
        new MessageButton()
          .setCustomId(subSpecialization)
          .setLabel(subSpecialization)
          .setStyle('PRIMARY'),
      );
    });

    await interaction.reply({
      content: 'تم اختيار كليتك \n اختار مسارك..',
      components: [subSpecializationRow],
      ephemeral: true
    });
  }
  }catch (error) {
    console.error('Error handling button click:', error);
 
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const selectedSubSpecialization = interaction.customId;
  const member = interaction.member;

  const selectedCollege = colleges.find((college) =>
    college.subSpecializations.includes(selectedSubSpecialization)
  );

  if (selectedCollege && selectedCollege.roles[selectedSubSpecialization]) {
    const selectedRoleId = selectedCollege.roles[selectedSubSpecialization];
    const role = interaction.guild.roles.cache.get(selectedRoleId);

    if (role) {
      const hasRole = member.roles.cache.has(selectedRoleId);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.reply({  content : `تم ازالة تخصصك ${role.name} بنجاح ❌.`,
        ephemeral: true });
      } else {
        await interaction.member.roles.add(role);
        await interaction.reply({  content : `تم اختيار تخصصك ${role.name} بنجاح ✅.`,
        ephemeral: true });
      }  
      if (interaction.replied) {
        console.log('تم الرد على هذا التفاعل بالفعل.');
        return;
      }
    }
  }
});
  
client.login(process.env.TOKEN);
