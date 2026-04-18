<script>
  import { enhance } from '$app/forms';
  import {
    Hand, Image, User, Lock, Eye, EyeOff, Calendar,
    Users, Briefcase, HelpCircle, ChevronRight, Sparkles,
    Shield, Star, Moon
  } from 'lucide-svelte';

  let { form } = $props();

  let showPass = $state(false);
  let showPassConfirm = $state(false);

  let leftPreviewOverride = $state('');
  let rightPreviewOverride = $state('');
  let leftPreview = $derived(leftPreviewOverride || form?.values?.leftPalmUrl || '');
  let rightPreview = $derived(rightPreviewOverride || form?.values?.rightPalmUrl || '');

  let leftError = $state(false);
  let rightError = $state(false);

  let loading = $state(false);

  function onLeftInput(e) {
    leftPreviewOverride = e.target.value;
    leftError = false;
  }
  function onRightInput(e) {
    rightPreviewOverride = e.target.value;
    rightError = false;
  }
</script>

<svelte:head>
  <title>Pantrypoints Palm — Read Your Destiny</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="hero-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="lines">
      {#each Array(6) as _, i}
        <div class="line" style="--i:{i}"></div>
      {/each}
    </div>
  </div>

  <div class="container hero-content">
    <div class="hero-badge">
      <Sparkles size={14} />
      Ancient wisdom, modern insight
    </div>
    <h1 class="hero-title">
      The Story of Your Life
      <span class="highlight">Is In Your Hands</span>
    </h1>
    <p class="hero-desc">
      Upload photos of your palms and receive a personalized reading guided by centuries of palmistry wisdom. Discover what your life lines reveal about your past, present, and future.
    </p>
    <div class="hero-cta">
      <a href="#register" class="btn-primary">
        <Hand size={18} />
        Get Your Reading
      </a>
      <a href="/login" class="btn-outline">
        Sign In
        <ChevronRight size={16} />
      </a>
    </div>

    <div class="hero-stats">
      <div class="stat">
        <Star size={16} />
        <span>Ancient art</span>
      </div>
      <div class="stat">
        <Shield size={16} />
        <span>Private & secure</span>
      </div>
      <div class="stat">
        <Moon size={16} />
        <span>Personalized insights</span>
      </div>
    </div>
  </div>
</section>

<!-- How it works -->
<section class="how-it-works">
  <div class="container">
    <h2 class="section-title">How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-icon"><Image size={28} /></div>
        <h3>Upload Your Palms</h3>
        <p>Share image URLs of both your left and right palms for a complete reading.</p>
      </div>
      <div class="step-arrow"><ChevronRight size={24} /></div>
      <div class="step">
        <div class="step-icon"><HelpCircle size={28} /></div>
        <h3>Ask Your Questions</h3>
        <p>Share up to three questions you seek answers to about your life's journey.</p>
      </div>
      <div class="step-arrow"><ChevronRight size={24} /></div>
      <div class="step">
        <div class="step-icon"><Sparkles size={28} /></div>
        <h3>Receive Insights</h3>
        <p>Our palmist will analyze your lines and provide personalized readings.</p>
      </div>
    </div>
  </div>
</section>

<!-- Registration Form -->
<section class="register-section" id="register">
  <div class="container">
    <div class="register-grid">
      <div class="register-intro">
        <h2>Begin Your Journey</h2>
        <p>
          Create your profile and upload palm photos to start your personalized reading. Both palms are required for a complete analysis.
        </p>
        <div class="palm-tip">
          <Hand size={20} />
          <div>
            <strong>Photography Tips</strong>
            <ul>
              <li>Use good, even lighting</li>
              <li>Open palm fully, fingers together</li>
              <li>Keep camera directly above</li>
              <li>Use a plain, light background</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="card register-card">
        {#if form?.errors && !Object.values(form.errors).some(Boolean)}
          <!-- no global error -->
        {/if}

        <form method="POST" action="?/register" use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            await update();
          };
        }}>
          <h3 class="form-section-title">
            <Image size={18} />
            Palm Photos
          </h3>

          <!-- Palm URLs -->
          <div class="palm-inputs">
            <div class="palm-field">
              <div class="form-group">
                <label for="leftPalmUrl">
                  Left Palm URL
                  <span class="required">*required</span>
                </label>
                <input
                  id="leftPalmUrl"
                  name="leftPalmUrl"
                  type="url"
                  placeholder="https://example.com/left-palm.jpg"
                  value={form?.values?.leftPalmUrl || ''}
                  oninput={onLeftInput}
                  class:has-error={form?.errors?.leftPalmUrl}
                  required
                />
                {#if form?.errors?.leftPalmUrl}
                  <span class="error-msg">{form.errors.leftPalmUrl}</span>
                {/if}
              </div>
              {#if leftPreview && !leftError}
                <img
                  src={leftPreview}
                  alt="Left palm preview"
                  class="palm-preview"
                  onerror={() => leftError = true}
                />
              {:else}
                <div class="palm-placeholder">
                  <Hand size={32} strokeWidth={1.5} />
                  <span>Left Palm Preview</span>
                </div>
              {/if}
            </div>

            <div class="palm-field">
              <div class="form-group">
                <label for="rightPalmUrl">
                  Right Palm URL
                  <span class="required">*required</span>
                </label>
                <input
                  id="rightPalmUrl"
                  name="rightPalmUrl"
                  type="url"
                  placeholder="https://example.com/right-palm.jpg"
                  value={form?.values?.rightPalmUrl || ''}
                  oninput={onRightInput}
                  class:has-error={form?.errors?.rightPalmUrl}
                  required
                />
                {#if form?.errors?.rightPalmUrl}
                  <span class="error-msg">{form.errors.rightPalmUrl}</span>
                {/if}
              </div>
              {#if rightPreview && !rightError}
                <img
                  src={rightPreview}
                  alt="Right palm preview"
                  class="palm-preview"
                  onerror={() => rightError = true}
                />
              {:else}
                <div class="palm-placeholder">
                  <Hand size={32} strokeWidth={1.5} />
                  <span>Right Palm Preview</span>
                </div>
              {/if}
            </div>
          </div>

          <hr class="divider" />

          <h3 class="form-section-title">
            <User size={18} />
            Account Details
          </h3>

          <div class="form-group">
            <label for="username">
              Username
              <span class="required">*required</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="your_username"
              value={form?.values?.username || ''}
              class:has-error={form?.errors?.username}
              required
            />
            {#if form?.errors?.username}
              <span class="error-msg">{form.errors.username}</span>
            {/if}
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">
                Password
                <span class="required">*required</span>
              </label>
              <div class="input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  class:has-error={form?.errors?.password}
                  required
                />
                <button type="button" class="eye-btn" onclick={() => showPass = !showPass} aria-label="Toggle password">
                  {#if showPass}
                    <EyeOff size={16} />
                  {:else}
                    <Eye size={16} />
                  {/if}
                </button>
              </div>
              {#if form?.errors?.password}
                <span class="error-msg">{form.errors.password}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="passwordConfirm">
                Confirm Password
                <span class="required">*required</span>
              </label>
              <div class="input-wrap">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  class:has-error={form?.errors?.passwordConfirm}
                  required
                />
                <button type="button" class="eye-btn" onclick={() => showPassConfirm = !showPassConfirm} aria-label="Toggle password confirm">
                  {#if showPassConfirm}
                    <EyeOff size={16} />
                  {:else}
                    <Eye size={16} />
                  {/if}
                </button>
              </div>
              {#if form?.errors?.passwordConfirm}
                <span class="error-msg">{form.errors.passwordConfirm}</span>
              {/if}
            </div>
          </div>

          <hr class="divider" />

          <h3 class="form-section-title">
            <Users size={18} />
            Personal Details <span class="optional-note">(optional)</span>
          </h3>

          <div class="form-row">
            <div class="form-group">
              <label for="dateOfBirth">
                <Calendar size={14} />
                Birthday
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form?.values?.dateOfBirth || ''}
              />
            </div>

            <div class="form-group">
              <label for="gender">
                <Users size={14} />
                Gender
                <span class="required">*required</span>
              </label>
              <select id="gender" name="gender" class:has-error={form?.errors?.gender} required>
                <option value="" disabled selected={!form?.values?.gender}>Select gender</option>
                <option value="male" selected={form?.values?.gender === 'male'}>Male</option>
                <option value="female" selected={form?.values?.gender === 'female'}>Female</option>
                <option value="nonbinary" selected={form?.values?.gender === 'nonbinary'}>Non-binary</option>
                <option value="other" selected={form?.values?.gender === 'other'}>Other / Prefer not to say</option>
              </select>
              {#if form?.errors?.gender}
                <span class="error-msg">{form.errors.gender}</span>
              {/if}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="job">
                <Briefcase size={14} />
                Occupation
              </label>
              <input
                id="job"
                name="job"
                type="text"
                placeholder="e.g. Teacher, Engineer..."
                value={form?.values?.job || ''}
              />
            </div>

            <div class="form-group">
              <label for="handed">
                <Hand size={14} />
                Dominant Hand
              </label>
              <select id="handed" name="handed">
                <option value="" selected={!form?.values?.handed}>Not specified</option>
                <option value="r" selected={form?.values?.handed === 'r'}>Right-handed</option>
                <option value="l" selected={form?.values?.handed === 'l'}>Left-handed</option>
                <option value="a" selected={form?.values?.handed === 'a'}>Ambidextrous</option>
              </select>
            </div>
          </div>

          <hr class="divider" />

          <h3 class="form-section-title">
            <HelpCircle size={18} />
            Your Questions <span class="optional-note">(optional)</span>
          </h3>
          <p class="form-hint">Ask up to 3 questions you'd like your palm reading to address.</p>

          <div class="form-group">
            <label for="q1">Question 1</label>
            <input
              id="q1"
              name="q1"
              type="text"
              placeholder="e.g. What does my career line say about my future?"
              value={form?.values?.q1 || ''}
            />
          </div>

          <div class="form-group">
            <label for="q2">Question 2</label>
            <input
              id="q2"
              name="q2"
              type="text"
              placeholder="e.g. Will I find lasting love?"
              value={form?.values?.q2 || ''}
            />
          </div>

          <div class="form-group">
            <label for="q3">Question 3</label>
            <input
              id="q3"
              name="q3"
              type="text"
              placeholder="e.g. What should I be aware of in the next year?"
              value={form?.values?.q3 || ''}
            />
          </div>

          <button type="submit" class="btn-primary submit-btn" disabled={loading}>
            {#if loading}
              <span class="spinner"></span>
              Creating profile...
            {:else}
              <Sparkles size={18} />
              Create Profile & Begin Reading
            {/if}
          </button>

          <p class="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== HERO ===== */
  .hero {
    position: relative;
    overflow: hidden;
    padding: 6rem 0 5rem;
    min-height: 85vh;
    display: flex;
    align-items: center;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
  }
  .orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--pink-300), transparent);
    top: -200px;
    right: -200px;
    animation: float 8s ease-in-out infinite;
  }
  .orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--pink-200), transparent);
    bottom: -100px;
    left: -100px;
    animation: float 10s ease-in-out infinite reverse;
  }
  .orb-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #ffd6e8, transparent);
    top: 50%;
    left: 40%;
    animation: float 12s ease-in-out infinite 2s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }

  .lines {
    position: absolute;
    inset: 0;
  }
  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--pink-200), transparent);
    opacity: 0.3;
    left: calc(var(--i) * 16.66%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    max-width: 650px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--pink-100);
    color: var(--pink-700);
    padding: 0.35rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    border: 1px solid var(--pink-200);
  }

  .hero-title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    line-height: 1.2;
    color: var(--text-dark);
  }

  .hero-title .highlight {
    display: block;
    background: linear-gradient(135deg, var(--pink-500), var(--pink-700));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 1.1rem;
    color: var(--text-mid);
    line-height: 1.7;
    max-width: 520px;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hero-stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-top: 0.5rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-light);
    font-size: 0.875rem;
  }

  .stat :global(svg) {
    color: var(--pink-400);
  }

  /* ===== HOW IT WORKS ===== */
  .how-it-works {
    background: var(--surface-2);
    padding: 5rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .section-title {
    font-size: 1.8rem;
    text-align: center;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }

  .steps {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .step {
    flex: 1;
    min-width: 200px;
    max-width: 260px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .step-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--pink-100), var(--pink-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pink-600);
    border: 2px solid var(--pink-200);
  }

  .step h3 {
    color: var(--text-dark);
    font-size: 1.05rem;
  }

  .step p {
    color: var(--text-light);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .step-arrow {
    color: var(--pink-300);
    margin-top: 2rem;
    flex-shrink: 0;
  }

  /* ===== REGISTER ===== */
  .register-section {
    padding: 5rem 0 6rem;
  }

  .register-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    align-items: start;
  }

  .register-intro {
    position: sticky;
    top: 5rem;
  }

  .register-intro h2 {
    font-size: 1.8rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  .register-intro > p {
    color: var(--text-mid);
    line-height: 1.7;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .palm-tip {
    background: var(--pink-50);
    border: 1px solid var(--pink-200);
    border-radius: var(--radius);
    padding: 1.25rem;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .palm-tip :global(svg) {
    color: var(--pink-400);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .palm-tip strong {
    display: block;
    color: var(--text-dark);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .palm-tip ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .palm-tip ul li {
    color: var(--text-mid);
    font-size: 0.82rem;
    padding-left: 0.75rem;
    position: relative;
  }

  .palm-tip ul li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--pink-400);
  }

  .register-card {
    padding: 2.5rem;
  }

  .form-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--text-dark);
    margin-bottom: 1.25rem;
  }

  .form-section-title :global(svg) {
    color: var(--pink-500);
  }

  .optional-note {
    color: var(--text-light);
    font-size: 0.8rem;
    font-weight: 400;
  }

  .form-hint {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: -0.75rem;
    margin-bottom: 1rem;
  }

  .palm-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .palm-field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
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

  :global(.has-error) {
    border-color: var(--rose-dark) !important;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
    padding: 0.9rem;
    font-size: 1rem;
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

  .login-link {
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-light);
    margin-top: 1rem;
  }

  @media (max-width: 900px) {
    .register-grid {
      grid-template-columns: 1fr;
    }
    .register-intro {
      position: static;
    }
    .palm-inputs {
      grid-template-columns: 1fr;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .steps {
      flex-direction: column;
      align-items: center;
    }
    .step-arrow {
      transform: rotate(90deg);
      margin: 0;
    }
  }
</style>
