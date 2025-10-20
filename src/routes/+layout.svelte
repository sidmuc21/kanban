<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/sw.js').then(
					(registration) => {
						console.log('Service Worker registered with scope:', registration.scope);
					},
					(error) => {
						console.log('Service Worker registration failed:', error);
					}
				);
			});
		}
	});
</script>

<svelte:head>
  <meta name="theme-color" content="#4F46E5" />
</svelte:head>


{@render children?.()}
