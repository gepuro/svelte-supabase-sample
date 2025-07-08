<script lang="ts">
	import { enhance } from '$app/forms';

	let { form }: { form?: { error?: string; success?: boolean } | null } = $props();

	let loading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	// フォームの状態
	let formData = $state({
		email: '',
		password: '',
		confirmPassword: '',
		fullName: ''
	});

	// パスワード強度チェック
	function checkPasswordStrength(password: string) {
		if (password.length < 8) return 'weak';
		if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong';
		return 'medium';
	}

	// パスワード一致チェック
	let passwordsMatch = $derived(formData.password === formData.confirmPassword);
	let passwordStrength = $derived(checkPasswordStrength(formData.password));
	let isFormValid = $derived(
		formData.email &&
			formData.password &&
			formData.confirmPassword &&
			passwordsMatch &&
			formData.password.length >= 8
	);
</script>

<svelte:head>
	<title>ユーザー登録 - Supabase App</title>
</svelte:head>

<div class="register-container">
	<div class="register-form">
		<h1>ユーザー登録</h1>
		<p class="subtitle">アカウントを作成して始めましょう</p>

		{#if form?.error}
			<div class="error">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="success">登録が完了しました！確認メールをチェックしてください。</div>
		{:else}
			<form
				method="POST"
				action="?/register"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<div class="form-group">
					<label for="fullName">氏名</label>
					<input
						id="fullName"
						name="fullName"
						type="text"
						bind:value={formData.fullName}
						placeholder="山田 太郎"
						disabled={loading}
					/>
				</div>

				<div class="form-group">
					<label for="email">メールアドレス *</label>
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
					<label for="password">パスワード *</label>
					<div class="password-input">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={formData.password}
							placeholder="8文字以上のパスワード"
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
					{#if formData.password}
						<div class="password-strength strength-{passwordStrength}">
							強度: {passwordStrength === 'weak'
								? '弱い'
								: passwordStrength === 'medium'
									? '普通'
									: '強い'}
						</div>
					{/if}
				</div>

				<div class="form-group">
					<label for="confirmPassword">パスワード確認 *</label>
					<div class="password-input">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={formData.confirmPassword}
							placeholder="パスワードを再入力"
							required
							disabled={loading}
						/>
						<button
							type="button"
							class="password-toggle"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{showConfirmPassword ? '🙈' : '👁️'}
						</button>
					</div>
					{#if formData.confirmPassword && !passwordsMatch}
						<div class="error-message">パスワードが一致しません</div>
					{/if}
				</div>

				<button type="submit" class="register-btn" disabled={loading || !isFormValid}>
					{loading ? '登録中...' : 'アカウントを作成'}
				</button>
			</form>

			<div class="login-link">
				<p>既にアカウントをお持ちですか？ <a href="/login">ログイン</a></p>
			</div>
		{/if}
	</div>
</div>

<style>
	.register-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
	}

	.register-form {
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

	.password-strength {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		font-weight: 600;
	}

	.strength-weak {
		color: #dc3545;
	}

	.strength-medium {
		color: #ffc107;
	}

	.strength-strong {
		color: #28a745;
	}

	.error-message {
		color: #dc3545;
		font-size: 0.8rem;
		margin-top: 0.5rem;
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
	}

	.register-btn {
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

	.register-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.register-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.login-link {
		text-align: center;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e1e5e9;
	}

	.login-link a {
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
	}

	.login-link a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.register-container {
			padding: 1rem;
		}

		.register-form {
			padding: 2rem;
		}
	}
</style>
