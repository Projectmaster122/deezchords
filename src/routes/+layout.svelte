<script lang="ts">
	import '../themes/warped.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import {
		AppShell,
		AppBar,
		Drawer,
		Modal,
		Toast,
		toastStore,
		storePopup,
		storeHighlightJs,
		TabAnchor,
		TabGroup,
		Accordion,
		AccordionItem,
		ListBoxItem,
		Avatar
	} from '@skeletonlabs/skeleton';
	import { mdiHome } from '@mdi/js';
	import Logo from '$lib/Logo.svelte';
	import { currentTabStore, scrollStore, tabStore, validStore } from '$lib/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import hljs from 'highlight.js';
	import { page } from '$app/stores';
	import Icon from '$lib/Icon.svelte';
	import ServerAccordionItem from '$lib/ServerAccordionItem.svelte';
	import { sharedAxisTransition } from '$lib/transitions/animation';
	import { addTab, commonTabs, registerTabShiz } from '$lib/tabs';
	import { isEqual } from 'lodash';
	import { draggable } from '@neodrag/svelte';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import tokenValid from '$lib/api/v10/global/tokenValid';

	afterNavigate((params: any) => {
		const isNewPage: boolean =
			params.from && params.to && params.from.route.id !== params.to.route.id;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	function scrollHandler(event: Event) {
		$scrollStore = {
			x: (event.currentTarget! as HTMLElement).scrollLeft,
			y: (event.currentTarget! as HTMLElement).scrollTop
		};
	}

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	storeHighlightJs.set(hljs);

	onMount(() => {
		window.onunhandledrejection = async (e) => {
			typeof e === 'object' ? console.dir(e) : console.error(e);

			const parser = new DOMParser();
			const doc = parser.parseFromString(
				'<div class="modal-backdrop fixed top-0 left-0 right-0 bottom-0 bg-surface-backdrop-token z-[999]  " style=""><div class="snackbar-wrapper flex fixed top-0 left-0 right-0 bottom-0 pointer-events-none justify-end items-end z-[888] " data-testid="snackbar-wrapper"><div class="snackbar flex flex-col gap-y-2 items-end p-4"><div><div class="toast flex justify-between items-center pointer-events-auto max-w-[640px]  p-4 space-x-4 rounded-container-token shadow-lg variant-filled-error" role="alert" aria-live="polite" data-testid="toast"><div class="text-base">A fatal error occurred and the page has to be reloaded. Check DevTools for more details.</div> <div class="toast-actions flex items-center space-x-2"><button class="btn variant-filled" onclick="window.location.reload()">Reload</button></div></div> </div></div></div></div>',
				'text/html'
			);
			document.querySelector('body > div')!.appendChild(doc.body.firstChild!);
		};
		window.onerror = async (e) => {
			typeof e === 'object' ? console.dir(e) : console.error(e);

			toastStore.trigger({
				message:
					'An error occurred, but you can keep using the page. Check DevTools for more details.',
				background: 'variant-filled-warning',
				autohide: false
			});
		};

		registerTabShiz();

		tokenValid().then((isValid) => {
			$validStore = isValid;
		});
	});

	export let data;
</script>

<svelte:head>
	<title>{$currentTabStore.title}</title>
</svelte:head>

<Modal />
<Toast max={8} position="br" />
<Drawer />

<AppShell on:scroll={scrollHandler}>
	<svelte:fragment slot="header">
		<AppBar class="border-b-2 border-surface-500/30">
			<svelte:fragment slot="lead">
				<Logo
					on:click={() => {
						addTab(commonTabs.home);
					}}
				/>
			</svelte:fragment>
			<TabGroup active="border-b-2 border-surface-900-50-token variant-soft-tertiary">
				{#each $tabStore as tab, i}
					<TabAnchor selected={isEqual(tab, $currentTabStore)} href={tab.url}>
						<Icon icon={tab.icon} />
						{tab.title}
					</TabAnchor>
				{/each}
			</TabGroup>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="bg-surface-100-800-token h-full w-96 p-4 border-r-2 border-surface-500/30">
			<Accordion autocollapse class="h-full">
				<AccordionItem open>
					<svelte:fragment slot="lead"><Icon icon={mdiHome} /></svelte:fragment>
					<svelte:fragment slot="summary">Deez Chords!</svelte:fragment>
					<svelte:fragment slot="content">
						<nav class="list-nav">
							<ul>
								<li>
									<a
										href="/"
										class={$currentTabStore.url === '/' ? '!bg-primary-50-900-token' : ''}
									>
										<span><Icon icon={mdiHome} /></span>
										<span class="flex-auto">
											<dt class="font-bold">Home</dt>
											<dd class="text-sm opacity-50">Welcome to Deez Chords!</dd>
										</span>
									</a>
								</li>
							</ul>
						</nav>
					</svelte:fragment>
				</AccordionItem>
				<div class="p-4 flex justify-center items-center">
					<a href="/signIn" class="m-2 btn variant-filled-primary">Sign in using Discord</a>
				</div>
				<ServerAccordionItem
					profile="https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48"
					banner="https://cdn.discordapp.com/banners/567141138021089308/fc91425e138166d1758adb2406206f25.webp?size=480"
				>
					<svelte:fragment slot="summary">The Doug District</svelte:fragment>
					<svelte:fragment slot="content">(content)</svelte:fragment>
				</ServerAccordionItem>
				<ServerAccordionItem
					profile="https://cdn.discordapp.com/icons/1058148300278222978/a21ad2b3d3da0ec73f559eff84979d74.webp?size=48"
				>
					<svelte:fragment slot="summary">Team NTL</svelte:fragment>
					<svelte:fragment slot="content">(content)</svelte:fragment>
				</ServerAccordionItem>
			</Accordion>
		</div>

		<!-- <div class="flex gap-4 items-center card variant-glass-surface p-4">
			<span
				><Avatar
					src={user.avatar ? cdnUserAvatar(user.id, user.avatar) : undefined}
					initials={generatePfpInitials(user.global_name || user.username)}
				/></span
			>
			<span class="flex flex-col items-start">
				<dt class="font-bold">{user.global_name || '[No name]'}</dt>
				<dd class="text-sm opacity-50">{current ? 'Current: ' : ''}@{user.username}</dd>
			</span>
		</div> -->
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		<div
			class="bg-surface-100-800-token h-full w-56 p-4 gap-2 flex flex-col border-l-2 border-surface-500/30"
		>
			<div class="flex gap-2 justify-center">
				<span class="chip variant-soft-success">0 online</span>
				<span class="chip variant-soft-tertiary">0 here</span>
			</div>
			No one's in this channel. Sad face.
		</div>
	</svelte:fragment>
	<svelte:fragment slot="pageHeader">Page Header</svelte:fragment>
	<!-- Router Slot -->
	<div class="relative h-full">
		{#key data.pathname}
			<div
				in:sharedAxisTransition={{
					direction: 'X',
					rightSeam: true
				}}
				out:sharedAxisTransition={{
					direction: 'X',
					rightSeam: false
				}}
				class="absolute inset-0 h-full flex flex-col gap-1 p-2"
			>
				<slot />
			</div>
		{/key}
	</div>
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<!-- (footer) -->
</AppShell>
