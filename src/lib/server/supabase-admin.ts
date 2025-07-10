import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '../database.types.js';

/**
 * サーバーサイド専用のSupabaseクライアント
 * - Service Role Keyを使用してフルアクセス権限を持つ
 * - サーバーサイドでのみ使用可能
 * - 管理者操作に使用する
 */
export const supabaseAdmin = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
