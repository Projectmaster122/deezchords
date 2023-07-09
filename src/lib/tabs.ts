import { mdiHome, mdiKey, mdiArrowDecision, mdiPlus, mdiAccount } from '@mdi/js';
import { currentTabStore, tabStore } from './stores';
import type { ITab } from './types';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { isEqual } from 'lodash-es';
import { page } from '$app/stores';

export function addTab(newTab: ITab) {
	tabStore.update((tabs) => {
		// If already exists, do nothing
		if (!tabs.some((tab) => tab.url === newTab.url)) {
			newTab.id = tabs.length;
			tabs.push(newTab);
			currentTabStore.set(newTab);
		}

		if (!page.subscribe((page) => newTab.url.some((tab) => tab === page.route.id))) {
			goto(newTab.url[0]);
		}
		return tabs;
	});
}

export const commonTabs: {
	[key: string]: ITab;
} = {
	home: {
		url: ['/'],
		icon: mdiHome,
		title: 'Home',
		context: { text: 'Deez Chords!' }
	},
	signIn: {
		title: 'Account manager',
		url: ['/signIn'],
		icon: mdiKey,
		context: {
			text: 'Deez Chords!',
			sub: 'Sign in using Discord'
		}
	},
	proxy: {
		title: 'CORSium',
		url: ['/proxy', '/proxy/config', '/proxy/config/[code]'],
		icon: mdiArrowDecision,
		context: { text: 'Deez Chords!', sub: 'A proxy for all major operating systems' }
	},
	joinGuild: {
		title: 'Join a guild',
		url: ['/joinGuild', '/joinGuild/[code]'],
		icon: mdiPlus,
		context: { text: 'Deez Chords!' }
	},
	onboarding: {
		title: 'Hello there!',
		url: ['/onboarding'],
		icon: mdiAccount,
		context: {
			text: 'Deez Chords!',
			sub: 'Use DZCH'
		}
	}
};

export function registerTabShiz() {
	currentTabStore.subscribe((changedTab) => {
		if (get(tabStore).some((tab) => !isEqual(tab, changedTab)) && changedTab.url[0] != '')
			addTab(changedTab);
	});
}
