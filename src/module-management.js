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
    const commands = {
        memory: 'free -h',
        uptime: 'uptime',
        temp: 'cat /sys/class/thermal/thermal_zone0/temp', // Raspberry Pi temperature
    };
    Promise.all([
        executeCommand(commands.memory),
        executeCommand(commands.uptime),
        executeCommand(commands.temp),
    ])
        .then(([memory, uptime, tempRaw]) => {
            // Convert temperature if fetched
            const temp = tempRaw ? (parseInt(tempRaw.trim(), 10) / 1000).toFixed(2) : 'N/A';

            // Reply with aggregated stats
            ctx.replyWithHTML(`System Stats:\n\n` +
                `📊 <b>Memory Usage:</b>\n${memory}\n` +
                `⏱️ <b>System Load:</b>\n${uptime}\n` +
                `🌡️ <b>Core Temperature:</b>\n${temp}°C`
            );
        })
        .catch((err) => {
            console.error('Error fetching stats:', err);
            ctx.reply('Error fetching stats: ' + err.message);
        });
}

// Helper to execute a shell command and return a promise
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            resolve(stdout.trim());
        });
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
