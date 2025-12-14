const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder, EmbedBuilder} = require('discord.js');
fs = require('fs');
const { ContainerBuilder, UserSelectMenuBuilder, MessageFlags } = require('discord.js');
const {spreadsheetID} = require('./config.json');

let emptyBox = String.fromCharCode(parseInt('2610', 16));
let xBox = String.fromCharCode(parseInt('2612', 16));

const playbooks = ['Aware', 'Fae', 'Hunter', 'Immortal', 'Imp', 'Spectre', 'Sworn', 'Tainted', 'Vamp', 'Veteran', 'Wizard', 'Wolf'];

class Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        this.alias = alias;
        this.manifest = manifest;
        this.sheetFields = sheetFields;
        this.gid = gid;
        const moveChecked = Object.keys(manifest).filter(name => name.startsWith("move") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
        this.moveNames = Object.keys(manifest).filter(name => name.startsWith("move") && name.endsWith("Name")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => moveChecked[index] === "TRUE");
        this.moveTexts = Object.keys(manifest).filter(name => name.startsWith("move") && name.endsWith("Text")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => moveChecked[index] === "TRUE");
        const corruptionMoveChecked = Object.keys(manifest).filter(name => name.startsWith("corruptionMove") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
        this.corruptionMoveNames = Object.keys(manifest).filter(name => name.startsWith("corruptionMove") && name.endsWith("Name")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => moveChecked[index] === "TRUE");
        this.corruptionMoveTexts = Object.keys(manifest).filter(name => name.startsWith("corruptionMove") && name.endsWith("Text")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => moveChecked[index] === "TRUE");

        const bloodCoordinates = Character.TransformCoordinates(manifest['blood']);
        this.blood = sheetFields[bloodCoordinates[0]][bloodCoordinates[1]];
        const heartCoordinates = Character.TransformCoordinates(manifest['heart']);
        this.heart = sheetFields[heartCoordinates[0]][heartCoordinates[1]];
        const mindCoordinates = Character.TransformCoordinates(manifest['mind']);
        this.mind = sheetFields[mindCoordinates[0]][mindCoordinates[1]];
        const spiritCoordinates = Character.TransformCoordinates(manifest['spirit']);
        this.spirit = sheetFields[spiritCoordinates[0]][spiritCoordinates[1]];
        const mortalisCoordinates = Character.TransformCoordinates(manifest['mortalis']);
        const nightCoordinates = Character.TransformCoordinates(manifest['night']);
        const powerCoordinates = Character.TransformCoordinates(manifest['power']);
        const wildCoordinates = Character.TransformCoordinates(manifest['wild']);
        this.mortalis = sheetFields[mortalisCoordinates[0]][mortalisCoordinates[1]];
        this.night = sheetFields[nightCoordinates[0]][nightCoordinates[1]];
        this.power = sheetFields[powerCoordinates[0]][powerCoordinates[1]];
        this.wild = sheetFields[wildCoordinates[0]][wildCoordinates[1]];
        
        this.improvementsChecked = Object.keys(manifest).filter(name => name.startsWith("improvement") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).map(x => (x === "TRUE") ? xBox : emptyBox);
        this.improvementsText = Object.keys(manifest).filter(name => name.startsWith("improvement") && name.endsWith("Text")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);

        this.advancedChecked = Object.keys(manifest).filter(name => name.startsWith("advanced") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).map(x => (x === "TRUE") ? xBox : emptyBox);
        this.advancedText = Object.keys(manifest).filter(name => name.startsWith("advanced") && name.endsWith("Text")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);

        this.corruptionChecked = Object.keys(manifest).filter(name => name.startsWith("corruptionImprovement") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).map(x => (x === "TRUE") ? xBox : emptyBox);
        this.corruptionText = Object.keys(manifest).filter(name => name.startsWith("corruptionImprovement") && name.endsWith("Text")).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);

        this.letItOut = sheetFields[Character.TransformCoordinates(manifest["letItOut0"])[0]][Character.TransformCoordinates(manifest["letItOut0"])[1]];
        this.letItOut += '\n\n' + sheetFields[Character.TransformCoordinates(manifest["letItOut1"])[0]][Character.TransformCoordinates(manifest["letItOut1"])[1]];
        
        this.debtsOwed = Object.keys(manifest).filter(name => name.startsWith("debtsOwed") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
        this.debtsToCollect = Object.keys(manifest).filter(name => name.startsWith("debtsToCollect") && Number.isInteger(parseInt(name.substr(-1)))).map(x => manifest[x]).map(x => sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
    }
    Playbook()
    {
        return ''
    }
    FormatImprovements()
    {
        let returnString = "";
        for(let impIndex = 0; impIndex < this.improvementsChecked.length; impIndex++)
        {
            returnString += `${this.improvementsChecked[impIndex]} ${this.improvementsText[impIndex]}\n\n`;
        }
        return returnString;
    }
    FormatAdvanced()
    {
        let returnString = "";
        for(let advIndex = 0; advIndex < this.advancedChecked.length; advIndex++)
        {
            returnString += `${this.advancedChecked[advIndex]} ${this.advancedText[advIndex]}\n\n`;
        }
        return returnString;
    }
    FormatCorruption()
    {
        let returnString = "";
        for(let corruptionIndex = 0; corruptionIndex < this.corruptionChecked.length; corruptionIndex++)
        {
            returnString += `${this.corruptionChecked[corruptionIndex]} ${this.corruptionText[corruptionIndex]}\n\n`;
        }
        return returnString;
    }
    FormatMoves()
    {
        let returnString = "";
        for(let moveIndex = 0; moveIndex < this.moveNames.length; moveIndex++)
        {
            returnString += `**${this.moveNames[moveIndex]}**`
            returnString += `\n${this.moveTexts[moveIndex]}\n\n`
        }
        return returnString;
    }
    toString()
    {
        let returnString = `${this.alias}\nBlood: ${this.blood}\nHeart: ${this.heart}\nMind: ${this.mind}\nSpirit: ${this.spirit}\nMortalis: ${this.mortalis}\nNight: ${this.night}\nWild: ${this.wild}\nPower: ${this.power}\n`;
        returnString += "\n---\nMOVES\n";
        for(let moveIndex = 0; moveIndex < this.moveNames.length; moveIndex++)
        {
            returnString += this.moveNames[moveIndex]
            returnString += `\n${this.moveTexts[moveIndex]}\n\n`
        }
        returnString += "\n---\nIMPROVEMENTS\n";
        for(let impIndex = 0; impIndex < this.improvementsChecked.length; impIndex++)
        {
            returnString += `${this.improvementsChecked[impIndex]} ${this.improvementsText[impIndex]}\n\n`;
        }
        returnString += "\n---\nADVANCED IMPROVEMENTS\n";
        for(let advIndex = 0; advIndex < this.advancedChecked.length; advIndex++)
        {
            returnString += `${this.advancedChecked[advIndex]} ${this.advancedText[advIndex]}\n\n`;
        }
        returnString += "\n---\nCORRUPTION\n";
        for(let corruptionIndex = 0; corruptionIndex < this.corruptionChecked.length; corruptionIndex++)
        {
            returnString += `${this.corruptionChecked[corruptionIndex]} ${this.corruptionText[corruptionIndex]}\n\n`;
        }
        return returnString;
    }
    toEmbed()
    {
        let stats = `Blood: ${this.blood}\nHeart: ${this.heart}\nMind: ${this.mind}\nSpirit: ${this.spirit}`;
        let circles = `Mortalis: ${this.mortalis}\nNight: ${this.night}\nWild: ${this.wild}\nPower: ${this.power}`;
        let description = " ";
        let embed = new EmbedBuilder().setTitle(`**The ${this.Playbook()} — ${this.alias}**`).setDescription(description);
        embed.addFields({name: "Stats", value: stats, inline: true});
        embed.addFields({name: "Circles", value: circles, inline: true});
        for(let move = 0; move < this.moveNames.length; move++)
        {
            embed.addFields({name: this.moveNames[move], value: this.moveTexts[move]});
        }
        for(let corruptionMove = 0; corruptionMove < this.corruptionMoveNames.length; corruptionMove++)
        {
            embed.addFields({name: this.corruptionMoveNames[corruptionMove], value: this.corruptionMoveTexts[corruptionMove]})
        }
        embed.addFields({name: "Let It Out", value: this.letItOut});
        return embed;        
    }
    toComponent()
    {
        let stats = `Blood: ${this.blood}\nHeart: ${this.heart}\nMind: ${this.mind}\nSpirit: ${this.spirit}`;
        let circles = `Mortalis: ${this.mortalis}\nNight: ${this.night}\nWild: ${this.wild}\nPower: ${this.power}`;
        const statActionRow = new ActionRowBuilder()
        const circleActionRow = new ActionRowBuilder()
        for(let stat of ['Blood', 'Heart', 'Mind', 'Spirit'])
        {
            statActionRow.addComponents(new ButtonBuilder().setCustomId(`rollStat${stat}`).setLabel(`${stat}: ${this[stat.toLowerCase()]}`).setStyle(ButtonStyle.Primary));
        }
        for(let stat of ['Mortalis', 'Night', 'Wild', 'Power'])
        {
            circleActionRow.addComponents(new ButtonBuilder().setCustomId(`rollStat${stat}`).setLabel(`${stat}: ${this[stat.toLowerCase()]}`).setStyle(ButtonStyle.Primary));
        }
        const container = new ContainerBuilder()
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`# [${this.alias} — The ${this.playbook}](https://docs.google.com/spreadsheets/d/${spreadsheetID}/edit?gid=${this.gid})`))
        .addActionRowComponents([statActionRow, circleActionRow])
        .addSeparatorComponents((separator) => separator)
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(this.FormatMoves()))
        .addSeparatorComponents((separator) => separator)
        .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`When you **Let It Out**, you can:\n${this.letItOut}`));
        return container;
    }
    Save(directory = 'Demo Characters')
    {
        let path = `./${directory}`;
        fs.writeFileSync(`${path}/${this.alias}.json`, JSON.stringify(this, null, 2), 'utf8');
    }
    FromJSON(name = '', playbook = null, activeGame = 'Demo Characters')
    {
        let directory = `./${activeGame}/`;
        let manifestPath = './Character Stuff/Field Data/';
        if(fs.existsSync(`${directory}${name}.json`))
        {
            let characterFile = fs.readFileSync(`${directory}${name}.json`);
            let fields = JSON.parse(characterFile);
            let manifestFile = fs.readFileSync(`${manifestPath}${playbook.Playbook()} Fields.json`);
            let manifest = JSON.parse(manifestFile);
            return new playbook(manifest, fields);
        }
    }
    static TransformCoordinates(rangeString)
    {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const preConvert = rangeString.split(':')[0].match(/[a-zA-Z]+|[0-9]+/g);
        const columnPre = preConvert[0];
        const rowPre = preConvert[1];
        const rowPost = Number(rowPre) - 1;
        let columnValue = 0;
        for(let letterIndex = 0; letterIndex < columnPre.length; letterIndex++)
        {
            const letterValue = alphabet.indexOf(columnPre[letterIndex]);
            columnValue += letterValue + (letterIndex * 26)

        }
        const columnPost = columnValue;

        return [rowPost, columnPost];
    }
    static PlaybookClass(name)
    {
        if(name === "The Aware")
        {
            return Aware;
        }
        else if(name === "The Fae")
        {
            return Fae;
        }
        else if(name === "The Hunter")
        {
            return Hunter;
        }
        else if(name === "The Immortal")
        {
            return Immortal;
        }
        else if(name === "The Imp")
        {
            return Imp;
        }
        else if(name === "The Oracle")
        {
            return Oracle;
        }
        else if(name === "The Spectre")
        {
            return Spectre;
        }
        else if(name === "The Sworn")
        {
            return Sworn;
        }
        else if(name === "The Tainted")
        {
            return Tainted;
        }
        else if(name === "The Vamp")
        {
            return Vamp;
        }
        else if(name === "The Veteran")
        {
            return Veteran;
        }
        else if(name === "The Wizard")
        {
            return Wizard;
        }
        else if(name === "The Wolf")
        {
            return Wolf;
        }
    }

}

class Aware extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid);
        this.playbook = 'Aware';
    }
    static Playbook()
    {
        return 'Aware';
    }
    playbookComponent()
    {
        let component = this.toComponent();
        return component;
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Aware — ${this.alias}**`)
        const relationshipsChecked = Object.keys(this.manifest).filter(name => name.startsWith("mortalRelationship") && Number.isInteger(parseInt(name.substr(-1)))).map(x => this.manifest[x]).map(x => this.sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
        const relationshipsTexts = Object.keys(this.manifest).filter(name => name.startsWith("mortalRelationship") && name.endsWith("Text")).map(x => this.manifest[x]).map(x => this.sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => relationshipsChecked[index] === "TRUE");
        console.log(relationshipsChecked);
        let relationshipString = "";

        for(let relationship = 0; relationship < relationshipsTexts.length; relationship++)
        {
            relationshipString += `${xBox} ${relationshipsTexts[relationship]}\n`
        }
        relationshipString += this.sheetFields[Character.TransformCoordinates(this.manifest["mortalRelationshipMove"])[0]][Character.TransformCoordinates(this.manifest["mortalRelationshipMove"])[1]];
        embed.addFields({name: "Mortal Relationships", value: relationshipString});
        embed.addFields({name: "Your Kit", value: this.sheetFields[Character.TransformCoordinates(this.manifest["kitMove"])[0]][Character.TransformCoordinates(this.manifest["kitMove"])[1]]});

        return embed;
    }
}

class Fae extends Character
{
   constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Fae';
    }
    static Playbook()
    {
        return 'Fae';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Fae — ${this.alias}**`);
        const faerieMagicChecked = Object.keys(this.manifest).filter(name => name.startsWith("faerieMagic") && Number.isInteger(parseInt(name.substr(-1)))).map(x => this.manifest[x]).map(x => this.sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]);
        const faerieMagicNames = Object.keys(this.manifest).filter(name => name.startsWith("faerieMagic") && name.endsWith("Name")).map(x => this.manifest[x]).map(x => this.sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => faerieMagicChecked[index] === "TRUE");
        const faerieMagicTexts = Object.keys(this.manifest).filter(name => name.startsWith("faerieMagic") && name.endsWith("Text")).map(x => this.manifest[x]).map(x => this.sheetFields[Character.TransformCoordinates(x)[0]][Character.TransformCoordinates(x)[1]]).filter((name, index) => faerieMagicChecked[index] === "TRUE");

        let faerieMagicString = "";
        for(let faerieMagic = 0; faerieMagic < faerieMagicNames.length; faerieMagic++)
        {
            faerieMagicString += `* **${faerieMagicNames[faerieMagic]}**: ${faerieMagicTexts[faerieMagic]}\n`
        }
        embed.addFields({name: "Faerie Powers", value: faerieMagicString});
        return embed;
    }
}

class Hunter extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Hunter';
    }
    static Playbook()
    {
        return 'Hunter'
    }
}

class Immortal extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Immortal';
    }
    static Playbook()
    {
        return 'Immortal'
    }
}
class Imp extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Imp';
    }
    static Playbook()
    {
        return 'Imp'
    }
}

class Oracle extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Oracle';
    }
    static Playbook()
    {
        return 'Oracle'
    }
}

class Spectre extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Spectre';
    }
    static Playbook()
    {
        return 'Spectre'
    }
}

class Sworn extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Sworn';
    }
    static Playbook()
    {
        return 'Sworn'
    }
}

class Tainted extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Tainted';
    }
    static Playbook()
    {
        return 'Tainted'
    }
}

class Vamp extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Vamp';
    }
    static Playbook()
    {
        return 'Vamp'
    }
}

class Veteran extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Veteran';
    }
    static Playbook()
    {
        return 'Veteran'
    }
}

class Wizard extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Wizard';
    }
    static Playbook()
    {
        return 'Wizard'
    }
}

class Wolf extends Character
{
    constructor(manifest, sheetFields, alias='', gid)
    {
        super(manifest, sheetFields, alias, gid)
        this.playbook = 'Wolf';
    }
    static Playbook()
    {
        return 'Wolf'
    }
}




module.exports = {Character, Aware, Fae, Hunter, Immortal, Imp, Oracle, Spectre, Sworn, Tainted, Vamp, Veteran, Wizard, Wolf};