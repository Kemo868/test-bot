require('dotenv').config();

const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
  
const colleges = [
  {
    id: '1192593387325505718',
    label: '💻 كلية دراسات الحاسب الآلي',
    subSpecializations: [
      'مسار تقنية المعلومات والحوسبة ( ITC )',
      'مسار الحوسبة والأعمال ( CSB )',
      'مسار تطوير الويب ( WD )',
      'مسار علوم الحاسب الآلي ( CS )',
      'مسار الأمن والشبكات ( SN )',
    ],
    roles: {
      'مسار تقنية المعلومات والحوسبة ( ITC )': '1192593391045853218',
      'مسار الحوسبة والأعمال ( CSB )': '1192593392685809855',
      'مسار تطوير الويب ( WD )': '1192593393885384824',
      'مسار علوم الحاسب الآلي ( CS )': '1192593395324047491',
      'مسار الأمن والشبكات ( SN )': '1192593396297105629',
    },
  },
  {
    id: '1192593388642504725',
    label: '💼 كلية دراسات إدارة الأعمال',
    subSpecializations: [
      'مسار النظم الإدارية ( BA )',
      'مسار التسويق ( MKT )',
      'مسار المحاسبة ( ACC )',
      'مسار المحاسبة باللغة العربية ( ACC-AR )',
    ],
    roles: {
      'مسار النظم الإدارية ( BA )': '1192593397312135229',
      'مسار التسويق ( MKT )': '1192593398918545630',
      'مسار المحاسبة ( ACC )': '1192593400369787111',
      'مسار المحاسبة باللغة العربية ( ACC-AR )': '1192593401355436194',
    },
  },
  {
    id: '1192593389745606879',
    label: '🗺 كلية الدراسات اللغوية',
    subSpecializations: [
      'مسار اللغة الإنجليزية وآدابها ( ELL )',
    ],
    roles: {
      'مسار اللغة الإنجليزية وآدابها ( ELL )': '1192593402466934965',
    },
  },
];

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

    console.log('Buttons sent to the channel.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

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
      content: 'اختار مسارك..',
      components: [subSpecializationRow],
      ephemeral: true
    });
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
        await interaction.reply({  content : `تم ازالة تخصصك ${role.name} بنجاح ❌`,
        ephemeral: true });
      } else {
        await interaction.member.roles.add(role);
        await interaction.reply({  content : `تم اختيار تخصصك ${role.name} بنجاح ✅..`,
        ephemeral: true });
      }  
    }
  }
});

client.login(process.env.TOKEN);
