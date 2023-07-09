export interface IRole {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	icon?: string | null;
	unicode_emoji?: string | null;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags?: IRoleTags;
}

export interface IRoleTags {
	bot_id?: string | null;
	integration_id?: string | null;
	premium_subscriber?: null;
	subscription_listing_id?: string | null;
	available_for_purchase?: null;
	guild_connections?: null;
}
