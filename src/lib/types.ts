import type { Database } from './database.types.js';

// サンプルテーブルの型エイリアス
export type SampleRow = Database['public']['Tables']['sample']['Row'];
export type SampleInsert = Database['public']['Tables']['sample']['Insert'];
export type SampleUpdate = Database['public']['Tables']['sample']['Update'];

// フォーム関連の型
export interface FormState {
	loading: boolean;
	error?: string;
	success?: boolean;
}

export interface SampleFormData {
	name: string;
	description: string;
}

// バリデーション関連
export interface ValidationError {
	field: string;
	message: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

// ページデータの型
export interface HomePageData {
	samples: SampleRow[];
	session: any;
	connectionStatus: string;
	error?: string;
}

// アクションデータの型
export interface ActionResult {
	success?: boolean;
	error?: string;
}
