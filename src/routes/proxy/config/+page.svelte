<script lang="ts">
	import corsiumAccessCode from '$lib/api/corsium/accessCode';
	import { currentTabStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import ConnectionError from '../ConnectionError.svelte';
	import corsiumValidateCode from '$lib/api/corsium/validateCode';
	import { goto } from '$app/navigation';

	currentTabStore.set(commonTabs.proxy);

	let accessCode: Promise<false | { code: string; timeout: number }>;
	onMount(() => {
		accessCode = corsiumAccessCode();

		accessCode.then((res) => {
			/* if (!res) return;

			let validate: Promise<false | { valid: boolean; timeout: number }> = corsiumValidateCode(
				res.code
			);
			let iv = setInterval(() => {
				// validate = corsiumValidateCode(res.code);
			}, 1000);
			validate.then((vRes) => {
				if (vRes && vRes.valid) {
					clearInterval(iv);
					goto(`/proxy/config/${res.code}`);
				}
			}); */
		});
	});
</script>

<div class="flex h-full justify-center items-center bg-cover bg-no-repeat bg-center">
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<header class="font-bold text-2xl">Use OTA code</header>
		<p>
			A window should pop up, telling you the one time access code. If no window pops up within the
			next few seconds, make sure CORSium is running.
		</p>
		{#await accessCode}
			<div class="flex p-4 justify-center gap-2 items-center">
				<ProgressRadial width="w-8" stroke={100} />
			</div>
		{:then res}
			{#if res}
				Does the code that CORSium created look like this? <span class="font-bold text-xl"
					>{res.code}</span
				>
			{:else}
				<ConnectionError on:retry={() => (accessCode = corsiumAccessCode())} />
			{/if}
		{/await}
	</div>
</div>
