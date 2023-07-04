import type { IRole } from "./role";
import type { IUser } from "./user";

export interface IEmoji {
	id?: string | null;
	name?: string | null;
	roles?: IRole[];
	user?: IUser;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
}

export interface ISticker {
	id: string;
	pack_id?: string;
	name: string;
	description?: string;
	tags: string;
	asset?: string;
	type: number;
	format_type: number;
	available?: boolean;
	guild_id?: string;
	user?: IUser;
	sort_value?: number;
}