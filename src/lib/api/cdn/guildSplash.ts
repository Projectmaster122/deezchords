export default function cdnGuildSplash(guildId: string, hash: string) {
	return `https://cdn.discordapp.com/splashes/${guildId}/${hash}.${
		!hash.startsWith('a_') ? 'png' : 'gif'
	}`;
}
