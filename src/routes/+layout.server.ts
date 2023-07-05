import { env } from '$env/dynamic/private';
import sha256 from 'fast-sha256';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { fromUint8Array } from 'js-base64';
import { redirect } from '@sveltejs/kit';

export const load = ({ route, cookies }) => {
	if (JSON.parse(env.DEV_CODES).length === 0) {
		if (route.id?.startsWith('/dev')) throw redirect(303, '/dev/codes?r=auth');
		return {
			status: 200
		};
	}

	if (route.id === '/dev/codes')
		return {
			status: 200
		};

	const devCookie = cookies.get('dev');
	if (!devCookie) throw redirect(303, '/dev/codes?r=auth');

	dayjs.extend(utc);
	if (
		JSON.parse(env.DEV_CODES).some(
			(item: string) =>
				fromUint8Array(
					sha256(
						new TextEncoder().encode(
							item + dayjs.utc().format('YYYYMMDDHH').split('').join('fuck you mr hacker')
						)
					),
					true
				) === devCookie
		)
	) {
		return {
			status: 200
		};
	}

	throw redirect(303, '/dev/codes?r=auth');
};
