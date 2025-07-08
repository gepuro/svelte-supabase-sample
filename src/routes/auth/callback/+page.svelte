<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase.js';

	let loading = $state(true);
	let message = $state('認証処理中...');

	$effect(() => {
		(async () => {
			try {
				// URLのハッシュフラグメントから認証情報を取得
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error('セッション取得エラー:', error);
					message = '認証に失敗しました。';
					setTimeout(() => {
						goto(
							'/login?error=' +
								encodeURIComponent(
									'メール認証に失敗しました。リンクが無効または期限切れの可能性があります。'
								)
						);
					}, 2000);
					return;
				}

				// URLパラメータからも確認
				const urlParams = new URLSearchParams(window.location.search);
				const token = urlParams.get('token');
				const type = urlParams.get('type');

				if (token && type) {
					// 新しい認証トークンがある場合の処理
					message = 'メール認証を確認中...';

					// 少し待機してからセッションを再確認
					setTimeout(async () => {
						const { data: newSession } = await supabase.auth.getSession();
						if (newSession.session) {
							message = 'メール認証が完了しました。ダッシュボードにリダイレクトします...';
							setTimeout(() => {
								goto('/dashboard?success=email_confirmed');
							}, 1500);
						} else {
							message = '認証処理が完了しませんでした。';
							setTimeout(() => {
								goto(
									'/login?error=' +
										encodeURIComponent('認証処理が完了しませんでした。再度お試しください。')
								);
							}, 2000);
						}
					}, 1000);
				} else if (data.session) {
					// 既存のセッションがある場合
					message = 'メール認証が完了しました。ダッシュボードにリダイレクトします...';
					setTimeout(() => {
						goto('/dashboard?success=email_confirmed');
					}, 1500);
				} else {
					// セッションもトークンもない場合
					message = '認証情報が見つかりません。';
					setTimeout(() => {
						goto('/login?error=' + encodeURIComponent('有効な認証リンクではありません。'));
					}, 2000);
				}
			} catch (err) {
				console.error('認証処理中にエラーが発生:', err);
				message = '認証処理中にエラーが発生しました。';
				setTimeout(() => {
					goto('/login?error=' + encodeURIComponent('認証処理中にエラーが発生しました。'));
				}, 2000);
			} finally {
				loading = false;
			}
		})();
	});
</script>

<svelte:head>
	<title>メール認証</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			{#if loading}
				<div
					class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
				></div>
			{:else}
				<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
					{#if message.includes('完了')}
						<svg
							class="h-12 w-12 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
					{:else}
						<svg
							class="h-12 w-12 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					{/if}
				</div>
			{/if}

			<h2 class="mb-4 text-2xl font-bold text-gray-900">メール認証</h2>

			<p class="text-gray-600">
				{message}
			</p>
		</div>
	</div>
</div>
