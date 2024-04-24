<script lang="ts">
    export let title: string;
</script>

<header class="title-bar">
    <h1>{title}</h1>
</header>

<style>
    .title-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background-color: #f0f0f0;
    }

    h1 {
        margin: 0;
        font-size: 2rem;
    }
</style>
