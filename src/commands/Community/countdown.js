const { SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');
const { DateTime } = require('luxon');

let countdownChannelId = null; // Variable to store the channel ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Sets up a Christmas countdown in the specified channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel for the countdown')
                .setRequired(true)),
    
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (!channel || channel.type !== 'GUILD_TEXT') {
            return interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
        }

        countdownChannelId = channel.id;

        // Schedule the Christmas countdown task
        scheduleCountdown(channel.id);

        await interaction.reply({ content: `Christmas countdown has been set in ${channel}.`, ephemeral: true });
    },
};

// Function to schedule the Christmas countdown
function scheduleCountdown(channelId) {
    // Schedule a task to run every day at midnight UK time
    cron.schedule('0 0 * * *', () => {
        const now = DateTime.now().setZone('Europe/London');
        const christmas = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });
        const daysUntilChristmas = christmas.diff(now, 'days').days;

        const channel = client.channels.cache.get(channelId);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🎄 Christmas Countdown 🎄')
                .setDescription(`There are **${Math.ceil(daysUntilChristmas)}** days left until Christmas!`)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }
    });
}
