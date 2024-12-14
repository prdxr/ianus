import { exec } from 'node:child_process';

// shutdown command
export function shutdownServer(ctx) {
    exec('sudo shutdown now', (err) => {
        if (err) {
            return ctx.reply('Error shutting down: ' + err.message);
        }
        ctx.reply('Host is shutting down...');
    });
}

// reboot command
export function rebootServer(ctx) {
    exec('sudo reboot', (err) => {
        if (err) {
            return ctx.reply('Error rebooting: ' + err.message);
        }
        ctx.reply('Host is rebooting...');
    });
}

// system stats command
export function analyzeServer(ctx) {
    exec('free -h', (err, stdout) => {
        if (err) {
            return ctx.reply('Error fetching stats: ' + err.message);
        }
        ctx.reply(`System Stats:\n${stdout}`);
    });
}

// custom command execution
export function executeCustomCommand(ctx, cmd) {
    exec(cmd, (err, stdout) => {
        if (err) {
            return ctx.reply(`Error executing ${cmd}: ` + err.message);
        }
        ctx.reply(`Result:\n${stdout}`);
    });
}
