<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import CommandIcon from '@lucide/svelte/icons/command';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let {
		organizations
	}: { organizations: { role: string; organization: { name: string; id: string } | null }[] } =
		$props();

	const sidebar = useSidebar();
	let error = $state('');
	let activeOrg = $state(organizations[0]);
	let hasSelectedOnLoad = $state(false);

	onMount(() => {
		if (!hasSelectedOnLoad && activeOrg?.organization?.id) {
			hasSelectedOnLoad = true;
			selectOrganization(activeOrg.organization.id);
		}
	});

	async function selectOrganization(orgId: string) {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/organizations/${orgId}/select`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
				credentials: 'include'
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? 'Failed to select organization');
			}
		} catch (err: any) {
			console.log(err);
			error = err.message;
		}
	}

	function handleOrgSelect(org: (typeof organizations)[0]) {
		activeOrg = org;
		if (org?.organization?.id) {
			selectOrganization(org.organization.id);
		}
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<CommandIcon class="size-4" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								{activeOrg?.organization?.name}
							</span>
							<span class="truncate text-xs capitalize">{activeOrg.role}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">Organizations</DropdownMenu.Label>
				{#each organizations as org, index (org?.organization?.name)}
					<DropdownMenu.Item onSelect={() => handleOrgSelect(org)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-md border">
							<CommandIcon class="size-4" />
						</div>
						{org?.organization?.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<PlusIcon class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Create organization</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
