<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { PUBLIC_API_URL } from '$env/static/public';

	let code = $state('');
	let error = $state('');
	let {
		email,
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { email: string } = $props();

	async function handleSubmit(e: Event) {
		e.preventDefault();

		try {
			const res = await fetch(`${PUBLIC_API_URL}/auth/email-verification`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code }),
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
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form onsubmit={handleSubmit} class="mx-auto">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-4">
				<a href="##" class="items-left flex flex-col gap-2 font-medium">
					<div class="flex rounded-md">
						<img class="w-10" src="/icon-transparent.png" alt="" />
					</div>
				</a>
				<h1 class="text-gray-2-dark text-sm">
					We sent a code to <span class="font-semibold">{email}</span> <br /> so we can verify your email
				</h1>
			</div>
			<div class="items-left flex flex-col gap-4">
				<InputOTP.Root maxlength={6} bind:value={code}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3, 6) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<div class="flex flex-col gap-2">
					<Button type="submit" class="w-min">Submit</Button>
					<div
						class="text-red-light col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
					>
						<span>{error} </span>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
