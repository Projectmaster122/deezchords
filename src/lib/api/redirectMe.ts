export default function redirectMe(url: string): string {
	const urlArray = url.toLowerCase().split('/')

	switch (urlArray[0]) {
		case 'discord.com':
			break;
		case 'discord.gg':
			if (urlArray[1] && !urlArray[2]) return '/joinGuild/' + urlArray[1]
			break;

		default:
			break;
	}

	return 'https://' + url
}