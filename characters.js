const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder, EmbedBuilder} = require('discord.js');
fs = require('fs');


let emptyBox = String.fromCharCode(parseInt('2610', 16));
let xBox = String.fromCharCode(parseInt('2612', 16));

const playbooks = ['Aware', 'Fae', 'Hunter', 'Immortal', 'Imp', 'Spectre', 'Sworn', 'Tainted', 'Vamp', 'Veteran', 'Wizard', 'Wolf'];

class Character
{
    constructor(manifest, sheetFields, alias='')
    {
        this.alias = alias;
        this.manifest = manifest;
        this.sheetFields = sheetFields;
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
            returnString += this.moveNames[moveIndex]
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
    }

}

class Aware extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.playbook = 'Aware';
    }
    static Playbook()
    {
        return 'Aware';
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
   constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias)
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

class Divine extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.mission = this.manifest[Object.keys(field).filter(field => field.startsWith('mission'))[0]];
        this.weapon = this.manifest[Object.keys(field).filter(field => field.startsWith('gear'))[0]];
        this.playbook = 'Divine';
    }
    static Playbook()
    {
        return 'Divine';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Divine — ${this.alias}**`);
        embed.addFields({name: '**Mission**', value: this.mission});
        embed.addFields({name: '**Weapon**', value: this.weapon});
        return embed;
    }
}

class Expert extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        let havenFields = Object.keys(this.fields).filter(field => field.startsWith('haven'));
        this.haven = [];
        for(let field = 0; field < havenFields.length; field++)
        {
            this.haven.push(this.manifest[havenFields[field]]);
        }
        this.playbook = 'Expert';
    }
    static Playbook()
    {
        return 'Expert';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Expert — ${this.alias}**`);
        embed.addFields({name: '**Haven**', value: this.haven.join('\n')});
        return embed;
    }
}

class Flake extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.playbook = 'Flake';
    }
    static Playbook()
    {
        return 'Flake';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Flake — ${this.alias}**`);
        return embed;
    }
}

class Initiate extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        let goodFields = Object.keys(this.fields).filter(field => field.startsWith('good'));
        let badFields = Object.keys(this.fields).filter(field => field.startsWith('bad'));
        this.good = [];
        this.bad = [];
        for(let good = 0; good < goodFields.length; good++)
        {
            this.good.push(this.manifest[goodFields[good]]);
        }
        for(let bad = 0; bad < badFields.length; bad++)
        {
            this.bad.push(this.manifest[badFields[bad]]);
        }
        this.playbook = 'Initiate';
    }
    static Playbook()
    {
        return 'Initiate';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Initiate — ${this.alias}**`);
        embed.addFields({name: '**Order Good Traits**', value: this.good.join('\n'), inline: true});
        embed.addFields({name: '**Order Bad Traits**', value: this.bad.join('\n'), inline: true});
        return embed;
    }
}

class Monstrous extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.attacks = this.NaturalAttack()
        this.curse = this.manifest[Object.keys(this.fields).filter(field => field.startsWith('curse'))[0]];
        this.playbook = 'Monstrous';
    }
    static Playbook()
    {
        return 'Monstrous';
    }
    NaturalAttack()
    {
        let bases = Object.keys(this.fields).filter(field => field.startsWith('base'));
        let extras = Object.keys(this.fields).filter(field => field.startsWith('extra'));
        let attacks = [];
        for(let base = 0; base < bases.length; base++)
        {
            let baseName = '';
            let baseHarm = 0;
            let baseTags = [];
            if(bases[base] == 'base0')
            {
                baseName = 'Teeth';
                baseHarm = 3;
                baseTags.push('intimate');
            }
            else if(bases[base] == 'base1')
            {
                baseName = 'Claws';
                baseHarm = 2;
                baseTags.push('hand');
            }
            else if(bases[base] == 'base2')
            {
                baseName = 'Magical Force';
                baseHarm = 1;
                baseTags.push('magical');
                baseTags.push('close');
            }
            else if(bases[base] == 'base3')
            {
                baseName = 'Life-Drain';
                baseHarm = 1;
                baseTags.push('intimate');
                baseTags.push('life-drain');
            }
            // Instead of extras applying to one base, apply to all bases
            // This is against the rules but way easier to manage automatically
            for(let extra = 0; extra < extras.length; extra++)
            {
                if(extras[extra] == 'extra0')
                {
                    baseHarm += 1;
                }
                else if(extrax[extra] == 'extra1')
                {
                    baseTags.push('ignore-armour');
                }
                else if(extras[extra] == 'extra2')
                {
                    baseTags.push('close');
                }
            }
            attacks.push(new MonstrousAttack(baseName, baseHarm, baseTags));
        }
        return attacks;
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Monstrous — ${this.alias}**`);
        embed.addFields({name: '**Curse**', value: this.curse});
        let attacks = '';
        for(let attack = 0; attack < this.attacks.length; attack++)
        {
            attacks += this.attacks[attack].toString()+'\n';
        }
        embed.addFields({name: '**Attacks**', value: attacks});
        return embed;
    }
}
class MonstrousAttack
{
    constructor(base='', harm=0, tags=[])
    {
        this.base = base;
        this.harm = harm;
        this.tags = tags;
    }
    toString()
    {
        return `Base: ${this.base} (${this.harm}-harm ${this.tags.join(' ')})`;
    }
}

class Mundane extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.playbook = 'Mundane';
    }
    static Playbook()
    {
        return 'Mundane'
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Mundane — ${this.alias}**`);
        return embed;
    }
}

class Professional extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        let resourceFields = Object.keys(this.fields).filter(field => field.startsWith('resource'));
        let redTapeFields = Object.keys(this.fields).filter(field => field.startsWith('redtape'));
        this.resources = [];
        this.redtape = [];
        for(let resource = 0; resource < resourceFields.length; resource++)
        {
            this.resources.push(this.manifest[resourceFields[resource]]);
        }
        for(let redtape = 0; redtape < redTapeFields.length; redtape++)
        {
            this.redtape.push(this.manifest[redTapeFields[redtape]]);
        }
        this.moves.push(this.manifest['move7']);
        this.playbook = 'Professional';
    }
    static Playbook()
    {
        return 'Professional';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Professional — ${this.alias}**`);
        embed.addFields({name: '**Resources**', value: this.resources.join('\n'), inline: false});
        embed.addFields({name: '**Redtape**', value: this.redtape.join('\n'), inline: true});
        return embed;
    }
}

class SpellSlinger extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.techniques = this.Techniques();
        this.combatMagic = this.CombatMagic();
        this.playbook = 'Spell-Slinger';
    }
    static Playbook()
    {
        return 'Spell-Slinger'
    }
    Techniques()
    {
        // Check the 3 that you do use, leave the one you don't need blank
        let techniqueFields = Object.keys(this.fields).filter(field => field.startsWith('technique'));
        let techniques = [];
        for(let technique = 0; technique < techniqueFields.length; technique++)
        {
            techniques.push(this.manifest[techniqueFields[technique]]);
        }
        return techniques;
    }
    CombatMagic()
    {
        let bases = Object.keys(this.fields).filter(field => field.startsWith('base'));
        let effects = Object.keys(this.fields).filter(field => field.startsWith('effect'));
        let spells = [];
        for(let base = 0; base < bases.length; base++)
        {
            let baseName = ''
            let baseHarm = 0
            let baseTags = []
            let spellEffects = []
            if(bases[base] == 'base0')
            {
                baseName = 'Blast';
                baseHarm = 2;
                baseTags = ['Magic', 'Close', 'Obvious', 'Loud'];
            }
            else if(bases[base] == 'base1')
            {
                baseName = 'Ball';
                baseHarm = 1;
                baseTags = ['Magic', 'Area', 'Close', 'Obvious', 'Loud'];
            }
            else if(bases[base] == 'base2')
            {
                baseName = 'Missile';
                baseHarm = 1;
                baseTags = ['Magic', 'Far', 'Obvious', 'Loud'];
            }
            else if(bases[base] == 'base3')
            {
                baseName = 'Wall';
                baseHarm = 1;
                baseTags = ['Magic', 'Barrier', 'Close', '1-Armour', 'Obvious', 'Loud'];
            }
            for(let effect = 0; effect < effects.length; effect++)
            {
                if(effects[effect] == 'effect0')
                {
                    spellEffects.push('Fire');
                    baseHarm += 2;
                    baseTags.push('Fire');
                    baseTags.push('[if you get a 10+ on a combat magic roll, the fire won\'t spread.]');
                }
                else if(effects[effect] == 'effect1')
                {
                    spellEffects.push('Force/Wind');
                    baseHarm += 1;
                    baseTags.push('Forceful');
                    if(baseName == 'Wall')
                    {
                        baseTags.push('+1 Armour');
                    }
                }
                else if(effects[effect] == 'effect2')
                {
                    spellEffects.push('Lightning/Entropy');
                    baseHarm += 1;
                    baseTags.push('messy');
                }
                else if(effects[effect] == 'effect3')
                {
                    spellEffects.push('Frost/Ice');
                    if(baseName == 'Wall')
                    {
                        baseHarm -= 1;
                        baseTags.push('+2 Armour');
                    }
                    else
                    {
                        baseHarm += 1;
                        baseTags.push('Restraining');
                    }
                }
                else if(effects[effect] == 'effect4')
                {
                    spellEffects.push('Earth');
                    baseTags.push('Forceful');
                    baseTags.push('Restraining');
                }
                else if(effects[effect] == 'effect5')
                {
                    spellEffects.push('Necromantic');
                    baseTags.push('Life-Drain');
                }
            }
            spells.push(new CombatSpell(baseName, spellEffects, baseHarm, baseTags));
        }
        return spells;
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Spell-Slinger — ${this.alias}**`);
        let spells = [];
        for(let spell = 0; spell < this.combatMagic; spell++)
        {
            spells.push(this.combatMagic[spell].toString());
        }
        embed.addFields({name: '**Techniques**', value: this.techniques.join('\n'), inline: true});
        embed.addFields({name: '**Combat Magic**', value: spells.join('\n'), inline: true});
        return embed;
    }
}

class CombatSpell
{
    constructor(base='', effects=[], harm=0, tags=[])
    {
        this.base = base;
        this.harm = harm;
        this.tags = tags;
        this.effects = effects;
    }
    toString()
    {
        return `Base: ${this.base} (${this.effects.join(', ')}) (${this.harm}-harm ${this.tags.join(' ')})`;
    }
}

class Spooky extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        let darksideFields = Object.keys(this.fields).filter(field => field.startsWith('darkside'));
        this.darkside = [];
        for(let field = 0; field < darksideFields.length; field++)
        {
            this.darkside.push(this.manifest[darksideFields[field]]);
        }
        this.playbook = 'Spooky';
    }
    static Playbook()
    {
        return 'Spooky';
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Spooky — ${this.alias}**`);
        embed.addFields({name: '**Dark Side**', value: this.darkside.join('\n')});
        return embed;
    }
}

class Wronged extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        this.lost = this.Loss();
        this.prey = this.fields['prey'];
        let guiltFields = Object.keys(this.fields).filter(field => field.startsWith('save'));
        this.guilt = [];
        for(let guilt = 0; guilt < guiltFields.length; guilt++)
        {
            this.guilt.push(this.manifest[guiltFields[guilt]]);
        }
        let weaponFields = Object.keys(this.fields).filter(field => field.startsWith('signature'));
        this.signatureWeapon = [];
        for(let weapon = 0; weapon < weaponFields.length; weapon++)
        {
            this.signatureWeapon.push(this.manifest[weaponFields[weapon]]);
        }
        this.playbook = 'Wronged';
    }
    static Playbook()
    {
        return 'Wronged';
    }
    Loss()
    {
        let lossFields = Object.keys(this.fields).filter(field => field.startsWith('lost') && !field.startsWith('lostText'));
        let lossTextFields = Object.keys(this.fields).filter(field => field.startsWith('lostText'));
        let yourLosses = [];
        if(lossFields.length == lossTextFields.length)
        {
            for(let loss = 0; loss < lossFields.length; loss++)
            {
                yourLosses.push(`${this.manifest[lossFields[loss]]}, ${this.fields[lossTextFields[loss]]}`);
            }
        }
        else
        {
            yourLosses = ['I think you filled this out wrong.'];
        }
        return yourLosses;
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Wronged — ${this.alias}**`);
        embed.addFields({name: '**Signature Weapon**', value: this.signatureWeapon.join('\n')});
        embed.addFields({name: '**Guilt**', value: this.guilt.join('\n')});
        return embed;
    }
}

class Searcher extends Character
{
    constructor(manifest, sheetFields, alias='')
    {
        super(manifest, sheetFields, alias);
        let encounterFields = Object.keys(this.fields).filter(field => field.startsWith('firstencounter'));
        this.firstEncounter = [this.manifest['firstEncounter0']];
        for(let field = 0; field < encounterFields.length; field++)
        {
            this.firstEncounter.push(this.manifest[encounterFields[field]]);
        }
        this.playbook = 'Searcher';
    }
    static Playbook()
    {
        return 'Searcher'
    }
    playbookEmbed()
    {
        let embed = this.toEmbed();
        embed.setTitle(`**The Searcher — ${this.alias}**`);
        embed.addFields({name: '**First Encounter**', value: this.firstEncounter[1]});
        return embed;
    }
}


function LoadAllCharacters(playerCharacters=[], activeGame='Demo Characters')
{
    let playbookClasses =  [Chosen, Crooked, Divine, Expert, Flake, Initiate, Monstrous, Mundane, Professional, SpellSlinger, Spooky, Wronged];
    let characters = {};
    for(let playbook = 0; playbook < playbookClasses.length; playbook++)
    {
        [data, fields] = LoadCharacter(playbookClasses[playbook].Playbook());
        let character = playbook(data, fields, alias=playbook.Playbook());
        characters[playbook.Playbook()] = character;
    }
    for(let playerCharacter = 0; playerCharacter < playerCharacters.length; playerCharacter++)
    {
        [data, fields] = LoadCharacter(playbook=playerCharacters[playerCharacter][1].Playbook(), sheetPath=`./Character Stuff/${activeGame}`, name=playerCharacters[playerCharacter][0]);
        let character = playerCharacters[playerCharacter][1](data, fields, alias=playerCharacters[playerCharacter][0]);
        characters[playerCharacters[playerCharacter][0]] = character;
    }
    return characters;
}

function LoadAllCharactersFromJSON(playerCharacters=[], activeGame='Demo Characters')
{
    let playbookClasses = [Chosen, Crooked, Divine, Expert, Flake, Initiate, Monstrous, Mundane, Professional, SpellSlinger, Spooky, Wronged, Searcher];
    let characters = {};
    for(let playbook = 0; playbook < playbookClasses.length; playbook++)
    {
        if(fs.existsSync(`./Character Stuff/${activeGame}/${playbookClasses[playbook].Playbook()}.json`))
        {
            let manifestFile = fs.readFileSync(`./Character Stuff/Field Data/${playbookClasses[playbook].Playbook()} Fields.json`);
            let manifest = JSON.parse(manifestFile);
            let fieldsFile = fs.readFileSync(`./Character Stuff/${activeGame}/${playbookClasses[playbook].Playbook()}.json`);
            let fields = JSON.parse(fieldsFile);
            characters[playbookClasses[playbook].Playbook()] = playbookClasses[playbook](manifest, fields, alias=playbookClasses[playbook].Playbook());
        }
    }
    for(let playerCharacter = 0; playerCharacter < playerCharacters.length; playerCharacter++)
    {
        console.log(playerCharacters[playerCharacter][0]);
        if(fs.existsSync(`./Character Stuff/${activeGame}/${playerCharacters[playerCharacter][0]}.json`))
        {
            let playbook = playerCharacters[playerCharacter][1];
            let name = playerCharacters[playerCharacter][0];
            console.log(name);
            let manifestFile = fs.readFileSync(`./Character Stuff/Field Data/${playbook.Playbook()} Fields.json`);
            let manifest = JSON.parse(manifestFile);
            let fieldsFile = fs.readFileSync(`./Character Stuff/${activeGame}/${name}.json`);
            let fields = JSON.parse(fieldsFile);
            characters[name] = new playbook(manifest, fields, alias=name);
        }
    }
    return characters;
}


async function DumpPDFToJSON(directory = 'Demo Characters', name='Chosen', playbook=Chosen)
{
    let path = `./Character Stuff/${directory}/`;
    [data, fields] = await LoadCharacter(playbook.Playbook(), sheetPath=path, name=name);
    let character = new playbook(data, fields);
    character.Save();
    return character;
}


async function LoadCharacter(playbook='Chosen', sheetPath='./Character Stuff/Demo Characters/', name=null)
{
    let fieldPath = './Character stuff/Field Data/';
    if(name == null)
    {
        name = `The_${playbook}`;
    }
    let pdfFileObj = fs.readFileSync(`${sheetPath}${name}.pdf`);
    const pdfDoc = await PDFDocument.load(pdfFileObj);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    let blankBoxes = [];
    let returnFields = {'fields': {}};

    for(let field = 0; field < fields.length; field++)
    {
        if(fields[field].constructor.name == 'PDFCheckBox' && !fields[field].isChecked())
        {
            blankBoxes.push(fields[field].getName());
        }
    }
    for(let field = 0; field < fields.length; field++)
    {
        if(!blankBoxes.includes(fields[field].getName()))
        {
            if(fields[field].constructor.name == 'PDFCheckBox')
            {
                returnFields['fields'][fields[field].getName()] = fields[field].getName();   
            }
            else if(fields[field].constructor.name == 'PDFTextField')
            {
                returnFields['fields'][fields[field].getName()] = fields[field].getText();
            }
        }
    }
    let fieldData = fs.readFileSync(`${fieldPath}${playbook} Fields.json`);
    let data = JSON.parse(fieldData);
    return [data, returnFields];
}

function PlaybookByName(name='Chosen')
{
    let playbooks = [Chosen, Crooked, Divine, Expert, Flake, Initiate, Monstrous, Mundane, Professional, SpellSlinger, Spooky, Wronged, Searcher];
    for(let playbook = 0; playbook < playbooks.length; playbook++)
    {
        if(playbooks[playbook].Playbook() == name)
        {
            return playbooks[playbook];
        }
    }
}


module.exports = {Character, Aware, Fae, Divine, Expert, Flake, Initiate, Monstrous, Mundane, Professional, SpellSlinger, Spooky, Wronged, Searcher, LoadCharacter, LoadAllCharactersFromJSON, PlaybookByName,DumpPDFToJSON};