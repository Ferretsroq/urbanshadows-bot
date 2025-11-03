const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');
const { ContainerBuilder, UserSelectMenuBuilder, MessageFlags } = require('discord.js');


module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('moves')
	.setDescription('Show moves!'),

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
		//const reply = await interaction.reply({components: [character.toComponent()], flags: MessageFlags.IsComponentsV2});
        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Basic Moves`));
        const basicMoves = fs.readdirSync('./moves/basic/').map(name => name.replace('.basicmove', ''));
        const basicMoveRows = [];
        for(let moveIndex = 0; moveIndex < basicMoves.length; moveIndex++)
        {
            if(moveIndex%5 == 0)
            {
                basicMoveRows.push(new ActionRowBuilder());
            }
            basicMoveRows[basicMoveRows.length-1].addComponents(new ButtonBuilder().setCustomId(basicMoves[moveIndex]).setLabel(basicMoves[moveIndex]).setStyle(ButtonStyle.Primary))
        }
        container.addActionRowComponents(basicMoveRows);
        container.addSeparatorComponents((separator) => separator);
        container.addTextDisplayComponents((textDisplay) => textDisplay.setContent('# Circle Moves'));
        const circleMoves = fs.readdirSync('./moves/circle/').map(name => name.replace('.circlemove', ''));
        const circleMoveRows = [];
        for(let moveIndex = 0; moveIndex < circleMoves.length; moveIndex++)
        {
            if(moveIndex%5 == 0)
            {
                circleMoveRows.push(new ActionRowBuilder());
            }
            circleMoveRows[circleMoveRows.length-1].addComponents(new ButtonBuilder().setCustomId(circleMoves[moveIndex]).setLabel(circleMoves[moveIndex]).setStyle(ButtonStyle.Primary))
        }
        container.addActionRowComponents(circleMoveRows);
        const reply = await interaction.reply({components: [container], flags: MessageFlags.IsComponentsV2});
        const filter = (i) => i.user.id === interaction.member.id;

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter
		});
		let stat = '';
		collector.on('collect', async (interaction) => {
				await this.DisplayMove(interaction, reply);
                return;
		});
	},
    async DisplayMove(interaction, reply)
    {
        const moveName = interaction.customId;
        const container = this.MakeBaseContainer();
        container.addSeparatorComponents((separator) => separator);
        if(fs.existsSync(`./moves/basic/${moveName}.basicmove`))
        {
            const content = fs.readFileSync(`./moves/basic/${moveName}.basicmove`, 'utf8');
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# ${moveName}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(content));
            await interaction.update({components: [container]});
        }
        else if(fs.existsSync(`./moves/circle/${moveName}.circlemove`))
        {
            const content = fs.readFileSync(`./moves/circle/${moveName}.circlemove`, 'utf8');
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# ${moveName}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(content));
            await interaction.update({components: [container]});
        }
    },
	async Roll(interaction, character)
	{
        const stat = interaction.customId.split('rollStat')[1].toLowerCase();
		const roll0 = Math.floor(Math.random()*6)+1;
		const roll1 = Math.floor(Math.random()*6)+1;
        const result = roll0 + roll1 + parseInt(character[stat]);
		await interaction.reply({content: `Rolling with **${stat.toUpperCase()}**\n${roll0}+${roll1}+${character[stat]} = **${result}**`, components: []});

		
	},
    MakeBaseContainer()
    {
        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Basic Moves`));
        const basicMoves = fs.readdirSync('./moves/basic/').map(name => name.replace('.basicmove', ''));
        const basicMoveRows = [];
        for(let moveIndex = 0; moveIndex < basicMoves.length; moveIndex++)
        {
            if(moveIndex%5 == 0)
            {
                basicMoveRows.push(new ActionRowBuilder());
            }
            basicMoveRows[basicMoveRows.length-1].addComponents(new ButtonBuilder().setCustomId(basicMoves[moveIndex]).setLabel(basicMoves[moveIndex]).setStyle(ButtonStyle.Primary))
        }
        container.addActionRowComponents(basicMoveRows);
        container.addSeparatorComponents((separator) => separator);
        container.addTextDisplayComponents((textDisplay) => textDisplay.setContent('# Circle Moves'));

        const circleMoves = fs.readdirSync('./moves/circle/').map(name => name.replace('.circlemove', ''));
        const circleMoveRows = [];
        for(let moveIndex = 0; moveIndex < circleMoves.length; moveIndex++)
        {
            if(moveIndex%5 == 0)
            {
                circleMoveRows.push(new ActionRowBuilder());
            }
            circleMoveRows[circleMoveRows.length-1].addComponents(new ButtonBuilder().setCustomId(circleMoves[moveIndex]).setLabel(circleMoves[moveIndex]).setStyle(ButtonStyle.Primary))
        }
        container.addActionRowComponents(circleMoveRows);
        return container;
    }
}