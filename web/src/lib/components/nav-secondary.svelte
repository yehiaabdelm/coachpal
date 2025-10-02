<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Component, ComponentProps } from 'svelte';
	import BankNoteIcon from '@lucide/svelte/icons/banknote';
	import Settings from '@lucide/svelte/icons/settings';
	import SettingsDialog from './settings-dialog.svelte';

	let settingsDialog = $state(false);
	let {
		ref = $bindable(null),
		items,
		...restProps
	}: {
		items: {
			title: string;
			url: string;
			icon: Component;
		}[];
	} & ComponentProps<typeof Sidebar.Group> = $props();

</script>

<SettingsDialog open={settingsDialog} />

<Sidebar.Group bind:ref {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<a href="/payments">
					<Sidebar.MenuButton size="default">
						<BankNoteIcon />
						<span>Payments</span>
					</Sidebar.MenuButton>
				</a>
			</Sidebar.MenuItem>
			<Sidebar.MenuItem
				class="curor-pointer"
				onclick={() => {
					settingsDialog = !settingsDialog;
				}}
			>
				<Sidebar.MenuButton size="default">
					<Settings />
					<span>Settings</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
