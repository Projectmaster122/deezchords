export interface ITab {
	title: string;
	url: string[];
	icon: string;
	context: { image?: string; text: string; sub?: string };
	id?: number;
}
