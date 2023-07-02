import { mdiHome, mdiLogin } from '@mdi/js';
import { currentTabStore, tabStore } from './stores';
import type { ITab } from './types';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { isEqual } from 'lodash-es';

export function addTab(newTab: ITab) {
	tabStore.update((tabs) => {
		// If already exists, do nothing
		if (!tabs.some((tab) => tab.url === newTab.url)) {
			tabs.push(newTab);
			currentTabStore.set(newTab);
		}

		goto(newTab.url);
		return tabs;
	});
}

export const commonTabs = {
	home: { url: '/', icon: mdiHome, title: 'Home', context: { text: 'Deez Chords!' } },
	signIn: {
		title: 'Sign in',
		url: '/signIn',
		icon: mdiLogin,
		context: {
			text: 'Deez Chords!',
			sub: 'Sign in using Discord'
		}
	}
};

export function registerTabShiz() {
	currentTabStore.subscribe((changedTab) => {
		if (get(tabStore).some((tab) => !isEqual(tab, changedTab)) && changedTab.url != '')
			addTab(changedTab);
	});
}
