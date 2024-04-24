
const openWeather = import.meta.env.VITE_OPEN_WEATHER_KEY;

export async function getJSONFromURL(url: string) {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
    });
    const jsonData = await response.json();
    return jsonData;
}

function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

function gaussianRandom(rand: Function, mean = 0, stdev = 1) {
    const u = rand();
    const v = rand();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    return z * stdev + mean;
}

export function AQIColor(value: number) {
    value = Math.max(0, Math.min(value, 300));
    const greenThreshold = 150;
    const redThreshold = 300;

    let red, green, blue;
    if (value <= greenThreshold) {
        green = 255 - value;
        red = value;
        blue = 0;
    } else {
        red = 255;
        green = redThreshold - value;
        blue = 0;
    }

    const lightnessFactor = 0.9;
    red = Math.round(red * lightnessFactor);
    green = Math.round(green * lightnessFactor);
    blue = Math.round(blue * lightnessFactor);

    const alpha = 1;
    const hex = "#" + red.toString(16).padStart(2, "0") +
        green.toString(16).padStart(2, "0") +
        blue.toString(16).padStart(2, "0") +
        (alpha * 255).toString(16).padStart(2, "0");

    return hex;
}
const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;

export function noiseGenerator(city: string, metric: string, size: number) {
    var seed = cyrb128(city + metric);
    // Four 32-bit component hashes provide the seed for sfc32.
    var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    var seedMetric = cyrb128(metric);
    var rand2 = sfc32(seedMetric[0], seedMetric[1], seedMetric[2], seedMetric[3]);

    const myArray = Array.from({ length: size + 1 }, (_, i) => i * 0.01);

    const newArray = new Array(size).fill(0);


    for (let i = 1; i < newArray.length; i += 3) {
        newArray[i - 1] = rand();
        newArray[i + 1] = rand();
        newArray[i] = newArray[i - 1] * Math.cos(i / 2) + (1 - Math.cos(i / 2)) * newArray[i + 1];
    }

    // convolution
    const weights = [0.05, 0.2, 0.5, 0.2, 0.05];
    for (let i = 2; i < newArray.length - 2; i++) {
        let newVal = 0;

        for (let j = -2; j < 3; j++) {
            newVal += newArray[i - j] * weights[j + 2];
        }

        newArray[i] = newVal;
    }

    let randomOffset = rand() * 6;
    let divsior = 35;
    let randomPow = rand() * 2;
    let randomPow2 = rand() * 5;
    for (let i = 0; i < 100; i++) {
        newArray[i] = newArray[i] + Math.sin(randomOffset + Math.pow(Math.sqrt(2) * i / divsior, randomPow2)) + Math.sin(randomOffset + Math.PI * Math.pow(i / divsior, randomPow))
    }

    let variance = gaussianRandom(rand2);

    let mean = 0;

    console.log(variance)

    for (let i = 0; i < newArray.length; i++) {
        mean += newArray[i];
    }

    mean = mean / newArray.length;

    console.log("mean", mean)
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = mean + variance * Math.sign(newArray[i] - mean) * (Math.abs(newArray[i] - mean));
    }

    return newArray;
}

export async function getLatLong(zipcode: string) {
    const url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${openWeather}`;
    const jsonData = await getJSONFromURL(url);

    console.log(jsonData);
    return jsonData;
}