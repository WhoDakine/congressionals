<script>
    import Footer from "$lib/components/footer.svelte";
    import SiteHeader from "$lib/components/siteHeader.svelte";
    import { onMount } from "svelte";
    let trails = $state([]);
    let beaches = $state([]);
    let query = $state("");
    let selectedType = $state("all");
    let selectedLetter = $state("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function normalize(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/gi, "")
            .toLowerCase();
    }

    function matchesFilters(item, type) {
        const name = type === "trail" ? item.name : item.tags?.name;
        const normalizedName = normalize(name);
        const normalizedQuery = query.trim().toLowerCase();
        const matchesLetter = !selectedLetter || normalizedName.startsWith(selectedLetter.toLowerCase());
        const matchesQuery = !normalizedQuery ||
            String(name ?? "").toLowerCase().includes(normalizedQuery) ||
            String(item.island ?? "").toLowerCase().includes(normalizedQuery);

        return matchesLetter && matchesQuery;
    }

    let results = $derived.by(() => {
        const matchingTrails = selectedType !== "beach"
            ? trails.filter((trail) => matchesFilters(trail, "trail"))
            : [];
        const matchingBeaches = selectedType !== "trail"
            ? beaches.filter((beach) => matchesFilters(beach, "beach"))
            : [];

        return interweave(matchingTrails, matchingBeaches);
    });

    let shouldShowResults = $derived(
        query.trim().length > 0 || selectedLetter !== "" || selectedType !== "all",
    );

    let loaded = $state(false);
    import Beach from "$lib/components/Beach.svelte";
    import Trail from "$lib/components/Trail.svelte";

    async function getTrails() {
        const response = await fetch(`/api/trails`);
        const data = await response.json();
        trails = data.data;
        getBeaches();
    }

    function interweave(a1, a2) {
        var maxLength = Math.max(a1.length, a2.length)
        var array = []
        for (let i = 0; i < maxLength; i++) {
            if (i < a1.length) {
                    array.push({
                    a: a1[i],
                    t: "trail"
                })
            }

            if (i < a2.length) {
                array.push({
                    a: a2[i],
                    t: "beach"
                })
            }
        }
        return array
    }

    async function getBeaches() {
        const response = await fetch("/beaches.json");
        const response2 = await fetch("/beachActivities.json");
        const data = await response.json();
        const data2 = await response2.json();

        beaches = data.elements;
        loaded = true;
    }

    onMount(() => {
        getTrails();
    });
</script>

<main>
    <div class="page-header">
        <h1 class="pageTitle">Search Away!</h1>
    </div>
    <form class="findSpots">
        <fieldset role="group">
            <input
                bind:value={query}
                type="search"
                name="search"
                placeholder="Find Spots"
                autofocus
            />
        </fieldset>
    </form>

    <div class="filterGroup" aria-label="Filter by type">
        <button class:active={selectedType === "all"} aria-pressed={selectedType === "all"} onclick={() => selectedType = "all"}>All</button>
        <button class:active={selectedType === "beach"} aria-pressed={selectedType === "beach"} onclick={() => selectedType = "beach"}>Beaches</button>
        <button class:active={selectedType === "trail"} aria-pressed={selectedType === "trail"} onclick={() => selectedType = "trail"}>Trails</button>
    </div>

    <div class="alphabet" aria-label="Filter by first letter">
        <button class:active={selectedLetter === ""} aria-pressed={selectedLetter === ""} onclick={() => selectedLetter = ""}>All</button>
        {#each alphabet as letter}
            <button
                class:active={selectedLetter === letter}
                aria-label="Names beginning with {letter}"
                aria-pressed={selectedLetter === letter}
                onclick={() => selectedLetter = selectedLetter === letter ? "" : letter}
            >{letter}</button>
        {/each}
    </div>

    {#if loaded}
        {#if shouldShowResults}
            {#if results.length > 0}
            {#each results as t (t.t === "trail" ? `trail-${t.a.idKey}` : `beach-${t.a.id}`)}
                {#if t.t == "trail"}

                    <Trail trail={t.a}></Trail>
                {:else}
                    <Beach beach={t.a}></Beach>
                {/if}
            {/each}
            {:else}
                <p class="emptyState">No matching spots found.</p>
            {/if}
        {:else}
            <p class="emptyState">Search by name, choose a type, or select a letter.</p>
        {/if}
    {/if}
</main>

<style>
    main {
        display: flex;
        padding: 20px;
        flex-direction: column;
    }
    main * {
        border-radius: 20px;
    }
    .findSpots {
        view-transition-name: findSpots;
        width: 100%;
        margin-top: 1rem;
    }

    .filterGroup {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }

    .filterGroup button,
    .alphabet button {
        border: 1px solid #80A1BA;
        background: #FFF7DD;
        color: #80A1BA;
        cursor: pointer;
    }

    .filterGroup button {
        padding: 0.5rem 0.85rem;
    }

    .filterGroup button.active,
    .alphabet button.active {
        background: #80A1BA;
        color: #FFF7DD;
    }

    .alphabet {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.75rem;
    }

    .alphabet button {
        min-width: 2rem;
        min-height: 2rem;
        padding: 0.25rem;
    }

    .emptyState {
        padding: 1rem 0;
        text-align: center;
    }

    .pageTitle {
        view-transition-name: pageTitle;
    }
</style>
