<script lang="ts">
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import BankNoteIcon from '@lucide/svelte/icons/banknote';
	import Settings from '@lucide/svelte/icons/settings';
	import UserRound from '@lucide/svelte/icons/user-round';
	import type { User } from '../../types';
	import NavMain from './nav-main.svelte';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';

	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import CommandIcon from '@lucide/svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	import TeamSwitcher from './team-switcher.svelte';

	const data = {
		navMain: [
			{
				title: 'Clients',
				url: '#',
				icon: UserRound
			},
			{
				title: 'Dashboard',
				url: '#',
				icon: ChartPieIcon,
				isActive: true,
				items: [
					{ title: 'Overview', url: '#' },
					{ title: 'Compliance', url: '#' },
					{ title: 'Programming Due', url: '#' }
				]
			},
			{
				title: 'Programs',
				url: '#',
				icon: BookOpenIcon,
				items: [
					{ title: 'Splits', url: '#' }, // Day 1, Day 2, etc
					{ title: 'Templates', url: '#' },
					{ title: 'Exercise Library', url: '#' }
				]
			},
			{
				title: 'Payments',
				url: '#',
				icon: BankNoteIcon,
				items: [
					{ title: 'Payouts', url: '#' }, // Day 1, Day 2, etc
					{ title: 'Products & Subscriptions', url: '#' }
				]
			}
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '#',
				icon: Settings
			}
		],
		projects: []
	};

	let {
		user,
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher organizations={user.organizations} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
