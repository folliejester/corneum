require('dotenv').config()
const config = require('./config.json')
const nhentai = require('nhentai');
const api = new nhentai.API();
async function slashcom(config, guildID, guildname) {
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
  new SlashCommandBuilder().setName('help').setDescription('Shows the help embed!'),
  new SlashCommandBuilder().setName('read').setDescription('Mention the code of the hmanga')
  .addIntegerOption(option => option.setName('code').setRequired(true).setDescription('Mention the code of the hmanga'))
  .addBooleanOption(option => option.setName('private').setRequired(true).setDescription('Would you like to read it privately?')),
  new SlashCommandBuilder().setName('bookmarks').setDescription('Lists all your favourite marked codes'),
  new SlashCommandBuilder().setName('home').setDescription(`nHentai.net's homepage!`),
  new SlashCommandBuilder().setName('random').setDescription(`Drops a random hentai manga`),
  new SlashCommandBuilder().setName('last').setDescription('Shows you your last read hmanga'),
  new SlashCommandBuilder().setName('previous').setDescription(`Drops the code of the previously interacted hmanga`),
  new SlashCommandBuilder().setName('ping').setDescription(`Check the bot's ping`),
  new SlashCommandBuilder().setName('uptime').setDescription(`Check how long the bot is online for`)
]; 

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing application (/) commands for ${guildname}\n`);

    await rest.put(
      Routes.applicationGuildCommands(config.client_ID, guildID),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands for ${guildname}`);
  } catch (error) {
    console.log(error)
    console.error(`${guildname} (${guildID}) needs to re-add the bot.`);
  }
})();
}

const db = require("quick.db");

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

/*const { AutoPoster } = require('topgg-autoposter')
AutoPoster(config.topdotgg_token, client)
.on('posted', (stats) => {
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
});*/

client.on('ready', async () => {
  console.log(client.user.username + " is online bitches!\n");
  client.guilds.cache.forEach(guild => {
    client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 13th February '22`, { type: 'LISTENING' });
    console.log(`${guild.id}\t${guild.me.permissions.has('ADMINISTRATOR')}\t${guild.memberCount}\t${guild.name}`);
    slashcom(config, guild.id, guild.name)
    });
      
    let chan = await client.channels.fetch("758969560060919810");
    const embed = new MessageEmbed()
    .setColor("ff2779")
    .setTitle("Corneum Hosting Now!")
    .setImage("https://i.redd.it/1if6y4laq6cz.gif")
    //.setTimestamp()
    chan.send({embeds:[embed]})
});

client.on("guildCreate", async guild => {
  if (!guild.available) return;
  let owner = await guild.members.fetch(guild.ownerId);
  const app = await client.application.fetch();
  const embed = new MessageEmbed()
  .setColor('ff2779')
  .setAuthor({name:`Made by ${app.owner.username}#${app.owner.discriminator}`,iconURL : app.owner.avatarURL({format: "jpeg",dynamic:true, size:1024}) })
  .setTitle(app.name +' | '+ client.user.username+'#'+client.user.discriminator)
  .setDescription(`Hello ${owner.user.username}, thank you for having me onboard.\nMy name is Corneum, horny in Latin, the name kinda suits me though.\nThis message is sent to you because I have been added to a server you own, also, this message serve as a notification of me joining your server.\nTo get started, use the slash commands, if you don't see them, kick me and add me again!\nIf you face any trouble, join the [support server](https://discord.gg/FgjzdwB "Syden's Test & Support Server") to get assistance.\nI'd also appreciate your support to the project at [Buy Me A Coffee](https://buymeacoffee.com/Loquax "Loquax's BMC Page").`)
  .setImage('https://i.imgur.com/NJw66KD.png')
  .setThumbnail(app.iconURL({format:"jpeg",size:1024,dynamic:true}))
  .setFooter({text:'https://buymeacoffee.com/Loquax',iconURL:'https://bmc-dev.s3.us-east-2.amazonaws.com/assets/icons/bmc_icon_black.png'})
  owner.send({embeds:[embed]})
  .catch(err => {
    return;// guild.channels.fetch();
  })
  slashcom(config, guild.id, guild.name)
  client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 13th February '22`, { type: 'LISTENING' });
  let joinChannel = await client.channels.fetch("758969811299467276");
  var big = " ";
  if (!guild.large) big = "small";
  else return (big = "large");
  const joinembed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor({name:`Owned by ${owner.user.tag}`, iconURL: owner.user.avatarURL({ format: "jpg", size: 1024, dynamic: true }), url: `https://discordapp.com/users/${guild.ownerID}`})
    .setTitle(`Joined a new guild, ${guild.name}!`)
    //.setURL(invite.code)
    .setThumbnail(guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setDescription(`This ${big} happy guild has ${guild.memberCount.toString()} members!`)
    .addFields(
      { name: "ID", value: guild.id, inline: true },
      { name: "Vanity URL Code", value: (guild.vanityURLCode) || "None", inline: true },
      { name: "Preffered Locale", value: (guild.preferredLocale || "None Yet"), inline: true }
    )
    .setImage( (guild.splashURL) || guild.iconURL({ format: "jpg", size: 1024, dynamic: true }) )
    .setTimestamp();
  joinChannel.send({embeds: [joinembed]});
});

  client.on("guildDelete", async guild =>{
    client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 13th February '22`, { type: 'LISTENING' });
    let kickChannel = client.channels.cache.get("758969811299467276");
    var big = " ";
    if (!guild.large) big = "small";
    else return (big = "large");
    let owner = await guild.members.fetch(guild.ownerId);
    const joinembed = new MessageEmbed()
    .setColor("RED")
    .setAuthor({name:`Owned by ${owner.user.tag}`, iconURL: owner.user.avatarURL({ format: "jpg", size: 1024, dynamic: true }), url:`https://discordapp.com/users/${guild.ownerID}`})
    .setTitle(`Got kicked from ${guild.name} 😭`)
    //.setURL(inv.url)
    .setThumbnail(guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setDescription(`Served this ${big} happy guild of ${guild.memberCount.toString()} members since ${new Date(guild.joinedTimestamp)}!`)
    .addFields(
      { name: "ID", value: guild.id, inline: true },
      { name: "Vanity URL Code", value: (guild.vanityURLCode) || "None", inline: true },
      { name: "Preffered Locale", value: (guild.preferredLocale || "None"), inline: true }
    )
    .setImage((guild.splashURL) || guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setTimestamp();
    kickChannel.send({embeds: [joinembed]});
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if(msg.content == `<@!${config.client_ID}>` || msg.content == `<@${config.client_ID}>`) return msg.reply(`Hello!\nThank you for having me onboard, I do not work with prefixes, please use the slash commands to get started!`)
  .catch(err => {
    return;
  })
});

client.on('interactionCreate', async interaction => {
  if(interaction.isCommand())
  {
  if(!interaction.inGuild()) return;
  if(interaction.commandName === 'read')
  {
    if(interaction.channel.nsfw != true) return interaction.reply({content: 'Use a NSFW channel 😉', ephemeral: true});
    const boolean = interaction.options.getBoolean('private');
    if(boolean === true) interaction.reply({content:'Fetching data...',ephemeral:true});
    else if (boolean === false) interaction.reply('Fetching data...');
    const integer = interaction.options.getInteger('code');
    (async () => {
        if(await api.doujinExists(integer)) 
        {
            const dojin = await api.fetchDoujin(integer)
            .catch(err => {
                return interaction.editReply({content: err.message})
            })
    let pages = dojin.pages;
    const test = new MessageEmbed()
    .setColor('ec2854')
    .setTitle(dojin.titles.pretty)
    .setURL(dojin.url)
    .setDescription(`• **ID** : ${(dojin.id || 'Null')}\n• **Native Title** : ${(dojin.titles.japanese || 'None')}\n• **Tags** : *Feature Coming Soon*\n• **Uploaded** : ${(dojin.uploadDate) || 'None'}`)
    .setFooter({ text: `Page 1 of ${pages.length}`, iconURL: 'https://i.imgur.com/TCXYS5M.jpg' })
    .setThumbnail(pages[0].url)
    .setTimestamp();
    const row = new MessageActionRow()
      .addComponents(
				new MessageButton()
					.setCustomId('prevpage')
					.setLabel('Previous')
					.setStyle('SUCCESS'),
			).addComponents(
				new MessageButton()
					.setCustomId('bookmark')
					.setLabel('🤍')
					.setStyle('DANGER'),
			).addComponents(
				new MessageButton()
					.setCustomId('nexpage')
					.setLabel('Next')
					.setStyle('SUCCESS'),
			).addComponents(
				new MessageButton()
					.setLabel('Link')
					.setStyle('LINK')
          .setURL(dojin.url),
			);
      return await interaction.editReply({
      content: `#${dojin.id} Use the buttons below to scroll through the pages.`,
      embeds: [test],
      components: [row]
    });
    then(msg => {
        msg.react('⬅').then( r => {
            msg.react('➡')
            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === interaction.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === interaction.author.id;

            const backwards = msg.createReactionCollector(backwardsFilter, { time: 600000 });
            const forwards = msg.createReactionCollector(forwardsFilter, { time: 600000 });

            backwards.on('collect', r => {
                
                if(page === 1) return;
                page--;
                test.setImage(pages[page-1].url);
                test.setFooter(`Page ${page} of ${pages.length}`, 'https://i.imgur.com/TCXYS5M.jpg')
                msg.edit(test)
                msg.reactions.resolve(r).users.remove(interaction.author.id);
            })
            forwards.on('collect', r => {
                
                if(page === pages.length) return;
                page++;
                test.setTitle('')
                test.setThumbnail('')
                test.setDescription('')
                test.setURL('')
                test.setImage(pages[page-1].url);
                test.setFooter(`Page ${page} of ${pages.length}`, 'https://i.imgur.com/TCXYS5M.jpg')
                msg.edit(test)
                msg.reactions.resolve(r).users.remove(interaction.author.id);
            })
            forwards.on('end', r => {
                if(msg.deleted) return;
                msg.edit('Manga expired! (*10 minutes*)');
                msg.reactions.removeAll()
            })
        })
    })//end of then
}
else { return interaction.editReply({ content: 'No doujin exists in the database with that specific ID, please try again.' }) }

})();
  }
  else if(interaction.commandName === 'bookmarks')
  {
    data = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67]
    index = 1;
    class Pagination {
      constructor(data){
          this.pages = []
          this.createPages(data)
          this.embed = new MessageEmbed()
          this.onClick(index)
      }
  
      createPages(data){
          let totalPages = data.length / 60
          for(var i = 0; i <= totalPages; i++){
              let tempArray = []
              for(var j = 0; j<60;j++){
                  if(data[60*i+j] == undefined){
                      break
                  }else{
                      tempArray.push(data[60*i+j])
                  }
              }
              this.pages.push(tempArray)
          }
      }
  
      page(index){
          if(this.pages[index-1] != undefined){
              return this.pages[index-1]
          }
      }
  
      updateEmbed(data){
          for(var i = 0; i<data.length;i++){
              this.embed.addDescription(`Name ${data[i]}\nValue ${data[i]}`)
          }
      }
  
      onClick(index){
          this.updateEmbed(this.page(index))
          return this.embed
      }
  }
  
  const myPages = new Pagination(data)
  console.log(myPages)
/*
    data = db.get(interaction.user.id);
    data = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67]
    if(data.length === 1) return interaction.reply({content:'Your bookmark is empty!',ephemeral:true});
    data.shift();
    const embed = new MessageEmbed()
  let finalArray = []
  for(var i = 0; i <= 19; i++){
      let tempArray = []
      for(var j=0; j<3; j++){
          if(data[3*i+j] === undefined) {
              break
          }
          else{
              tempArray.push(data[3*i+j])
          }
      }
      let tempString = tempArray.join(' • ')
      finalArray.push(tempString)
      tempString = ''
      tempArray = []
  }
console.log(finalArray)*/
      return interaction.reply({content:'Feature Coming Soon!',ephemeral:true});
  }
  else if(interaction.commandName === 'home')
  {
    return interaction.reply({content:'Feature Coming Soon!',ephemeral:true});
  }
  else if(interaction.commandName === 'random')
  {
    return interaction.reply({content:'Feature Coming Soon!',ephemeral:true});
  }
  else if(interaction.commandName === 'last')
  {
    return interaction.reply({content:'Feature Coming Soon!',ephemeral:true});
  }
  else if(interaction.commandName === 'previous')
  {
    return interaction.reply({content:'Feature Coming Soon!',ephemeral:true});
  }
  else if(interaction.commandName === 'help')
  {
    const version = require("./package.json");
  const app = await client.application.fetch();
  const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
        .setLabel('Buy Me a Coffee')
        .setStyle('LINK')
        .setURL('https://www.buymeacoffee.com/Loquax'),
			);
  const embed = new MessageEmbed()
  .setColor('ec2854')
  .setAuthor({name: `Made by ${app.owner.username}#${app.owner.discriminator}`, iconURL : app.owner.avatarURL({format: "jpeg",dynamic:true, size:1024}) })
  .setTitle(app.name +' | '+ client.user.username+'#'+client.user.discriminator)
  .setURL('https://dsc.gg/corneum')
  .setDescription(`Hello ${interaction.member.displayName},\nUse the slash commands to get started, and yes, this bot has no prefix to work with.
  You can use the slash command interaction by typing a forward slash/ and choose the preferred interaction you want.\n
  • To read a hentai manga, use the \`/read\` slash command in your server's nsfw channel.
  • You can also read hentai mangas privately to hide your fantasies or to prevent people from changing pages by mentioning \`yes\` or \`no\` in the \`read\` slash command.
  • Example to read privately : \`/read code:177013 private:yes\`
  • Your bookmarked hentai mangas are list in \`/bookmarks\` slash command
  • You can also check your previously interacted or last read hentai manga by using the \`/previous\` and the \`last\` slash commands.
  • The homepage can be check by using the \`/home\` slash command.
  • Use \`/random\` slash command to let me find a random hmanga for you!
  • To check the bot's ping, use the \`/ping\` slash command.
  • To check how long the bot is online for, use the \`/uptime\` slash command.
  If you face any trouble, [click to join the support server](https://discord.gg/FgjzdwB "Syden's Test & Support Server") to get assistance.\nI'd also appreciate your support to the project at [Buy Me A Coffee](https://buymeacoffee.com/Loquax "Loquax's BMC Page").\n\n[Invite me](https://discord.com/oauth2/authorize?client_id=903855063359950888&permissions=517611052096&scope=bot%20applications.commands "Vanity : dsc.gg/loquax") | [Github](https://github.com/folliejester/loquax "Open Source") | [VPS Host](https://www.vultr.com/?ref=8913956 "Vultr VPS") | [Community Server](https://discord.gg/96vgbea "The Rushia's Cult!")`)
  .setImage('https://i.imgur.com/NJw66KD.png')
  .setThumbnail(app.iconURL({format:"jpeg",size:1024,dynamic:true}))
  .setFooter({text:'https://buymeacoffee.com/Loquax',iconURL:'https://bmc-dev.s3.us-east-2.amazonaws.com/assets/icons/bmc_icon_black.png'})
  .addField('Launched on','21th February 2022',true)
  .addField('API and environment',`[discord.js v${version.dependencies['discord.js'].replace('^',"")}](https://discord.js.org/#/ "Imagine a bot")\n[Node.js v${version.engines.node.replace('.x',"")}](https://nodejs.org/en/ "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.")`,true)
  await interaction.member.send({embeds:[embed],components: [row]})
  .then( m=> {
    interaction.reply({content:"Check your DM!",ephemeral:true})
    .catch(err => {
      return;
    })
})
.catch(e=>{
  interaction.reply({embeds:[embed]})
})
  }
  else if (interaction.commandName === 'ping') {
    await interaction.reply("Pinging . .. ...")
    .catch(err => {
      return;
    })
    const m1 = await interaction.fetchReply()
    let sign = "", sign2 = "";
  
  if((m1.createdTimestamp - interaction.createdTimestamp) < 100) sign = "🟢";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 99 && (m1.createdTimestamp - interaction.createdTimestamp) < 150) sign = "🟡";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 149 && (m1.createdTimestamp - interaction.createdTimestamp) < 300) sign = "🟠";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 299) sign = "🔴";

  if(interaction.client.ws.ping < 100) sign2 = "🟢";
  else if(interaction.client.ws.ping > 99 && interaction.client.ws.ping < 150) sign2 = "🟡";
  else if(interaction.client.ws.ping > 149 && interaction.client.ws.ping < 300) sign2 = "🟠";
  else if(interaction.client.ws.ping > 299) sign2 = "🔴";

  const pingembed = new MessageEmbed()
    .setColor("ff2779")
    .setTitle("Loquax's Latency")
    .addFields(
      {name: "Latency",value: `${m1.createdTimestamp - interaction.createdTimestamp}ms ${sign}`,inline: true},
      {name: "API Latency",value: `${Math.round(interaction.client.ws.ping)}ms ${sign2}`,inline: true}
    );
  await interaction.editReply({content:"Pinged!", embeds: [pingembed]})
  }
  else if (interaction.commandName === "uptime") {
    var day, hour, minute, seconds;
  seconds = Math.floor(client.uptime / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  const uptime = `${day} days, ${hour} hours, ${minute} minutes and ${seconds} seconds`;
  const utembed = new MessageEmbed()
  .setColor("ff2779")
  .setDescription(uptime)
  .setTitle('Hosting Duration 🕛')
  return interaction.reply({embeds: [utembed]})
  .catch(err => {
    return;
  })
  }
}
else if(interaction.isButton())
{
  if(interaction.message.author.id !== config.client_ID) return;
  const footer = interaction.message.embeds[0].footer.text;
  let url = interaction.message.embeds[0].thumbnail?.url || interaction.message.embeds[0].image?.url;
  let split = footer.split(" ");
  let page = split[1]; //1
  let tpage = split[3]; //255
  let prev = url.replace(`${page}.jpg`,`${parseInt(page)-1}.jpg`);
  let next = url.replace(`${page}.jpg`,`${parseInt(page)+1}.jpg`);
  if(interaction.customId === "prevpage")
  {
    if(page === '1') return interaction.reply({content:'Already at first page!', ephemeral:true});
    const embed = new MessageEmbed()
    .setTitle('')
    .setColor('ec2854')
    .setThumbnail('')
    .setDescription('')
    .setURL('')
    .setFooter({ text: `Page ${parseInt(page)-1} of ${tpage}`, iconURL: 'https://i.imgur.com/TCXYS5M.jpg' })
    .setImage(prev)
    return interaction.update({
      content: interaction.message.content,
      embeds: [embed]
    })
  }
  else if(interaction.customId === "nexpage")
  {
    if(page === tpage) return interaction.reply({content:'Already at last page!', ephemeral:true});
    const embed = new MessageEmbed()
    .setTitle('')
    .setColor('ec2854')
    .setThumbnail('')
    .setDescription('')
    .setURL('')
    .setFooter({ text: `Page ${parseInt(page)+1} of ${tpage}`, iconURL: 'https://i.imgur.com/TCXYS5M.jpg' })
    .setImage(next)
    return interaction.update({
      content: interaction.message.content,
      embeds: [embed]
    })
  }
  else if(interaction.customId === "bookmark")
  {
    const code = interaction.message.content.split(" ")[0].replace('#','');
    let data = db.get(interaction.user.id);
    if(data === null)
    {
      db.set(`${interaction.user.id}`,['codes',code])
      return interaction.reply({content: 'Bookmarked!', ephemeral:true});
    }
    if(data.find(id => id === code))
    {
      const index = data.indexOf(code);
      if (index > -1) {
        data.splice(index, 1);
      }
      db.set(interaction.user.id, data)
      return interaction.reply({content:'Bookmark Removed!',ephemeral:true});
    }
    db.push(`${interaction.user.id}`,code)
    interaction.reply({content: 'Bookmarked!', ephemeral:true});
  }
}
else return;
}
);

client.login(process.env.DISCORD_TOKEN);
