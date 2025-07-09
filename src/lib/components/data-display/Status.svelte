<script lang="ts">
	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const isConnected = status === 'Connected';
	const statusClass = isConnected
		? 'text-green-600 bg-green-50 border-green-200'
		: 'text-red-600 bg-red-50 border-red-200';

	const iconPath = isConnected
		? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
</script>

<div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
		<svg class="mr-2 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"
			></path>
		</svg>
		Supabase ステータス
	</h2>

	<div class="flex items-center space-x-3">
		<div class="flex items-center space-x-2 rounded-lg border px-3 py-2 {statusClass}">
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath}></path>
			</svg>
			<span class="text-sm font-medium">
				{isConnected ? '接続済み' : '接続エラー'}
			</span>
		</div>
		{#if !isConnected}
			<p class="text-sm text-gray-600">{status}</p>
		{/if}
	</div>
</div>
