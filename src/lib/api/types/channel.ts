import {
	mdiBullhorn,
	mdiCastAudio,
	mdiFolder,
	mdiForum,
	mdiMessage,
	mdiMessageReply,
	mdiMessageSettings,
	mdiMessageTextLock,
	mdiPound,
	mdiShape,
	mdiVolumeHigh
} from '@mdi/js';
import type { IGuildMember } from './guild';
import type { IUser } from './user';

export interface IChannel {
	id: string;
	type: number;
	guild_id?: string;
	position?: number;
	permission_overwrites?: IOverwrite[];
	name?: string | null;
	topic?: string | null;
	nsfw?: boolean;
	last_message_id?: string | null;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number | null;
	recipients?: IUser[];
	icon?: string | null;
	owner_id?: string;
	application_id?: string;
	managed?: boolean;
	parent_id?: string | null;
	last_pin_timestamp?: string | null;
	rtc_region?: string | null;
	video_quality_mode?: number;
	message_count?: number;
	member_count?: number;
	thread_metadata?: IThreadMetadata;
	member?: IThreadMember;
	default_auto_archive_duration?: number;
	permissions?: string;
	flags?: number;
	total_message_sent?: number;
	available_tags?: ITag[];
	applied_tags?: string[];
	default_reaction_emoji?: IDefaultReactionObject | null;
	default_thread_rate_limit_per_user?: number;
	default_sort_order?: number | null;
	default_forum_layout?: number;
}

export interface IOverwrite {
	id: string;
	type: number;
	allow: string;
	deny: string;
}

export interface IThreadMetadata {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: string;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: string | null;
}

export interface IThreadMember {
	id?: string;
	user_id?: string;
	join_timestamp?: string;
	flags?: number;
	member?: IGuildMember;
}

export interface ITag {
	id: string;
	name: string;
	moderated: boolean;
	emoji_id?: string | null;
	emoji_name?: string | null;
}

export interface IDefaultReactionObject {
	emoji_id?: string | null;
	emoji_name?: string | null;
}

export enum EChannelType {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4,
	GUILD_ANNOUNCEMENT = 5,
	ANNOUNCEMENT_THREAD = 10,
	PUBLIC_THREAD = 11,
	PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE = 13,
	GUILD_DIRECTORY = 14,
	GUILD_FORUM = 15
}

export const EDNChannelType = [
	// enum display name
	'Text channel', // GUILD_TEXT
	'Personal chat', // DM
	'Voice channel', // GUILD_VOICE
	'Group chat', // GROUP_DM
	'Category', // GUILD_CATEGORY
	'Announcement', // GUILD_ANNOUNCEMENT
	null,
	null,
	null,
	null, // [4] empty
	'Announcement Thread', // ANNOUNCEMENT_THREAD
	'Public Thread', // PUBLIC_THREAD
	'Private Thread', // PRIVATE_THREAD
	'Stage Voice Channel', // GUILD_STAGE_VOICE
	'Directory', // GUILD_DIRECTORY
	'Forum' // GUILD_FORUM
];

export const EIChannelType = [
	// enum icon
	mdiPound, // GUILD_TEXT
	mdiMessage, // DM
	mdiVolumeHigh, // GUILD_VOICE
	mdiMessage, // GROUP_DM
	mdiShape, // GUILD_CATEGORY
	mdiBullhorn, // GUILD_ANNOUNCEMENT
	null,
	null,
	null,
	null, // [4] empty
	mdiMessageSettings, // ANNOUNCEMENT_THREAD
	mdiMessageReply, // PUBLIC_THREAD
	mdiMessageTextLock, // PRIVATE_THREAD
	mdiCastAudio, // GUILD_STAGE_VOICE
	mdiFolder, // GUILD_DIRECTORY
	mdiForum // GUILD_FORUM
];
