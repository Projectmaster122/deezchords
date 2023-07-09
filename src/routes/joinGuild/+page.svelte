<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import getThisUser from '$lib/api/v10/global/getThisUser';
	import tokenValid from '$lib/api/v10/global/tokenValid';
	import { getPromiseFromEvent, sleep } from '$lib/common';
	import { currentTabStore, tokenStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiDatabase, mdiKey } from '@mdi/js';
	import {
		TabGroup,
		Tab,
		toastStore,
		Step,
		Stepper,
		Avatar,
		modalStore,
		CodeBlock
	} from '@skeletonlabs/skeleton';

	currentTabStore.set(commonTabs.joinGuild);

	let code = '';
</script>

<div
	class="flex h-full m-4 rounded-container-token justify-center items-center bg-cover bg-no-repeat bg-center"
>
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<header class="font-bold text-2xl">Join a guild</header>
		<p>
			You can join a guild by using the invite code below. Alternatively, use the sidebar menu to
			access publicly available guilds. See <a href="/joinGuild/public" class="anchor"
				>public guilds</a
			>.
		</p>
		<input
			type="text"
			class="input variant-form-material"
			bind:value={code}
			placeholder="Invite code"
		/>
	</div>
</div>
