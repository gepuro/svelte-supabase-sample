import { supabaseAdmin } from '$lib/server/index.js';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	// 認証確認
	const { user } = await locals.safeGetSession();

	if (!user) {
		error(401, 'ログインが必要です');
	}

	// 管理者権限の確認
	const isAdmin = user.email?.endsWith('@admin.com') || user.email === 'gepuro@gmail.com';

	if (!isAdmin) {
		error(403, '管理者権限が必要です');
	}

	try {
		const body = await request.json();
		const { action, data: actionData } = body;

		switch (action) {
			case 'deleteUser': {
				const { userId } = actionData;
				const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

				if (deleteError) {
					console.error('ユーザー削除エラー:', deleteError);
					error(500, 'ユーザーの削除に失敗しました');
				}

				return json({ success: true, message: 'ユーザーを削除しました' });
			}

			case 'updateUserEmail': {
				const { userId, newEmail } = actionData;
				const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
					email: newEmail
				});

				if (updateError) {
					console.error('ユーザー更新エラー:', updateError);
					error(500, 'ユーザーの更新に失敗しました');
				}

				return json({ success: true, message: 'ユーザー情報を更新しました' });
			}

			case 'createSampleData': {
				const { name } = actionData;
				const { error: insertError } = await supabaseAdmin.from('sample').insert({ name });

				if (insertError) {
					console.error('サンプルデータ作成エラー:', insertError);
					error(500, 'サンプルデータの作成に失敗しました');
				}

				return json({ success: true, message: 'サンプルデータを作成しました' });
			}

			case 'deleteSampleData': {
				const { id } = actionData;
				const { error: deleteError } = await supabaseAdmin.from('sample').delete().eq('id', id);

				if (deleteError) {
					console.error('サンプルデータ削除エラー:', deleteError);
					error(500, 'サンプルデータの削除に失敗しました');
				}

				return json({ success: true, message: 'サンプルデータを削除しました' });
			}

			default:
				error(400, '不正なアクションです');
		}
	} catch (err) {
		console.error('管理者API エラー:', err);
		error(500, 'サーバーエラーが発生しました');
	}
};
