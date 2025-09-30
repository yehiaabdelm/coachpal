import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('token', {
		path: '/'
	});
	redirect(303, '/login');
};
