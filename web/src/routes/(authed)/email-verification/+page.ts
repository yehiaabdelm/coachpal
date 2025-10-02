import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { User } from '../../../types';

export const load = (async ({ fetch }) => {
	const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
		credentials: 'include'
	});
	const user: User = await response.json();
	if (user.emailVerifiedAt) {
		redirect(303, '/dashboard');
	}
	return {
		user
	}
}) satisfies PageLoad;
