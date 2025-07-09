import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ url, locals: { supabase } }: any) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	if (error) {
		const errorMessage = errorDescription || '認証に失敗しました。';
		throw redirect(303, `/login?error=${encodeURIComponent(errorMessage)}`);
	}

	if (code) {
		try {
			const { error } = await supabase.auth.exchangeCodeForSession(code);

			if (error) {
				console.error('Code exchange error:', error);
				throw redirect(303, `/login?error=${encodeURIComponent('認証に失敗しました。')}`);
			}

			// 成功時はダッシュボードにリダイレクト
			throw redirect(303, '/dashboard');
		} catch (err) {
			console.error('Unexpected error during code exchange:', err);
			throw redirect(
				303,
				`/login?error=${encodeURIComponent('認証処理中にエラーが発生しました。')}`
			);
		}
	}

	// コードがない場合はログインページにリダイレクト
	throw redirect(303, '/login');
};
