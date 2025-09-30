<script>
	import Spinner from '$lib/components/ui/spinner.svelte';
	import { cn } from '$lib/utils.js';
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<div class={cn('flex flex-col gap-6')}>
			<div class="flex flex-col items-center gap-6">
				<div class="flex flex-col gap-4">
					<a href="##" class="flex flex-col items-center gap-2 font-medium">
						<div class="flex rounded-md">
							<img class="w-10" src="/icon-transparent.png" alt="" />
						</div>
					</a>
					<h1 class="text-gray-3-dark text-center text-sm">Coaching that works with you</h1>
				</div>
				<Spinner />
			</div>
		</div>
	</div>
</div>
