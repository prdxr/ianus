import dht from 'node-dht-sensor';

const sensorType = 11; // DHT11
const gpioPin = process.env.DHT_PIN;

// read humidity-temperature function
export function readDhtSensor() {
    return new Promise((resolve, reject) => {
        dht.read(sensorType, gpioPin, (err, temperature, humidity) => {
            if (err) {
                reject(err);
            } else {
                resolve({ temperature, humidity });
            }
        });
    });
}
