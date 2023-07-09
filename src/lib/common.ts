import { get, writable } from 'svelte/store';
import { searchStore } from './stores';
import sha256 from 'fast-sha256';

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

const runFuncs = writable<string[]>([]);
export function inlineFunc(run: () => void, rerunCheck?: string) {
	if (rerunCheck && get(runFuncs).includes(rerunCheck)) return true;
	if (rerunCheck) runFuncs.update((i) => [...i, rerunCheck]);

	run();
	return true;
}

export function addToSearch(item: { title: string; subtitle: string; icon: string; url: string }) {
	if (get(searchStore).some((i) => i.url === item.url)) {
		searchStore.update((search) => {
			search[get(searchStore).findIndex((i) => i.url === item.url)] = item;
			return search;
		});
		return;
	}

	// Else, just append to it.
	searchStore.update((search) => {
		search.push(item);
		return search;
	});
}

export function generateRandomBool(
	percentage: number,
	user: string,
	feature: string,
	salt: string
): boolean {
	const seed = `${user} ${feature} ${salt}`;
	const hash = new TextDecoder().decode(sha256(new TextEncoder().encode(seed)));
	const randomNum = stringToNumbers(hash) % 100;

	return randomNum < percentage;
}

export function getRandomString(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

export function stringToNumbers(str: string): number {
	let numbers = 0;

	for (let i = 0; i < str.length; i++) {
		const charCode = str.charCodeAt(i);
		numbers += charCode;
	}

	return numbers;
}
