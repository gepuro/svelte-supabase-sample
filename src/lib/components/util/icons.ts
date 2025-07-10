// 共通のアイコンパス定数
export const iconPaths = {
	success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
	warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
	info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
} as const;

// 共通のステータスクラス定数
export const statusClasses = {
	success: 'text-green-600 bg-green-50 border-green-200',
	warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
	error: 'text-red-600 bg-red-50 border-red-200',
	info: 'text-blue-600 bg-blue-50 border-blue-200'
} as const;

// アラート用のクラス定数（背景色が異なる）
export const alertClasses = {
	success: 'bg-green-50 border-green-200 text-green-800',
	error: 'bg-red-50 border-red-200 text-red-800',
	warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
	info: 'bg-blue-50 border-blue-200 text-blue-800'
} as const;
