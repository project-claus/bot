const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const axios = require('axios');
const { DateTime } = require('luxon');
const Vibrant = require('node-vibrant');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json'); // Construct safe data file path

// Function to load data from JSON file
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        return {};
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Function to save data to JSON file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Sets up a Christmas countdown in the specified channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a text channel for the countdown')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)), // Ensure only text channels can be selected

    async execute(interaction, client) {
        // Check if the user has Manage Guild permission
        if (!interaction.member.permissions.has('ManageGuild')) {
            return interaction.reply({ content: 'You need the "Manage Server" permission to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        // Save the channel ID in a JSON file
        const data = loadData();
        data[interaction.guild.id] = { countdownChannelId: channel.id };
        saveData(data);

        // Acknowledge the interaction
        await interaction.deferReply({ ephemeral: true });

        // Send the initial countdown message
        await sendCountdownMessage(channel);

        // Schedule the Christmas countdown task
        scheduleCountdown(client, channel.id);

        await interaction.followUp({ content: `Christmas countdown has been set in ${channel}.`, ephemeral: true });
    },
};

// Function to schedule the Christmas countdown
function scheduleCountdown(client, channelId) {
    // Schedule a task to run every day at midnight UK time
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = DateTime.now().setZone('Europe/London');
            const christmas = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });

            const daysUntilChristmas = Math.ceil(christmas.diff(now, 'days').days);

            const channel = client.channels.cache.get(channelId);
            if (channel) {
                await sendCountdownMessage(channel);
            } else {
                console.error(`Channel with ID ${channelId} not found.`);
            }
        } catch (error) {
            console.error('Error in countdown task:', error);
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
        .setColor(dominantColor)
        .setTitle('🎄 Christmas Countdown 🎄')
        .setDescription(`There are **${daysUntilChristmas}** days left until Christmas!`)
        .addFields(
            { name: 'Current Day', value: now.toFormat("cccc"), inline: true },
            { name: 'Christmas Date', value: `<t:${Math.floor(christmasDate.toMillis() / 1000)}:F>`, inline: true }
        )
        .setImage(imageUrl)
        .setTimestamp();

    await channel.send({ embeds: [embed] });
}

// Function to fetch a random Christmas image URL from Unsplash
async function fetchRandomChristmasImage() {
    const response = await axios.get('https://api.unsplash.com/photos/random?query=christmas&client_id=11Fvuurv0GRQtHvMpiMXxESMXkHGOJVaYaecIJIOXB8');
    return response.data.urls.regular;
}

// Function to get dominant color from an image URL using Vibrant
async function getDominantColor(imageUrl) {
    const palette = await Vibrant.from(imageUrl).getPalette();
    return palette.Vibrant.hex;
}
