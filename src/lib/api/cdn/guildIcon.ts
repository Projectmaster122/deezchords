export default function cdnGuildIcon(guildId: string, hash: string) {
	return `https://cdn.discordapp.com/icons/${guildId}/${hash}.${
		!hash.startsWith('a_') ? 'png' : 'gif'
	}`;
}
