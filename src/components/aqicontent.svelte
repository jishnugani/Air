<script lang="ts">
    import { each } from "highcharts";
    import jsonData from "../lib/gemni-data.json";

    export let weatherData: any;
    export let aqi: number | undefined;
    export let backgroundColor: string;
    import Hc from "./hc.svelte";
    import { generateT } from "../lib/gemini";
    import { onMount } from "svelte";

    $: descriptor = getDescriptor(aqi);

    function getDescriptor(aqi: number | undefined) {
        if (aqi == undefined) return "";
        if (aqi < 50) return "Good";
        if (aqi < 100) return "Moderate";
        if (aqi < 150) return "Unhealthy for Sensitive Groups";
        if (aqi < 200) return "Unhealthy";
        if (aqi > 200) return "Hazardous";
        return "";
    }

    let airData: any = { ...weatherData.current.air_quality };
    delete airData["gb-defra-index"];
    delete airData["us-epa-index"];

    const showAir = {
        ...airData,
        ...Object.fromEntries(Object.keys(airData).map(() => [, false])),
    };

    onMount(async () => {
        for (const key in airData) {
            showAir[key] = await generateT(
                jsonData.prompt2 +
                    `The pollutant is ${key} and the levels are ${airData[key]} micrograms per cubic meter`,
            );
            showAir[key] = showAir[key].replace(/\*/g, "");
        }
    });

    let viewDetails: boolean = false;
</script>

<div class="a" style={`background-color: ${backgroundColor}`}>
    <h2>
        AQI: {aqi}
        {descriptor ? "(" + descriptor + ")" : ""}
    </h2>
</div>

<button on:click={() => (viewDetails = true)}>Details</button>

{#if viewDetails}
    {#each Object.entries(airData) as [key, value]}
        <div id="abc">
            <p><b>{key.toUpperCase()}: </b>{value}µg/m<sup>3</sup></p>
            <p>Description: {showAir[key]}</p>
            <Hc city={weatherData.location.name} metric={key} />
        </div>
    {/each}
{/if}

<style>
    #abc {
        display: grid;
        grid-template-columns: repeat(
            auto-fit,
            minmax(100px, 1fr)
        ); /* Adjust as needed */
        gap: 10px; /* Optional: Add spacing between items */
    }

    sup {
        vertical-align: super;
        font-size: 0.8em; /* Optional for smaller size */
    }

    sub {
        vertical-align: sub;
        font-size: 0.8em; /* Optional for smaller size */
    }

    .a {
        padding-left: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
</style>
