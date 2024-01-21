const { Client, Intents, Permissions, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../config.json')
const targetChannelId = '1197785650771005460'; // قم بالتبديل بمعرّف القناة المستهدفة
const targetRoleId = '1192593386188832838'; // قم بالتبديل بمعرّف الرتبة المستهدفة

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const commands = [
  {
    name: 'student',
    description: 'عرض زر "اثبات الطلاب".',
  }
];

const student = {
    type: 1,
    components: [
      {
        type: 2, // استخدم نوع الزر مباشرة
        style: 1,
        custom_id: 'student',
        label: 'انا طالب/ه 👨👩الجامعة العربية المفتوحة'
      }
    ]
  };
  
  const disabledStudent = {
    type: 2,
    style: 2, // تغيير الستايل إلى 2 للرمادي
    custom_id: 'student',
    label: 'انا طالب/ه 👨👩الجامعة العربية المفتوحة',
    disabled: true,
  };

  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      console.log('بدأ تحديث الأوامر التطبيقية (/).');
  
      // تحديث أوامر السلاش
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
  
    if (interaction.commandName === 'student' && interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      try {
        // إرسال الزر في القناة المستهدفة
        const targetChannel = await client.channels.fetch(targetChannelId);
        const sentMessage = await targetChannel.send({
          content: 'انقر على الزر للحصول على الرول!',
          components: [student]
        });
  
  
        // انتظار الضغط على الزر وتحديث الرسالة
        const filter = i => i.customId === 'student' && i.isButton() && i.message.id === sentMessage.id;
        const collector = targetChannel.createMessageComponentCollector({ filter, time: 30000 });
  
        collector.on('collect', async i => {
          // إضافة الرتبة للعضو
          await i.member.roles.add(targetRoleId);
          // رد بعد الضغط على الزر
          sentMessage.edit({
            content: '✅ تم الضغط بنجاح!',
            components: [
              {
                type: 1,
                components: [disabledStudent], // استخدام الزر المعطل بعد الضغط
              }
            ],
          })
          collector.stop(); // إيقاف جمع البيانات بمجرد الضغط
        });
  
        collector.on('end', collected => {
          if (collected.size === 0) {
            // رد في حال انتهاء المدة دون الضغط على الزر
            sentMessage.edit({
              content: 'انتهت المدة دون الضغط على الزر.',
              components: [],
            });
          }
        });
  
      } catch (error) {
        console.error('❌ خطأ في إرسال الزر:', error);
        await interaction.reply('❌ حدث خطأ أثناء محاولة إرسال الزر.');
      }
    }
  });
  

client.login(token);
