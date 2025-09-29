<script lang="ts" module>
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import MapIcon from '@lucide/svelte/icons/map';
	import SendIcon from '@lucide/svelte/icons/send';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';

	const data = {
		user: {
			name: 'Coach John',
			email: 'coach@example.com',
			avatar: '/avatars/coach.jpg'
		},
		navMain: [
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
				title: 'Clients',
				url: '#',
				icon: UserRound
			}

			// {
			// 	title: 'Payments',
			// 	url: '#',
			// 	icon: SendIcon
			// 	// items: [
			// 	// 	{ title: 'Transactions', url: '#' },
			// 	// 	{ title: 'Recurring Payments', url: '#' },
			// 	// 	{ title: 'One-Time Payments', url: '#' },
			// 	// 	{ title: 'Payout Methods', url: '#' },
			// 	// 	{ title: 'Reminders / Late Clients', url: '#' }
			// 	// ]
			// },
			// {
			// 	title: 'Settings',
			// 	url: '#',
			// 	icon: Settings2Icon
			// }
		],
		navSecondary: [
			{
				title: 'Payments',
				url: '#',
				icon: SendIcon
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2Icon
			}
		],
		projects: []
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import CommandIcon from '@lucide/svelte/icons/command';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<CommandIcon class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-medium">Acme Inc</span>
								<span class="truncate text-xs">Enterprise</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
