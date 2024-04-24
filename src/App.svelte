<script lang="ts">
    import { onMount } from "svelte";
    import { genAI, generateT, generateFrom } from "./lib/gemini";
    import Titlebar from "./components/titlebar.svelte";
    import Loadcircle from "./components/loadcircle.svelte";
    import { Search } from "svelte-bootstrap-icons";
    import {
        getZipcodeByIP,
        fetchWeatherFromQuery,
        getAQIZipcode,
        getAQICity,
        getAQI,
        getAirDataHistory,
    } from "./lib/weather";

    import Weathercontent from "./components/weathercontent.svelte";
    import Aqicontent from "./components/aqicontent.svelte";
    import {
        AQIColor,
        getJSONFromURL,
        getLatLong,
        noiseGenerator,
    } from "./lib/util";

    enum Status {
        SUCCESS,
        MANUAL_INPUT,
        WEATHER_API_ERROR,
        LOADING,
    }

    let status = Status.LOADING;

    let weatherData: any = undefined;
    let zipcode: any = undefined;
    let geminiSummary: any = undefined;

    let searchInput: string = "";

    let firstTime: boolean = true;
    let aqi: number | undefined = undefined;

    function handleEnter(e: KeyboardEvent) {
        if (e.key == "Enter") {
            updateData(searchInput);
        }
    }
    onMount(async () => {
        zipcode = await getZipcodeByIP();
        if (zipcode === null) return;
        updateData(zipcode);
        firstTime = true;
    });

    async function updateData(query: string) {
        firstTime = false;
        geminiSummary = undefined;
        weatherData = undefined;

        weatherData = await fetchWeatherFromQuery(query);
        // console.log("weatherapi", weatherData);

        aqi = await getAQI(weatherData.location.lat, weatherData.location.lon);
        const currentDatetimeInMilliseconds = Date.now() - 1000 * 60 * 60 * 24;
        const msLastWeek =
            currentDatetimeInMilliseconds - 2 * 1000 * 60 * 60 * 24;

        await getAirDataHistory(
            weatherData.location.lat,
            weatherData.location.lon,
            msLastWeek,
            currentDatetimeInMilliseconds,
        );
        geminiSummary = await generateFrom(JSON.stringify(weatherData));
        console.log(aqiColor);
    }

    $: aqiColor = aqi ? AQIColor(aqi) : "#f0f0f0";
</script>

<main>
    <Titlebar title={"Weathair"} />
    <div class="search-bar">
        <input
            type="text"
            placeholder="Search Zipcode, City"
            bind:value={searchInput}
            on:keydown={handleEnter}
        />
        <button type="submit" on:click={() => updateData(searchInput)}
            >Search</button
        >
    </div>
    {#if weatherData != undefined}
        {#if weatherData.error != null}
            <h1>Invalid input</h1>
        {:else}
            <div class="container">
                <div id="weather">
                    <Weathercontent {weatherData} />
                </div>
                <div id="aqi">
                    <Aqicontent
                        {weatherData}
                        {aqi}
                        backgroundColor={aqiColor}
                    />
                </div>
            </div>

            <div id="summary">
                <h3>AI Summary</h3>
                {#if geminiSummary == undefined}
                    <div class="three-dots-loader"></div>
                {:else}
                    <p>{geminiSummary}</p>
                {/if}
            </div>

            {#if firstTime}
                <div id="changeLocation">
                    <p>
                        Not in {weatherData.location.name}, {weatherData
                            .location.region}?
                    </p>
                </div>
            {/if}
        {/if}
    {:else if zipcode === null}
        <div>
            <h3>Could not find your location</h3>
            <p>Try disabling your adblocker</p>
            <p>Otherwise, set your location in the search bar</p>
        </div>
    {:else}
        <div class="center-container">
            <Loadcircle />
        </div>
    {/if}
</main>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    #summary {
        background-color: #f0f0f0;
        min-height: 35px;
        padding-bottom: 0.5px;
        border-radius: 1.5rem;
    }

    #summary p,
    h3 {
        margin: 1rem;
    }

    .three-dots-loader {
        margin: 1rem 1rem 1rem 2rem;
        width: 15px;
        aspect-ratio: 1;
        border-radius: 50%;
        animation: l5 1s infinite linear alternate;
    }

    @keyframes l5 {
        0% {
            box-shadow:
                20px 0 #000,
                -20px 0 #0002;
            background: #000;
        }
        33% {
            box-shadow:
                20px 0 #000,
                -20px 0 #0002;
            background: #0002;
        }
        66% {
            box-shadow:
                20px 0 #0002,
                -20px 0 #000;
            background: #0002;
        }
        100% {
            box-shadow:
                20px 0 #0002,
                -20px 0 #000;
            background: #000;
        }
    }

    #weather,
    #aqi {
        padding: 1rem;
        background-color: #f0f0f0;
        border-radius: 1.5rem;
    }

    @media screen and (min-width: 1000px) {
        .container {
            flex-direction: row;
        }

        #weather,
        #aqi {
            width: 45%;
        }
    }

    @media screen and (max-width: 999px) {
        .container {
            flex-direction: column; /* Make divs stack on smaller screens */
        }

        #weather,
        #aqi {
            width: calc(100% - 2rem);
        }
    }

    .search-bar {
        display: flex;
        justify-content: space-between; /* Space between elements */
        align-items: center;
        width: 80%; /* Span entire viewport width */
        margin: 1rem auto; /* Add left & right margin, center horizontally */
        padding: 0.5rem;
        background-color: #f0f0f0;
        border-radius: 5px;
    }

    .search-bar input {
        flex: 1; /* Input expands to fill remaining space */
        border: none;
        outline: none;
        padding: 0.5rem;
        border-radius: 3px;
    }

    .search-bar button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: #3498db;
        color: white;
        cursor: pointer;
        border-radius: 0.2rem;
    }

    .search-bar button :hover {
        background-color: #6899b9;
    }

    .center-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #changeLocation {
        margin-left: 1rem;
    }
    #changeLocation p {
        text-decoration: underline;
    }
</style>
