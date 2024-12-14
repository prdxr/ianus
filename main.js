import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { rebootServer, shutdownServer, analyzeServer, executeCustomCommand } from './src/module-management.js';
import {getFromShare, listShare, postToShare} from './src/module-filestorage.js';
import { wakeUpComputer, scanNetwork } from './src/module-network.js';
import { readDhtSensor } from './src/module-sensors.js';

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
let waitForFile = false;

bot.launch();


// privilege checker
function checkOwnership(func) {
    return function(ctx) {
        if (String(ctx.message.from.id) !== process.env.OWNER_TGID) {
            ctx.reply('Error: unauthorized');
            return;
        }

        func(ctx);
    }
}


// help command
bot.command('help', (ctx) => {
   let helpMessage = 'my commands:\n\n' +
       '*Management section*\n' +
       '\\- 🔐 `/reboot` \\- reboot the server\n' +
       '\\- 🔐 `/shutdown` \\- shutdown the server\n' +
       '\\- `/stats` \\- get server memory status\n' +
       '\\- 🔐 `/cmd {command}` \\- execute custom bash command on server\n' +
       '*File storage section*\n' +
       '\\- `/ls` \\- print share folder contents\n' +
       '\\- 🔐 `/get {filename}` \\- download file by filename \\(from ls\\)\n' +
       '\\- 🔐 `/post` \\- initiate file upload\\. You will be prompted with a file right after\n' +
       '*Network section*\n' +
       '\\- 🔐 `/wake_pc` \\- wake up home pc\n' +
       '*Sensors section*\n' +
       '\\- `/dht` \\- print current server room temperature and humidity\n\n' +
       '_the 🔐 icon means for owner usage only_';
   ctx.replyWithMarkdownV2(helpMessage);
});


// management commands
bot.command('reboot', checkOwnership((ctx) => {
    rebootServer(ctx);
}));

bot.command('shutdown', checkOwnership((ctx) => {
    shutdownServer(ctx);
}));

bot.command('stats', (ctx) => {
    analyzeServer(ctx);
});

bot.command('cmd', checkOwnership((ctx) => {
    executeCustomCommand(ctx, ctx.message.text.slice(5));
}));
// -----


// file storage commands
bot.command('ls', (ctx) => {
    listShare(ctx);
});

bot.command('get', checkOwnership((ctx) => {
    getFromShare(ctx, ctx.message.text.slice(5));
}));

bot.command('post', checkOwnership((ctx) => {
    ctx.reply('Please provide the file you want to upload.');
    waitForFile = true;
}));

// file listener
bot.on('document', checkOwnership((ctx) => {
    if (!waitForFile) { return }

    waitForFile = false;
    let fileId = ctx.message.document.file_id;
    postToShare(ctx, fileId);
}));
// -----


// network commands
bot.command('wake_pc', checkOwnership((ctx) => {
    wakeUpComputer(process.env.HOME_PC_MAC).then((result) => { ctx.reply(result) });
}));

// !!! placeholder
bot.command('scan', checkOwnership((ctx) => {
    scanNetwork(process.env.HOME_PC_MAC);
}));
// -----


// sensors commands
bot.command('dht', async (ctx) => {
    try {
        const data = await readDhtSensor();
        ctx.reply(
            `Temperature: ${data.temperature.toFixed(1)}°C
            \nHumidity: ${data.humidity.toFixed(1)}%`
        );
    } catch (error) {
        ctx.reply('Failed to read from sensor. Please try again later.');
        console.error('Sensor read error:', error);
    }
});
// -----


// enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'))