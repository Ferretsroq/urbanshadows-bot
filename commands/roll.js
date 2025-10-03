const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');


module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('roll')
	.setDescription('Roll some dice!'),

	async execute(interaction)
	{
        const characterIDs = JSON.parse(fs.readFileSync('./characterIDs.json'));
		const id = interaction.user.id;
		const manifest = characterIDs[id]["manifest"];
		const sheetName = characterIDs[id]["sheetName"];
		const name = characterIDs[id]["name"];
		const playbook = Character.PlaybookClass(characterIDs[id]["playbook"]);
		
        const character = new playbook(JSON.parse(fs.readFileSync(`./manifests/${manifest}.json`)), await getFields(sheetName), name);
		const buttonRow0 = new ActionRowBuilder();
        const buttonRow1 = new ActionRowBuilder();
        for(let stat of ['Blood', 'Heart', 'Mind', 'Spirit'])
        {
            buttonRow0.addComponents(new ButtonBuilder().setCustomId(`rollStat${stat}`).setLabel(`${stat}: ${character[stat.toLowerCase()]}`).setStyle(ButtonStyle.Primary));
        }
        for(let stat of ['Mortalis', 'Night', 'Wild', 'Power'])
        {
            buttonRow1.addComponents(new ButtonBuilder().setCustomId(`rollStat${stat}`).setLabel(`${stat}: ${character[stat.toLowerCase()]}`).setStyle(ButtonStyle.Primary));
        }
		const reply = await interaction.reply({content: 'Choose a stat to roll with!', components: [buttonRow0, buttonRow1]});

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
        /*const characterIDs = JSON.parse(fs.readFileSync('./characterIDs.json'));
		const id = interaction.user.id;
		const manifest = characterIDs[id]["manifest"];
		const sheetName = characterIDs[id]["sheetName"];
		const name = characterIDs[id]["name"];
		const playbook = Character.PlaybookClass(characterIDs[id]["playbook"]);
		
        const character = new playbook(JSON.parse(fs.readFileSync(`./manifests/${manifest}.json`)), await getFields(sheetName), name);*/
        const stat = interaction.customId.split('rollStat')[1].toLowerCase();
		const roll0 = Math.floor(Math.random()*6)+1;
		const roll1 = Math.floor(Math.random()*6)+1;
        const result = roll0 + roll1 + parseInt(character[stat]);
		await interaction.update({content: `${roll0}+${roll1}+${character[stat]} = **${result}**`, components: []});

		
	},
}


