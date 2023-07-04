<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import corsiumPing from '$lib/api/corsium/ping';
	import { currentTabStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiHome } from '@mdi/js';
	import { Accordion, AccordionItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import SellingPoints from './SellingPoints.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ConnectionError from './ConnectionError.svelte';

	currentTabStore.set(commonTabs.proxy);

	let pingCorsium: Promise<boolean>;

	onMount(() => {
		pingCorsium = corsiumPing();

		pingCorsium.then((res) => {
			if (res) goto('/proxy/config');
		});
	});
</script>

<div class="flex flex-col gap-1 justify-center items-center">
	<Logo size="w-24" />
	<h1 class="h1">CORSium, the Deez Chords! proxy</h1>
	<p>
		Extend the limits of Deez Chords!, while still keeping everything local. Available for all major
		operating systems, forever free of charge.
	</p>

	<div class="h-4" />

	{#await pingCorsium}
		<div class="flex p-4 justify-center gap-2 items-center">
			<ProgressRadial width="w-8" stroke={100} />
		</div>
	{:then res}
		{#if res}
			<div class="flex p-4 justify-center items-center">
				<a href="/proxy/config" class="btn variant-filled">Configure</a>
			</div>
		{:else}
			<ConnectionError on:retry={() => (pingCorsium = corsiumPing())} />
		{/if}
	{/await}

	<div class="h-4" />

	<SellingPoints />
</div>
