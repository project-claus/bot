const statusArray = [
    { content: 'Spreading holiday cheer', type: 'PLAYING', status: 'online' },
    { content: 'Wrapping gifts', type: 'WATCHING', status: 'online' },
    { content: 'Listening to Christmas carols', type: 'LISTENING', status: 'online' },
    { content: 'Sipping hot cocoa', type: 'PLAYING', status: 'online' },
    { content: 'Decorating the Christmas tree', type: 'PLAYING', status: 'online' },
    { content: 'Counting down to Christmas!', type: 'WATCHING', status: 'online' },
    { content: 'Building snowmen', type: 'PLAYING', status: 'online' },
    { content: 'Hanging stockings by the fire', type: 'WATCHING', status: 'online' },
];

const PRESENCE_UPDATE_INTERVAL = 10000;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot logged in as ${client.user.tag} and is ready!`);

        const updatePresence = async () => {
            try {
                const randomIndex = Math.floor(Math.random() * statusArray.length);
                const { content, type, status } = statusArray[randomIndex];

                await client.user.setPresence({
                    activities: [{ name: content, type }],
                    status,
                });

                console.log(`Presence updated to: ${content} (${type})`);
            } catch (error) {
                console.error('Error updating presence:', error);
            }
        };

        await updatePresence();

        setInterval(async () => {
            await updatePresence();
        }, PRESENCE_UPDATE_INTERVAL);
    },
};
