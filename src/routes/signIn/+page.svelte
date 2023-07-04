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
	import AccountCard from './AccountCard.svelte';

	currentTabStore.set(commonTabs.signIn);

	let loginMethod = 0;
	let token = '';

	let loginToken = '';
	let prefix = '';
	// ---
	let storageToken = $tokenStore[1] || '';

	let refreshing = false;
	let validToken = false;
	$: {
		validToken = false;
		switch (loginMethod) {
			case 0:
				token = `${prefix} ${loginToken}`;
				break;
			case 1:
				token = storageToken;
				break;

			default:
				break;
		}
		if (token !== '')
			tokenValid(token).then((isValid) => {
				if (!isValid) return;
				validToken = true;
			});
	}
</script>

<div class="flex h-full justify-center items-center bg-cover bg-no-repeat bg-center">
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<Stepper
			buttonBackLabel="Back"
			buttonNextLabel="Continue"
			buttonCompleteLabel="Reload"
			buttonComplete="variant-filled-secondary"
			on:complete={() => {
				window.location.reload();
			}}
		>
			<Step locked={!validToken}>
				<svelte:fragment slot="header">Account manager</svelte:fragment>
				{#if $tokenStore.length >= 1}
					<aside class="alert variant-ghost-warning max-w-2xl">
						<div class="alert-message">
							<p>
								You're already signed in with {$tokenStore.length}
								account{$tokenStore.length > 1 ? 's' : ''}. Use the "Storage" tab to switch between
								them. You can log out of the current account from settings.
							</p>
						</div>
					</aside>
				{/if}
				<TabGroup active="border-b-2 border-surface-900-50-token variant-soft-tertiary">
					<Tab bind:group={loginMethod} name="token" value={0}>
						<svelte:fragment slot="lead"><Icon icon={mdiKey} /></svelte:fragment>
						<span>Token</span></Tab
					>
					<Tab bind:group={loginMethod} name="storage" value={1}>
						<svelte:fragment slot="lead"><Icon icon={mdiDatabase} /></svelte:fragment>
						<span>Storage</span></Tab
					>
					<Tab bind:group={loginMethod} name="storage" value={2}>
						<svelte:fragment slot="lead"><Icon icon={mdiDatabase} /></svelte:fragment>
						<span>Delete</span></Tab
					>
					<svelte:fragment slot="panel">
						<div class="flex flex-col gap-2">
							{#if loginMethod === 0}
								<p>
									You can sign in with your Discord token. We won't tell you how to get your token,
									you're on your own there. Good luck!
								</p>
								<div class="flex gap-1">
									<select class="select variant-form-material w-fit" bind:value={prefix}>
										<option value="">User</option>
										<option value="Bot">Bot</option>
										<option value="Bearer">Bearer</option>
									</select>
									<input
										type="password"
										class="input variant-form-material"
										on:input={() => (validToken = false)}
										bind:value={loginToken}
										placeholder="Token"
									/>
								</div>
							{:else if loginMethod === 1}
								<p>Select an account to sign in.</p>
								<AccountCard token={$tokenStore[0] || ''} current />
								<div class="grid grid-cols-2 gap-1">
									{#each $tokenStore.splice(1) as to, i}
										<button
											on:click={() => {
												storageToken = to;
											}}
										>
											<AccountCard selected={storageToken === to} token={to} />
										</button>
									{:else}
										<div
											class="flex row-span-2 gap-4 justify-center items-center card variant-ghost-error p-4"
										>
											Add another user to switch.
										</div>
									{/each}
								</div>
							{:else if loginMethod === 2}
								<button
									on:click={() => {
										localStorage.clear();
									}}
									class="btn variant-filled-secondary">Delete all</button
								>
							{/if}
						</div>
					</svelte:fragment>
				</TabGroup>
			</Step>
			<Step
				buttonBackLabel="Not me!"
				buttonBack={refreshing ? 'invisible' : 'anchor'}
				buttonComplete="hidden"
			>
				<svelte:fragment slot="header">Use this account?</svelte:fragment>
				<div class="flex flex-col gap-1">
					{#if $tokenStore.some((t) => t === storageToken)}
						<button
							on:click={() => {
								$tokenStore = $tokenStore.filter((t) => t !== storageToken);
								$tokenStore.unshift(storageToken);
								$tokenStore = $tokenStore;

								refreshing = true;
								window.location.reload();
							}}
						>
							<AccountCard selected={$tokenStore[0] === storageToken} token={storageToken} />
						</button>
						<p>Click the card above to switch to this account.</p>
					{:else}
						<button
							on:click={() => {
								$tokenStore.unshift(token);
								$tokenStore = $tokenStore;

								refreshing = true;
								window.location.reload();
							}}
						>
							<AccountCard selected={$tokenStore[0] === token} {token} />
						</button>
						<p>Click the card above to log in and switch to this account.</p>
					{/if}
				</div>
			</Step>
		</Stepper>
	</div>
</div>
