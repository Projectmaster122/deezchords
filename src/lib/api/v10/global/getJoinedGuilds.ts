import request from '$lib/api/custom/calls';
import type { IGuild } from '$lib/api/types/guild';
import getGuild from '../guilds/getGuild';

export default async function getJoinedGuilds(customToken?: string) {
	const output = await request<IGuild[]>(
		'GET',
		'https://discord.com/api/v10/users/@me/guilds',
		{ short: 'Getting user data' },
		undefined,
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}
