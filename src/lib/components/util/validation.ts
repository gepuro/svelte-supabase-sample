import type { SampleFormData, ValidationResult, ValidationError } from '../../types.js';

/**
 * サンプルデータのバリデーション
 * @param data バリデーション対象のフォームデータ
 * @returns バリデーション結果
 */
export function validateSampleData(data: SampleFormData): ValidationResult {
	const errors: ValidationError[] = [];

	// 名前のバリデーション
	if (!data.name?.trim()) {
		errors.push({ field: 'name', message: 'サンプル名は必須です' });
	} else if (data.name.trim().length > 100) {
		errors.push({ field: 'name', message: 'サンプル名は100文字以内で入力してください' });
	}

	// 説明のバリデーション
	if (data.description && data.description.length > 500) {
		errors.push({ field: 'description', message: '説明は500文字以内で入力してください' });
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * フォームデータのサニタイズ
 * @param data サニタイズ対象のフォームデータ
 * @returns サニタイズされたフォームデータ
 */
export function sanitizeSampleData(data: SampleFormData): SampleFormData {
	return {
		name: data.name?.trim() || '',
		description: data.description?.trim() || ''
	};
}
