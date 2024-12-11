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

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        // Function to pick a random presence
        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status
                });
                console.log(`Updated presence to: ${statusArray[option].content} (${statusArray[option].type})`);
            } catch (error) {
                console.error('Error setting presence:', error);
            }
        }

        // Initial presence update
        await pickPresence();

        // Update presence every 10 seconds
        setInterval(pickPresence, 10000);
    },
};
