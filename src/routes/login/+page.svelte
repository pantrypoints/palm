<script>
  import { enhance } from '$app/forms';
  import { Hand, User, Lock, Eye, EyeOff, LogIn } from 'lucide-svelte';

  let { form } = $props();
  let showPass = $state(false);
  let loading = $state(false);
</script>

<svelte:head>
  <title>Sign In — Pantrypoints Palm</title>
</svelte:head>

<div class="login-page">
  <div class="login-bg">
    <div class="bg-orb orb-a"></div>
    <div class="bg-orb orb-b"></div>
  </div>

  <div class="login-card card">
    <div class="login-header">
      <div class="login-icon">
        <Hand size={32} strokeWidth={1.5} />
      </div>
      <h1>Welcome Back</h1>
      <p>Sign in to view your palm reading</p>
    </div>

    {#if form?.error}
      <div class="alert alert-error">
        <span>{form.error}</span>
      </div>
    {/if}

    <form method="POST" use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        loading = false;
        await update();
      };
    }}>
      <div class="form-group">
        <label for="username">
          <User size={14} />
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="your_username"
          value={form?.username || ''}
          required
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="password">
          <Lock size={14} />
          Password
        </label>
        <div class="input-wrap">
          <input
            id="password"
            name="password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
          <button type="button" class="eye-btn" onclick={() => showPass = !showPass} aria-label="Toggle password">
            {#if showPass}
              <EyeOff size={16} />
            {:else}
              <Eye size={16} />
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="btn-primary submit-btn" disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
          Signing in...
        {:else}
          <LogIn size={18} />
          Sign In
        {/if}
      </button>
    </form>

    <p class="register-link">
      New here? <a href="/#register">Create your profile</a>
    </p>
  </div>
</div>

<style>
  .login-page {
    min-height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .login-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.25;
  }

  .orb-a {
    width: 500px;
    height: 500px;
    background: var(--pink-300);
    top: -150px;
    right: -150px;
  }

  .orb-b {
    width: 400px;
    height: 400px;
    background: var(--pink-200);
    bottom: -100px;
    left: -100px;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .login-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--pink-100), var(--pink-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pink-600);
    border: 2px solid var(--pink-200);
  }

  .login-header h1 {
    font-size: 1.6rem;
    color: var(--text-dark);
  }

  .login-header p {
    color: var(--text-light);
    font-size: 0.9rem;
  }

  .input-wrap {
    position: relative;
  }

  .input-wrap input {
    padding-right: 2.5rem;
  }

  .eye-btn {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-light);
    display: flex;
    padding: 0;
    transition: color 0.2s;
  }
  .eye-btn:hover {
    color: var(--pink-500);
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .register-link {
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-light);
    margin-top: 1.25rem;
  }
</style>
