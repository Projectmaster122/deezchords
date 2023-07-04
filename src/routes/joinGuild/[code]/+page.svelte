<script lang="ts">
	import { currentTabStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiPlus } from '@mdi/js';
	import { Avatar } from '@skeletonlabs/skeleton';
	import GuildJoinScreen from './GuildJoinScreen.svelte';
	import type { IGuild, IInvite } from '$lib/api/types/guild';
	import cdnGuildSplash from '$lib/api/cdn/guildSplash';

	currentTabStore.set(commonTabs.joinGuild);

	export let data;

	let guild: IInvite | false;
</script>

<div
	class="flex h-full rounded-container-token justify-center items-center bg-cover bg-no-repeat bg-center"
	style="background-image: url({guild && guild.guild && guild.guild.splash
		? cdnGuildSplash(guild.guild.id, guild.guild.splash) + '?size=1024'
		: ''})"
>
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<GuildJoinScreen bind:guild code={data.code} />
	</div>
</div>
