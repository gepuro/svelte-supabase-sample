<script lang="ts">
	let loading = $state(true);
	let message = $state('認証処理中...');

	$effect(() => {
		// Server-side handling is done in +page.server.ts, so we just show loading
		// and the server will redirect appropriately
		message = '認証処理中...';
		loading = true;
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
