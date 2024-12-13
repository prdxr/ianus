import { wake } from 'wake_on_lan';
import { networkInterfaces } from 'os';
import { createSession } from 'net-ping';

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

function getLocalSubnet() {
    const interfaces = networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                const subnet = iface.address.split('.').slice(0, 3).join('.') + '.0/24';
                return subnet;
            }
        }
    }
    throw new Error("Unable to determine local subnet");
}

export function scanNetwork() {
    return undefined;
}
//     const session = createSession();
//     const subnet = getLocalSubnet();
//     const baseIp = subnet.split('/')[0].split('.').slice(0, 3).join('.');
//     const promises = [];
//
//     console.log(`Scanning subnet: ${subnet}`);
//
//     for (let i = 1; i <= 254; i++) {
//         const ip = `${baseIp}.${i}`;
//         promises.push(
//             new Promise(resolve => {
//                 session.pingHost(ip, (error, target) => {
//                     if (!error) {
//                         resolve(target); // Responding device
//                     } else {
//                         resolve(null); // No response
//                     }
//                 });
//             })
//         );
//     }
//
//     Promise.all(promises).then(results => {
//         const activeDevices = results.filter(Boolean);
//         ctx.(activeDevices); // Devices that responded
//         session.close();
//     });
// }