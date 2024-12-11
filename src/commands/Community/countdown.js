const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const axios = require('axios');
const { DateTime } = require('luxon');
const Vibrant = require('node-vibrant');

let countdownChannelId = null; // Variable to store the channel ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Sets up a Christmas countdown in the specified channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a text channel for the countdown')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)), // Ensure only text channels can be selected
    
    async execute(interaction) {
        // Check if the user has Manage Guild permission
        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply({ content: 'You need the "Manage Server" permission to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        // Check if the selected channel is valid
        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
        }

        countdownChannelId = channel.id;

        // Acknowledge the interaction
        await interaction.deferReply({ ephemeral: true });

        // Send the initial countdown message
        await sendCountdownMessage(channel);

        // Schedule the Christmas countdown task
        scheduleCountdown(channel.id);

        await interaction.followUp({ content: `Christmas countdown has been set in ${channel}.`, ephemeral: true });
    },
};

// Function to schedule the Christmas countdown
function scheduleCountdown(channelId) {
    // Schedule a task to run every day at midnight UK time
    cron.schedule('0 0 * * *', async () => {
        const now = DateTime.now().setZone('Europe/London');
        const christmas = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });
        
        const daysUntilChristmas = Math.ceil(christmas.diff(now, 'days').days);
        
        const channel = client.channels.cache.get(channelId);
        if (channel) {
            await sendCountdownMessage(channel);
        }
    });
}

// Function to send the countdown message with an image
async function sendCountdownMessage(channel) {
    const now = DateTime.now().setZone('Europe/London');
    const christmasDate = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });
    const daysUntilChristmas = Math.ceil(christmasDate.diff(now, 'days').days);
    
    const imageUrl = await fetchRandomChristmasImage(); // Fetch a random Christmas image

    // Get dominant color from the image
    const dominantColor = await getDominantColor(imageUrl);

    // Create and send embed message with the image and countdown info
    const embed = new EmbedBuilder()
        .setColor(dominantColor) // Set embed color to dominant color of image
        .setTitle('🎄 Christmas Countdown 🎄')
        .setDescription(`There are **${daysUntilChristmas}** days left until Christmas!`)
        .addFields(
            { name: 'Current Day', value: now.toFormat("cccc"), inline: true }, // Display current day (e.g., "Monday")
            { name: 'Christmas Date', value: `<t:${Math.floor(christmasDate.toMillis() / 1000)}:F>`, inline: true }
        )
        .setImage(imageUrl) // Attach fetched image
        .setTimestamp();

    await channel.send({ embeds: [embed] });
}

// Function to fetch a random Christmas image URL from Unsplash
async function fetchRandomChristmasImage() {
    const response = await axios.get('https://api.unsplash.com/photos/random?query=christmas&client_id=11Fvuurv0GRQtHvMpiMXxESMXkHGOJVaYaecIJIOXB8');
    
    return response.data.urls.regular; // Return the regular size URL of the image
}

// Function to get dominant color from an image URL using Vibrant
async function getDominantColor(imageUrl) {
    const palette = await Vibrant.from(imageUrl).getPalette();
    return palette.Vibrant.hex; // Return vibrant color as hex code
}
