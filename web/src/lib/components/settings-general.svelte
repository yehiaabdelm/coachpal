<script lang="ts">
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';
	import DateOfBirthPicker from './date-of-birth-picker.svelte';
	import { type CalendarDate } from '@internationalized/date';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Spinner from './ui/spinner.svelte';

	let dateOfBirth = $state<CalendarDate | undefined>();

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const fetchUser = async (): Promise<
		| {
				firstName: string | null;
				lastName: string | null;
				email: string;
		  }
		| undefined
	> => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/users/me`, {
				credentials: 'include'
			});

			if (res.ok) {
				return await res.json();
			} else {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? 'Failed to pull user data');
			}
		} catch (error) {}
	};
	let userData = $state(fetchUser());
</script>

<header
	class="mx-4 flex h-16 shrink-0 flex-col items-start gap-1 pb-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
>
	<p class="mt-4 text-lg font-medium">General</p>
	<p class="text-muted-foreground text-sm">Update your settings</p>
</header>

{#await userData}
	<div class="my-auto flex flex-col items-center gap-6">
		<Spinner />
	</div>
{:then value}
	<form class="flex flex-1 flex-col space-y-6 overflow-y-auto p-4 pt-0">
		<section class="mt-4">
			<div class="flex gap-4 *:flex *:flex-1 *:flex-col *:gap-1.5">
				<div>
					<div class="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
						<p class="text-muted-foreground text-2xl">
							{value?.firstName?.slice(0, 1)}{value?.lastName?.slice(0, 1)}
						</p>
					</div>
				</div>
			</div>
			<p class="text-muted-foreground py-2 text-xs">
				Recommended size: 200×200px. JPG or PNG only.
			</p>
		</section>
		<!-- <section class="space-y-1">
		<Label for="email">Email</Label>
		<p class="text-foreground text-sm font-medium">user@example.com</p>
		<p class="text-muted-foreground text-xs">This is your login email and cannot be changed.</p>
	</section> -->
		<section class="space-y-2">
			<div class="flex gap-4 *:flex *:flex-1 *:flex-col *:gap-1.5">
				<div>
					<Label for="first-name">First name</Label>
					<Input type="text" id="first-name" placeholder="First Name" value={value?.firstName} />
				</div>
				<div>
					<Label for="last-name">Last name</Label>
					<Input type="text" id="last-name" placeholder="Last Name" value={value?.lastName} />
				</div>
			</div>
		</section>
		<section class="space-y-2">
			<DateOfBirthPicker value={dateOfBirth} />
		</section>
	</form>
{:catch error}
	<div
		class="text-red-light col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
	>
		<span>{error.message} </span>
	</div>
{/await}
