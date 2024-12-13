const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');
const { DateTime } = require('luxon');

const movies = [
    { title: "It's a Wonderful Life", link: "https://www.imdb.com/title/tt0038650/" },
    { title: "Miracle on 34th Street", link: "https://www.imdb.com/title/tt0039628/" },
    { title: "White Christmas", link: "https://www.imdb.com/title/tt0047673/" },
    { title: "A Christmas Carol (1951)", link: "https://www.imdb.com/title/tt0044008/" },
    { title: "The Bishop's Wife", link: "https://www.imdb.com/title/tt0039190/" },
    { title: "The Muppet Christmas Carol", link: "https://www.imdb.com/title/tt0104940/" },
    { title: "Scrooge (1970)", link: "https://www.imdb.com/title/tt0066344/" },
    { title: "Holiday Inn", link: "https://www.imdb.com/title/tt0034862/" },
    { title: "Meet Me in St. Louis", link: "https://www.imdb.com/title/tt0037059/" },
    { title: "Jingle All the Way", link: "https://www.imdb.com/title/tt0116705/" },
    { title: "A Charlie Brown Christmas", link: "https://www.imdb.com/title/tt0068359/" },
    { title: "The Shop Around the Corner", link: "https://www.imdb.com/title/tt0033045/" },
    { title: "Elf", link: "https://www.imdb.com/title/tt0319343/" },
    { title: "Home Alone", link: "https://www.imdb.com/title/tt0099785/" },
    { title: "Home Alone 2: Lost in New York", link: "https://www.imdb.com/title/tt0104431/" },
    { title: "The Nightmare Before Christmas", link: "https://www.imdb.com/title/tt0107688/" }
];

async function createMovieOfTheDayEmbed() {
    const now = DateTime.now().setZone('Europe/London');
    const christmasDate = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });
    
    const daysUntilChristmas = Math.ceil(christmasDate.diff(now, 'days').days);
    
    // Ensure daysUntilChristmas is within bounds
    const movieIndex = (daysUntilChristmas - 1) % movies.length; // Adjust for zero-based index
    const todayMovie = movies[movieIndex];

    return new EmbedBuilder()
        .setTitle('🎬 Movie of the Day 🎬')
        .setDescription(`Today's movie is [${todayMovie.title}](${todayMovie.link})`)
        .setTimestamp();
}

/**
 * Slash command definition and execution
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('movieoftheday')
        .setDescription('Get today\'s movie recommendation'),
    
    async execute(interaction) {
        const embed = await createMovieOfTheDayEmbed();
        
        await interaction.reply({ embeds: [embed] });
    }
};
