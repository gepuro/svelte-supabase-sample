import { supabaseAdmin } from '$lib/server/index.js';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	// 認証確認
	const { user } = await locals.safeGetSession();

	if (!user) {
		redirect(303, '/login');
	}

	// 管理者権限の確認（例：特定のemail domainやユーザーメタデータで確認）
	// ここでは簡単な例として、特定のemailを管理者として扱います
	const isAdmin = user.email?.endsWith('@admin.com') || user.email === 'gepuro@gmail.com';

	if (!isAdmin) {
		error(403, '管理者権限が必要です');
	}

	try {
		console.log('🔍 Supabase Admin 接続テスト開始...');
		console.log('URL:', PUBLIC_SUPABASE_URL);
		console.log('Service Role Key設定済み:', !!SUPABASE_SERVICE_ROLE_KEY);
		
		// 管理者権限でユーザー一覧を取得
		console.log('📋 ユーザー一覧取得を試行中...');
		const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

		if (usersError) {
			console.error('❌ ユーザー一覧の取得エラー:', {
				message: usersError.message,
				status: usersError.status,
				details: usersError
			});
			error(500, 'ユーザーデータの取得に失敗しました');
		}
		
		console.log('✅ ユーザー一覧取得成功:', users.users?.length || 0, 'ユーザー');

		// デバッグ用：ユーザーオブジェクトの構造を確認
		if (users.users && users.users.length > 0) {
			console.log('ユーザーオブジェクトの構造:', JSON.stringify(users.users[0], null, 2));
		}

		// サンプルテーブルのデータを取得
		console.log('📊 サンプルデータ取得を試行中...');
		const { data: sampleData, error: sampleError } = await supabaseAdmin
			.from('sample')
			.select('*')
			.order('created_at', { ascending: false });

		if (sampleError) {
			console.error('❌ サンプルデータの取得エラー:', {
				message: sampleError.message,
				details: sampleError
			});
		} else {
			console.log('✅ サンプルデータ取得成功:', sampleData?.length || 0, '件');
		}

		// 統計情報を取得
		const totalUsers = users.users?.length || 0;

		const { count: totalSamples } = await supabaseAdmin
			.from('sample')
			.select('*', { count: 'exact', head: true });

		return {
			user,
			users: users.users || [],
			sampleData: sampleData || [],
			stats: {
				totalUsers,
				totalSamples: totalSamples || 0
			}
		};
	} catch (err) {
		console.error('💥 管理者ページデータ取得で例外発生:', {
			name: (err as Error)?.name,
			message: (err as Error)?.message,
			stack: (err as Error)?.stack,
			error: err
		});
		error(500, 'データの取得に失敗しました');
	}
};
