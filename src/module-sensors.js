import dht from 'node-dht-sensor';

const sensorType = 11; // DHT11
const gpioPin = Number(process.env.DHT_PIN);

dht.initialize(sensorType, gpioPin);

// read humidity-temperature function
export function readDhtSensor() {
    return new Promise((resolve, reject) => {
        try {
            const readout = dht.read();
            const temperature = readout.temperature.toFixed(1);
            const humidity = readout.humidity.toFixed(1);

            // Respond with sensor data
            resolve({ temperature, humidity });
        } catch (error) {
            console.error('Error reading sensor data:', error);
            reject(error);
        }
    });
}
