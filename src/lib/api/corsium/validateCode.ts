import { sleep } from '$lib/common';

export default async function corsiumValidateCode(
	code: string
): Promise<{ valid: boolean; timeout: number } | false> {
	const ws = new WebSocket('ws://127.0.0.1:6463/codeValid');
	let received: { valid: boolean; timeout: number } | undefined;
	let timePassed = 0;

	ws.send(
		JSON.stringify({
			cmd: 'CODE_VALID',
			data: {
				code: code
			},
			evt: 'READY',
			nonce: null
		})
	);

	ws.onmessage = (m) => {
		received =
			JSON.parse(m.data).cmd === 'CODE_VALID'
				? {
						valid: JSON.parse(m.data).data.code,
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
