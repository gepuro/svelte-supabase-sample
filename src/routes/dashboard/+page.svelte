<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	$effect(() => {
		const success = $page.url.searchParams.get('success');
		if (success === 'email_confirmed') {
			showSuccessMessage = true;
			successMessage = 'メール認証が完了しました！';

			// 3秒後にメッセージを非表示
			setTimeout(() => {
				showSuccessMessage = false;
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>ダッシュボード - Supabase App</title>
</svelte:head>

<div class="dashboard">
	{#if showSuccessMessage}
		<div class="success-banner">
			<div class="success-content">
				<svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
					></path>
				</svg>
				<span>{successMessage}</span>
			</div>
		</div>
	{/if}

	<header class="dashboard-header">
		<div class="header-content">
			<h1>ダッシュボード</h1>
			<form
				method="POST"
				action="?/logout"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<button type="submit" class="logout-btn" disabled={loading}>
					{loading ? 'ログアウト中...' : 'ログアウト'}
				</button>
			</form>
		</div>
	</header>

	<main class="dashboard-main">
		<div class="welcome-section">
			<h2>
				{#if data.user?.fullName}
					{data.user.fullName}さん、おかえりなさい！
				{:else}
					おかえりなさい！
				{/if}
			</h2>
			<p class="user-info">
				メールアドレス: <strong>{data.user?.email}</strong>
			</p>
			<p class="user-info">
				登録日: <strong
					>{data.user?.createdAt
						? new Date(data.user.createdAt).toLocaleDateString('ja-JP')
						: 'N/A'}</strong
				>
			</p>
		</div>

		<div class="dashboard-grid">
			<div class="dashboard-card">
				<h3>プロフィール</h3>
				<p>アカウント情報を管理できます。</p>
				<a href="/profile" class="card-link">プロフィールを編集</a>
			</div>

			<div class="dashboard-card">
				<h3>サンプルデータ</h3>
				<p>サンプルデータを表示・管理できます。</p>
				<a href="/" class="card-link">サンプルを見る</a>
			</div>

			<div class="dashboard-card">
				<h3>設定</h3>
				<p>アプリケーションの設定を変更できます。</p>
				<a href="/settings" class="card-link">設定を開く</a>
			</div>

			<div class="dashboard-card">
				<h3>ヘルプ</h3>
				<p>よくある質問やサポート情報を確認できます。</p>
				<a href="/help" class="card-link">ヘルプを見る</a>
			</div>
		</div>
	</main>
</div>

<style>
	.dashboard {
		min-height: 100vh;
		background-color: #f8f9fa;
	}

	.dashboard-header {
		background: white;
		border-bottom: 1px solid #e1e5e9;
		padding: 1rem 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.dashboard-header h1 {
		margin: 0;
		color: #333;
		font-size: 1.8rem;
	}

	.logout-btn {
		background-color: #dc3545;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.2s ease;
	}

	.logout-btn:hover:not(:disabled) {
		background-color: #c82333;
	}

	.logout-btn:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.dashboard-main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.welcome-section {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.welcome-section h2 {
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.5rem;
	}

	.user-info {
		margin: 0.5rem 0;
		color: #666;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.dashboard-card {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.dashboard-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.dashboard-card h3 {
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.25rem;
	}

	.dashboard-card p {
		margin: 0 0 1.5rem 0;
		color: #666;
		line-height: 1.5;
	}

	.card-link {
		display: inline-block;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: transform 0.2s ease;
	}

	.card-link:hover {
		transform: translateY(-1px);
	}

	.success-banner {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		padding: 1rem;
		margin: 0;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
		animation: slideDown 0.3s ease-out;
	}

	.success-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.success-icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.header-content {
			padding: 0 1rem;
		}

		.dashboard-main {
			padding: 1rem;
		}

		.welcome-section,
		.dashboard-card {
			padding: 1.5rem;
		}

		.dashboard-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}
</style>
