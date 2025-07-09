import { fail, redirect } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { user } }: any) => {
	if (user) {
		throw redirect(303, '/dashboard');
	}
	return {};
};

export const actions = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	login: async ({ request, locals: { supabase } }: any) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'メールアドレスとパスワードを入力してください。' });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Login error:', error);

			let errorMessage = 'ログインに失敗しました。';

			if (error.message.includes('Invalid login credentials')) {
				errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
			} else if (error.message.includes('Email not confirmed')) {
				errorMessage = 'メールアドレスが確認されていません。確認メールをチェックしてください。';
			} else if (error.message.includes('Too many requests')) {
				errorMessage = '試行回数が多すぎます。しばらく時間をおいて再度お試しください。';
			}

			return fail(400, { error: errorMessage });
		}

		throw redirect(303, '/dashboard');
	}
};
