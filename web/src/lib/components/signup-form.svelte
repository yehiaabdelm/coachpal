<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { PUBLIC_API_URL } from '$env/static/public';
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();

	let payload = $state({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		organization: { name: '' }
	});
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

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
			console.log('✅ signed up:', data);

			// e.g. redirect to dashboard
			window.location.href = '/dashboard';
		} catch (err: any) {
			console.log(err);
			error = err.message;
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
					Have an account?
					<a href="/login" class="underline underline-offset-4"> Log in </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<div class="grid gap-1">
						<Label for="organization-name-{id}">Organization Name</Label>
						<p class="text-muted-foreground text-sm">Create your own organization.</p>
					</div>
					<Input
						id="organization-name-{id}"
						type="text"
						placeholder="Downtown CrossFit"
						bind:value={payload.organization.name}
						required
					/>
					<div class="mt-1 flex flex-col gap-3 md:flex-row">
						<div class="flex flex-1 flex-col gap-2">
							<Label for="first-name-{id}">First Name</Label>
							<Input id="first-name-{id}" bind:value={payload.firstName} placeholder="Yehia" />
						</div>
						<div class="flex flex-1 flex-col gap-2">
							<Label for="last-name-{id}">Last Name</Label>
							<Input id="last-name-{id}" bind:value={payload.lastName} placeholder="A" />
						</div>
					</div>
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
				<Button type="submit" class="w-full">Sign up</Button>
			</div>
		</div>
	</form>
	<div
		class="text-red-light col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
	>
		<span
			>{error}
		</span>
	</div>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div>
</div>
