import { wake } from 'wake_on_lan';

export function wakeUpComputer(macAddress) {
    return new Promise((resolve, reject) => {
        wake(macAddress, (error) => {
            if (error) {
                console.error("Failed to send WOL packet: ", error);
                reject(error);
            } else {
                console.log(`WOL packet sent to ${macAddress}`);
                resolve(`WOL packet sent to ${macAddress}`);
            }
        });
    });
}