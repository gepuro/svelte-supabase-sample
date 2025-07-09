<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import Status from '$lib/components/data-display/Status.svelte';
	import Form from '$lib/components/form/Form.svelte';
	import List from '$lib/components/data-display/List.svelte';
	import Alert from '$lib/components/feedback/Alert.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
	let formRef: Form;

	// フォームアクションが完了した後の処理
	$effect(() => {
		if (form?.success && formRef) {
			formRef.resetForm();
		}
	});
</script>

<svelte:head>
	<title>SvelteKit with Supabase</title>
	<meta name="description" content="SvelteKit と Supabase を使用したサンプルアプリケーション" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- ヘッダー -->
		<header class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">SvelteKit with Supabase</h1>
			<p class="text-gray-600">
				Visit <a href="https://svelte.dev/docs/kit" class="text-blue-600 hover:underline"
					>svelte.dev/docs/kit</a
				> to read the documentation
			</p>
		</header>

		<!-- ナビゲーション -->
		<Navigation isAuthenticated={!!data.user} />

		<!-- Supabaseステータス -->
		<Status status={data.connectionStatus} />

		<!-- アラート -->
		{#if form?.error}
			<div class="mb-6">
				<Alert type="error" message={form.error} />
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6">
				<Alert type="success" message="サンプルが正常に処理されました！" />
			</div>
		{/if}

		{#if data.error}
			<div class="mb-6">
				<Alert type="error" message={data.error} />
			</div>
		{/if}

		<!-- サンプル管理セクション -->
		<section class="space-y-8">
			<h2 class="text-center text-2xl font-bold text-gray-900">サンプルデータ管理</h2>

			<!-- サンプル追加フォーム -->
			<Form bind:this={formRef} {loading} error={form?.error} />

			<!-- サンプル一覧 -->
			<List samples={data.samples} {loading} />
		</section>
	</div>
</div>
