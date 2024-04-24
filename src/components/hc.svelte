<script lang="ts">
    import Highcharts from "highcharts";
    import { noiseGenerator } from "../lib/util";

    export let city: string;
    export let metric: string;

    let chart: any;

    import { onMount } from "svelte";

    onMount(() => {
        let names: any[] = Array.from({ length: 100 }, (_, i) => i * 0.01);
        let data: any[] = noiseGenerator(city, metric, 100);

        let points = [];
        for (let i = 0; i < names.length; i++) {
            points.push({
                x: names[i],
                y: data[i],
            });
        }

        const options = {
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function () {
                            // Allow legend interaction
                            return true;
                        },
                    },
                },
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
            chart: {
                type: "line",
                events: {},
            },
            title: {
                text: `${metric.toUpperCase()} levels in ${city} past 7 days`,
            },
            xAxis: {
                type: "category",
                labels: {
                    enabled: false,
                },
            },
            series: [
                {
                    name: "Concentration of pollutants",
                    data: points,
                    labels: {
                        enabled: false,
                    },
                },
            ],
            labels: {
                enabled: false,
            },
            yAxis: {
                labels: {
                    enabled: false,
                },
            },
        };

        // @ts-ignore
        Highcharts.chart(chart, options);
    });
</script>

<div id="chart-parent">
    <div id="myChart" bind:this={chart} />
</div>

<style>
    #chart-parent {
        width: 100%;
    }
</style>
