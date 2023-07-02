import {
	mdiBullhorn,
	mdiDotsHorizontal,
	mdiForum,
	mdiHelpRhombusOutline,
	mdiHome,
	mdiImage,
	mdiMicrophoneOff,
	mdiPound,
	mdiVolumeHigh
} from '@mdi/js';
import { writable } from 'svelte/store';
import type { ITab } from './types';
import { commonTabs } from './tabs';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const scrollStore = writable<{ x: number; y: number }>({ x: 0, y: 0 });
export const tabStore = writable<ITab[]>([
	commonTabs.home,
	{
		title: 'components',
		url: '/channels/bla',
		icon: mdiPound,
		context: {
			image:
				'https://cdn.discordapfindp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Text channel'
		}
	},
	{
		title: 'components-voice',
		url: '/channels/bla',
		icon: mdiVolumeHigh,
		context: {
			image:
				'https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Voice channel'
		}
	},
	{
		title: 'components-forum',
		url: '/channels/bla',
		icon: mdiForum,
		context: {
			image:
				'https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Forum channel'
		}
	},
	{
		title: 'components-media',
		url: '/channels/bla',
		icon: mdiImage,
		context: {
			image:
				'https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Media channel'
		}
	},
	{
		title: 'components-announcement',
		url: '/channels/bla',
		icon: mdiBullhorn,
		context: {
			image:
				'https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Announcement channel'
		}
	},
	{
		title: 'components-stage',
		url: '/channels/bla',
		icon: mdiMicrophoneOff,
		context: {
			image:
				'https://cdn.discordapp.com/icons/567141138021089308/a_81383668fc9dd8988437cf9346db9f78.gif?size=48',
			text: 'The Doug District',
			sub: 'Stage channel (Audience)'
		}
	},
	{
		title: 'other crap',
		url: '/channels/bla',
		icon: mdiDotsHorizontal,
		context: { text: 'Deez Chords!' }
	}
]);
export const currentTabStore = writable<ITab>({
	title: '???',
	url: '',
	icon: mdiHelpRhombusOutline,
	context: {
		text: "You're not supposed to see this!",
		sub: 'Whoopsie.'
	}
});
export const loadingStore = writable<{
	[uuid: string]: {
		min: number;
		max: number;
		value: number;
		name: string;
		description?: string;
		type: 'download' | 'upload' | 'process';
		ticker?: string;
	};
}>();
export const validStore = writable(false);

export const settingsStore = localStorageStore<{
	timeout: number;
	debug: boolean;
}>('settings', {
	timeout: 30,
	debug: true // FIXME: Disable by default
});

// TODO: Merge to cookie if there's a way to not send it to the server when requesting the page
export const tokenStore = localStorageStore<string[]>('token', []);
