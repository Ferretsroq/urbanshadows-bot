const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');


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
		const playbook = Character.PlaybookClass(characterIDs[id]["playbook"]);
		
        const character = new playbook(JSON.parse(fs.readFileSync(`./manifests/${manifest}.json`)), await getFields(sheetName), name);


		await interaction.reply({embeds: [character.playbookEmbed()]});
	},
}