<script>
    import { userData } from "$lib/userData";
    import { resultArr } from "$lib/resultArr";
    import Trail from "$lib/components/Trail.svelte"
    import Beach from "$lib/components/Beach.svelte"

    import { onMount } from "svelte";
    let t = $state();
    function roll() {
        let randomIndex = Math.round(Math.random() * $resultArr.length);
        t = $resultArr[randomIndex];
    }

    onMount(() => {
        roll()
        console.log(t)
    });
</script>

<main>
    <div>

        <h1>not sure where to go ?</h1>
    </div>

    <div class="siteContainer">
        {#if t != null}
            {#if t.t == "trail"}
                <Trail trail={t.a}></Trail>
            {:else}
                <Beach beach={t.a}></Beach>
            {/if}
        {/if}
    </div>
    <small>this place is really good ^</small>
    <small>go there now but check local conditions</small>
</main>

<style>
    main {
        padding-top: 40px;
        padding-left: 20px;
        padding-right: 20px;

        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .siteContainer {
        width: 50vw;
    }
    #reroll {
        width: 10vw;
        padding: none;
    }
</style>
