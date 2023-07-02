<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import { currentTabStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';
	import { mdiHome } from '@mdi/js';

	currentTabStore.set(commonTabs.home);
</script>

<div class="flex flex-col gap-1 justify-center items-center">
	<Logo size="w-24" />
	<h1 class="h1">Deez Chords!</h1>
	<p>
		An alternative Discord client built with the user in mind, with API calls being fully
		client-sided.
	</p>
	<div class="h-4" />

	<aside class="alert variant-ghost-error max-w-2xl">
		<div class="alert-message">
			<h3 class="h3">Discord TOS</h3>
			<p>
				Deez Chords! is not affiliated with Discord in any way and by using it, you agree that your
				account may be terminated by Discord at any time for using an unofficial client. The Deez
				Chords! developers do not endorse client modding in any way, this originally started out as
				a "look Discord, this is stuff that people may want!"-type project.
			</p>
		</div>
	</aside>
	<aside class="alert variant-ghost-warning max-w-2xl">
		<div class="alert-message">
			<h3 class="h3">Not mobile-optimized</h3>
			<p>
				Deez Chords! is currently not optimized for viewing on mobile devices. At all. We're working
				on this, expect updates soon.
			</p>
		</div>
	</aside>
	<aside class="alert variant-ghost-success max-w-2xl">
		<div class="alert-message">
			<h3 class="h3">We're open-source now!</h3>
			<p>
				Expect spaghetti code, no tests, and lots of weird stuff. If you want to know how Deez
				Chords! does something, check out the source code. It's all Svelte, but the API calls work
				regardless of library (duh).
			</p>
		</div>
	</aside>
</div>
