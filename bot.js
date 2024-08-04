const mineflayer = require('mineflayer');
const schedule = require('node-schedule');

console.log('Server analysis...');
const username = 'example'; // Replace with your TLauncher username 
const server = 'example.aternos.me'; // Replace with your server address
const port = 12345; // Replace with your server port if necessary

console.log('Server found.');

function createBot() {
    console.log('Bot creation...');
    const bot = mineflayer.createBot({
        host: server,
        port: port,
        username: username,
        version: '1.20.1' // Specify the version as a string (<1.20.1)
    });

    console.log('Server connection...');

    bot.on('login', () => {
        console.log('Bot connected to the server.');
    });

    bot.on('end', (reason) => {
        console.log('Bot disconnected from server. Reason:', reason);
    });

    bot.on('kicked', (reason, loggedIn) => {
        console.log('Bot has been expelled from the server. Reason:', reason, 'Connected:', loggedIn);
    });

    bot.on('error', (err) => {
        console.log('Error:', err);
    });

    return bot;
}

const bot = createBot();

// Function to move the bot one block forward and backward
function moveBot() {
    const pos = bot.entity.position;

    // Move forward one block
    bot.setControlState('forward', true);
    setTimeout(() => {
        bot.setControlState('forward', false);

        // Backing up a block after a short pause
        setTimeout(() => {
            bot.setControlState('back', true);
            setTimeout(() => {
                bot.setControlState('back', false);
            }, 1000); // Adjust the delay as needed
        }, 1000);
    }, 1000); // Adjust the delay as needed
}

setInterval(moveBot, 60 * 1000); 

// Disconnect the bot at a specific time (e.g. 8:00 p.m.)
const disconnectHour = 20; // Log-off time (24-hour format)
const disconnectMinute = 0; // Minute of disconnection

const now = new Date();
const disconnectTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), disconnectHour, disconnectMinute, 0);

if (disconnectTime < now) {
    // If today's switch-off time has already passed, schedule it for tomorrow.
    disconnectTime.setDate(disconnectTime.getDate() + 1);
}

schedule.scheduleJob(disconnectTime, () => {
    bot.end();
    console.log('Bot disconnected at scheduled time.');
});
