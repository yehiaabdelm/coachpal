<script lang="ts">
	import Spinner from './ui/spinner.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { page } from '$app/state';

	let PUBLIC_API_URL = 'http://localhost:3000';

	let payload = $state({
		firstName: '',
		lastName: '',
		password: ''
	});
	let error = $state('');

	async function fetchInvite(): Promise<
		| {
				firstName: string | null;
				lastName: string | null;
				email: string;
				role: string | null;
				type: 'coach' | 'athlete';
				status: 'pending' | 'accepted' | 'expired';
				message: string | null;
				expiresAt: Date | null;
				acceptedAt: Date | null;
				organization: {
					name: string;
				};
		  }
		| undefined
	> {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/invitations/${page.params.token}`);
			if (res.ok) {
				return await res.json();
			} else {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? 'Failed to pull invite data');
			}
		} catch (err: any) {
			throw err;
		}
	}

	let inviteData = $state(fetchInvite());

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	async function handleSubmit(e: Event) {
		e.preventDefault();
		try {
			const res = await fetch(`${PUBLIC_API_URL}/auth/signup-with-organization`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
				credentials: 'include'
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? 'Failed to sign up');
			}
			const data = await res.json();
			window.location.href = '/dashboard';
		} catch (err: any) {
			console.log(err);
			error = err.message;
		}
	}

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-6">
		<div class="flex flex-col gap-4">
			<a href="##" class="flex flex-col items-center gap-2 font-medium">
				<div class="flex rounded-md">
					<img class="w-10" src="/icon-transparent.png" alt="" />
				</div>
			</a>
			<h1 class="text-gray-3-dark text-center text-sm">Coaching that works with you</h1>
		</div>
		{#await inviteData}
			<Spinner />
		{:then value}
			<form>
				<div class="flex flex-col gap-6">
					<div class="grid gap-3">
						<div class="grid gap-3">
							<div class="grid gap-1">
								<Label for="organization-{id}">Organization</Label>
								<p class="text-muted-foreground text-sm">
									You've been invited to join an organization
								</p>
							</div>
							<div
								id="organization-{id}"
								class="flex items-center rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900"
							>
								{value?.organization.name}
							</div>
						</div>
						<div class="grid gap-3">
							<Label for="organization-{id}">Email</Label>
							<div
								id="organization-{id}"
								class="flex items-center rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900"
							>
								{value?.email}
							</div>
						</div>
						<div class="mt-1 flex flex-col gap-3 md:flex-row">
							<div class="flex flex-1 flex-col gap-2">
								<Label for="first-name-{id}">First Name</Label>
								<Input id="first-name-{id}" placeholder="Yehia" bind:value={payload.firstName} />
							</div>
							<div class="flex flex-1 flex-col gap-2">
								<Label for="last-name-{id}">Last Name</Label>
								<Input id="last-name-{id}" placeholder="A" bind:value={payload.lastName} />
							</div>
						</div>
						<Label for="password-{id}">Password</Label>
						<Input
							id="password-{id}"
							type="password"
							placeholder="********"
							bind:value={payload.password}
							required
						/>
					</div>
					<Button type="submit" class="w-full">Sign up</Button>
				</div>
			</form>
			<div
				class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
			>
				By clicking continue, you agree to our <a href="##">Terms of Service</a>
				and <a href="##">Privacy Policy</a>.
			</div>
		{:catch error}
			<div
				class="text-red-light col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
			>
				<span
					>{error.message}
					<a class="underline" href="/login">Back home</a>
				</span>
			</div>
		{/await}
	</div>
</div>
