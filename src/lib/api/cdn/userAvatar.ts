export default function cdnUserAvatar(userId: string, hash: string) {
	return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${
		!hash.startsWith('a_') ? 'png' : 'gif'
	}`;
}
