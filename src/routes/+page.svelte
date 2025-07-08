<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import type { Database } from '$lib/database.types.js';

	type SampleRow = Database['public']['Tables']['sample']['Row'];
	type SampleInsert = Database['public']['Tables']['sample']['Insert'];

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);

	// フォームの状態
	let newSample = $state<Omit<SampleInsert, 'id' | 'created_at'>>({
		name: '',
		description: ''
	});

	// フォームアクションが完了した後の処理
	$effect(() => {
		if (form?.success) {
			// フォームをリセット
			newSample = { name: '', description: '' };
		}
	});
</script>

<h1>Welcome to SvelteKit with Supabase</h1>

<nav class="main-nav">
	<div class="nav-links">
		<a href="/register" class="nav-link register-link">新規登録</a>
		<a href="/login" class="nav-link login-link">ログイン</a>
		<a href="/dashboard" class="nav-link dashboard-link">ダッシュボード</a>
		<a href="/auth/setup" class="nav-link setup-link">認証設定確認</a>
	</div>
</nav>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="supabase-status">
	<h2>Supabase Status</h2>
	<p>Status: {data.connectionStatus}</p>
</div>

<div class="sample-section">
	<h2>Sample データ管理</h2>

	{#if form?.error}
		<div class="error">
			エラー: {form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="success">サンプルが正常に処理されました！</div>
	{/if}

	<!-- サンプル追加フォーム -->
	<div class="add-form">
		<h3>新しいサンプルを追加</h3>
		<form
			method="POST"
			action="?/add"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="form-group">
				<label for="name">サンプル名 *</label>
				<input
					id="name"
					name="name"
					type="text"
					bind:value={newSample.name}
					placeholder="サンプル名を入力"
					required
					disabled={loading}
				/>
			</div>
			<div class="form-group">
				<label for="description">説明</label>
				<textarea
					id="description"
					name="description"
					bind:value={newSample.description}
					placeholder="説明を入力（オプション）"
					disabled={loading}
				></textarea>
			</div>
			<button type="submit" disabled={loading || !newSample.name.trim()}>
				{loading ? '追加中...' : 'サンプルを追加'}
			</button>
		</form>
	</div>

	<!-- サンプル一覧 -->
	<div class="samples-list">
		<h3>サンプル一覧</h3>
		{#if data.samples.length === 0}
			<p>サンプルデータがありません。</p>
		{:else}
			<div class="samples-grid">
				{#each data.samples as sample (sample.id)}
					<div class="sample-card">
						<div class="sample-header">
							<h4>{sample.name}</h4>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									loading = true;
									return async ({ update }) => {
										await update();
										loading = false;
									};
								}}
							>
								<input type="hidden" name="id" value={sample.id} />
								<button type="submit" class="delete-btn" disabled={loading} title="削除">
									×
								</button>
							</form>
						</div>
						{#if sample.description}
							<p class="description">{sample.description}</p>
						{/if}
						<p class="created-at">
							作成日: {new Date(sample.created_at).toLocaleString('ja-JP')}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.main-nav {
		margin: 2rem 0;
		padding: 1rem;
		background-color: #f8f9fa;
		border-radius: 8px;
		border: 1px solid #e1e5e9;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.nav-link {
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.register-link {
		background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
		color: white;
	}

	.register-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
	}

	.login-link {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.login-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.dashboard-link {
		background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
		color: white;
	}

	.dashboard-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
	}

	.supabase-status {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.sample-section {
		margin-top: 2rem;
	}

	.error {
		background-color: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success {
		background-color: #efe;
		color: #3c3;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.add-form {
		background-color: #f9f9f9;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.form-group textarea {
		height: 80px;
		resize: vertical;
	}

	button {
		background-color: #007acc;
		color: white;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	button:hover:not(:disabled) {
		background-color: #005a99;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.samples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.sample-card {
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.sample-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.sample-header h4 {
		margin: 0;
		color: #333;
	}

	.delete-btn {
		background-color: #dc3545;
		color: white;
		padding: 0.25rem 0.5rem;
		font-size: 1.2rem;
		line-height: 1;
		min-width: auto;
	}

	.delete-btn:hover:not(:disabled) {
		background-color: #c82333;
	}

	.description {
		color: #666;
		margin: 0.5rem 0;
	}

	.created-at {
		color: #888;
		font-size: 0.9rem;
		margin: 0;
	}
</style>
