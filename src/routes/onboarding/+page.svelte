<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import Logo from '$lib/Logo.svelte';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import corsiumPing from '$lib/api/corsium/ping';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import getThisUser from '$lib/api/v10/global/getThisUser';
	import tokenValid from '$lib/api/v10/global/tokenValid';
	import { getPromiseFromEvent, sleep } from '$lib/common';
	import { currentTabStore, tokenStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiDatabase, mdiKey, mdiSpeedometer, mdiStepForward, mdiStepForward2 } from '@mdi/js';
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
	import { onMount } from 'svelte';

	currentTabStore.set(commonTabs.onboarding);

	let iconAnimation = true;

	let promCorsium: Promise<boolean>;
	let doneCorsium: boolean = false;

	onMount(() => {
		promCorsium = corsiumPing("Initial ping");
		promCorsium.then((v) => (doneCorsium = v));

		setTimeout(() => {
			iconAnimation = false;

			promCorsium = corsiumPing("Heartbeat ping for onboarding");
		promCorsium.then((v) => (doneCorsium = v));
		}, 5 * 1000);
	});
</script>

<div class="flex h-full justify-center items-center bg-cover bg-no-repeat bg-center">
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<Stepper
			buttonBackLabel="Back"
			buttonNextLabel="Go on"
			buttonCompleteLabel="Let's do it!"
			buttonComplete="variant-filled-primary"
			class="max-w-lg"
			on:complete={() => {
				window.location.reload();
			}}
		>
			<Step buttonNextLabel="Welcome to Deez Chords!" locked={iconAnimation}>
				<svelte:fragment slot="navigation">
					<button
						class="btn variant-ghost-error"
						on:click={() => {
							window.history.back();
						}}>Return</button
					>
				</svelte:fragment>
				<svelte:fragment slot="header"><span /></svelte:fragment>
				<Logo size="w-96" speed={2} />
			</Step>
			<Step>
				<svelte:fragment slot="header">New here?</svelte:fragment>
				<p>
					Cool! Let's get started. I'm glad to have you here! Setup won't take more than 5 minutes.
					You'll need a Discord account to get started. Steps you already completed will be skipped.
				</p>
			</Step>
			{#await corsiumPing("Initial UI ping") then res}
				{#if !res}
					<Step locked={!doneCorsium}>
						<svelte:fragment slot="header">Get CORSium</svelte:fragment>
						<p>
							CORSium is essential for Deez Chords, as it allows communication between Deez Chords and
							Discord. It's available for all major operating systems and a one-click install. It can
							be completely configured or uninstalled from within Deez Chords.
						</p>
						<!-- TODO: Get CORSium -->
					</Step>
				{:else}{/if}
			{/await}
		</Stepper>
	</div>
</div>
