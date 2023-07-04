import { loadingStore, settingsStore, tokenStore } from '$lib/stores';
import { toastStore } from '@skeletonlabs/skeleton';
import axios from 'axios';
import type { AxiosHeaders } from 'axios';
import { get } from 'svelte/store';
import req from '$lib/api/custom/calls';

export default async function request<Response>(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	url: string,
	details: { short: string; long?: string },
	params?: any,
	data?: any,
	headers?: AxiosHeaders,
	customToken?: string
): Promise<{ resp: Response; fail: boolean }> {
	const progressToken = 'blah'; //crypto.randomUUID(); TODO: use uuid
	try {
		const response = await axios.request({
			method,
			url,
			params,
			timeout: (get(settingsStore).timeout || 30) * 1000,
			data,
			headers: { ...headers, Authorization: customToken || get(tokenStore)[0] },
			onDownloadProgress: (progressEvent) => {
				const { total, loaded } = progressEvent;
				const { short, long } = details;
				const ticker = progressEvent.estimated ? String(progressEvent.estimated) : undefined;

				loadingStore.update((state) => ({
					...state,
					[progressToken]: {
						min: 0,
						max: total || 1024,
						value: loaded,
						name: short,
						description: long,
						type: 'download',
						ticker
					}
				}));
			},
			onUploadProgress: (progressEvent) => {
				loadingStore.update((state) => {
					state[progressToken] = {
						min: 0,
						max: progressEvent.total || 1024,
						value: progressEvent.loaded,
						name: details.short,
						description: details.long,
						type: 'upload',
						ticker: progressEvent.estimated ? String(progressEvent.estimated) : undefined
					};
					return state;
				});
			}
		});

		console.log(response.headers);
		if (response.status === 429 || response.headers['x-ratelimit-remaining'] <= 2) {
			const dur = response.headers['x-ratelimit-reset-after'] as number;
			setTimeout(() => {
				toastStore.trigger({
					message: `Too many requests, waiting ${dur}s.`,
					background: 'variant-filled-warning',
					timeout: dur * 1000,
					hideDismiss: true
				});
			}, dur);
			request<Response>(method, url, details, params, data, headers, customToken);
		}

		const resp = { resp: response.data, fail: false };
		if (get(settingsStore).debug) console.dir(resp);
		return resp;
	} catch (err) {
		const resp = { resp: err, fail: true };
		if (get(settingsStore).debug) console.dir(resp);
		//@ts-expect-error Error handling should be checked using fail prop
		return resp;
	}
}
