<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let ed = createEventDispatcher();
</script>

<aside class="alert variant-ghost-warning max-w-2xl">
	<div class="alert-message">
		<h3 class="h3">Failed to link with CORSium</h3>
		<p>
			If CORSium is running, try refreshing the page or restarting it. CORSium needs to connect in
			order for you to change settings. There currently exists a bug that prevents you from using
			CORSium if the official Discord client is running (the one you download), we'll fix that.
		</p>
		<div class="flex p-1 gap-2 justify-center items-center">
			<a href="/proxy/download" class="btn variant-filled-primary">Download</a>
			<button on:click={() => ed('retry')} class="anchor">Retry</button>
		</div>
	</div>
</aside>
