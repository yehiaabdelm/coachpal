<script lang="ts">
	import Spinner from './ui/spinner.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const fetchInvite = async () => {
		return '';
	};
	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-4">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex rounded-md">
						<img class="w-10" src="/icon-transparent.png" alt="" />
					</div>
				</a>
				<h1 class="text-gray-3-dark text-center text-sm">Coaching that works with you</h1>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<div class="grid gap-1">
						<Label for="organization-name-{id}">Organization Name</Label>
						<p class="text-muted-foreground text-sm">Create your own organization.</p>
					</div>
					<Input id="organization-name-{id}" type="text" placeholder="Downtown CrossFit" required />
					<div class="mt-1 flex flex-col gap-3 md:flex-row">
						<div class="flex flex-1 flex-col gap-2">
							<Label for="first-name-{id}">First Name</Label>
							<Input id="first-name-{id}" placeholder="Yehia" />
						</div>
						<div class="flex flex-1 flex-col gap-2">
							<Label for="last-name-{id}">Last Name</Label>
							<Input id="last-name-{id}" placeholder="A" />
						</div>
					</div>
					<Label for="email-{id}">Email</Label>
					<Input id="email-{id}" type="email" placeholder="m@example.com" required />
					<Label for="password-{id}">Password</Label>
					<Input id="password-{id}" type="password" placeholder="********" required />
				</div>
				<Button type="submit" class="w-full">Sign up</Button>
			</div>
		</div>
	</form>
	{#await fetchData()}
		<!-- promise is pending -->
		<p>waiting for the promise to resolve...</p>
		<Spinner />
	{:then value}
		<!-- promise was fulfilled or not a Promise -->
		<p>The value is {value}</p>
	{:catch error}
		<!-- promise was rejected -->
		<p>Something went wrong: {error.message}</p>
	{/await}
	<!-- <div class="text-gray-3-dark text-sm">
		Have have an account?
		<a href="/login" class="underline underline-offset-4"> Log in </a>
	</div> -->
	<!-- <div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Have an account? <a href="##">Log in</a>.
	</div> -->
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div>
</div>
