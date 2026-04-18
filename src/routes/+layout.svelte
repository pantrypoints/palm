<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { Hand, LogIn, LogOut, User, Facebook } from 'lucide-svelte';

  let { data, children } = $props();

  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<svelte:head>
  <title>Pantrypoints Palm</title>
</svelte:head>

<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="logo">
      <img src="/palm.png" alt="Palm icon" class="" style="width: 35px" />
      <span>Pantrypoints<strong>Palm</strong></span>
    </a>

    <nav class="nav-links" class:open={menuOpen}>
      <a href="/" onclick={() => menuOpen = false}>Home</a>
      {#if data.user}
        <a href="/profile" onclick={() => menuOpen = false}>My Profile</a>
        {#if data.user.kind === 'admin'}
          <a href="/admin" onclick={() => menuOpen = false}>Admin</a>
        {/if}
        <form method="POST" action="/logout" style="display:contents">
          <button type="submit" class="nav-btn">
            <LogOut size={16} />
            Logout
          </button>
        </form>
      {:else}
        <a href="/login" onclick={() => menuOpen = false}>Login</a>
        <a href="/#register" class="btn-primary" style="padding:0.5rem 1.2rem;font-size:0.9rem" onclick={() => menuOpen = false}>
          <User size={15} />
          Register
        </a>
      {/if}
    </nav>

    <button class="hamburger" onclick={toggleMenu} aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<main class="main-content">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <Hand size={22} strokeWidth={2} />
      <span>Pantrypoints<strong>Palm</strong></span>
      <p>Reveal the story written in your hands.</p>
    </div>

    <div class="footer-links">
      <h4>Follow Us</h4>
      <a href="https://www.facebook.com/pantrypalm/" target="_blank" rel="noopener noreferrer" class="social-link">
        <Facebook size={18} />
        Facebook
      </a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© {new Date().getFullYear()} Pantrypoints Palm. All rights reserved.</p>
  </div>
</footer>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 248, 251, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    gap: 1rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    color: var(--text-dark);
    text-decoration: none;
    flex-shrink: 0;
  }

  .logo :global(svg) {
    color: var(--pink-500);
  }

  .logo strong {
    color: var(--pink-500);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-links a {
    color: var(--text-mid);
    font-size: 0.95rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover {
    color: var(--pink-500);
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: none;
    border: none;
    color: var(--text-mid);
    font-size: 0.95rem;
    cursor: pointer;
    font-family: var(--font);
    transition: color 0.2s;
  }
  .nav-btn:hover {
    color: var(--pink-500);
  }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--pink-500);
    border-radius: 2px;
    transition: all 0.2s;
  }

  .main-content {
    flex: 1;
  }

  .site-footer {
    background: var(--text-dark);
    color: #ffd6e8;
    padding: 3rem 0 0;
    margin-top: auto;
  }

  .footer-inner {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
    padding-bottom: 2rem;
  }

  .footer-brand {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-brand :global(svg) {
    color: var(--pink-300);
  }

  .footer-brand span {
    font-size: 1.1rem;
    color: #fff;
  }

  .footer-brand strong {
    color: var(--pink-300);
  }

  .footer-brand p {
    font-size: 0.875rem;
    color: #c4879e;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-links h4 {
    color: #fff;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #c4879e;
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .social-link:hover {
    color: var(--pink-300);
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 214, 232, 0.15);
    padding: 1rem 0;
    text-align: center;
  }

  .footer-bottom p {
    color: #7a4c5e;
    font-size: 0.8rem;
  }

  @media (max-width: 640px) {
    .hamburger {
      display: flex;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 1.5rem;
      gap: 1rem;
      align-items: flex-start;
    }

    .nav-links.open {
      display: flex;
    }
  }
</style>
