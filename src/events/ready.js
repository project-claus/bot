const statusArray = [
    { content: 'Spreading holiday cheer', type: 'PLAYING', status: 'online' },
    { content: 'Wrapping gifts', type: 'WATCHING', status: 'online' },
    { content: 'Listening to Christmas carols', type: 'LISTENING', status: 'online' },
    { content: 'Sipping hot cocoa', type: 'STREAMING', status: 'online' },
    { content: 'Decorating the Christmas tree', type: 'PLAYING', status: 'online' },
    { content: 'Counting down to Christmas!', type: 'WATCHING', status: 'online' },
    { content: 'Building snowmen', type: 'PLAYING', status: 'online' },
    { content: 'Hanging stockings by the fire', type: 'WATCHING', status: 'online' }
];

const PRESENCE_UPDATE_INTERVAL = 10000;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);
            const selectedStatus = statusArray[option];

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: selectedStatus.content,
                            type: selectedStatus.type,
                        },
                    ],
                    status: selectedStatus.status
                });
                console.log(`Updated presence to: ${selectedStatus.content} (${selectedStatus.type})`);
            } catch (error) {
                console.error('Error setting presence:', error);
            }
        }

        await pickPresence();

        setInterval(pickPresence, PRESENCE_UPDATE_INTERVAL);
    },
};
