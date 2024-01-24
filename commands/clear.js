const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../config.json')

const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
  });
  
  const allowedRoleIds = ['1198939720940527616', '1192593384481755296'];
  
  const commands = [
    {
      name: 'clear',
      description: 'مسح رسالة',
      options: [
        {
          name: 'عدد',
          description: 'عدد الرسائل المراد مسحها',
          type: 'INTEGER',
          required: true,
        },
      ],
    },
  ];
  
  const rest = new REST({ version: '9' }).setToken(token);
  
  (async () => {
    try {
      console.log('بدأ تحديث الأوامر التطبيقية (/).');
  
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
  
      console.log('✅ تم تحديث الأوامر بنجاح.');
  
      console.log('🤖 قم بتشغيل البوت الآن.');
  
    } catch (error) {
      console.error(error);
    }
  })();
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options, member } = interaction;
  
    if (commandName === 'clear') {
      if (!allowedRoleIds.some(roleId => member.roles.cache.has(roleId))) {
        return interaction.reply({ content: 'ليس لديك الصلاحيات لاستخدام هذا الأمر.', ephemeral: true });
      }
  
      const amount = options.getInteger('عدد');
  
      if (amount <= 1 || amount > 100) {
        return interaction.reply('يجب أن يكون العدد بين 1 و 100!');
      }
  
      await interaction.channel.bulkDelete(amount);
      interaction.reply(`تم مسح ${amount} رسالة!`);
    }
  });
  
client.login(process.env.TOKEN);
