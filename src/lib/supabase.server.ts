import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { Database } from './database.types.js'
import type { RequestEvent } from '@sveltejs/kit'

/**
 * Creates a request-specific Supabase client using the new @supabase/ssr package.
 * This client properly handles authentication cookies and session management.
 */
export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' })
					})
				},
			},
		}
	)
}

/**
 * Safe session getter that validates the JWT before returning the session.
 * Unlike `supabase.auth.getSession()`, which returns the session _without_
 * validating the JWT, this function also calls `getUser()` to validate the
 * JWT before returning the session.
 */
export async function safeGetSession(event: RequestEvent) {
	const supabase = createSupabaseServerClient(event)
	
	const {
		data: { session },
	} = await supabase.auth.getSession()
	
	if (!session) {
		return { session: null, user: null }
	}
	
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()
	
	if (error) {
		// JWT validation has failed
		return { session: null, user: null }
	}
	
	return { session, user }
}
