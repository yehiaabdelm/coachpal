<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let PUBLIC_API_URL = 'http://localhost:3000';
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();

	let payload = $state({
		email: '',
		password: ''
	});
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch(`${PUBLIC_API_URL}/auth/login`, {
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
		} finally {
			loading = false;
		}
	}
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form onsubmit={handleSubmit}>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-4">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex rounded-md">
						<img class="w-10" src="/icon-transparent.png" alt="" />
					</div>
				</a>
				<!-- <h1 class="text-gray-3-dark text-center text-sm">Coaching that works with you</h1> -->
				<div class="text-center text-sm">
					Don&apos;t have an account?
					<a href="/signup" class="underline underline-offset-4"> Sign up </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email-{id}">Email</Label>
					<Input
						id="email-{id}"
						type="email"
						bind:value={payload.email}
						placeholder="yehia@teletyped.com"
						required
					/>
					<Label for="password-{id}">Password</Label>
					<Input
						id="password-{id}"
						type="password"
						bind:value={payload.password}
						placeholder="********"
						required
					/>
				</div>
				<Button type="submit" class="w-full">Log in</Button>
			</div>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Forgot your password? <a href="##">Reset</a>
	</div>
</div>
