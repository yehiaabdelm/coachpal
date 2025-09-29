<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let code = $state('');

	$inspect(code);
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form>
		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-4">
				<a href="##" class="flex flex-col gap-2 font-medium">
					<div class="flex rounded-md">
						<img class="w-10" src="/icon-transparent.png" alt="" />
					</div>
				</a>
				<h1 class="text-gray-2-dark text-sm">
					We sent a code to your email so we can <br /> verify your email
				</h1>
			</div>
			<div class="flex flex-col gap-3">
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
			</div>
		</div>
		<Button type="submit" class="mt-4">Submit</Button>
	</form>
	<!-- <div class="text-gray-3-dark text-sm">
		Have have an account?
		<a href="/login" class="underline underline-offset-4"> Log in </a>
	</div> -->
	<!-- <div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Have an account? <a href="##">Log in</a>.
	</div> -->
</div>
