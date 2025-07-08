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
	resetPassword: async ({ request, locals: { supabase } }: any) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { error: 'メールアドレスを入力してください。' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: '有効なメールアドレスを入力してください。' });
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${process.env.NODE_ENV === 'production' ? 'https://yourapp.com' : 'http://localhost:5173'}/auth/callback`,
		});

		if (error) {
			console.error('Password reset error:', error);
			return fail(400, { error: 'パスワードリセットメールの送信に失敗しました。' });
		}

		return { success: true, message: 'パスワードリセットメールを送信しました。メールをご確認ください。' };
	}
};
