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
		Avatar,
		popup,
		ProgressRadial,
		drawerStore
	} from '@skeletonlabs/skeleton';
	import {
		mdiHome,
		mdiPlus,
		mdiKey,
		mdiArrowDecision,
		mdiHelpRhombusOutline,
		mdiServer,
		mdiMagnify
	} from '@mdi/js';
	import Logo from '$lib/Logo.svelte';
	import { currentTabStore, scrollStore, searchStore, tabStore, tokenStore } from '$lib/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import hljs from 'highlight.js';
	import { page } from '$app/stores';
	import Icon from '$lib/Icon.svelte';
	import ServerAccordionItem from '$lib/ServerAccordionItem.svelte';
	import { sharedAxisTransition, containerTransform } from '$lib/transitions/animation';
	import { addTab, commonTabs, registerTabShiz } from '$lib/tabs';
	import { isEqual } from 'lodash-es';
	import { draggable } from '@neodrag/svelte';
	import cdnUserAvatar from '$lib/api/cdn/userAvatar';
	import { generatePfpInitials } from '$lib/api/custom/initials';
	import tokenValid from '$lib/api/v10/global/tokenValid';
	import getThisUser from '$lib/api/v10/global/getThisUser';
	import type { IUser } from '$lib/api/types/user';
	import type { IGuild } from '$lib/api/types/guild';
	import getJoinedGuilds from '$lib/api/v10/global/getJoinedGuilds';
	import cdnGuildIcon from '$lib/api/cdn/guildIcon';
	import cdnGuildBanner from '$lib/api/cdn/guildBanner';
	import getGuild from '$lib/api/v10/guilds/getGuild';
	import DraggableTabGroup from '$lib/DraggableTabGroup.svelte';
	import { shortcut } from '@svelte-put/shortcut';
	import getGuildChannels from '$lib/api/v10/guilds/getGuildChannels';
	import { EChannelType, EDNChannelType, EIChannelType } from '$lib/api/types/channel';
	import { blur } from 'svelte/transition';
	import { addToSearch, inlineFunc, validUrl } from '$lib/common';
	import fuzzysort from 'fuzzysort';

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

	let promIsValid = tokenValid();
	let promUser: Promise<IUser | false>;
	let promGuilds: Promise<IGuild[] | false>;

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

		if ($tokenStore[0])
			promIsValid.then((_isValid) => {
				if (!_isValid) return;

				promUser = getThisUser();
				promGuilds = getJoinedGuilds();

				promUser.then((_user) => {
					user = _user;
				});
				promGuilds.then((_guilds) => {
					guilds = _guilds;
				});
			});

		window.addEventListener('resize', function (event) {
			console.log('%cSTOP!', 'font-size: 64px; color: red;');
			console.log(
				"%cThe tool you're using is meant for developers and developers only.",
				'font-size: 14px;'
			);
			console.log(
				"%cIf you are not a developer, please don't use it unless you know EXACTLY what you're doing.",
				'font-size: 14px;'
			);
			console.log(
				'%cRunning something in here will likely give attackers access to your account.',
				'font-size: 14px; color: red;'
			);
		});
	});

	let user: IUser | false;
	let guilds: IGuild[] | false;
	let open = -1;
	let search = '';

	export let data;

	function openSearch() {
		if ($searchStore.length === 0) {
			toastStore.trigger({
				message: 'Search is indexing. Try again in a few seconds.',
				background: 'variant-filled-warning'
			});
			return;
		}

		search = '';
		drawerStore.open({
			id: 'search',
			width: 'w-96',
			position: 'right'
		});
	}

	$: filteredSearch = fuzzysort.go(search, $searchStore, { keys: ['title', 'subtitle'] });
</script>

<svelte:head>
	<title>{$currentTabStore.title}</title>
</svelte:head>

<Modal />
<Toast max={8} position="br" />
<Drawer>
	{#if $drawerStore.id === 'search'}
		<div class="flex flex-col gap-2 p-4">
			<input
				class="input variant-form-material"
				type="search"
				placeholder="Search for anything"
				bind:value={search}
			/>
			<nav class="list-nav">
				<ul>
					{#each filteredSearch as item}
						<li>
							<a href={item.obj.url}>
								<span>
									{#if validUrl(item.obj.icon)}
										<Avatar src={item.obj.icon} width="w-6" />
									{:else}
										<Icon icon={item.obj.icon} />
									{/if}
								</span>
								<span class="flex-auto">
									<dt class="font-bold">{item.obj.title}</dt>
									<dd class="text-sm opacity-50">{item.obj.subtitle}</dd>
								</span>
							</a>
						</li>
					{:else}
						<div class="flex justify-center items-center">
							{search === '' ? 'Type a keyword to search.' : "Nothing's here."}
						</div>
					{/each}
				</ul>
			</nav>
		</div>
	{:else}
		Drawer got unexpected id: {$drawerStore.id}
	{/if}
</Drawer>

<svelte:window
	use:shortcut={{
		trigger: {
			key: 'k',
			modifier: ['ctrl', 'meta'],
			callback: openSearch,
			preventDefault: true
		}
	}}
/>

<AppShell class="transition-transform" on:scroll={scrollHandler}>
	<svelte:fragment slot="header">
		<AppBar class="border-b-2 border-surface-500/30">
			<svelte:fragment slot="lead">
				<Logo
					on:click={() => {
						addTab(commonTabs.home);
					}}
				/>
			</svelte:fragment>
			<DraggableTabGroup
				options={{
					items: $tabStore,
					dropTargetStyle: {
						'box-shadow': '0 0 0 100vmax rgba(0,0,0,.6)'
					}
				}}
				on:finalize={(e) => {
					$tabStore = e.detail.items;
				}}
				on:consider={(e) => {
					$tabStore = e.detail.items;
				}}
			>
				{#each $tabStore as tab, i (i)}
					<TabAnchor selected={isEqual(tab, $currentTabStore)} href={tab.url[0]}>
						<Icon icon={tab.icon} />
						{tab.title}
					</TabAnchor>

					<div class="card p-4 w-72 shadow-xl" data-popup="popupTabs{i}">
						<div class="flex gap-2">
							{#if tab.icon !== ''}
								<Avatar src={tab.context.image} />
							{/if}
							<div class="flex flex-col items-start">
								<dt class="font-bold">{tab.context.text}</dt>
								{#if tab.context.sub}
									<dd class="text-sm opacity-50">{tab.context.sub}</dd>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</DraggableTabGroup>
			<svelte:fragment slot="trail">
				<button class="btn p-2 px-4 variant-soft hover:variant-soft-primary" on:click={openSearch}>
					<Icon icon={mdiMagnify} />
					<span class="badge variant-soft">Ctrl+K</span>
				</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="bg-surface-100-800-token h-full w-80 p-4 border-r-2 border-surface-500/30">
			<Accordion autocollapse class="h-full overflow-auto">
				<AccordionItem open>
					<svelte:fragment slot="lead"><Icon icon={mdiHome} /></svelte:fragment>
					<svelte:fragment slot="summary">Deez Chords!</svelte:fragment>
					<svelte:fragment slot="content">
						<nav class="list-nav">
							<ul>
								<li>
									<a
										href="/"
										class={$currentTabStore.url === commonTabs.home.url
											? '!bg-primary-50-900-token'
											: ''}
									>
										<span><Icon icon={mdiHome} /></span>
										<span class="flex-auto">
											<dt class="font-bold">Home</dt>
											<dd class="text-sm opacity-50">Welcome to Deez Chords!</dd>
										</span>
									</a>
								</li>
								<li>
									<a
										href="/signIn"
										class={$currentTabStore.url === commonTabs.signIn.url
											? '!bg-primary-50-900-token'
											: ''}
									>
										<span><Icon icon={mdiKey} /></span>
										<span class="flex-auto">
											<dt class="font-bold">Account manager</dt>
											<dd class="text-sm opacity-50">Switch accounts</dd>
										</span>
									</a>
								</li>
								<li>
									<a
										href="/proxy"
										class={$currentTabStore.url === commonTabs.proxy.url
											? '!bg-primary-50-900-token'
											: ''}
									>
										<span><Icon icon={mdiArrowDecision} /></span>
										<span class="flex-auto">
											<dt class="font-bold">CORSium</dt>
											<dd class="text-sm opacity-50">Official Deez Chords! proxy</dd>
										</span>
									</a>
								</li>
							</ul>
						</nav>
					</svelte:fragment>
				</AccordionItem>
				{#await promGuilds}
					<div class="flex justify-center items-center gap-2 p-4">
						<ProgressRadial width="w-8" stroke={100} />
					</div>
				{:then guilds}
					{#if guilds}
						{#each guilds as guild, i}
							{#await getGuild({ guildId: guild.id }) then guild}
								{#if guild && inlineFunc(() => {
										addToSearch( { title: guild.name, subtitle: `${guild.approximate_presence_count} out of ${guild.approximate_member_count} online`, url: `/guild/${guild.id}`, icon: guild.icon ? cdnGuildIcon(guild.id, guild.icon) : mdiServer } );
									})}
									<div>
										<ServerAccordionItem
											profile={guild.icon ? cdnGuildIcon(guild.id, guild.icon) : undefined}
											banner={guild.banner
												? cdnGuildBanner(guild.id, guild.banner) + '?size=240'
												: undefined}
											initials={generatePfpInitials(guild.name)}
											open={open === i}
											on:toggle={() => (open = i)}
										>
											<svelte:fragment slot="summary">{guild.name}</svelte:fragment>
											<svelte:fragment slot="content">
												<nav class="list-nav">
													<ul>
														{#await getGuildChannels({ guildId: guild.id })}
															<div class="flex justify-center items-center gap-2 p-4">
																<ProgressRadial width="w-8" stroke={100} />
															</div>
														{:then gServers}
															{#if gServers}
																{#each gServers as channel, iC}
																	<li in:blur={{ delay: 20 * iC }}>
																		<a
																			href="/joinGuild"
																			class={$currentTabStore.url === commonTabs.joinGuild.url
																				? '!bg-primary-50-900-token'
																				: ''}
																		>
																			<span
																				><Icon
																					icon={EIChannelType[channel.type] ||
																						mdiHelpRhombusOutline}
																				/></span
																			>
																			<span class="flex-auto">
																				<dt class="font-bold">{channel.name || '[No name]'}</dt>
																				<dd class="text-sm opacity-50">
																					{EDNChannelType[channel.type] || 'Channel'}
																				</dd>
																			</span>
																		</a>
																	</li>
																{/each}
															{/if}
														{/await}
													</ul>
												</nav>
											</svelte:fragment>
										</ServerAccordionItem>
									</div>
								{/if}
							{/await}
						{/each}
					{/if}
				{/await}
				<AccordionItem>
					<svelte:fragment slot="lead"><Icon icon={mdiPlus} /></svelte:fragment>
					<svelte:fragment slot="summary">Join guild</svelte:fragment>
					<svelte:fragment slot="content">
						<nav class="list-nav">
							<ul>
								<li>
									<a
										href="/joinGuild"
										class={$currentTabStore.url === commonTabs.joinGuild.url
											? '!bg-primary-50-900-token'
											: ''}
									>
										<span><Icon icon={mdiPlus} /></span>
										<span class="flex-auto">
											<dt class="font-bold">Join existing guild</dt>
											<dd class="text-sm opacity-50">Join a guild by code</dd>
										</span>
									</a>
								</li>
							</ul>
						</nav>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
			{#await promUser then user}
				{#if user}
					<div class="flex gap-4 items-center card variant-glass-surface p-4 m-4">
						<span><div class="placeholder-circle animate-pulse w-16" /></span>
						<span class="flex-auto">
							<div class="placeholder animate-pulse" />
						</span>
						<span
							><Avatar
								src={user.avatar ? cdnUserAvatar(user.id, user.avatar) : undefined}
								initials={generatePfpInitials(user.global_name || user.username)}
							/></span
						>
						<span class="flex flex-col items-start">
							<dt class="font-bold">{user.global_name || '[No name]'}</dt>
							<dd class="text-sm opacity-50">
								@{user.username}{Number(user.discriminator) !== 0 ? `#${user.discriminator}` : ''}
							</dd>
						</span>
					</div>
				{/if}
			{/await}
		</div>
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
	<!-- (pageHeader) -->
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
	<!-- (pageFooter) -->
	<!-- (footer) -->
</AppShell>
