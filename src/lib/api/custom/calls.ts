import {
	loadingStore,
	requestAmountStore,
	requestBanStore,
	settingsStore,
	tokenStore
} from '$lib/stores';
import type { AxiosHeaders } from 'axios';
import { get } from 'svelte/store';
import { sleep } from '$lib/common';
import { toastStore } from '@skeletonlabs/skeleton';

export default async function request<Response>(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	url: string,
	details: { short: string; long?: string },
	maxReq: number,
	params?: {
		[key: string]: any;
	},
	data?: any,
	headers?: AxiosHeaders,
	customToken?: string
): Promise<{ resp: Response; fail: boolean }> {
	let id = 0;
	try {
		if (get(requestBanStore).requestsLeft <= 4000)
			throw new Error('Too many requests, prevented potential ban');

		requestAmountStore.update((state) => {
			return { ...state, ...{ total: state.total + 1, queued: state.queued + 1 } };
		});
		while (get(requestAmountStore).open >= maxReq) {
			await sleep(10);
		}
		requestAmountStore.update((state) => {
			return { ...state, ...{ open: state.open + 1, queued: state.queued - 1 } };
		});

		loadingStore.update((state) => {
			id = state.push({
				short: details.short,
				long: details.long || '-',
				state: 'wait'
			});
			return state;
		});

		const ws = new WebSocket('ws://127.0.0.1:6463/cors?c=' + details.short);
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					method: method,
					url: url,
					params: Object.entries(params || {}).reduce(
						(acc, [key, value]) => ({ ...acc, [key]: String(value) }),
						{}
					),
					maxReq: maxReq,
					timeout: (get(settingsStore).timeout || 30) * 1000,
					data: data || '',
					headers: { ...headers, Authorization: customToken || get(tokenStore)[0] }
				})
			);
		};

		const response = JSON.parse(await waitForMessage(ws)) as {
			status: number;
			data: string;
			headers: {
				[key: string]: any;
			};
		};
		ws.close();

		requestAmountStore.update((state) => {
			return { ...state, ...{ open: state.open - 1, done: state.done + 1 } };
		});

		if (
			response.status === 429 ||
			typeof response.headers['x-ratelimit-remaining'] === 'number' ||
			typeof JSON.parse(response.data || '{}').retry_after === 'number'
		) {
			const dur =
				(response.headers['x-ratelimit-reset-after'] as number) ||
				(JSON.parse(response.data || '{}').retry_after as number) ||
				5;
			console.error('Rate limited, trying again');
			setTimeout(() => {
				request<Response>(method, url, details, maxReq, params, data, headers, customToken);
			}, dur);
		}

		loadingStore.update((state) => {
			state[id] = {
				...state[id],
				state: 'done'
			};
			return state;
		});
		const resp = { resp: JSON.parse(response.data), fail: false };
		if (get(settingsStore).debug) console.dir(resp);
		return resp;
	} catch (err) {
		requestAmountStore.update((state) => {
			return { ...state, ...{ open: state.open - 1, fail: state.fail + 1 } };
		});
		requestBanStore.update((state) => {
			return {
				...state,
				requestsLeft: state.requestsLeft - 1
			};
		});
		loadingStore.update((state) => {
			state[id] = {
				...state[id],
				state: 'fail'
			};
			return state;
		});

		const resp = { resp: err, fail: true };
		if (get(settingsStore).debug) console.dir(resp);
		//@ts-expect-error Error handling should be checked using fail prop
		return resp;
	}
}

function waitForMessage(ws: WebSocket): Promise<string> {
	return new Promise((resolve) => {
		ws.onmessage = (event) => {
			const msg = event.data;
			resolve(msg);
		};
	});
}
