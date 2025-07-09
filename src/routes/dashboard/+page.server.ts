import { redirect, fail } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { user, supabase } }: any) => {
	if (!user) {
		throw redirect(303, '/login');
	}

	try {
		// サンプルテーブルからデータを取得
		const { data: sampleData, error } = await supabase
			.from('sample')
			.select('*')
			.limit(10);

		if (error) {
			console.error('Error fetching sample data:', error);
			return {
				sampleData: [],
				error: error.message
			};
		}

		return {
			sampleData: sampleData || [],
			error: null,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.user_metadata?.full_name || null,
				createdAt: user.created_at
			}
		};
	} catch (error) {
		console.error('Unexpected error in dashboard load:', error);
		return {
			sampleData: [],
			error: 'Unexpected error occurred'
		};
	}
};

export const actions = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	logout: async ({ locals: { supabase } }: any) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return fail(500, { message: 'サインアウトに失敗しました' });
		}
		throw redirect(303, '/login');
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	create: async ({ request, locals: { supabase } }: any) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!name || !description) {
			return fail(400, { message: 'Name and description are required' });
		}

		const { error } = await supabase
			.from('sample')
			.insert([{ name, description }]);

		if (error) {
			console.error('Error creating record:', error);
			return fail(500, { message: 'Failed to create record' });
		}

		return { success: true };
	}
};
