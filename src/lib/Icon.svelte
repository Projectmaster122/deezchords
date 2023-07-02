<script lang="ts">
	import { mdiHelpRhombusOutline } from '@mdi/js';
	import { twMerge } from 'tailwind-merge';

	export let icon: string = mdiHelpRhombusOutline;
</script>

<svg
	aria-hidden="true"
	viewBox="0 0 24 24"
	class={twMerge('w-6 inline', $$props.class)}
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path d={icon} />
</svg>
