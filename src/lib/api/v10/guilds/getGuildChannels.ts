import request from '$lib/api/custom/calls';
import type { IChannel } from '$lib/api/types/channel';

export default async function getGuildChannels(options: { guildId: string }, customToken?: string) {
	const output = await request<IChannel[]>(
		'GET',
		`https://discord.com/api/v10/guilds/${options.guildId}/channels`,
		{ short: 'Getting guild channels', long: options.guildId },
		1,
		undefined,
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}
