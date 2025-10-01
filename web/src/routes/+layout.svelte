<script lang="ts">
	import '../app.css';
	// import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<!-- <Toaster /> -->

<svelte:head>
	<link rel="icon" href="favicon.png" />
</svelte:head>

{@render children?.()}
