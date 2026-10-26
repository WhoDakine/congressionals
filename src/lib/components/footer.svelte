<script>
    import { page } from '$app/state';
</script>

<div class="bottom-nav">
    <nav>
        <a href="/" aria-label="Home" id="home" class:active={page.url.pathname === '/'} aria-current={page.url.pathname === '/' ? 'page' : undefined}>
            <i class="fa-solid fa-house"></i>
        </a>

        <a href="/search" aria-label="Search" id="search" class:active={page.url.pathname === '/search'} aria-current={page.url.pathname === '/search' ? 'page' : undefined}>
            <i class="fa-solid fa-magnifying-glass"></i>
        </a>
        <a href="/suggestion" aria-label="Suggestion" id="suggestion" class:active={page.url.pathname === '/suggestion'} aria-current={page.url.pathname === '/suggestion' ? 'page' : undefined}>
            <i class="fa-solid fa-question"></i>
        </a>

        <a href="/favorites" aria-label="Favorites" id="favorites" class:active={page.url.pathname === '/favorites'} aria-current={page.url.pathname === '/favorites' ? 'page' : undefined}>
            <i class="fa-regular fa-star"></i>
        </a>
        <a href="/settings" aria-label="Settings" id="settings" class:active={page.url.pathname === '/settings'} aria-current={page.url.pathname === '/settings' ? 'page' : undefined}>
            <i class="fa-solid fa-gear"></i>        
        </a>
    </nav>
</div>

<style>

    .bottom-nav {
        position: fixed;
        bottom: 0.5rem;
        left: 0;
        width: 100%;
        padding: 0.5rem;
        margin: 0;
    }

    .bottom-nav nav {
        display: flex;
        align-items: center;
        max-width: 400px;
        margin: auto;
        gap: 0px;
        justify-content: space-evenly;
        transition: max-width 0.3s ease 0s;
        padding-left: 10px;
        padding-right: 10px;

    }

    .bottom-nav nav:hover {
        max-width: 500px;
    }
    .bottom-nav nav:not(:hover) {
        max-width: 400px;
        transition-delay: 0.1s;
    }

    .bottom-nav a {
        font-size: 1.5rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .bottom-nav a::after {
        content: '';
        width: 16px;
        height: 2px;
        border-radius: 1px;
        background: transparent;
    }

    .bottom-nav a.active::after {
        background: currentColor;
    }
    a {
        color: black;
    }
    nav {
        background-color: var(--footer-background-color);
        border-radius: 20px;
    }
    #suggestion i {
        font-size: 1.2em;
    }
</style>
