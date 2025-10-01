<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { buttonVariants } from './ui/button';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from './ui/popover';
	import * as Command from './ui/command';

	let members = $state([
		{
			name: 'Sofia Davis',
			email: 'm@example.com',
			role: 'Owner',
			avatar: '/avatars/01.png'
		},
		{
			name: 'Jackson Lee',
			email: 'p@example.com',
			role: 'Member',
			avatar: '/avatars/02.png'
		},
		{
			name: 'Isabella Nguyen',
			email: 'i@example.com',
			role: 'Member',
			avatar: '/avatars/03.png'
		}
	]);

	const roles = [
		{
			name: 'Viewer',
			description: 'Can view and comment.'
		},
		{
			name: 'Developer',
			description: 'Can view, comment and edit.'
		},
		{
			name: 'Billing',
			description: 'Can view, comment and manage billing.'
		},
		{
			name: 'Owner',
			description: 'Admin-level access to all resources.'
		}
	];
</script>

<header
	class="mx-4 flex h-16 shrink-0 flex-col items-start gap-1 text-left transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
>
	<p class="mt-4 text-lg font-medium md:block">Team</p>
	<p class="text-muted-foreground text-sm md:block">Invite team members to your organization</p>
</header>
<div class="mt-6 flex flex-col gap-5 overflow-y-auto p-4 pt-0">
	<div class="flex flex-1 flex-col gap-4">
		<p class="text-muted-foreground text-xs uppercase tracking-wider">Members</p>
		{#each members as member (member.name)}
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<!-- <Avatar.Root class="border">
						<Avatar.Image src={member.avatar} alt="Image" />
						<Avatar.Fallback>
							{member.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</Avatar.Fallback>
					</Avatar.Root> -->
					<div class="flex flex-col gap-0.5">
						<p class="text-sm font-medium leading-none">{member.name}</p>
						<p class="text-muted-foreground text-xs">{member.email}</p>
					</div>
				</div>
				<Popover.Root>
					<Popover.Trigger
						class={buttonVariants({
							variant: 'outline',
							size: 'sm',
							class: 'ml-auto shadow-none'
						})}
					>
						{member.role}
						<ChevronDownIcon />
					</Popover.Trigger>
					<Popover.Content class="p-0" align="end">
						<Command.Root>
							<Command.Input placeholder="Select role..." />
							<Command.List>
								<Command.Empty>No roles found.</Command.Empty>
								<Command.Group>
									{#each roles as role (role.name)}
										<Command.Item onSelect={() => (member.role = role.name)}>
											<div class="flex flex-col">
												<p class="text-sm font-medium">{role.name}</p>
												<p class="text-muted-foreground">
													{role.description}
												</p>
											</div>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/each}
	</div>
	<div class="">
		<p class="text-muted-foreground text-xs uppercase tracking-wider">Invitations</p>
	</div>
</div>
