<script lang="ts">
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let status = $state({
		supabaseConnection: data.connectionStatus === 'Connected' ? 'success' : 'error',
		redirectUrl: data.redirectUrl,
		currentSession: data.session
	});

	function getSupabaseProjectId() {
		try {
			const url = new URL(PUBLIC_SUPABASE_URL);
			return url.hostname.split('.')[0];
		} catch {
			return 'unknown';
		}
	}
</script>

<svelte:head>
	<title>認証設定確認 - Supabase App</title>
</svelte:head>

<div class="setup-checker">
	<header class="header">
		<h1>認証設定確認</h1>
		<p>メール認証の問題解決のための設定状況を確認します。</p>
	</header>

	<main class="main">
		<div class="section">
			<h2>🔗 Supabase接続状況</h2>
			<div class="status-item">
				<span class="label">接続状態:</span>
				<span class="status {status.supabaseConnection}">
					{#if status.supabaseConnection === 'checking'}
						確認中...
					{:else if status.supabaseConnection === 'success'}
						✅ 正常
					{:else}
						❌ エラー
					{/if}
				</span>
			</div>
			<div class="status-item">
				<span class="label">プロジェクトURL:</span>
				<span class="value">{PUBLIC_SUPABASE_URL}</span>
			</div>
			<div class="status-item">
				<span class="label">プロジェクトID:</span>
				<span class="value">{getSupabaseProjectId()}</span>
			</div>
		</div>

		<div class="section">
			<h2>🔄 リダイレクト設定</h2>
			<div class="status-item">
				<span class="label">設定されたリダイレクトURL:</span>
				<span class="value">{status.redirectUrl}</span>
			</div>
			<div class="info-box warning">
				<h3>⚠️ 重要な設定</h3>
				<p>Supabaseダッシュボードで以下の設定を確認してください：</p>
				<ol>
					<li>
						<a
							href="https://supabase.com/dashboard/project/{getSupabaseProjectId()}/auth/url-configuration"
							target="_blank"
							rel="noopener">Authentication → URL Configuration</a
						>
					</li>
					<li>"Redirect URLs" セクションに以下のURLを追加：</li>
					<li><code>{status.redirectUrl}</code></li>
				</ol>
			</div>
		</div>

		<div class="section">
			<h2>👤 現在の認証状態</h2>
			{#if status.currentSession}
				<div class="status-item">
					<span class="label">ログイン状態:</span>
					<span class="status success">✅ ログイン済み</span>
				</div>
				<div class="status-item">
					<span class="label">ユーザーID:</span>
					<span class="value">{status.currentSession.user?.id}</span>
				</div>
				<div class="status-item">
					<span class="label">メールアドレス:</span>
					<span class="value">{status.currentSession.user?.email}</span>
				</div>
			{:else}
				<div class="status-item">
					<span class="label">ログイン状態:</span>
					<span class="status error">❌ 未ログイン</span>
				</div>
			{/if}
		</div>

		<div class="section">
			<h2>🚀 解決手順</h2>
			<div class="info-box">
				<h3>メール認証リンクの問題を解決する手順：</h3>
				<ol>
					<li>
						<strong>Supabaseダッシュボードにアクセス</strong><br />
						<a
							href="https://supabase.com/dashboard/project/{getSupabaseProjectId()}"
							target="_blank"
							rel="noopener"
						>
							プロジェクトダッシュボード
						</a>
					</li>
					<li>
						<strong>Authentication → URL Configuration を開く</strong><br />
						<a
							href="https://supabase.com/dashboard/project/{getSupabaseProjectId()}/auth/url-configuration"
							target="_blank"
							rel="noopener"
						>
							URL Configuration設定
						</a>
					</li>
					<li>
						<strong>"Redirect URLs" に以下を追加：</strong><br />
						<code class="copy-text">{status.redirectUrl}</code>
						<button onclick={() => navigator.clipboard.writeText(status.redirectUrl)}>コピー</button
						>
					</li>
					<li>
						<strong>設定を保存</strong>
					</li>
					<li>
						<strong>新しいアカウントで再度登録テスト</strong>
					</li>
				</ol>
			</div>
		</div>

		<div class="actions">
			<a href="/register" class="btn primary">新規登録をテスト</a>
			<a href="/login" class="btn secondary">ログイン画面へ</a>
			<a href="/" class="btn secondary">ホームに戻る</a>
		</div>
	</main>
</div>

<style>
	.setup-checker {
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		padding: 2rem 1rem;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		color: #2d3748;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.header p {
		color: #4a5568;
		font-size: 1.1rem;
	}

	.main {
		max-width: 800px;
		margin: 0 auto;
	}

	.section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.section h2 {
		color: #2d3748;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid #f1f5f9;
	}

	.status-item:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: #4a5568;
	}

	.value {
		font-family: 'Monaco', 'Menlo', monospace;
		background: #f7fafc;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.status.success {
		background: #c6f6d5;
		color: #22543d;
	}

	.status.error {
		background: #fed7d7;
		color: #c53030;
	}

	.status.checking {
		background: #bee3f8;
		color: #2c5282;
	}

	.info-box {
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-top: 1rem;
	}

	.info-box.warning {
		background: #fffbeb;
		border-color: #f6e05e;
	}

	.info-box h3 {
		margin: 0 0 1rem 0;
		color: #2d3748;
	}

	.info-box ol {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.copy-text {
		background: #2d3748;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.9rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.btn.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn.secondary {
		background: white;
		color: #4a5568;
		border: 2px solid #e2e8f0;
	}

	.btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 768px) {
		.setup-checker {
			padding: 1rem;
		}

		.section {
			padding: 1.5rem;
		}

		.status-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.actions {
			flex-direction: column;
		}
	}
</style>
