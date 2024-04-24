<script lang="ts">
    export let weatherData: any;
</script>

<div id="top-row">
    <img src={weatherData.current.condition.icon} alt="Icon" />
    <h2 class="long-text">
        Current Weather in {weatherData.location.name}
    </h2>

    <h2 class="short-text">
        {weatherData.location.name}
    </h2>

    <h2>{weatherData.current.temp_f}°F</h2>
</div>
<div id="weather-parent">
    <div>
        <p>
            {weatherData.location.name}, {weatherData.location.region}, {weatherData
                .location.country}
        </p>
        <p><b>Time: </b>{weatherData.location.localtime.split(" ")[1]}</p>
        <p><b>Wind: </b>{weatherData.current.wind_mph}mph</p>
        <p><b>UV Index: </b>{weatherData.current.uv}</p>
        <p><b>Humidity: </b>{weatherData.current.humidity}%</p>
    </div>

    <div>
        <p><b>Feels like </b>{weatherData.current.feelslike_f}°F</p>
        <p><b>Precipitation: </b>{weatherData.current.precip_in}"</p>
        <p><b>Pressure: </b>{weatherData.current.pressure_in} in</p>
    </div>
</div>

<style>
    #weather-parent {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Defines two columns */
        gap: 10px; /* Optional: Add spacing between items */
    }

    p {
        margin-top: 0;
    }

    #top-row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        grid-gap: 1rem;
    }

    /* #top-row img {
        margin-top: 0.5rem;
    } */

    .long-text {
        display: none;
    }

    .short-text {
        display: inline;
    }

    @media screen and (min-width: 1200) {
        .long-text {
            display: inline;
        }

        .short-text {
            display: none;
        }
    }
</style>
