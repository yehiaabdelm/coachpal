import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PUBLIC_API_URL } from '$env/static/public';
import { selectedOrganization } from './state/organization.svelte';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export async function selectOrganization(org: any) {
	selectedOrganization.value = org;
	try {
		const res = await fetch(`${PUBLIC_API_URL}/organizations/${org.organization.id}/select`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}),
			credentials: 'include'
		});
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error(data.message ?? 'Failed to select organization');
		}
	} catch (err: any) {
		console.log(err);
	}
}
