import { sleep } from '$lib/common';

export default async function corsiumPing(c: string): Promise<boolean> {
	const ws = new WebSocket('ws://127.0.0.1:6463/ping?c=' + c);
	let received = 2;
	let timePassed = 0;

	ws.onmessage = (m) => {
		received = JSON.parse(m.data).cmd === 'PING' ? 1 : 0;
		ws.close();
	};

	while (received === 2 && timePassed < 3) {
		await sleep(1000);
		timePassed++;
	}

	if (timePassed >= 3) {
		ws.close();
		return false;
	}

	return received === 1;
}
