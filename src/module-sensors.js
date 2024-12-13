import dht from 'node-dht-sensor';

// Configure the DHT sensor
const sensorType = 11; // DHT11
const gpioPin = process.env.DHT_PIN; // GPIO pin number where Data pin is connected

// Function to read sensor data
export function readSensor() {
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
