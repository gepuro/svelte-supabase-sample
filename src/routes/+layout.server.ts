// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { user }, cookies }: any) => {
	return {
		user,
		cookies: cookies.getAll()
	};
};
