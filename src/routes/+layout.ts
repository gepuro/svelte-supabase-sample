import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { Database } from '$lib/database.types.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ data, depends, fetch }: any) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth')

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch,
				},
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch,
				},
				cookies: {
					getAll() {
						return data.cookies
					},
				},
			})

	/**
	 * For complete security, only use getUser() which validates the JWT by 
	 * contacting the Supabase Auth server. We completely avoid any session
	 * usage to prevent security warnings.
	 */
	const {
		data: { user },
	} = await supabase.auth.getUser()

	return { supabase, user }
}
