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

	const data = {
		nav: [
			{ name: 'General', icon: SettingsIcon },
			{ name: 'Team', icon: UsersRound },
			{ name: 'Organization', icon: Building },
			{ name: 'Language & region', icon: GlobeIcon }
			// { name: 'Privacy & visibility', icon: LockIcon }
		]
	};

	let { open = $bindable(false) }: { open: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]"
		trapFocus={false}
	>
		<Dialog.Title class="sr-only">Settings</Dialog.Title>
		<Dialog.Description class="sr-only">Customize your settings here.</Dialog.Description>
		<Sidebar.Provider class="items-start">
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
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each data.nav as item (item.name)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={item.name === 'Team'}>
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
			<main class="flex h-[480px] flex-1 flex-col overflow-hidden">
				<header
					class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
				>
					<p class=" mt-4 gap-2 self-start px-4 text-lg font-medium md:block">General</p>
				</header>
				<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0"></div>
			</main>
		</Sidebar.Provider>
	</Dialog.Content>
</Dialog.Root>
