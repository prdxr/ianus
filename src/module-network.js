import { wake } from 'wake_on_lan';
import { networkInterfaces } from 'os';
import { createSession } from 'net-ping';
import {exec} from "node:child_process";

// wake-on-lan command
export function wakeUpComputer(macAddress) {
    return new Promise((resolve, reject) => {
        wake(macAddress, (error) => {
            if (error) {
                console.error('Failed to send WOL packet: ', error);
                reject(error);
            } else {
                console.log(`WOL packet sent to ${macAddress}`);
                resolve(`WOL packet sent to ${macAddress}`);
            }
        });
    });
}

// scan network command
export function scanNetwork(ctx) {
    exec('nmap -sn 192.168.1.0/24', (err, stdout) => {
        if (err) {
            return ctx.reply(`Error scanning: ` + err.message);
        }
        ctx.reply(`Result:\n${stdout}`);
    });
}