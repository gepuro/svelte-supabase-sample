<script lang="ts">
	import type { Database } from '$lib/database.types.js';
	import SampleCard from './SampleCard.svelte';

	type SampleRow = Database['public']['Tables']['sample']['Row'];

	interface Props {
		samples: SampleRow[];
		loading: boolean;
	}

	let { samples, loading }: Props = $props();
</script>

<div class="space-y-6">
	<h3 class="flex items-center text-lg font-semibold text-gray-900">
		<svg class="mr-2 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			></path>
		</svg>
		サンプル一覧
		<span class="ml-2 text-sm font-normal text-gray-500">({samples.length}件)</span>
	</h3>

	{#if samples.length === 0}
		<div class="py-12 text-center">
			<svg
				class="mx-auto mb-4 h-16 w-16 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				></path>
			</svg>
			<p class="text-lg text-gray-500">サンプルデータがありません</p>
			<p class="mt-2 text-sm text-gray-400">上のフォームから新しいサンプルを追加してください</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each samples as sample (sample.id)}
				<SampleCard {sample} {loading} />
			{/each}
		</div>
	{/if}
</div>
