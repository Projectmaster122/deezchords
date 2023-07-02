<script lang="ts">
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import getThisUser, { type IgetThisUser } from '$lib/api/v10/global/getThisUser';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { blur } from 'svelte/transition';

	export let token = '';
	export let selected = false
	export let current = false

	let user: IgetThisUser;
	let prom = getThisUser(token);

	prom.then((u) => {
		if (!u) return;
		user = u;
	});
</script>

{#await prom}
	<div class="flex gap-4 justify-center items-center card variant-ghost-surface p-4">
		<span><div class="placeholder-circle animate-pulse w-16" /></span>
		<span class="flex-auto">
			<div class="placeholder animate-pulse" />
		</span>
	</div>
{:then}
	<div class="flex gap-4 items-center card {selected ? 'variant-ghost-primary' : 'variant-ghost-surface'} p-4">
		<span
			><Avatar
				src={user.avatar ? cdnUserAvatar(user.id, user.avatar) : undefined}
				initials={generatePfpInitials(user.global_name || user.username)}
			/></span
		>
		<span class="flex flex-col items-start">
			<dt class="font-bold">{user.global_name || '[No name]'}</dt>
			<dd class="text-sm opacity-50">{current ? 'Current: ' : ''}@{user.username}</dd>
		</span>
	</div>
{:catch error}
	<div class="flex gap-4 justify-center items-center card variant-ghost-error p-4">
		Failed to load a user.
	</div>
{/await}
