import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	try {
		// Supabaseの接続状態を確認
		let connectionStatus = 'Connected';
		try {
			const { error } = await supabase.from('sample').select('count', { count: 'exact' }).limit(1);
			if (error) {
				connectionStatus = 'Error: ' + error.message;
			}
		} catch {
			connectionStatus = 'Connection Error';
		}

		// パブリックなサンプルデータを読み込み（認証は不要）
		const { data: samples, error: fetchError } = await supabase
			.from('sample')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(10);

		if (fetchError) {
			console.error('Error loading samples:', fetchError);
			return {
				samples: [],
				session,
				connectionStatus,
				error: 'サンプルデータの読み込みに失敗しました'
			};
		}

		return {
			samples: samples || [],
			session,
			connectionStatus,
			error: null
		};
	} catch (err) {
		console.error('Unexpected error in load function:', err);
		return {
			samples: [],
			session,
			connectionStatus: 'Error',
			error: '予期しないエラーが発生しました'
		};
	}
};

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const description = formData.get('description')?.toString();

		// バリデーション
		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'サンプル名は必須です' });
		}

		if (name.trim().length > 100) {
			return fail(400, { error: 'サンプル名は100文字以内で入力してください' });
		}

		if (description && description.length > 500) {
			return fail(400, { error: '説明は500文字以内で入力してください' });
		}

		try {
			const { error } = await supabase.from('sample').insert({
				name: name.trim(),
				description: description?.trim() || null
			});

			if (error) {
				console.error('Error inserting sample:', error);
				return fail(500, { error: 'サンプルの追加に失敗しました' });
			}

			return { success: true };
		} catch (err) {
			console.error('Unexpected error in add action:', err);
			return fail(500, { error: '予期しないエラーが発生しました' });
		}
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		// バリデーション
		if (!id) {
			return fail(400, { error: 'IDが指定されていません' });
		}

		try {
			const { error } = await supabase.from('sample').delete().eq('id', parseInt(id, 10));

			if (error) {
				console.error('Error deleting sample:', error);
				return fail(500, { error: 'サンプルの削除に失敗しました' });
			}

			return { success: true };
		} catch (err) {
			console.error('Unexpected error in delete action:', err);
			return fail(500, { error: '予期しないエラーが発生しました' });
		}
	}
};
