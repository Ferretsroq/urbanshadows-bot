const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');
const { ContainerBuilder, UserSelectMenuBuilder, MessageFlags } = require('discord.js');
const { text } = require('stream/consumers');


module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('debts')
	.setDescription('Fetch your debts!'),

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
        const debtsOwed = character.debtsOwed;
        const debtsToCollect = character.debtsToCollect;

        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Debts Owed By ${name}`));
        for(let debtIndex = 0; debtIndex < debtsOwed.length; debtIndex++)
        {
            if(debtsOwed[debtIndex])
            {
                container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(debtsOwed[debtIndex]));
            }
        }
        container.addSeparatorComponents((separator) => separator);
        container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Debts Owed To ${name}`));
        for(let debtIndex = 0; debtIndex < debtsToCollect.length; debtIndex++)
        {
            if(debtsToCollect[debtIndex])
            {
                container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(debtsToCollect[debtIndex]));
            }
        }


		//await interaction.reply({embeds: [character.playbookEmbed()]});
		const reply = await interaction.reply({components: [container], flags: MessageFlags.IsComponentsV2});

	},

}