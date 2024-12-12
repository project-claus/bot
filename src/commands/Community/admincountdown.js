const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { loadData, saveData } = require('../utils/dataUtils.js'); // Reuse the load/save data logic
const ADMIN_USER_ID = '1316521788162834456'; // Replace with your admin's Discord user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admincountdown')
        .setDescription('Sets up an exclusive Christmas countdown for the admin')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a text channel for the countdown')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction, client) {
        // Check if the user is the allowed admin
        if (interaction.user.id !== ADMIN_USER_ID) {
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        // Save the channel ID for the admin countdown
        const data = loadData();
        data.adminCountdown = { channelId: channel.id };
        saveData(data);

        // Schedule the countdown
        await interaction.reply({ content: `Admin-only Christmas countdown has been set in ${channel}.`, ephemeral: true });
        scheduleCountdown(client, channel.id);
    },
};
