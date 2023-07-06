<script lang="ts">
	import sha256 from 'fast-sha256';
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
	import { fromUint8Array } from 'js-base64';

	let user = '';
	let pass = '';

	let code = '';
	$: code = fromUint8Array(sha256(new TextEncoder().encode(user + pass)), true);

	export let data;
</script>

<div class="flex h-full justify-center items-center bg-cover bg-no-repeat bg-center">
	<div class="card p-4 variant-ghost-surface-surface space-y-2 max-w-2xl">
		<Stepper buttonBackLabel="Back" buttonNextLabel="Continue" buttonComplete="hidden">
			{#if data.ref === 'auth'}
			<Step>
				<svelte:fragment slot="header">Hol' up.</svelte:fragment>
				<p>
					The build you're using is a development build and requires the use of a developer hash.
					You've been redirected here because you do not seem to have one. If you're not a developer,
					this build won't be of any use to you.
				</p>
			</Step>
			{:else if data.ref === 'invalid'}
			<Step>
				<svelte:fragment slot="header">Hol' up.</svelte:fragment>
				<p>
					The build you're using is a development build and requires the use of a developer hash.
					You've been redirected here because signed in using a hash, but it is invalid. Did it
					expire? You can create a new one, or use Codeez to log back in.
				</p>
			</Step>
			{/if}
			<Step locked={!(user && pass && pass.length > 8)}>
				<svelte:fragment slot="header">Create developer hash</svelte:fragment>
				<p>
					Enter a username and password to create a dev hash. Your password must be at least 8
					characters long. It isn't stored anywhere. Leaked your hash? Don't worry. It's unusable by
					the next hour.
					<strong>
						Set your username and password to something you remember - you won't be able to change
						or restore them later.
					</strong>
				</p>
				<p>
					Why? Well, first up, it's simple, yet efficient in keeping others out. Secondly, we're
					working on a dev database solution for settings. Log in with your username and password
					and you'll be asked if you want to transfer Deez Chords! settings and Discord tokens. This
					is useful when you have to reset LS to test something. Also, before you ask, normal users
					are going to get some method of backing up and restoring their settings and tokens (all
					encrypted).
				</p>
				<input
					type="text"
					class="input variant-form-material"
					bind:value={user}
					placeholder="Username"
				/>
				<input
					type="password"
					class="input variant-form-material"
					bind:value={pass}
					placeholder="Password"
				/>
			</Step>
			<Step>
				<svelte:fragment slot="header">Copy hash</svelte:fragment>
				<p>
					Send this to your head developer using some sort of 1-to-1 chat. This is required so that
					only select people can get a hash.
				</p>
				<div
					class="flex gap-2 justify-center items-center input p-2 variant-form-material select-all"
				>
					{code}
				</div>
			</Step>
			<Step>
				<svelte:fragment slot="header">Download Codeez</svelte:fragment>
				<p>
					Codeez allows you to update your development environment client once you require a new
					hash (once per hour).
				</p>
				<div class="flex flex-wrap gap-2 justify-center items-center">
					<a href="/codeez/darwin-amd64.app" class="chip variant-filled">Darwin/AMD64</a>
					<a href="/codeez/darwin-arm64.app" class="chip variant-filled">Darwin/ARM64</a>
					<a href="/codeez/linux-amd64" class="chip variant-filled">Linux/AMD64</a>
					<a href="/codeez/linux-arm" class="chip variant-filled">Linux/ARM</a>
					<a href="/codeez/linux-arm64" class="chip variant-filled">Linux/ARM64</a>
					<a href="/codeez/windows-amd64.exe" class="chip variant-filled">Windows/AMD64</a>
					<a href="/codeez/windows-arm.exe" class="chip variant-filled">Windows/ARM</a>
					<a href="/codeez/windows-arm64.exe" class="chip variant-filled">Windows/ARM64</a>
				</div>
			</Step>
		</Stepper>
	</div>
</div>
