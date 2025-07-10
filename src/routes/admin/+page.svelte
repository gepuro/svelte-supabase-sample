<script lang="ts">
	import { Card, Button, Alert, Status, Input } from '$lib';
	import type { PageData } from './$types.js';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// デフォルト値を設定してundefinedエラーを防ぐ
	let users = $derived(data?.users || []);
	let sampleData = $derived(data?.sampleData || []);
	let stats = $derived(data?.stats || { totalUsers: 0, totalSamples: 0 });
	let user = $derived(data?.user);

	let selectedTab = $state('overview');
	let isLoading = $state(false);
	let notification = $state({ message: '', type: '' });
	let newSampleName = $state('');

	function formatDate(dateString: string | null | undefined) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleString('ja-JP');
	}

	function getUserRole(user: any) {
		return user.email?.endsWith('@admin.com') ? '管理者' : '一般ユーザー';
	}

	function getUserStatus(user: any) {
		return user.email_confirmed_at ? 'アクティブ' : '未認証';
	}

	async function performAdminAction(action: string, actionData: any) {
		isLoading = true;
		notification = { message: '', type: '' };

		try {
			const response = await fetch('/admin/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ action, data: actionData })
			});

			const result = await response.json();

			if (response.ok) {
				notification = { message: result.message, type: 'success' };
				await invalidateAll(); // データを再読み込み
			} else {
				notification = { message: result.error || 'エラーが発生しました', type: 'error' };
			}
		} catch (error) {
			notification = { message: 'ネットワークエラーが発生しました', type: 'error' };
		} finally {
			isLoading = false;
		}
	}

	async function createSampleData() {
		if (!newSampleName.trim()) {
			notification = { message: '名前を入力してください', type: 'error' };
			return;
		}

		await performAdminAction('createSampleData', { name: newSampleName.trim() });
		newSampleName = '';
	}

	async function deleteSampleData(id: number) {
		if (confirm('このデータを削除しますか？')) {
			await performAdminAction('deleteSampleData', { id });
		}
	}

	// 通知を自動で消す
	$effect(() => {
		if (notification.message) {
			const timer = setTimeout(() => {
				notification = { message: '', type: '' };
			}, 5000);

			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>管理者ページ - Admin Dashboard</title>
</svelte:head>

<div class="admin-dashboard">
	<div class="header">
		<h1>🛡️ 管理者ダッシュボード</h1>
		<p>システム管理とユーザー管理を行うことができます</p>
	</div>

	<!-- 通知 -->
	{#if notification.message}
		<div class="notification-container">
			<Alert
				type={notification.type === 'success' ? 'success' : 'error'}
				title={notification.type === 'success' ? '成功' : 'エラー'}
			>
				{notification.message}
			</Alert>
		</div>
	{/if}

	<!-- ローディング状態 -->
	{#if isLoading}
		<div class="loading-overlay">
			<div class="loading-spinner">読み込み中...</div>
		</div>
	{/if}

	<div class="stats-grid">
		<Card class="stat-card">
			<div class="stat">
				<div class="stat-value">{stats.totalUsers}</div>
				<div class="stat-label">総ユーザー数</div>
			</div>
		</Card>
		<Card class="stat-card">
			<div class="stat">
				<div class="stat-value">{stats.totalSamples}</div>
				<div class="stat-label">総サンプル数</div>
			</div>
		</Card>
		<Card class="stat-card">
			<div class="stat">
				<div class="stat-value">{users.filter((u) => u.email_confirmed_at).length}</div>
				<div class="stat-label">アクティブユーザー</div>
			</div>
		</Card>
		<Card class="stat-card">
			<div class="stat">
				<div class="stat-value">{users.filter((u) => !u.email_confirmed_at).length}</div>
				<div class="stat-label">未認証ユーザー</div>
			</div>
		</Card>
	</div>

	<div class="tabs">
		<button
			class="tab-btn"
			class:active={selectedTab === 'overview'}
			onclick={() => (selectedTab = 'overview')}
		>
			概要
		</button>
		<button
			class="tab-btn"
			class:active={selectedTab === 'users'}
			onclick={() => (selectedTab = 'users')}
		>
			ユーザー管理
		</button>
		<button
			class="tab-btn"
			class:active={selectedTab === 'data'}
			onclick={() => (selectedTab = 'data')}
		>
			データ管理
		</button>
	</div>

	<div class="tab-content">
		{#if selectedTab === 'overview'}
			<div class="overview">
				<Alert type="info" title="管理者権限について">
					このページではSupabase Service Role
					Keyを使用して、通常のユーザーでは実行できない管理者操作を行うことができます。
				</Alert>

				<Card class="welcome-card">
					<h3>👋 こんにちは、{user?.email}さん</h3>
					<p>管理者としてログインしています。以下の操作が可能です：</p>
					<ul>
						<li>全ユーザーの一覧表示と管理</li>
						<li>システムデータの閲覧と管理</li>
						<li>ユーザーの認証状態の確認</li>
						<li>データベースの直接操作</li>
					</ul>
				</Card>
			</div>
		{/if}

		{#if selectedTab === 'users'}
			<div class="users-section">
				<h3>👥 ユーザー管理</h3>
				<div class="users-table">
					<table>
						<thead>
							<tr>
								<th>ユーザーID</th>
								<th>メールアドレス</th>
								<th>役割</th>
								<th>ステータス</th>
								<th>作成日時</th>
								<th>最終ログイン</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user}
								<tr>
									<td class="user-id">{user.id}</td>
									<td>{user.email || 'N/A'}</td>
									<td>
										<Status type={getUserRole(user) === '管理者' ? 'success' : 'info'}>
											{getUserRole(user)}
										</Status>
									</td>
									<td>
										<Status type={getUserStatus(user) === 'アクティブ' ? 'success' : 'warning'}>
											{getUserStatus(user)}
										</Status>
									</td>
									<td>{formatDate(user.created_at)}</td>
									<td>{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : '未ログイン'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if selectedTab === 'data'}
			<div class="data-section">
				<h3>📊 サンプルデータ管理</h3>

				<!-- 新しいサンプルデータ作成 -->
				<Card class="create-data-card">
					<h4>新しいサンプルデータを作成</h4>
					<div class="create-form">
						<Input
							bind:value={newSampleName}
							placeholder="サンプル名を入力..."
							label="サンプル名"
						/>
						<Button onclick={createSampleData} disabled={isLoading || !newSampleName.trim()}>
							作成
						</Button>
					</div>
				</Card>

				{#if sampleData.length > 0}
					<div class="data-table">
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>名前</th>
									<th>説明</th>
									<th>作成日時</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								{#each sampleData as item}
									<tr>
										<td>{item.id}</td>
										<td>{item.name || 'N/A'}</td>
										<td>{item.description || '-'}</td>
										<td>{formatDate(item.created_at)}</td>
										<td>
											<Button
												variant="danger"
												size="sm"
												onclick={() => deleteSampleData(item.id)}
												disabled={isLoading}
											>
												削除
											</Button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<Card>
						<p>サンプルデータがありません。上記のフォームから新しいデータを作成してください。</p>
					</Card>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--primary-color, #3b82f6);
	}

	.header p {
		color: var(--text-muted, #6b7280);
		font-size: 1.1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	:global(.stat-card) {
		text-align: center;
		padding: 1.5rem;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--primary-color, #3b82f6);
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: var(--text-muted, #6b7280);
		font-size: 0.9rem;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		border-bottom: 2px solid var(--border-color, #e5e7eb);
	}

	.tab-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		background: transparent;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
		font-weight: 500;
	}

	.tab-btn:hover {
		background: var(--hover-bg, #f3f4f6);
	}

	.tab-btn.active {
		border-bottom-color: var(--primary-color, #3b82f6);
		color: var(--primary-color, #3b82f6);
	}

	.tab-content {
		min-height: 400px;
	}

	:global(.welcome-card) {
		margin-top: 1rem;
	}

	:global(.welcome-card) h3 {
		margin-bottom: 1rem;
		color: var(--primary-color, #3b82f6);
	}

	:global(.welcome-card) ul {
		margin-top: 1rem;
		padding-left: 1.5rem;
	}

	:global(.welcome-card) li {
		margin-bottom: 0.5rem;
	}

	.users-table,
	.data-table {
		overflow-x: auto;
		margin-top: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	th {
		background: var(--bg-secondary, #f9fafb);
		font-weight: 600;
		color: var(--text-primary, #374151);
	}

	.user-id {
		font-family: monospace;
		font-size: 0.8rem;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	tr:hover {
		background: var(--hover-bg, #f3f4f6);
	}

	.overview,
	.users-section,
	.data-section {
		animation: fadeIn 0.3s ease-in-out;
	}

	.notification-container {
		margin-bottom: 1rem;
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.loading-spinner {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		font-weight: bold;
	}

	:global(.create-data-card) {
		margin-bottom: 2rem;
	}

	:global(.create-data-card) h4 {
		margin-bottom: 1rem;
		color: var(--primary-color, #3b82f6);
	}

	.create-form {
		display: flex;
		gap: 1rem;
		align-items: end;
	}

	.create-form :global(.input-group) {
		flex: 1;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.admin-dashboard {
			padding: 1rem;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.tab-btn {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.users-table,
		.data-table {
			font-size: 0.8rem;
		}
	}
</style>
