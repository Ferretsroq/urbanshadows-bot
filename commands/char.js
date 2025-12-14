const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');
const { ContainerBuilder, UserSelectMenuBuilder, MessageFlags } = require('discord.js');


module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('char')
	.setDescription('Fetch a character!'),

	async execute(interaction)
	{
        const characterIDs = JSON.parse(fs.readFileSync('./characterIDs.json'));
		const id = interaction.user.id;
		const manifest = characterIDs[id]["manifest"];
		const sheetName = characterIDs[id]["sheetName"];
		const name = characterIDs[id]["name"];
		const gid = characterIDs[id]["gid"];
		const playbook = Character.PlaybookClass(characterIDs[id]["playbook"]);
		
        const character = new playbook(JSON.parse(fs.readFileSync(`./manifests/${manifest}.json`)), await getFields(sheetName), name, gid);


		//await interaction.reply({embeds: [character.playbookEmbed()]});
		const reply = await interaction.reply({components: [character.toComponent()], flags: MessageFlags.IsComponentsV2});
		const filter = (i) => i.user.id === interaction.member.id;

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter
		});
		let stat = '';
		collector.on('collect', async (interaction) => {
				await this.Roll(interaction, character);
                return;
		});
	},
	async Roll(interaction, character)
	{
		console.log('Rolling stat');
        const stat = interaction.customId.split('rollStat')[1].toLowerCase();
		console.log(stat);
		const roll0 = Math.floor(Math.random()*6)+1;
		const roll1 = Math.floor(Math.random()*6)+1;
        const result = roll0 + roll1 + parseInt(character[stat]);
		await interaction.reply({content: `Rolling with **${stat.toUpperCase()}**\n${roll0}+${roll1}+${character[stat]} = **${result}**`, components: []});

		
	},
}