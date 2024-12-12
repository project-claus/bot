const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    PermissionsBitField, 
    Permissions, 
    MessageManager, 
    Embed, 
    Collection 
} = require(`discord.js`);
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { DateTime } = require('luxon');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
}); 

client.commands = new Collection();

const DATA_FILE = path.join(__dirname, './data.json'); // Path to the JSON file

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

// Function to schedule the Christmas countdown
function scheduleCountdown(client, channelId) {
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = DateTime.now().setZone('Europe/London');
            const christmas = DateTime.fromISO('2024-12-25T00:00:00', { zone: 'Europe/London' });

            const daysUntilChristmas = Math.ceil(christmas.diff(now, 'days').days);

            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('🎄 Christmas Countdown 🎄')
                    .setDescription(`There are **${daysUntilChristmas}** days left until Christmas!`)
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            } else {
                console.error(`Channel with ID ${channelId} not found.`);
            }
        } catch (error) {
            console.error('Error in countdown task:', error);
        }
    });
}

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

// Christmas-themed presences
const christmasPresences = [
    { type: 'WATCHING', message: 'Christmas movies 🎥🎄' },
    { type: 'PLAYING', message: 'in the snow ❄️' },
    { type: 'LISTENING', message: 'to jingle bells 🔔' },
    { type: 'WATCHING', message: 'the Christmas countdown ⏳🎅' },
    { type: 'PLAYING', message: 'Secret Santa 🎁' },
    { type: 'LISTENING', message: 'carolers sing 🎶' },
];

// Function to set a random Christmas presence
function setRandomChristmasPresence() {
    const randomPresence = christmasPresences[Math.floor(Math.random() * christmasPresences.length)];
    client.user.setPresence({
        activities: [{ name: randomPresence.message, type: randomPresence.type }],
        status: 'online',
    });
}

(async () => {
    // Load functions, events, and commands
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);

        // Set a random presence on bot startup
        setRandomChristmasPresence();

        // Change presence every 30 minutes
        setInterval(setRandomChristmasPresence, 30 * 60 * 1000);

        // Load saved countdowns and reschedule them
        const data = loadData();
        for (const guildId in data) {
            const channelId = data[guildId].countdownChannelId;
            scheduleCountdown(client, channelId);
        }
    });

    client.login(process.env.token);
})();
