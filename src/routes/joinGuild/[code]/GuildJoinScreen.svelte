<script lang="ts">
	import ServerAccordionItem from '$lib/ServerAccordionItem.svelte';
	import cdnGuildBanner from '$lib/api/cdn/guildBanner';
	import cdnGuildIcon from '$lib/api/cdn/guildIcon';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import type { IInvite } from '$lib/api/types/guild';
	import inviteGuild from '$lib/api/v10/global/inviteGuild';
	import { Accordion, Avatar, CodeBlock } from '@skeletonlabs/skeleton';
	import { blur } from 'svelte/transition';

	export let code;
	export let guild: IInvite | false = false;

	let prom = inviteGuild({ guildId: code });

	prom.then((u) => {
		if (!u) return;
		guild = u;
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
	{#if guild && guild.guild}
		<div class="flex flex-col gap-2">
			<Accordion class="w-80">
				<ServerAccordionItem
					profile={guild.guild.icon ? cdnGuildIcon(guild.guild.id, guild.guild.icon) : undefined}
					banner={guild.guild.banner
						? cdnGuildBanner(guild.guild.id, guild.guild.banner) + '?size=240'
						: undefined}
					initials={generatePfpInitials(guild.guild.name)}
				>
					<svelte:fragment slot="summary">{guild.guild.name}</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="w-80 p-4 gap-4 flex flex-col">
							<div class="flex gap-2 justify-center">
								<span class="chip variant-soft-success"
									>~{guild.approximate_presence_count} online</span
								>
								<span class="chip variant-soft-tertiary"
									>~{guild.approximate_member_count} members</span
								>
							</div>
							<blockquote class="blockquote py-4 bg-surface-50-900-token">
								{guild.guild.description || 'No description'}
							</blockquote>
						</div>
					</svelte:fragment>
				</ServerAccordionItem>
			</Accordion>
			<span class="w-80"
				>To view and interact with this guild, drag it into your channel list to join it.</span
			>
		</div>
	{:else}
		<div class="flex gap-4 justify-center items-center card variant-ghost-error p-4">
			Failed to load server
		</div>
	{/if}
{/await}
