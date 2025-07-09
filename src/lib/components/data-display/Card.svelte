<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Database } from '$lib/database.types.js';
	import Button from '../general/Button.svelte';

	type SampleRow = Database['public']['Tables']['sample']['Row'];

	interface Props {
		sample: SampleRow;
		loading: boolean;
	}

	let { sample, loading }: Props = $props();

	const formattedDate = new Date(sample.created_at).toLocaleString('ja-JP', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
</script>

<div
	class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
>
	<div class="mb-3 flex items-start justify-between">
		<h4 class="truncate pr-4 text-lg font-semibold text-gray-900">{sample.name}</h4>
		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={sample.id} />
			<Button
				type="submit"
				variant="danger"
				size="sm"
				disabled={loading}
				class="flex-shrink-0"
				title="削除"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					></path>
				</svg>
			</Button>
		</form>
	</div>

	{#if sample.description}
		<p class="mb-4 text-sm leading-relaxed text-gray-600">{sample.description}</p>
	{/if}

	<div class="flex items-center text-xs text-gray-500">
		<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		作成日: {formattedDate}
	</div>
</div>
