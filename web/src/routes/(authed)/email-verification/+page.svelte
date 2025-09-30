<script lang="ts">
	import Otp from '$lib/components/otp.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props(); 
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<Otp email={data.user.email}/>
	</div>
</div>
