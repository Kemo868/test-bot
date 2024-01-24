require('dotenv').config();
const keep_alive = require('../keep_alive.js')
const colleges = require('./colleges.json');
const colleges2 = require('./colleges2.json');
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
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

client.on('ready', async () => {
  const channel = client.channels.cache.get('1197785650771005460');
  if (!channel) return console.log('القناة غير موجودة.');

  client.commands = new Collection();

// قراءة ملفات الأوامر
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  // تأكد من أن كائن الأمر معرف وله خاصية name
  if (command && command.data && command.data.name) {
      client.commands.set(command.data.name, command);
  } else {
      console.error(`مشكلة في تحميل الأمر من الملف: ${file}`);
  }
  client.once('ready', () => {
    console.log('البوت جاهز!');
});
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// التعامل مع الأوامر
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'حدث خطأ أثناء تنفيذ هذا الأمر!', ephemeral: true });
    }
});

client.on('ready', async () => {
  const channel = client.channels.cache.get('1197785650771005460');
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
    const channel = await client.channels.cache.get('1196528663273938975');
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
    const channel = await client.channels.cache.get('1192593411090419805');
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
      const requiredRole = '1192593386188832838'; // استبدل بمعرف الرتبة الخاص بك
      const targetChannelId = '1197785650771005460'; // استبدل بمعرف القناة الخاص بك
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
