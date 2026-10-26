<script>
    import { userData } from "$lib/userData";
    import beachKnowledge from "../../../beachData/json/hawaii_knowledge.json";
    import cleanedSearchSources from "../../../beachData/json/searxng_cleaned.json";
    import webSources from "../../../beachData/json/web_data.json";

    let referencesDialog;

    function getCollectionReferences(collection) {
        return Object.values(collection ?? {}).flatMap((entries) =>
            Array.isArray(entries) ? entries : [],
        );
    }

    const referenceCandidates = [
        ...Object.values(beachKnowledge.beaches ?? {}).flatMap((beach) => beach.sources ?? []),
        ...getCollectionReferences(cleanedSearchSources),
        ...getCollectionReferences(webSources),
    ];

    const references = [...new Map(
        referenceCandidates
            .filter((source) => source.url)
            .map((source) => [source.url, {
                name: source.name ?? source.title ?? source.url,
                url: source.url,
            }]),
    ).values()];

    function updatePreference(preference, event) {
        const value = Number(event.currentTarget.value);
        userData.update((current) => ({
            ...current,
            [preference]: value,
        }));
    }

    const islands = ["Big Island", "Maui", "Molokai", "Lanai", "Oahu", "Kauai"];

    function updateIsland(event) {
        userData.update((current) => ({
            ...current,
            island: event.currentTarget.value,
        }));
    }

    function updateName(event) {
        userData.update((current) => ({
            ...current,
            name: event.currentTarget.value,
        }));
    }

    function getSelectedIsland(value) {
        return islands.find((island) => island.toLowerCase() === String(value ?? "").toLowerCase()) ?? "";
    }
</script>

<main>
    <div class="header page-header">
        <div>
            <h1 class="pageTitle">Settings</h1>
            <small>View & Edit Your Preferences</small>
        </div>
    </div>
    <article>
        <section class="identity">
            <h2>Your details</h2>
            <label for="name">Name</label>
            <input id="name" type="text" value={$userData.name} oninput={updateName} placeholder="Enter your name" />
            <label for="island">Island</label>
            <select id="island" value={getSelectedIsland($userData.island)} onchange={updateIsland}>
                <option value="">Select your island</option>
                {#each islands as island}
                    <option value={island}>{island}</option>
                {/each}
            </select>
        </section>

        <section class="preference">
            <label for="beach-safety">Beach Safety: </label>
            <output for="beach-safety">{$userData.swimSafety} / 10</output>
            <input
                id="beach-safety"
                type="range"
                min="0"
                max="10"
                step="1"
                value={$userData.swimSafety}
                oninput={(event) => updatePreference("swimSafety", event)}
            />
        </section>

        <section class="preference">
            <label for="trail-length">Max Trail Length: </label>
            <output for="trail-length">
                {$userData.distance}{#if $userData.distance === 7}+ miles{:else if $userData.distance === 1} mile{:else} miles{/if}
            </output>
            <input
                id="trail-length"
                type="range"
                min="0"
                max="7"
                step="1"
                value={$userData.distance}
                oninput={(event) => updatePreference("distance", event)}
            />
        </section>

        <button type="button" class="references-button" onclick={() => referencesDialog?.showModal()}>
            References ({references.length})
        </button>
    </article>

    <dialog bind:this={referencesDialog} aria-labelledby="references-title">
        <header class="references-header">
            <h2 id="references-title">Data References</h2>
            <button type="button" class="close-button" aria-label="Close references" onclick={() => referencesDialog?.close()}>
                <i class="fa-solid fa-xmark"></i>
            </button>
        </header>
        <ul class="references-list">
            {#each references as reference (reference.url)}
                <li>
                    <a href={reference.url} target="_blank" rel="noreferrer">{reference.name}</a>
                    <small>{reference.url}</small>
                </li>
            {/each}
        </ul>
    </dialog>

</main>

<style>
    main {
        display: flex;
        padding: 20px;
        padding-top: 0;
        flex-direction: column;
        gap: 1rem;
    }
    article {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 520px;
        width: 100%;
    }

    .identity {
        display: grid;
        gap: 0.75rem;
    }

    .identity h2 {
        margin: 0;
    }

    .identity p {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 0;
    }

    .identity select {
        width: 100%;
    }

    .preference {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.75rem 1rem;
        align-items: center;
    }

    .preference label {
        font-weight: 600;
    }

    .preference output {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    .preference input {
        grid-column: 1 / -1;
        width: 100%;
        accent-color: var(--pico-primary);
    }

    .references-button {
        align-self: flex-start;
    }

    dialog {
        width: min(720px, calc(100vw - 2rem));
        max-height: min(80vh, 720px);
        padding: 1.25rem;
        border: 1px solid var(--pico-muted-border-color);
        border-radius: 12px;
        background: var(--pico-background-color);
        color: var(--pico-color);
    }

    dialog::backdrop {
        background: rgb(20 30 35 / 55%);
    }

    .references-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .references-header h2 {
        margin: 0;
    }

    .close-button {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
    }

    .references-list {
        max-height: 60vh;
        overflow-y: auto;
        padding-left: 1.25rem;
    }

    .references-list li {
        margin-bottom: 0.75rem;
    }

    .references-list small {
        display: block;
        overflow-wrap: anywhere;
    }
    .findSpots {
        view-transition-name: findSpots;
        width: 100%;
    }

    .pageTitle {
        view-transition-name: pageTitle;
        margin-bottom: 0px;
    }

</style>
