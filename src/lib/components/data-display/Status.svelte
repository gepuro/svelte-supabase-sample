<script lang="ts">
	import type { Snippet } from 'svelte';
	import { iconPaths, statusClasses } from '../util/icons.js';

	interface Props {
		status?: string;
		type?: 'success' | 'warning' | 'error' | 'info';
		children?: Snippet;
	}

	let { status, type, children }: Props = $props();

	// ステータスベースの設定
	const isConnected = status === 'Connected';
	const statusType = isConnected ? 'success' : 'error';
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
				class="flex items-center space-x-2 rounded-lg border px-3 py-2 {statusClasses[statusType]}"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={iconPaths[statusType]}
					></path>
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
{:else if type !== undefined}
	<!-- ステータスバッジ表示 (管理者ページ用) -->
	<span
		class="inline-flex items-center space-x-1 rounded-lg border px-2 py-1 text-xs font-medium {statusClasses[
			type
		]}"
	>
		<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPaths[type]}
			></path>
		</svg>
		{@render children?.()}
	</span>
{/if}
