<script lang="ts">
	interface NavLink {
		href: string;
		label: string;
		variant: 'register' | 'login' | 'dashboard' | 'setup';
	}

	interface Props {
		isAuthenticated: boolean;
	}

	let { isAuthenticated }: Props = $props();

	const links: NavLink[] = [
		...(isAuthenticated
			? []
			: [
					{ href: '/register', label: '新規登録', variant: 'register' as const },
					{ href: '/login', label: 'ログイン', variant: 'login' as const }
				]),
		{ href: '/dashboard', label: 'ダッシュボード', variant: 'dashboard' as const },
		{ href: '/auth/setup', label: '認証設定確認', variant: 'setup' as const }
	];

	const variantClasses = {
		register:
			'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-green-500/25',
		login:
			'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25',
		dashboard:
			'bg-gradient-to-r from-red-400 to-yellow-400 text-white shadow-lg hover:shadow-red-500/25',
		setup:
			'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-gray-500/25'
	};
</script>

<nav class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
	<div class="flex flex-wrap justify-center gap-4">
		{#each links as link}
			<a
				href={link.href}
				class="transform rounded-lg px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 {variantClasses[
					link.variant
				]}"
			>
				{link.label}
			</a>
		{/each}
	</div>
</nav>
