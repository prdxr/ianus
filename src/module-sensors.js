import dht from 'node-dht-sensor';
import { Gpio } from 'onoff';

const sensorType = 11; // DHT11
dht.initialize(sensorType, Number(process.env.DHT_PIN));

const buzzer = new Gpio(process.env.BUZZ_PIN, 'out');

// read humidity-temperature function
export function readDhtSensor() {
    return new Promise((resolve, reject) => {
        try {
            const readout = dht.read();
            const temperature = readout.temperature;
            const humidity = readout.humidity;

            resolve({ temperature, humidity });
        } catch (error) {
            console.error('Error reading sensor data:', error);
            reject(error);
        }
    });
}

// ping buzzer function
export function pingBuzzer(ctx) {
    return new Promise((resolve, reject) => {
        try {
            buzzer.writeSync(1);
            // turn off the buzzer after 1 second
            setTimeout(() => {
                buzzer.writeSync(0);
            }, 1000);

            resolve('pong!');
        } catch (error) {
            console.error('Error activating buzzer:', error);
            reject(error);
        }
    });
}

export const cleanupBuzzer = () => {
    buzzer.unexport();
};