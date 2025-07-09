import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(
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

	/**
	 * Safely gets user by validating JWT with getUser() only.
	 * We completely avoid getSession() to prevent any security warnings.
	 */
	event.locals.safeGetSession = async () => {
		// Only validate the JWT by contacting Supabase Auth server
		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()
		
		if (error || !user) {
			// JWT validation failed or no user
			return { session: null, user: null }
		}

		// Return user without session to completely avoid security warnings
		return { session: null, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version'
		},
	})
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user

	// Protect dashboard routes - use user instead of session for security
	if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
		redirect(303, '/login')
	}

	// Redirect logged-in users from auth pages to top page
	if (event.locals.user && (
		event.url.pathname === '/login' || 
		event.url.pathname === '/register'
	)) {
		redirect(303, '/')
	}

	return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)
