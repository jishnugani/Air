import { getJSONFromURL, getLatLong } from "./util";

const weatherAPI = import.meta.env.VITE_WEATHER_API_KEY;
const openWeather = import.meta.env.VITE_OPEN_WEATHER_KEY;

export async function fetchWeatherFromQuery(query: string): Promise<Object> {
    let url = `https://api.weatherapi.com/v1/current.json?key=${weatherAPI}&q=${query}&aqi=yes`;
    const jsonData = await getJSONFromURL(url);
    return jsonData;
}

export async function getZipcodeByIP(ip: string = ""): Promise<string | null> {
    let url = `https://geolocation-db.com/json/0daad5e0-82e7-11ee-92e0-f5d620c7dcb4${ip ? `/${ip}` : ""}`;
    let jsonData;
    try {
        jsonData = await getJSONFromURL(url);

        console.log("geolocation", jsonData);
    }
    catch {
        return null;
    }

    if (jsonData) {
        return jsonData.postal;
    }
    else {
        return null;
    }

}

export async function getAQI(lat: string, long: string) {
    const url = `https://api.waqi.info/feed/geo:${lat};${long}/?token=5684639b4121da9162e968dc1bba2d7331c24b97`
    const jsonData = await getJSONFromURL(url);

    console.log("AQI", jsonData);

    if (jsonData.status == "ok") return jsonData.data.aqi;
    throw Error;
    return "unavailable";
}

export async function getAQICity(city: string) {
    const url = `https://api.waqi.info/feed/${city}/?token=5684639b4121da9162e968dc1bba2d7331c24b97`
    const jsonData = await getJSONFromURL(url);

    console.log("AQI", jsonData);

    if (jsonData.status == "ok") return jsonData.data.aqi;
    return "unavailable";
}

export async function getAQIZipcode(zipcode: string) {
    const geoLocation = await getLatLong(zipcode);
    return getAQI(geoLocation.lat, geoLocation.lon);
}

export async function getAirDataHistory(lat: string, lon: string, start: number, end: number) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${openWeather}`
    const jsonData = await getJSONFromURL(url);
    console.log(url)
    console.log("openweather", jsonData);
}