export const load = async ({ locals: { user, supabase } }) => {
	// Test Supabase connection
	let connectionStatus = 'Connected';
	try {
		const { error } = await supabase.from('sample').select('count', { count: 'exact' }).limit(1);
		if (error) {
			connectionStatus = 'Error: ' + error.message;
		}
	} catch {
		connectionStatus = 'Connection Error';
	}

	return {
		user,
		connectionStatus,
		redirectUrl: 'http://localhost:5173/auth/callback'
	};
};
