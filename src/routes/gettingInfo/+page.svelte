<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import {userData} from '$lib/userData';
    import {goto} from '$app/navigation';
    let name = '';
    let island = $state('');
    let beachSafety = $state(10);
    let trailLength = $state(4);    
    
    function getHawaiianIsland(lon, lat) {
        const islands = {
            Niihau: {
                minLon: -160.3,
                maxLon: -159.5,
                minLat: 21.7,
                maxLat: 22.1
            },
            Kauai: {
                minLon: -159.8,
                maxLon: -159.2,
                minLat: 21.8,
                maxLat: 22.3
            },
            Oahu: {
                minLon: -158.3,
                maxLon: -157.6,
                minLat: 21.2,
                maxLat: 21.8
            },
            Molokai: {
                minLon: -157.4,
                maxLon: -156.6,
                minLat: 21.0,
                maxLat: 21.3
            },
            Lanai: {
                minLon: -157.1,
                maxLon: -156.8,
                minLat: 20.7,
                maxLat: 21.0
            },
            Maui: {
                minLon: -156.8,
                maxLon: -155.9,
                minLat: 20.5,
                maxLat: 21.1
            },
            "Big Island": {
                minLon: -156.1,
                maxLon: -154.7,
                minLat: 18.9,
                maxLat: 20.3
            }
        };

        for (const [island, box] of Object.entries(islands)) {
            if (
                lon >= box.minLon &&
                lon <= box.maxLon &&
                lat >= box.minLat &&
                lat <= box.maxLat
            ) {
                return island;
            }
        }

        return null;
    }

    function showPosition(position) {
        userData.update((current) => ({
            ...current,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }));

    }

    async function showError() {
        const res = await fetch("https://ipapi.co/json/");
        const location = await res.json();

        userData.update((current) => ({
            ...current,
            lat: location.latitude,
            lon: location.longitude,
        }));
    }
    
    async function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            const res = await fetch("https://ipapi.co/json/");
            const location = await res.json();

            userData.update((current) => ({
                ...current,
                lat: location.latitude,
                lon: location.longitude,
            }));
        }
    }

    async function getIsland() {
        await getLocation()
        island = getHawaiianIsland($userData.lon, $userData.lat)
        console.log(island)
    }

    // Function to handle form submission
    function handleSubmit() {
        const userInfo = [
            name,
            island,
            beachSafety,
            trailLength
        ];

        for (let i = 0; i < userInfo.length; i++) {
            if (userInfo[i] === '' || userInfo[i] === null || userInfo[i] === undefined) {
                alert('Please fill out all fields before submitting.');
                return;
            }
        }
        userData.update((current) => ({
            ...current,
            name: userInfo[0],
            island: userInfo[1],
            swimSafety: userInfo[2],
            distance: userInfo[3]
        }));
        goto("/");

        // You can send this data to a server or store it as needed
    }

    let container;
    
    
    onMount(() => {
        const boxes = document.querySelectorAll('.question-input');
        console.log(boxes);

        boxes.forEach((element) => {
            element.addEventListener('submit', () => scrollNext());
        });
        getIsland()

    });


    function scrollNext() {
        if (container) {
            container.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    }

    function getSafety(value) {
        if (value < 6) {
            return "not safe / only surfing"
        } else if (value < 7) {
            return "teenagers should be fine"
        } else {
            return "my baby cousin can swim here"
        }
    }
</script>


<main id="main" bind:this={container}>
    <div class="title">
        <h1>
            hey cutie !
        </h1>
        <h2>lets get to know you</h2>
    </div>

    <div class="question">
        <h3>what is your name ?</h3>
        <form action="" class="question-input">
            <input type="text" placeholder="your name" class="question-box" bind:value={name}/>
            <button type="submit" onclick={scrollNext}>
                <h3>next</h3>
            </button>
        </form>
    </div>

    <div class="question">
        <h3>what island are you on ?</h3>
        <form action="" class="question-input">
            <select class="question-box"  bind:value={island}>

                <option value="">Select your island</option>
                <option value="Big Island">Big Island</option>
                <option value="Maui">Maui</option>
                <option value="Molokai">Molokai</option>
                <option value="Lanai">Lanai</option>
                <option value="Oahu">Oahu</option>
                <option value="Kauai">Kauai</option>

            </select>
            <button type="submit" onclick={scrollNext}>
                <h3>next</h3>
            </button>
        </form>

    </div>

    <div class="question">
        <h3>from 0 - 10 how safe do u want beaches ?</h3>
        <form action="" class="question-input">

            <input type="range" placeholder="your rating" class="question-box" min=0 max=10 bind:value={beachSafety}/>
            <h3>{beachSafety}</h3>
            <h3>{getSafety(beachSafety)}</h3>

            <button type="submit" onclick={scrollNext}>
                <h3>next</h3>
            </button>
        </form>
    </div>

    <div class="question">
        <h3>what would be the max trail length for you be ?</h3>
        <form action="" class="question-input">
            <input type="range" placeholder="your rating" class="question-box" min=0 max=7 bind:value={trailLength}/>
            <h3>
                {trailLength}
                {#if trailLength < 1}
                mile

                {/if}
                
                {#if trailLength < 7 && trailLength > 1}
                    miles
                {/if}

                {#if trailLength == 7}
                    + miles
                {/if}
            </h3>
            <button type="submit" onclick={scrollNext}>
                <h3>next</h3>
            </button>
        </form>
    </div>

    <div class="question">
        <button  onclick={handleSubmit}>
            <h1>get started !</h1>
        </button>

    </div>

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        overflow-y: auto;
        flex-shrink: 0;
        height: 94vh;
        gap: 2rem;
        scroll-snap-type: y mandatory; /* Enforces snapping on the Y-axis */
        scroll-behavior: smooth; /* Adds smooth scrolling effect    */  
    }

    h1 {
        font-size: 3rem;
    }

    h2 {
        font-size: 2rem;
    }

    .title {
        text-align: center;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: sticky;
        scroll-snap-align: start; /* Snaps the top of the div to the top of the container */
    }

    .question {
        text-align: center;
        margin-top: 2rem;
        height: 100%;
        width: 100%;
        flex-shrink: 0;
        padding: 0 1rem;
        justify-content: center;
        align-content: center;
        scroll-snap-align: start; /* Snaps the top of the div to the top of the container */

    }

    .question-input {
        max-width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    .question-input button {
        width: 25%;
        height: 3rem;
        display: inline-flex;
        justify-content: center; /* Centers text horizontally */
        align-items: center;     /* Centers text vertically */    
        padding-top: 1.5rem
    }

    .question-box {
        max-width: 50%;
        padding: 1rem;
        font-size: 1rem;
    }

</style>