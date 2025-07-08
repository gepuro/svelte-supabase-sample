import { redirect, fail } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { session, supabase } }: any) => {
	if (!session) {
		throw redirect(303, '/login');
	}

	try {
		// サンプルテーブルからデータを取得
		const { data: sampleData, error } = await supabase
			.from('sample_table')
			.select('*')
			.limit(10);

		if (error) {
			console.error('Error fetching sample data:', error);
			return {
				session,
				sampleData: [],
				error: error.message
			};
		}

		return {
			session,
			sampleData: sampleData || [],
			error: null,
			user: {
				id: session.user.id,
				email: session.user.email,
				fullName: session.user.user_metadata?.full_name || null,
				createdAt: session.user.created_at
			}
		};
	} catch (error) {
		console.error('Unexpected error in dashboard load:', error);
		return {
			session,
			sampleData: [],
			error: 'Unexpected error occurred'
		};
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actions = {
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
			.from('sample_table')
			.insert([{ name, description }]);

		if (error) {
			console.error('Error creating record:', error);
			return fail(500, { message: 'Failed to create record' });
		}

		return { success: true };
	}
};
