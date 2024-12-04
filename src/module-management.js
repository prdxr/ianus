import { exec } from "node:child_process";

// Shutdown Command
export function shutdownServer(ctx) {
    exec('shutdown', (err) => {
        if (err) {
            return ctx.reply('Error shutting down: ' + err.message);
        }
        ctx.reply('Host is shutting down...');
    });
}

// Reboot Command
export function rebootServer(ctx) {
    exec('reboot', (err) => {
        if (err) {
            return ctx.reply('Error rebooting: ' + err.message);
        }
        ctx.reply('Host is rebooting...');
    });
}

// Stats Command
export function analyzeServer(ctx) {
    exec('free -h', (err, stdout) => {
        if (err) {
            return ctx.reply('Error fetching stats: ' + err.message);
        }
        ctx.reply(`System Stats:\n${stdout}`);
    });
}

// Custom Command
export function executeCustomCommand(ctx, cmd) {
    exec(cmd, (err, stdout) => {
        if (err) {
            return ctx.reply(`Error executing ${cmd}: ` + err.message);
        }
        ctx.reply(`Result:\n${stdout}`);
    });
}
