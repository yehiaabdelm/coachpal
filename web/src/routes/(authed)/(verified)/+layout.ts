import type { LayoutLoad } from '../$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { User } from '../../../types';
import { redirect } from '@sveltejs/kit';
export const load = (async ({ fetch }) => {
	const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
		credentials: 'include'
	});
	const user: User = await response.json();

	if (!user.emailVerifiedAt) {
		redirect(303, '/email-verification');
	}

}) satisfies LayoutLoad;
