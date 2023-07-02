<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/');
		toastStore.trigger({
			message: `${$page.status} ${$page.error?.message}`,
			background: 'variant-filled-error'
		});
	});
</script>
