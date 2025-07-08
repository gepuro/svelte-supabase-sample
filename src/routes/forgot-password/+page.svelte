<script lang="ts">
	import { enhance } from '$app/forms';

	let { form }: { form?: { error?: string; success?: boolean } | null } = $props();

	let loading = $state(false);
	let email = $state('');

	let isFormValid = $derived(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
</script>

<svelte:head>
	<title>パスワードリセット - Supabase App</title>
</svelte:head>

<div class="reset-container">
	<div class="reset-form">
		<h1>パスワードリセット</h1>
		<p class="subtitle">登録したメールアドレスにリセットリンクを送信します</p>

		{#if form?.error}
			<div class="error">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="success">
				パスワードリセットリンクをメールで送信しました。メールをチェックしてください。
			</div>
		{:else}
			<form
				method="POST"
				action="?/reset"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<div class="form-group">
					<label for="email">メールアドレス</label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						placeholder="example@example.com"
						required
						disabled={loading}
					/>
				</div>

				<button type="submit" class="reset-btn" disabled={loading || !isFormValid}>
					{loading ? '送信中...' : 'リセットリンクを送信'}
				</button>
			</form>
		{/if}

		<div class="back-links">
			<a href="/login" class="back-link">ログインに戻る</a>
			<a href="/register" class="back-link">新規登録</a>
		</div>
	</div>
</div>

<style>
	.reset-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
	}

	.reset-form {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		text-align: center;
		margin-bottom: 0.5rem;
		color: #333;
		font-size: 2rem;
	}

	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #333;
		font-weight: 600;
	}

	input {
		width: 100%;
		padding: 12px;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.3s ease;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
	}

	.error {
		background-color: #fee;
		color: #dc3545;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid #f5c6cb;
	}

	.success {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid #c3e6cb;
		line-height: 1.5;
	}

	.reset-btn {
		width: 100%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 14px;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.reset-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.reset-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.back-links {
		display: flex;
		justify-content: space-between;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e1e5e9;
	}

	.back-link {
		color: #667eea;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.reset-container {
			padding: 1rem;
		}

		.reset-form {
			padding: 2rem;
		}

		.back-links {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
