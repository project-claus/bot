const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('naughtyornice')
        .setDescription('Find out if you are on the Naughty or Nice list this Christmas!')
        .addStringOption(option => 
            option
                .setName('name')
                .setDescription('Enter your name to check the list')
                .setRequired(true)
        ),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        const responses = [
            'Definitely on the Nice list! 🎅✨',
            'Looking good for the Nice list! 🌟',
            'A bit borderline, but Santa says you made the Nice list! 🎁',
            'Uh oh, Naughty list this year! 🎄👀',
            'Santa says you might need to be a bit nicer! 😅',
            'Firmly on the Naughty list! Better luck next year! ❄️',
            'You are the definition of Nice! Santa is so proud! 🎅🎄',
            'Naughty list for sure! Better start being nice! 🎁😱',
            'Nice list with flying colors! Keep up the good cheer! ✨🌟',
            'Oops, borderline Naughty... but there’s hope! 🎄✨',
            'Santa says you are the nicest person ever! 🎅🎁',
            'Naughty for now, but there’s still time to change! 🕒🎅',
            'Wow, you’re so Nice that Rudolph wants to meet you! 🦌🎄',
            'Santa thinks you’re playing tricks—Naughty list this time! 🎄👀',
            'A mix of Naughty and Nice... you’re keeping Santa guessing! 🎅❄️'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎄 Naughty or Nice Predictor 🎄')
            .setColor('Red')
            .addFields({ name: 'Name', value: `${name}`, inline: false })
            .addFields({ name: 'Result', value: `${response}`, inline: false });

        await interaction.reply({ embeds: [embed] });
    } 
};
