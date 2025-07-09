/**
 * エラーメッセージのフォーマット
 * @param error エラーオブジェクト
 * @returns フォーマットされたエラーメッセージ
 */
export function formatErrorMessage(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return '予期しないエラーが発生しました';
}

/**
 * 日付のフォーマット
 * @param dateString 日付文字列
 * @param locale ロケール（デフォルト: 'ja-JP'）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(dateString: string, locale = 'ja-JP'): string {
	try {
		return new Date(dateString).toLocaleString(locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch {
		return dateString;
	}
}
