<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

	let { data, children } = $props();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { session, supabase } = $derived(data as any);

	onMount(() => {
		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_: AuthChangeEvent, newSession: Session | null) => {
				if (newSession?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		return () => subscription.unsubscribe();
	});
</script>

{@render children()}
