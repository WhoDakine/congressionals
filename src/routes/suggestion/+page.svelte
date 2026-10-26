<script>
    import { userData } from "$lib/userData";
    import { resultArr, beachResult, trailResult, shouldTrail } from "$lib/resultArr";
    import Trail from "$lib/components/Trail.svelte"
    import Beach from "$lib/components/Beach.svelte"
	import { goto } from '$app/navigation';

    import { onMount } from "svelte";
    let t = $state();


    function roll(type) {
        const selectedType = type ?? ($shouldTrail ? "trail" : "beach");
        if (selectedType === "trail") {
            let randomIndex = Math.floor(Math.random() * $trailResult.length);
            t ={
                t: "trail",
                a: $trailResult[randomIndex]
            };        
        } else {
            let randomIndex = Math.floor(Math.random() * $beachResult.names.length);
            t ={
                t: "beach",
                a: $beachResult.names[randomIndex]
            };
        }

        if (type == null) {
            $shouldTrail = !$shouldTrail;
        }
    }



    onMount(() => {
        if ($beachResult.length == 0 || $trailResult.length == 0) {
            goto("/?loadData=true")
        } else {
            roll()

        }
    });
</script>

<main>
    <div class="page-header">
        <h1>Not Sure Where to Go?</h1>
    </div>

    <div class="siteContainer">
        {#if t != null}
            {#if t.t == "trail"}
                <Trail trail={t.a}></Trail>
            {:else}
                <Beach beach={t.a}></Beach>
            {/if}
            <button id="reroll" on:click={() => roll(t.t)}>Reroll</button>
        {/if}
    </div>
    <small>Check out this spot!</small>
    <small>Make sure to check local conditions before visiting.</small>
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
        min-width: 50vw;
        
    }
    #reroll {
        margin-top: 16px;
        padding: 8px 16px;
        cursor: pointer;
    }
</style>
