import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types.js';
import type { SampleRow, SampleInsert } from '../types.js';
import { formatErrorMessage } from '../components/util/formatting.js';

export class SampleService {
	constructor(private supabase: SupabaseClient<Database>) {}

	async getConnectionStatus(): Promise<string> {
		try {
			const { error } = await this.supabase
				.from('sample')
				.select('count', { count: 'exact' })
				.limit(1);

			return error ? `Error: ${error.message}` : 'Connected';
		} catch {
			return 'Connection Error';
		}
	}

	async getSamples(limit = 10): Promise<{ data: SampleRow[]; error?: string }> {
		try {
			const { data, error } = await this.supabase
				.from('sample')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(limit);

			if (error) {
				console.error('Error loading samples:', error);
				return { data: [], error: 'サンプルデータの読み込みに失敗しました' };
			}

			return { data: data || [] };
		} catch (err) {
			console.error('Unexpected error loading samples:', err);
			return { data: [], error: formatErrorMessage(err) };
		}
	}

	async addSample(
		sample: Omit<SampleInsert, 'id' | 'created_at'>
	): Promise<{ success: boolean; error?: string }> {
		try {
			const { error } = await this.supabase.from('sample').insert({
				name: sample.name,
				description: sample.description || null
			});

			if (error) {
				console.error('Error inserting sample:', error);
				return { success: false, error: 'サンプルの追加に失敗しました' };
			}

			return { success: true };
		} catch (err) {
			console.error('Unexpected error adding sample:', err);
			return { success: false, error: formatErrorMessage(err) };
		}
	}

	async deleteSample(id: number): Promise<{ success: boolean; error?: string }> {
		try {
			const { error } = await this.supabase.from('sample').delete().eq('id', id);

			if (error) {
				console.error('Error deleting sample:', error);
				return { success: false, error: 'サンプルの削除に失敗しました' };
			}

			return { success: true };
		} catch (err) {
			console.error('Unexpected error deleting sample:', err);
			return { success: false, error: formatErrorMessage(err) };
		}
	}
}
