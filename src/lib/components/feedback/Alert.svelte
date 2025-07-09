<script lang="ts">
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

	const typeClasses = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	const iconPaths = {
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	const classes = `${baseClasses} ${typeClasses[type]} ${className}`;
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
