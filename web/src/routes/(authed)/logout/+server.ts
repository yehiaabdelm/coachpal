import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('token', {
		path: '/',
		sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
		secure: env.NODE_ENV === 'production',
		domain: env.NODE_ENV === 'production' ? '.dev.coachpal.app' : undefined
	});
	redirect(303, '/login');
};
