<script>
  import { enhance } from '$app/forms';
  import {
    Users, Hand, HelpCircle, MessageCircle,
    Sparkles, Trash2, ChevronDown, ChevronUp,
    User, Shield, Send
  } from 'lucide-svelte';

  let { data, form } = $props();

  let expandedUser = $state(new Set());
  let expandedQ = $state(new Set());
  let answerTexts = $state({});
  let submitting = $state(null);

  function toggleUser(id) {
    const next = new Set(expandedUser);
    next.has(id) ? next.delete(id) : next.add(id);
    expandedUser = next;
  }

  function toggleQ(id) {
    const next = new Set(expandedQ);
    next.has(id) ? next.delete(id) : next.add(id);
    expandedQ = next;
  }

  function genderLabel(g) {
    return { male: 'Male', female: 'Female', nonbinary: 'Non-binary', other: 'Other' }[g] ?? g;
  }

  const totalUsers = $derived(data.users.length);
  const totalQuestions = $derived(data.users.reduce((s, u) => s + u.questions.length, 0));
  const totalAnswered = $derived(data.users.reduce(
    (s, u) => s + u.questions.filter((q) => q.answers.length > 0).length, 0
  ));
  const totalPending = $derived(totalQuestions - totalAnswered);
</script>

<svelte:head>
  <title>Admin — Pantrypoints Palm</title>
</svelte:head>

<div class="admin-page">
  <div class="admin-hero">
    <div class="container">
      <div class="admin-header">
        <div class="admin-icon">
          <Shield size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users and provide palm reading responses</p>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-card">
          <Users size={20} />
          <div>
            <span class="stat-num">{totalUsers}</span>
            <span class="stat-label">Users</span>
          </div>
        </div>
        <div class="stat-card">
          <HelpCircle size={20} />
          <div>
            <span class="stat-num">{totalQuestions}</span>
            <span class="stat-label">Questions</span>
          </div>
        </div>
        <div class="stat-card stat-pending">
          <MessageCircle size={20} />
          <div>
            <span class="stat-num">{totalPending}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card stat-done">
          <Sparkles size={20} />
          <div>
            <span class="stat-num">{totalAnswered}</span>
            <span class="stat-label">Answered</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container admin-body">
    {#if form?.error}
      <div class="alert alert-error">{form.error}</div>
    {/if}
    {#if form?.success}
      <div class="alert alert-success">Action completed successfully.</div>
    {/if}

    {#if data.users.length === 0}
      <div class="empty-state card">
        <Users size={40} strokeWidth={1.5} />
        <h3>No users yet</h3>
        <p>Users who register will appear here.</p>
      </div>
    {:else}
      <div class="users-list">
        {#each data.users as u (u.id)}
          <div class="user-card card">
            <div
              class="user-header"
              role="button"
              tabindex="0"
              onclick={() => toggleUser(u.id)}
              onkeydown={(e) => e.key === 'Enter' && toggleUser(u.id)}
            >
              <div class="user-avatar">
                {#if u.avatar}
                  <img src={u.avatar} alt={u.username} />
                {:else}
                  <div class="avatar-ph">
                    <User size={20} />
                  </div>
                {/if}
              </div>
              <div class="user-info">
                <strong>{u.username}</strong>
                <div class="user-meta">
                  {#if u.gender}<span>{genderLabel(u.gender)}</span>{/if}
                  {#if u.job}<span>{u.job}</span>{/if}
                  <span>{u.questions.length} question{u.questions.length !== 1 ? 's' : ''}</span>
                  {#if u.questions.filter(q => q.answers.length > 0).length > 0}
                    <span class="answered-count">
                      {u.questions.filter(q => q.answers.length > 0).length} answered
                    </span>
                  {/if}
                </div>
              </div>
              {#if expandedUser.has(u.id)}
                <ChevronUp size={16} class="chevron" />
              {:else}
                <ChevronDown size={16} class="chevron" />
              {/if}
            </div>

            {#if expandedUser.has(u.id)}
              <div class="user-body">
                <!-- Palm photos -->
                <div class="palms-row">
                  <div class="palm-thumb">
                    <span class="thumb-label">Left Palm</span>
                    {#if u.leftPalmUrl}
                      <img src={u.leftPalmUrl} alt="Left palm" class="thumb-img" />
                    {:else}
                      <div class="thumb-ph"><Hand size={20} /></div>
                    {/if}
                  </div>
                  <div class="palm-thumb">
                    <span class="thumb-label">Right Palm</span>
                    {#if u.rightPalmUrl}
                      <img src={u.rightPalmUrl} alt="Right palm" class="thumb-img" />
                    {:else}
                      <div class="thumb-ph"><Hand size={20} /></div>
                    {/if}
                  </div>
                </div>

                <!-- Questions -->
                {#if u.questions.length === 0}
                  <p class="no-qs">This user has no questions.</p>
                {:else}
                  <div class="admin-questions">
                    {#each u.questions as q (q.id)}
                      <div class="admin-q" class:q-answered={q.answers.length > 0}>
                        <div
                          class="q-toggle"
                          role="button"
                          tabindex="0"
                          onclick={() => toggleQ(q.id)}
                          onkeydown={(e) => e.key === 'Enter' && toggleQ(q.id)}
                        >
                          <HelpCircle size={15} />
                          <span>{q.content}</span>
                          <div class="q-status">
                            {#if q.answers.length > 0}
                              <span class="badge badge-answered">
                                <MessageCircle size={11} />
                                {q.answers.length}
                              </span>
                            {:else}
                              <span class="badge-pending-sm">Pending</span>
                            {/if}
                            {#if expandedQ.has(q.id)}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
                          </div>
                        </div>

                        {#if expandedQ.has(q.id)}
                          <div class="q-body">
                            <!-- Existing answers -->
                            {#each q.answers as ans (ans.id)}
                              <div class="existing-answer">
                                <p>{ans.content}</p>
                                <form method="POST" action="?/deleteAnswer" use:enhance>
                                  <input type="hidden" name="answerId" value={ans.id} />
                                  <button type="submit" class="del-btn" aria-label="Delete answer">
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </form>
                              </div>
                            {/each}

                            <!-- Add answer form -->
                            <form
                              method="POST"
                              action="?/answer"
                              use:enhance={() => {
                                submitting = q.id;
                                return async ({ update }) => {
                                  submitting = null;
                                  answerTexts[q.id] = '';
                                  await update();
                                };
                              }}
                              class="answer-form"
                            >
                              <input type="hidden" name="qid" value={q.id} />
                              <textarea
                                name="content"
                                placeholder="Write your palm reading response..."
                                rows="4"
                                bind:value={answerTexts[q.id]}
                                required
                              ></textarea>
                              <button
                                type="submit"
                                class="btn-primary answer-submit"
                                disabled={submitting === q.id}
                              >
                                {#if submitting === q.id}
                                  <span class="spinner"></span>
                                  Saving...
                                {:else}
                                  <Send size={15} />
                                  Submit Reading
                                {/if}
                              </button>
                            </form>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-page {
    padding-bottom: 4rem;
  }

  .admin-hero {
    background: linear-gradient(135deg, var(--text-dark), var(--pink-800));
    padding: 2.5rem 0;
    color: white;
  }

  .admin-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .admin-icon {
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pink-200);
    border: 1px solid rgba(255,255,255,0.15);
  }

  .admin-header h1 {
    font-size: 1.6rem;
    color: white;
  }

  .admin-header p {
    color: var(--pink-200);
    font-size: 0.9rem;
  }

  .stats-bar {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius);
    padding: 1rem 1.5rem;
    color: white;
    flex: 1;
    min-width: 130px;
  }

  .stat-card :global(svg) {
    color: var(--pink-300);
    flex-shrink: 0;
  }

  .stat-pending :global(svg) {
    color: #fcd34d;
  }

  .stat-done :global(svg) {
    color: #6ee7b7;
  }

  .stat-num {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .admin-body {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-light);
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .user-card {
    padding: 0;
    overflow: hidden;
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .user-header:hover {
    background: var(--pink-50);
  }

  .user-avatar img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
  }

  .avatar-ph {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--pink-100);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pink-500);
    border: 2px solid var(--border);
  }

  .user-info {
    flex: 1;
  }

  .user-info strong {
    display: block;
    color: var(--text-dark);
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .user-meta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: var(--text-light);
  }

  .answered-count {
    color: #1a7a3c;
  }

  :global(.chevron) {
    color: var(--text-light);
    flex-shrink: 0;
  }

  .user-body {
    border-top: 1px solid var(--border);
    padding: 1.5rem;
    background: var(--pink-50);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .palms-row {
    display: flex;
    gap: 1rem;
  }

  .palm-thumb {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    align-items: center;
  }

  .thumb-label {
    font-size: 0.72rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .thumb-img {
    width: 100px;
    height: 130px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
  }

  .thumb-ph {
    width: 100px;
    height: 130px;
    border-radius: var(--radius-sm);
    border: 1.5px dashed var(--pink-300);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-light);
  }

  .no-qs {
    color: var(--text-light);
    font-size: 0.875rem;
    font-style: italic;
  }

  .admin-questions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .admin-q {
    background: white;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .admin-q.q-answered {
    border-color: #b2f0c5;
  }

  .q-toggle {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 1rem 1.25rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-dark);
    transition: background 0.15s;
  }

  .q-toggle:hover {
    background: var(--pink-50);
  }

  .q-toggle :global(svg:first-child) {
    color: var(--pink-400);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .q-toggle span {
    flex: 1;
    line-height: 1.5;
  }

  .q-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .badge-pending-sm {
    font-size: 0.72rem;
    color: var(--text-light);
    background: var(--pink-100);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full);
  }

  .badge-answered {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    background: #f0fff4;
    color: #1a7a3c;
    border: 1px solid #b2f0c5;
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full);
    font-size: 0.72rem;
  }

  .q-body {
    border-top: 1px dashed var(--border);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .existing-answer {
    background: var(--pink-50);
    border: 1px solid var(--pink-200);
    border-radius: var(--radius-sm);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .existing-answer p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-dark);
  }

  .del-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: none;
    border: 1px solid #ffc5c5;
    color: #c0392b;
    font-size: 0.78rem;
    padding: 0.25rem 0.6rem;
    border-radius: var(--radius-full);
    cursor: pointer;
    font-family: var(--font);
    align-self: flex-end;
    transition: all 0.15s;
  }

  .del-btn:hover {
    background: #fff0f0;
  }

  .answer-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .answer-form textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    background: white;
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--text-dark);
    resize: vertical;
    transition: border-color 0.2s;
  }

  .answer-form textarea:focus {
    outline: none;
    border-color: var(--pink-400);
    box-shadow: 0 0 0 3px rgba(235, 47, 150, 0.1);
  }

  .answer-submit {
    align-self: flex-end;
    padding: 0.6rem 1.25rem;
    font-size: 0.875rem;
  }

  .spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .stats-bar {
      grid-template-columns: 1fr 1fr;
      display: grid;
    }
  }
</style>
