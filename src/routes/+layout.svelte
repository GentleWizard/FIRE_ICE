<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeatBar, { heatMeter } from '$lib/heatMeter/heatMeter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="max-w-5xl mx-auto p-8 min-h-screen flex flex-col justify-center">
	<HeatBar />
	<div class="grid grid-cols-3 gap-3 mb-4">
		<button
			onclick={() => heatMeter.decrementHeat(10)}
			class="p-3.5 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg bg-sky-500 hover:bg-sky-600 active:scale-95 text-white"
		>
			<span>Decrease</span>
		</button>
		<button
			onclick={() => heatMeter.resetHeat()}
			class="p-3.5 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg bg-slate-500 hover:bg-slate-600 active:scale-95 text-white"
		>
			<span>Reset</span>
		</button>
		<button
			onclick={() => heatMeter.incrementHeat(10)}
			class="p-3.5 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white"
		>
			<span>Increase</span>
		</button>
	</div>
	<div class="grid grid-cols-3 gap-3 mb-4">
		<div>
			<label class="block text-xs text-slate-400 mb-1" for="minHeat">Min Heat</label>
			<input
				id="minHeat"
				type="number"
				bind:value={heatMeter.minHeat}
				step="5"
				class="w-full p-2 rounded border border-slate-300 text-white"
			/>
		</div>
		<div>
			<label class="block text-xs text-slate-400 mb-1" for="neutralHeat">Neutral Heat</label>
			<input
				id="neutralHeat"
				type="number"
				step="5"
				bind:value={heatMeter.neutralHeat}
				class="w-full p-2 rounded border border-slate-300 text-white"
			/>
		</div>
		<div>
			<label class="block text-xs text-slate-400 mb-1" for="maxHeat">Max Heat</label>
			<input
				id="maxHeat"
				type="number"
				step="5"
				bind:value={heatMeter.maxHeat}
				class="w-full p-2 rounded border border-slate-300 text-white"
			/>
		</div>
	</div>
</div>
{@render children()}
