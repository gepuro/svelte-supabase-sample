<script lang="ts">
	interface Props {
		label: string;
		name: string;
		id?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		type?: 'text' | 'email' | 'password' | 'number';
		class?: string;
	}

	let {
		label,
		name,
		id = name,
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		type = 'text',
		class: className = '',
		...rest
	}: Props = $props();

	const baseClasses =
		'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
	const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
	const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

	const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
</script>

<div class="space-y-1">
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>

	<input
		{id}
		{name}
		{type}
		{placeholder}
		{required}
		{disabled}
		class={inputClasses}
		bind:value
		{...rest}
	/>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
