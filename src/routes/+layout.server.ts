// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals: { session }, cookies }: any) => {
	return {
		session,
		cookies: cookies.getAll(),
	}
}
