<script lang="ts">
	import { currentTabStore } from '$lib/stores';
	import { commonTabs } from '$lib/tabs';

	currentTabStore.set(commonTabs.proxy);
</script>
