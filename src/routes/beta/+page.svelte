<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import Logo from '$lib/Logo.svelte';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import corsiumPing from '$lib/api/corsium/ping';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import getThisUser from '$lib/api/v10/global/getThisUser';
	import tokenValid from '$lib/api/v10/global/tokenValid';
	import { generateRandomBool, getPromiseFromEvent, getRandomString, sleep } from '$lib/common';
	import { currentTabStore, tokenStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiClose, mdiDatabase, mdiKey, mdiSpeedometer, mdiStepForward, mdiStepForward2 } from '@mdi/js';
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

	let user = '';
	let feature = '';
	let percentage = 50;
	let salt = getRandomString(16);

	let testTrue = 0;
	let testFalse = 0;
	let testAnimated = true;

	function test() {
		salt = getRandomString(16);
		user = getRandomString(16);
		feature = getRandomString(16);

		generateRandomBool(percentage, user, feature, result) ? testTrue++ : testFalse++;
	}

	$: result = `${user} ${feature} ${salt}`;
</script>

<div class="grid grid-cols-4 gap-2 w-full">
	<label class="label">
		<span>User</span>
		<input class="input variant-form-material" bind:value={user} type="text" placeholder="User" />
	</label>
	<label class="label">
		<span>Feature</span>
		<input
			class="input variant-form-material"
			bind:value={feature}
			type="text"
			placeholder="Feature"
		/>
	</label>
	<label class="label flex flex-col">
		<span>salt</span>
		<button class="btn variant-filled-surface" on:click={() => (salt = getRandomString(16))}>
			{salt}
		</button>
	</label>
	<label class="label">
		<span>Percentage</span>
		<input
			class="input variant-form-material {generateRandomBool(percentage, user, feature, result)
				? 'variant-ghost-success'
				: ''}"
			bind:value={percentage} min="0" max="100"
			type="number"
			placeholder="Percentage"
		/>
	</label>
</div>

<div class="grid grid-cols-10 m-8 gap-1 w-fit">
	{#each Array(101) as _, i}
		<div
			class="w-8 h-8 flex justify-center items-center {generateRandomBool(i, user, feature, result)
				? 'variant-ghost-success'
				: 'variant-ghost-surface'}"
		>
			{i}
		</div>
	{/each}
</div>

<label class="label flex flex-col gap-1">
	<span>Test</span>
	<div class="card p-2 variant-ghost-surface">
		{testTrue} got, {testFalse} didn't ({(testTrue / (testTrue + testFalse)) * 100 || '?? '}%)<br />
		Percentage should be close to <input
			class="w-fit mx-1 input variant-form-material"
			bind:value={percentage} min="0" max="100"
			type="number"
			placeholder="Percentage"
		/>%.<br />
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" bind:checked={testAnimated} />
		<p>Animate</p>
	</label>
	</div>
	<div class="flex gap-1">
		<button
			class="btn variant-filled-surface"
			on:click={async () => {
				for (let index = 0; index < 1; index++) {
					test();
				}
			}}>Test 1x</button
		>
		<button
			class="btn variant-filled-surface"
			on:click={async () => {
				for (let index = 0; index < 10; index++) {
					test();
				if (testAnimated) await sleep(100);
				}
			}}>Test 10x</button
		>
		<button
			class="btn variant-filled-surface"
			on:click={async () => {
				for (let index = 0; index < 100; index++) {
					test();
				if (testAnimated) await sleep(10);
				}
			}}>Test 100x</button
		>
		<button
			class="btn variant-filled-surface"
			on:click={async () => {
				for (let index = 0; index < 1000; index++) {
					test();
				if (testAnimated) await sleep(1);
				}
			}}>Test 1000x</button
		>
		<button
			class="btn variant-filled-surface"
			on:click={async() => {
				for (let index = 0; index < 10000; index++) {
					test();
				}
			}}>Test 10000x</button
		>
		<button
			class="btn-icon variant-filled-warning"
			on:click={() => {
				testTrue = 0;
				testFalse = 0;
			}}><Icon icon={mdiClose} /></button
		>
	</div>
</label>