<script lang="ts">
	import { fromUint8Array } from 'js-base64';
	import sha256 from 'fast-sha256';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { toastStore } from '@skeletonlabs/skeleton';

	export let data;

	toastStore.trigger({
		message: 'Signed in!',
		background: 'variant-filled-success',
	})
</script>

<div class="flex h-full justify-center items-center bg-cover bg-no-repeat bg-center">
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-md">
		<header class="flex items-center font-bold text-2xl">
			Hello,&nbsp;<input
				type="text"
				class="input variant-form-material font-normal mx-1 w-fit"
				placeholder="you"
			/>!
		</header>
		<p class="text-justify">
			Are you trying to sign in using a dev hash? If no, something triggered Codeez. Act concerned!
			Anyways, you're now signed in. Use the navbar to go to where you want to go.
		</p>
	</div>
</div>
