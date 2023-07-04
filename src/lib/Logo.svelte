<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	export let size = 'h-12';
	export let speed = 1;
	export let custom = '';

	let loaded = false;
	onMount(() => (loaded = true));

	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('click')}>
	<!--
		Meet Roji, the Logo. She's very friendly!
	-->
	<svg viewBox="-1.5 -3 10 10" class={size} xmlns="http://www.w3.org/2000/svg">
		{#if loaded}
			<path
				in:draw={{ duration: 2500 * speed, easing: quintOut }}
				d={custom ||
					'M2.57071 0.570711L3 0.141421L3.42929 0.570711L3.5 0.641421L3.57071 0.570711L4 0.141421L4.42929 0.570711L4.5 0.641421L4.57071 0.570711L5.04142 0.1H5.4382L5.91056 1.04472L5.9382 1.1H6H6.8382L6.41056 1.95528L6.39401 1.98837L6.40299 2.02425L6.87192 3.9H6.0618L5.58944 2.95528L5.5618 2.9H5.5H1.5H1.4382L1.41056 2.95528L0.938197 3.9H0.128078L0.597014 2.02425L0.605986 1.98837L0.589443 1.95528L0.161803 1.1H1H1.0618L1.08944 1.04472L1.5618 0.1H1.95858L2.42929 0.570711L2.5 0.641421L2.57071 0.570711Z'}
				stroke="url(#paint0_linear)"
				stroke-width="0.5"
				fill="none"
			/>
			<defs>
				<linearGradient
					id="paint0_linear"
					x1="0"
					y1="0"
					x2="7"
					y2="4"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#7EAAC7" />
					<stop offset="1" stop-color="#F4C5CE" />
				</linearGradient>
			</defs>
		{/if}
	</svg>
</button>
