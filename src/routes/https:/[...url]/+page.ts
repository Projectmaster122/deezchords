import redirectMe from '$lib/api/redirectMe.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	throw redirect(301, redirectMe(params.url.slice(1)));
}
