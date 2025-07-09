import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SampleService } from '$lib/services/sampleService.js';
import { validateSampleData, sanitizeSampleData } from '$lib/utils.js';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	const sampleService = new SampleService(supabase);
	
	try {
		const connectionStatus = await sampleService.getConnectionStatus();
		const { data: samples, error } = await sampleService.getSamples();

		return {
			samples,
			session,
			connectionStatus,
			error
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
		const sampleService = new SampleService(supabase);
		const formData = await request.formData();
		
		const rawData = {
			name: formData.get('name')?.toString() || '',
			description: formData.get('description')?.toString() || ''
		};

		// バリデーション
		const validation = validateSampleData(rawData);
		if (!validation.isValid) {
			return fail(400, { error: validation.errors[0].message });
		}

		// データのサニタイズ
		const sanitizedData = sanitizeSampleData(rawData);
		
		const result = await sampleService.addSample(sanitizedData);
		
		if (!result.success) {
			return fail(500, { error: result.error });
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const sampleService = new SampleService(supabase);
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'IDが指定されていません' });
		}

		const parsedId = parseInt(id, 10);
		if (isNaN(parsedId)) {
			return fail(400, { error: '無効なIDです' });
		}

		const result = await sampleService.deleteSample(parsedId);
		
		if (!result.success) {
			return fail(500, { error: result.error });
		}

		return { success: true };
	}
};
