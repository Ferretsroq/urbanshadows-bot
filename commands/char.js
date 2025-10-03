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
        
        const character = new Character(JSON.parse(fs.readFileSync("./awareManifest.json")), await getFields("The Aware"), "Foo");


		await interaction.reply({embeds: [character.toEmbed()]});
	},
}