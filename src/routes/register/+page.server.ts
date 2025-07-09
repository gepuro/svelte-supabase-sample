import { fail, redirect } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { session } }: any) => {
	if (session) {
		throw redirect(303, '/dashboard');
	}
	return {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actions = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: async ({ request, locals: { supabase }, url }: any) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// バリデーション
		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'すべてのフィールドを入力してください。' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'パスワードが一致しません。' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'パスワードは6文字以上で入力してください。' });
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			console.error('Registration error:', error);
			
			let errorMessage = 'アカウント作成に失敗しました。';
			
			if (error.message.includes('User already registered')) {
				errorMessage = 'このメールアドレスは既に登録されています。';
			} else if (error.message.includes('Password should be at least')) {
				errorMessage = 'パスワードは6文字以上で入力してください。';
			} else if (error.message.includes('Unable to validate email address')) {
				errorMessage = '有効なメールアドレスを入力してください。';
			}

			return fail(400, { error: errorMessage });
		}

		// 登録成功 - メール確認が必要なことを伝えるページにリダイレクト
		throw redirect(303, '/auth/setup');
	}
};
