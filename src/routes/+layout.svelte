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
			async (event: AuthChangeEvent, newSession: Session | null) => {
				// Only invalidate if session state actually changed
				// This avoids using potentially insecure session data directly
				if (newSession?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		return () => subscription.unsubscribe();
	});
</script>

{@render children()}
