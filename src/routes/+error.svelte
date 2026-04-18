<script>
  import { Hand } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Page Not Found — Pantrypoints Palm</title>
</svelte:head>

<div class="not-found">
  <div class="nf-icon">
    <Hand size={48} strokeWidth={1} />
  </div>
  <h1>404</h1>
  <p>The page you're looking for isn't written in the lines.</p>
  <a href="/" class="btn-primary">Back to Home</a>
</div>

<style>
  .not-found {
    min-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    padding: 2rem;
  }

  .nf-icon {
    color: var(--pink-300);
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 5rem;
    color: var(--pink-400);
    line-height: 1;
  }

  p {
    color: var(--text-light);
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
</style>
