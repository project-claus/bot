const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { profileImage } = require('discord-arts');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user-information')
    .setDescription('get information about a user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('the user your want to get info on')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        interaction.deferReply()

        const user = interaction.options.getUser('user')
        const member = await interaction.guild.members.fetch(user.id);
        const username = user.username
        const avatar = user.displayAvatarURL()
        const joined = `<t:${parseInt(member.joinedAt / 1000)}:R>`
        const created = `<t:${parseInt(user.createdAt / 1000)}:R>`
        const roles = member.roles.cache.map(r => r).join(` \n `)
        const buffer = await profileImage(user.id, {
            presenceStatus: 'online',
            badgesFrame: true,
            moreBackgroundBlur: true,
            backgroundBrightness: 100,
          });
          const profileBuffer = await profileImage(member.id);
          const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });
        const embed = new EmbedBuilder()
        .addFields({ name: `Username:`, value: `${username}`})
        .addFields({ name: `🧾 • ${username} Created their account at:`, value: `${created}`, inline: true})
        .addFields({ name: `🧾 • ${username} joined this server at:`, value: `${joined}`, inline: true})
        .addFields({ name: `📚 • ${username}'s Roles`, value: roles, inline: true})
        .setAuthor({ iconURL: avatar, name: `User ID: ${user.id}`})
        .setTimestamp()
        .setColor('Red')
        .setImage("attachment://profile.png")
        await interaction.editReply({ embeds: [embed], files: [imageAttachment] })

    }
}
