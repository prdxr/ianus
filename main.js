import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { rebootServer, shutdownServer, analyzeServer, executeCustomCommand } from "./src/module-management.js";
import {getFromShare, listShare} from "./src/module-filestorage.js";

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);

// placeholder for tests
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();

// Management commands
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

// Filestorage commands
bot.command('ls', (ctx) => {
    listShare(ctx);
});

bot.command('get', (ctx) => {
    getFromShare(ctx, ctx.message.text.slice(5));
})


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'))