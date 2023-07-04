import { get } from "svelte/store";
import { searchStore } from "./stores";

export function getPromiseFromEvent(item: any, event: string): Promise<void> {
	return new Promise((resolve) => {
		const listener = () => {
			item.removeEventListener(event, listener);
			resolve();
		};
		item.addEventListener(event, listener);
	});
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}

export function inlineFunc(run: (() => void)) {
	run();
	return true;
}

export function addToSearch(item: { title: string; subtitle: string; icon: string; url: string }) {
	if (get(searchStore).some((i) => i.url === item.url)) {
		searchStore.update((search) => {
			search[get(searchStore).findIndex((i) => i.url === item.url)] = item;
			return search;
		})
		return;
	}

	// Else, just append to it.
	searchStore.update((search) => {
		search.push(item);
		return search;
	})
}