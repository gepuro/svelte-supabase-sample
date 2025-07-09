<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Database } from '$lib/database.types.js';
	import Input from './Input.svelte';
	import Textarea from './Textarea.svelte';
	import Button from '../general/Button.svelte';

	type SampleInsert = Database['public']['Tables']['sample']['Insert'];

	interface Props {
		loading: boolean;
		error?: string;
	}

	let { loading, error }: Props = $props();

	let formData = $state<{ name: string; description: string }>({
		name: '',
		description: ''
	});

	let formErrors = $state<Record<string, string>>({});

	// フォームバリデーション
	function validateForm() {
		const errors: Record<string, string> = {};

		if (!formData.name?.trim()) {
			errors.name = 'サンプル名は必須です';
		} else if (formData.name.trim().length > 100) {
			errors.name = 'サンプル名は100文字以内で入力してください';
		}

		if (formData.description && formData.description.length > 500) {
			errors.description = '説明は500文字以内で入力してください';
		}

		formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	// フォームリセット - 外部から呼び出し可能
	export function resetForm() {
		formData = { name: '', description: '' };
		formErrors = {};
	}

	const isFormValid = $derived(
		formData.name?.trim().length > 0 && Object.keys(formErrors).length === 0
	);
</script>

<div class="rounded-xl bg-gray-50 p-6">
	<h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
		<svg class="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 6v6m0 0v6m0-6h6m-6 0H6"
			></path>
		</svg>
		新しいサンプルを追加
	</h3>

	<form
		method="POST"
		action="?/add"
		use:enhance={() => {
			if (!validateForm()) {
				return async () => {};
			}

			return async ({ update }) => {
				await update();
			};
		}}
		class="space-y-4"
	>
		<Input
			label="サンプル名"
			name="name"
			bind:value={formData.name}
			placeholder="サンプル名を入力"
			required
			disabled={loading}
			error={formErrors.name}
		/>

		<Textarea
			label="説明"
			name="description"
			bind:value={formData.description}
			placeholder="説明を入力（オプション）"
			disabled={loading}
			error={formErrors.description}
			rows={3}
		/>

		{#if error}
			<p class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>
		{/if}

		<Button type="submit" disabled={!isFormValid || loading} {loading} variant="success">
			{loading ? '追加中...' : 'サンプルを追加'}
		</Button>
	</form>
</div>
