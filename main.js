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


// management commands
bot.command('reboot', (ctx) => {
    rebootServer(ctx);
});

bot.command('shutdown', (ctx) => {
    shutdownServer(ctx);
});

bot.command('stats', (ctx) => {
    analyzeServer(ctx);
});

bot.command('cmd', (ctx) => {
    executeCustomCommand(ctx, ctx.message.text.slice(5));
});
// -----


// file storage commands
bot.command('ls', (ctx) => {
    listShare(ctx);
});

bot.command('get', (ctx) => {
    getFromShare(ctx, ctx.message.text.slice(5));
})

bot.command('post', (ctx) => {
    ctx.reply('Please provide the file you want to upload.');

    waitForFile = true;
})

// file listener
bot.on('document', (ctx) => {
    if (!waitForFile) { return }

    waitForFile = false;
    let fileId = ctx.message.document.file_id;
    postToShare(ctx, fileId);
})
// -----


// network commands
bot.command('wake_pc', (ctx) => {
    wakeUpComputer(process.env.HOME_PC_MAC).then((result) => { ctx.reply(result) });
})

// !!! placeholder
bot.command('scan', (ctx) => {
    scanNetwork(process.env.HOME_PC_MAC);
})
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