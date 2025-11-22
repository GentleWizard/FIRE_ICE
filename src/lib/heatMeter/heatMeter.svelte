<script module lang="ts">
	export const heatMeter = new heatMeterState();
</script>

<script lang="ts">
	import { heatMeterState } from './state.svelte';

	let TEMP_RANGE = $derived(heatMeter.maxHeat - heatMeter.minHeat);
	const TICK_INTERVAL = 5;
	let MAJOR_TICK_INTERVAL = $derived(TICK_INTERVAL * 2);
	let TICK_COUNT = $derived(TEMP_RANGE / TICK_INTERVAL + 1);
	const PADDING = 0.5;

	// Values are already percentages from state
	const coldPercent = $derived(heatMeter.cold);
	const hotPercent = $derived(heatMeter.hot);
	const neutralPercent = $derived(heatMeter.neutral);

	// Calculate where neutral point sits in the range (as percentage from left)
	const neutralPosition = $derived(
		((heatMeter.neutralHeat - heatMeter.minHeat) / TEMP_RANGE) * 100
	);

	// Width of each side in the bar
	const coldSideWidth = $derived(neutralPosition);
	const hotSideWidth = $derived(100 - neutralPosition);
</script>

<div class="mb-4.5">
	<div class="text-center text-sm font-semibold mb-1 grid grid-cols-3">
		<span class="text-sky-400">Cold: {coldPercent.toFixed(1)}%</span>
		<span class="text-slate-400">Neutral: {neutralPercent.toFixed(1)}%</span>
		<span class="text-amber-400">Hot: {hotPercent.toFixed(1)}%</span>
	</div>

	<div
		class="relative h-12 overflow-hidden shadow-inner border-2 border-white/10 bg-slate-700 rounded-sm"
	>
		<!-- Cold side (grows left from neutral point) -->
		<div
			style="width: {(coldPercent / 100) * coldSideWidth}%; right: {100 - neutralPosition}%;"
			class="bg-gradient-to-l from-sky-500 to-sky-400 absolute inset-y-0 transition-all duration-300"
		>
			<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
		</div>

		<!-- Hot side (grows right from neutral point) -->
		<div
			style="width: {(hotPercent / 100) * hotSideWidth}%; left: {neutralPosition}%;"
			class="bg-gradient-to-r from-amber-500 to-red-500 absolute inset-y-0 transition-all duration-300"
		>
			<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
		</div>

		<!-- Neutral line (at neutral point, not center) -->
		<div style="left: {neutralPosition}%;" class="absolute inset-y-0 w-0.5 bg-white/30"></div>
	</div>

	<!-- Tick marks -->
	<div class="relative h-8 mt-0.5">
		{#each Array.from({ length: TICK_COUNT }) as _, i}
			{@const value = heatMeter.minHeat + i * TICK_INTERVAL}
			{@const position = PADDING + ((value - heatMeter.minHeat) / TEMP_RANGE) * (100 - 2 * PADDING)}
			{@const isMajor = value % MAJOR_TICK_INTERVAL === 0}
			<div style="left: {position}%;" class="absolute">
				<div class="w-px bg-white/40 {isMajor ? 'h-4' : 'h-2'}"></div>
				{#if isMajor}
					<div class="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium">
						{value > 0 ? '+' : ''}{value}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
