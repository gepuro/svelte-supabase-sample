<script lang="ts">
	import { iconPaths, alertClasses } from '../util/icons.js';

	type AlertType = 'success' | 'error' | 'warning' | 'info';

	interface Props {
		type: AlertType;
		message: string;
		dismissible?: boolean;
		class?: string;
		onDismiss?: () => void;
	}

	let {
		type,
		message,
		dismissible = false,
		class: className = '',
		onDismiss,
		...rest
	}: Props = $props();

	const baseClasses = 'p-4 rounded-lg border flex items-start space-x-3';
	const classes = `${baseClasses} ${alertClasses[type]} ${className}`;
</script>

<div class={classes} {...rest}>
	<svg class="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPaths[type]}
		></path>
	</svg>

	<div class="flex-1">
		<p class="text-sm font-medium">{message}</p>
	</div>

	{#if dismissible && onDismiss}
		<button
			type="button"
			class="hover:bg-opacity-10 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 flex-shrink-0 rounded-lg p-1.5 text-current transition-colors duration-200 hover:bg-black focus:ring-2 focus:ring-offset-2"
			onclick={onDismiss}
			aria-label="閉じる"
		>
			<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
		</button>
	{/if}
</div>
