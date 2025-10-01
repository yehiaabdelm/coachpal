<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import UsersRound from '@lucide/svelte/icons/users-round';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import CommandIcon from '@lucide/svelte/icons/command';
	import LockIcon from '@lucide/svelte/icons/lock';
	import Building from '@lucide/svelte/icons/building';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SettingsGeneral from './settings-general.svelte';
	import SettingsOrganization from './settings-organization.svelte';
	import SettingsTeam from './settings-team.svelte';
	import SettingsLanguageRegion from './settings-language-region.svelte';

	const nav = [
		{ name: 'General', icon: SettingsIcon, content: SettingsGeneral },
		{ name: 'Team', icon: UsersRound, content: SettingsTeam },
		{ name: 'Organization', icon: Building, content: SettingsOrganization },
		{ name: 'Language & region', icon: GlobeIcon, content: SettingsLanguageRegion }
		// { name: 'Privacy & visibility', icon: LockIcon }
	];

	let selected = $state({ name: 'General', icon: SettingsIcon, content: SettingsGeneral });
	let { open = $bindable(false) }: { open: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]"
		showCloseButton={false}
		trapFocus={false}
	>
		<Dialog.Title class="sr-only">Settings</Dialog.Title>
		<Dialog.Description class="sr-only">Customize your settings here.</Dialog.Description>
		<Sidebar.Provider class=" items-start">
			<Sidebar.Root collapsible="none" class="hidden md:flex">
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
				<Sidebar.Content class="mt-3">
					<Sidebar.Group>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each nav as item (item.name)}
									<Sidebar.MenuItem
										onclick={() => {
											selected = item;
										}}
									>
										<Sidebar.MenuButton isActive={item.name === selected.name}>
											{#snippet child({ props })}
												<a href="##" {...props}>
													<item.icon />
													<span>{item.name}</span>
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<main class="flex h-[480px] flex-1 flex-col overflow-hidden px-2">
				<selected.content />
			</main>
		</Sidebar.Provider>
	</Dialog.Content>
</Dialog.Root>
