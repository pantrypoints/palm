<script>
  import {
    Hand, User, Calendar, Briefcase, Users,
    HelpCircle, MessageCircle, Sparkles, LogOut,
    Star, Clock, Shield, ChevronDown, ChevronUp
  } from 'lucide-svelte';

  let { data } = $props();
  const profile = $derived(data.profile);
  const questions = $derived(data.questions);

  let expandedQ = $state(new Set());

  function toggleQ(id) {
    const next = new Set(expandedQ);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    expandedQ = next;
  }

  function genderLabel(g) {
    const map = { male: 'Male', female: 'Female', nonbinary: 'Non-binary', other: 'Other' };
    return map[g] ?? g;
  }

  function handedLabel(h) {
    const map = { r: 'Right-handed', l: 'Left-handed', a: 'Ambidextrous' };
    return map[h] ?? 'Not specified';
  }

  function formatDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const joinDate = $derived(profile.dateCreated
    ? new Date(profile.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null);

  const answeredCount = $derived(questions.filter(q => q.answers.length > 0).length);
</script>

<svelte:head>
  <title>{profile.username}'s Profile — Pantrypoints Palm</title>
</svelte:head>

<div class="profile-page">
  <div class="profile-hero">
    <div class="orb po1"></div>
    <div class="orb po2"></div>
    <div class="container profile-hero-inner">
      <div class="profile-avatar">
        {#if profile.avatar}
          <img src={profile.avatar} alt={profile.username} />
        {:else}
          <div class="avatar-placeholder">
            <User size={36} strokeWidth={1.5} />
          </div>
        {/if}
      </div>
      <div class="profile-hero-info">
        <h1>{profile.username}</h1>
        <div class="profile-meta">
          {#if profile.job}
            <span class="meta-item">
              <Briefcase size={14} />
              {profile.job}
            </span>
          {/if}
          {#if profile.gender}
            <span class="meta-item">
              <Users size={14} />
              {genderLabel(profile.gender)}
            </span>
          {/if}
          {#if joinDate}
            <span class="meta-item">
              <Clock size={14} />
              Member since {joinDate}
            </span>
          {/if}
        </div>
        <div class="profile-badges">
          {#if profile.kind === 'admin'}
            <span class="badge badge-admin">
              <Shield size={12} />
              Admin
            </span>
          {/if}
          <span class="badge">
            <Star size={12} />
            Palm Reader
          </span>
          {#if answeredCount > 0}
            <span class="badge badge-answered">
              <Sparkles size={12} />
              {answeredCount} reading{answeredCount !== 1 ? 's' : ''} received
            </span>
          {/if}
        </div>
      </div>

      <form method="POST" action="/logout" class="logout-form">
        <button type="submit" class="btn-outline logout-btn">
          <LogOut size={16} />
          Sign Out
        </button>
      </form>
    </div>
  </div>

  <div class="container profile-body">
    <div class="profile-grid">

      <!-- Left Column: Personal details + Palm photos -->
      <div class="profile-sidebar">
        <div class="card sidebar-card">
          <h3 class="card-title">
            <User size={16} />
            Personal Details
          </h3>
          <dl class="detail-list">
            {#if profile.dateOfBirth}
              <div class="detail-row">
                <dt>
                  <Calendar size={14} />
                  Birthday
                </dt>
                <dd>{formatDate(profile.dateOfBirth)}</dd>
              </div>
            {/if}
            {#if profile.gender}
              <div class="detail-row">
                <dt>
                  <Users size={14} />
                  Gender
                </dt>
                <dd>{genderLabel(profile.gender)}</dd>
              </div>
            {/if}
            {#if profile.job}
              <div class="detail-row">
                <dt>
                  <Briefcase size={14} />
                  Occupation
                </dt>
                <dd>{profile.job}</dd>
              </div>
            {/if}
            {#if profile.handed}
              <div class="detail-row">
                <dt>
                  <Hand size={14} />
                  Dominant Hand
                </dt>
                <dd>{handedLabel(profile.handed)}</dd>
              </div>
            {/if}
          </dl>
        </div>

        <div class="card sidebar-card palms-card">
          <h3 class="card-title">
            <Hand size={16} />
            Your Palms
          </h3>

          <div class="palm-pair">
            <div class="palm-item">
              <span class="palm-label">Left Palm</span>
              {#if profile.leftPalmUrl}
                <img
                  src={profile.leftPalmUrl}
                  alt="Left palm"
                  class="palm-img"
                  onerror={(e) => e.currentTarget.style.display = 'none'}
                />
              {:else}
                <div class="palm-placeholder">
                  <Hand size={28} strokeWidth={1.5} />
                  <span>No photo</span>
                </div>
              {/if}
            </div>

            <div class="palm-item">
              <span class="palm-label">Right Palm</span>
              {#if profile.rightPalmUrl}
                <img
                  src={profile.rightPalmUrl}
                  alt="Right palm"
                  class="palm-img"
                  onerror={(e) => e.currentTarget.style.display = 'none'}
                />
              {:else}
                <div class="palm-placeholder">
                  <Hand size={28} strokeWidth={1.5} />
                  <span>No photo</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Questions & Answers -->
      <div class="profile-main">
        <h2 class="section-heading">
          <HelpCircle size={20} />
          Your Questions & Readings
        </h2>

        {#if questions.length === 0}
          <div class="empty-state card">
            <Sparkles size={40} strokeWidth={1.5} />
            <h3>No questions yet</h3>
            <p>You haven't submitted any questions. Your palm reading answers will appear here once a palmist responds.</p>
          </div>
        {:else}
          <div class="questions-list">
            {#each questions as q (q.id)}
              <div class="question-card card" class:has-answer={q.answers.length > 0}>
                <div
                  class="question-header"
                  role="button"
                  tabindex="0"
                  onclick={() => toggleQ(q.id)}
                  onkeydown={(e) => e.key === 'Enter' && toggleQ(q.id)}
                >
                  <div class="question-meta">
                    <HelpCircle size={16} />
                    <span class="question-text">{q.content}</span>
                  </div>
                  <div class="question-right">
                    {#if q.answers.length > 0}
                      <span class="badge badge-answered">
                        <MessageCircle size={11} />
                        {q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}
                      </span>
                    {:else}
                      <span class="badge badge-pending">
                        <Clock size={11} />
                        Pending
                      </span>
                    {/if}
                    {#if expandedQ.has(q.id)}
                      <ChevronUp size={16} />
                    {:else}
                      <ChevronDown size={16} />
                    {/if}
                  </div>
                </div>

                {#if expandedQ.has(q.id)}
                  <div class="answers-section">
                    {#if q.answers.length === 0}
                      <div class="no-answer">
                        <Sparkles size={18} strokeWidth={1.5} />
                        <p>Your reading for this question is being prepared. Check back soon!</p>
                      </div>
                    {:else}
                      {#each q.answers as ans (ans.id)}
                        <div class="answer-block">
                          <div class="answer-header">
                            <Sparkles size={15} />
                            <span>Palm Reading</span>
                            {#if ans.dateCreated}
                              <span class="answer-date">{formatDate(ans.dateCreated)}</span>
                            {/if}
                          </div>
                          <p class="answer-content">{ans.content}</p>
                        </div>
                      {/each}
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .profile-page {
    padding-bottom: 4rem;
  }

  .profile-hero {
    background: linear-gradient(135deg, var(--pink-50), var(--rose-light));
    border-bottom: 1px solid var(--border);
    padding: 3rem 0;
    position: relative;
    overflow: hidden;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.3;
    pointer-events: none;
  }

  .po1 {
    width: 400px;
    height: 400px;
    background: var(--pink-300);
    top: -150px;
    right: -100px;
  }

  .po2 {
    width: 300px;
    height: 300px;
    background: var(--pink-200);
    bottom: -100px;
    left: 10%;
  }

  .profile-hero-inner {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .profile-avatar {
    flex-shrink: 0;
  }

  .profile-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: var(--shadow);
  }

  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--pink-200), var(--pink-300));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pink-700);
    border: 4px solid white;
    box-shadow: var(--shadow);
  }

  .profile-hero-info {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .profile-hero-info h1 {
    font-size: 1.8rem;
    color: var(--text-dark);
  }

  .profile-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--text-mid);
    font-size: 0.875rem;
  }

  .meta-item :global(svg) {
    color: var(--pink-400);
  }

  .profile-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge-admin {
    background: #fff3e0;
    color: #b45309;
    border: 1px solid #fcd34d;
  }

  .badge-answered {
    background: #f0fff4;
    color: #1a7a3c;
    border: 1px solid #b2f0c5;
  }

  .badge-pending {
    background: var(--pink-50);
    color: var(--text-light);
    border: 1px solid var(--border);
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    font-size: 0.78rem;
  }

  .logout-form {
    margin-left: auto;
  }

  .logout-btn {
    align-self: flex-start;
  }

  .profile-body {
    margin-top: 2.5rem;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    align-items: start;
  }

  .profile-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 5rem;
  }

  .sidebar-card {
    padding: 1.5rem;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-dark);
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .card-title :global(svg) {
    color: var(--pink-500);
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .detail-row dt {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .detail-row dt :global(svg) {
    color: var(--pink-400);
  }

  .detail-row dd {
    font-size: 0.92rem;
    color: var(--text-dark);
    padding-left: 1.3rem;
  }

  .palms-card {
    /* extra padding handled in card */
  }

  .palm-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .palm-item {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .palm-label {
    font-size: 0.78rem;
    color: var(--text-light);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .palm-img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    display: block;
  }

  /* Main section */
  .profile-main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.2rem;
    color: var(--text-dark);
  }

  .section-heading :global(svg) {
    color: var(--pink-500);
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .empty-state :global(svg) {
    color: var(--pink-300);
  }

  .empty-state h3 {
    font-size: 1.1rem;
    color: var(--text-dark);
  }

  .empty-state p {
    color: var(--text-light);
    font-size: 0.9rem;
    max-width: 380px;
    line-height: 1.6;
  }

  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .question-card {
    padding: 0;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .question-card.has-answer {
    border-color: #b2f0c5;
  }

  .question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    gap: 1rem;
    transition: background 0.15s;
  }

  .question-header:hover {
    background: var(--pink-50);
  }

  .question-meta {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    flex: 1;
  }

  .question-meta :global(svg) {
    color: var(--pink-400);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .question-text {
    color: var(--text-dark);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .question-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .question-right :global(svg:last-child) {
    color: var(--text-light);
  }

  .answers-section {
    border-top: 1px solid var(--border);
    background: var(--pink-50);
  }

  .no-answer {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-light);
    font-size: 0.875rem;
  }

  .no-answer :global(svg) {
    color: var(--pink-300);
    flex-shrink: 0;
  }

  .answer-block {
    padding: 1.5rem;
    border-top: 1px dashed var(--pink-200);
  }

  .answer-block:first-child {
    border-top: none;
  }

  .answer-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.82rem;
    color: var(--pink-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .answer-header :global(svg) {
    color: var(--pink-500);
  }

  .answer-date {
    margin-left: auto;
    color: var(--text-light);
    font-size: 0.78rem;
    text-transform: none;
    letter-spacing: 0;
  }

  .answer-content {
    color: var(--text-dark);
    font-size: 0.95rem;
    line-height: 1.75;
  }

  @media (max-width: 900px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
    .profile-sidebar {
      position: static;
    }
    .palm-pair {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 560px) {
    .profile-hero-inner {
      flex-direction: column;
      align-items: flex-start;
    }
    .logout-form {
      margin-left: 0;
    }
  }
</style>
