const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../gifts.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) return { gifts: [], totalGifts: 0 };

    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return data ? JSON.parse(data) : { gifts: [], totalGifts: 0 }; // Handle empty file
    } catch (error) {
        console.error('Error reading or parsing gifts.json:', error);
        return { gifts: [], totalGifts: 0 }; // Return default data on error
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gifts')
        .setDescription('Show all gifts sent by the specified user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check gifts for.')
                .setRequired(true)),

    async execute(interaction) {
        const data = loadData();
        const user = interaction.options.getUser('user');
        const userGifts = data.gifts.filter(gift => gift.senderId === user.id);

        if (userGifts.length === 0) {
            return interaction.reply({
                content: `${user.tag} has not sent any gifts this holiday season.`,
                ephemeral: true,  // Make this response ephemeral
            });
        }

        // Create a nicer embed for displaying the number of gifts sent
        const embed = new EmbedBuilder()
            .setTitle(`🎁 Gifts Sent by ${user.tag}`)
            .setDescription(`**${user.tag}** has sent a total of **${userGifts.length}** gifts this holiday season.`)
            .setColor('#F03A47') // Use hex color codes for better color control
            .setFooter({ text: 'Keep the holiday spirit alive!' })
            .setTimestamp();

        // Optionally, you can add details about the gifts without revealing sensitive information
        const giftDetails = userGifts.map(gift => `- 🎁 Sent to **${gift.recipientTag}**`).join('\n');
        
        if (giftDetails) {
            embed.addFields({ name: 'Gift Recipients', value: giftDetails });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true }); // Make this response ephemeral
    },
};
