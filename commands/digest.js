const {SlashCommandBuilder} = require('@discordjs/builders');
const {userMention, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SelectMenuOptionBuilder } = require('discord.js');
const { Character } = require('../characters.js');
const fs = require('fs');
const {getFields} = require('../sheetsInterface.js');
const { ContainerBuilder, UserSelectMenuBuilder, MessageFlags } = require('discord.js');


module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('digest')
	.setDescription('Post a digest!'),

	async execute(interaction)
	{
		
		


		//await interaction.reply({embeds: [character.playbookEmbed()]});
		//const reply = await interaction.reply({components: [character.toComponent()], flags: MessageFlags.IsComponentsV2});
        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Weekly Digest`));
        container.addSeparatorComponents((separator) => separator);

        const digestData = JSON.parse(fs.readFileSync('./digests/0.json', 'utf8'));
        for(let keyIndex = 0; keyIndex < Object.keys(digestData).length; keyIndex++)
        {
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# ${digestData[Object.keys(digestData)[keyIndex]].name}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`${digestData[Object.keys(digestData)[keyIndex]].blurb}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`Players Interested: ${digestData[Object.keys(digestData)[keyIndex]].players}`));
            container.addActionRowComponents(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(digestData[Object.keys(digestData)[keyIndex]].name).setLabel('Interested').setStyle(ButtonStyle.Primary)));
        }
        const reply = await interaction.reply({components: [container], flags: MessageFlags.IsComponentsV2});
        const filter = (i) => i.user.id === interaction.member.id;

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter
		});
		let stat = '';
		collector.on('collect', async (interaction) => {
				await this.Interested(interaction);
                return;
		});
	},
    async Interested(interaction)
    {
        const characterIDs = JSON.parse(fs.readFileSync('./characterIDs.json'));
        const name = characterIDs[interaction.user.id].name;
        let digestData = JSON.parse(fs.readFileSync('./digests/0.json', 'utf8'));
        if(!digestData[interaction.customId].players.includes(name))
        {
            digestData[interaction.customId].players.push(name);
        }
        else
        {
            const index = digestData[interaction.customId].players.indexOf(name);
            digestData[interaction.customId].players.splice(index, 1);
        }
        fs.writeFileSync('./digests/0.json', JSON.stringify(digestData, null, 2));
        digestData = JSON.parse(fs.readFileSync('./digests/0.json', 'utf8'));

        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# Weekly Digest`));
        container.addSeparatorComponents((separator) => separator);

        for(let keyIndex = 0; keyIndex < Object.keys(digestData).length; keyIndex++)
        {
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# ${digestData[Object.keys(digestData)[keyIndex]].name}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`${digestData[Object.keys(digestData)[keyIndex]].blurb}`));
            container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(`Players Interested: ${digestData[Object.keys(digestData)[keyIndex]].players}`));
            container.addActionRowComponents(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(digestData[Object.keys(digestData)[keyIndex]].name).setLabel('Interested').setStyle(ButtonStyle.Primary)));
        }
        await interaction.update({components: [container]});
    },
}