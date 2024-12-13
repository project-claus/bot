const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../gifts.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) return { gifts: [], totalGifts: 0 };
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Display the top gift-givers.'),

    async execute(interaction) {
        const data = loadData();
        const leaderboard = {};

        for (const gift of data.gifts) {
            if (!leaderboard[gift.senderId]) {
                leaderboard[gift.senderId] = { tag: gift.senderTag, count: 0 };
            }
            leaderboard[gift.senderId].count++;
        }

        const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.count - a.count);

        if (sortedLeaderboard.length === 0) {
            return interaction.reply('No gifts have been exchanged yet!');
        }

        const description = sortedLeaderboard
            .map((entry, index) => `**#${index + 1}**: ${entry.tag} - **${entry.count}** gifts`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🎄 Gift Leaderboard 🎁')
            .setDescription(description)
            .setColor('FFD166')
            .setFooter({ text: 'Keep spreading holiday cheer!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
