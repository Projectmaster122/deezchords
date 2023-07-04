import { sleep } from '$lib/common';

export default async function corsiumAccessCode(): Promise<
	{ code: string; timeout: number } | false
> {
	const ws = new WebSocket('ws://127.0.0.1:6463/access');
	let received: { code: string; timeout: number } | undefined;
	let timePassed = 0;

	ws.onmessage = (m) => {
		received =
			JSON.parse(m.data).cmd === 'ACCESS'
				? {
						code: JSON.parse(m.data).data.code,
						timeout: JSON.parse(m.data).data.timeout
				  }
				: undefined;
	};

	while (received === undefined && timePassed < 3) {
		await sleep(1000);
		timePassed++;
	}

	if (timePassed >= 3) {
		ws.close();
		return false;
	}

	return received || false;
}
