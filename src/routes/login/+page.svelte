<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form }: { form?: { error?: string; success?: boolean } | null } = $props();

	let loading = $state(false);
	let showPassword = $state(false);

	// フォームの状態
	let formData = $state({
		email: '',
		password: ''
	});

	let isFormValid = $derived(formData.email && formData.password);

	// ログイン成功時のリダイレクト
	$effect(() => {
		if (form?.success) {
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>ログイン - Supabase App</title>
</svelte:head>

<div class="login-container">
	<div class="login-form">
		<h1>ログイン</h1>
		<p class="subtitle">アカウントにサインインしてください</p>

		{#if form?.error}
			<div class="error">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/login"
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
					bind:value={formData.email}
					placeholder="example@example.com"
					required
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="password">パスワード</label>
				<div class="password-input">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={formData.password}
						placeholder="パスワードを入力"
						required
						disabled={loading}
					/>
					<button
						type="button"
						class="password-toggle"
						onclick={() => (showPassword = !showPassword)}
					>
						{showPassword ? '🙈' : '👁️'}
					</button>
				</div>
			</div>

			<button type="submit" class="login-btn" disabled={loading || !isFormValid}>
				{loading ? 'ログイン中...' : 'ログイン'}
			</button>
		</form>

		<div class="form-links">
			<a href="/forgot-password" class="forgot-link">パスワードを忘れた方</a>
		</div>

		<div class="register-link">
			<p>アカウントをお持ちでない方は <a href="/register">新規登録</a></p>
		</div>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
	}

	.login-form {
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

	.password-input {
		position: relative;
	}

	.password-toggle {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		padding: 0;
	}

	.error {
		background-color: #fee;
		color: #dc3545;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid #f5c6cb;
	}

	.login-btn {
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

	.login-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.login-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.form-links {
		text-align: center;
		margin-top: 1.5rem;
	}

	.forgot-link {
		color: #667eea;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.forgot-link:hover {
		text-decoration: underline;
	}

	.register-link {
		text-align: center;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e1e5e9;
	}

	.register-link a {
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
	}

	.register-link a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.login-container {
			padding: 1rem;
		}

		.login-form {
			padding: 2rem;
		}
	}
</style>
