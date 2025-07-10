<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		status?: string;
		type?: 'success' | 'warning' | 'error' | 'info';
		children?: Snippet;
	}

	let { status, type, children }: Props = $props();

	// ホームページ用のSupabase接続ステータス表示
	if (status !== undefined) {
		const isConnected = status === 'Connected';
		const statusClass = isConnected
			? 'text-green-600 bg-green-50 border-green-200'
			: 'text-red-600 bg-red-50 border-red-200';

		const iconPath = isConnected
			? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
			: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
	}

	// 管理者ページ用のステータスバッジ表示
	if (type !== undefined) {
		const typeClasses = {
			success: 'text-green-600 bg-green-50 border-green-200',
			warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
			error: 'text-red-600 bg-red-50 border-red-200',
			info: 'text-blue-600 bg-blue-50 border-blue-200'
		};

		const typeIcons = {
			success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			warning:
				'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
			error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
			info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		};
	}
</script>

{#if status !== undefined}
	<!-- Supabase接続ステータス表示 (ホームページ用) -->
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
			<div
				class="flex items-center space-x-2 rounded-lg border px-3 py-2 {status === 'Connected'
					? 'border-green-200 bg-green-50 text-green-600'
					: 'border-red-200 bg-red-50 text-red-600'}"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={status === 'Connected'
							? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
							: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}
					></path>
				</svg>
				<span class="text-sm font-medium">
					{status === 'Connected' ? '接続済み' : '接続エラー'}
				</span>
			</div>
			{#if status !== 'Connected'}
				<p class="text-sm text-gray-600">{status}</p>
			{/if}
		</div>
	</div>
{:else if type !== undefined}
	<!-- ステータスバッジ表示 (管理者ページ用) -->
	<span
		class="inline-flex items-center space-x-1 rounded-lg border px-2 py-1 text-xs font-medium {type ===
		'success'
			? 'border-green-200 bg-green-50 text-green-600'
			: type === 'warning'
				? 'border-yellow-200 bg-yellow-50 text-yellow-600'
				: type === 'error'
					? 'border-red-200 bg-red-50 text-red-600'
					: 'border-blue-200 bg-blue-50 text-blue-600'}"
	>
		<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={type === 'success'
					? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
					: type === 'warning'
						? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
						: type === 'error'
							? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
							: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}
			></path>
		</svg>
		{@render children?.()}
	</span>
{/if}
