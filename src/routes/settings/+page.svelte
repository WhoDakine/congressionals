<script>
    import { userData } from "$lib/userData";

    function updatePreference(preference, event) {
        const value = Number(event.currentTarget.value);
        userData.update((current) => ({
            ...current,
            [preference]: value,
        }));
    }
</script>

<main>
    <div class="header">
        <h1 class="pageTitle">Settings</h1>
        <small>View & Edit Your Preferences</small>
    </div>
    <article>
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
    </article>

</main>

<style>
    main {
        display: flex;
        padding: 20px;
        flex-direction: column;
        padding-top: 40px;
        gap: 1rem;
    }
    article {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 520px;
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
    .findSpots {
        view-transition-name: findSpots;
        width: 100%;
    }

    .pageTitle {
        view-transition-name: pageTitle;
        margin-bottom: 0px;
    }

</style>
