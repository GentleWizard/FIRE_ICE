interface localStorage {
	restraints: {
		maxHeat: number;
		minHeat: number;
		neutralHeat: number;
	};
	values: {
		heat: number;
		cold: number;
		hot: number;
		neutral: number;
	};
}

export class heatMeterState {
	#maxHeat: number;
	#minHeat: number;
	#neutralHeat: number;

	#heat: number;
	#cold: number;
	#hot: number;
	#neutral: number;

	#storageKey: string;
	#cleanupStorage: () => void;

	constructor(minHeat = -100, maxHeat = 100, neutralHeat = 0, storageKey = 'heatMeterState') {
		this.#storageKey = storageKey;

		// Load from localStorage if available
		const saved = this.#loadFromStorage();

		this.#minHeat = $state<number>(saved?.restraints.minHeat ?? minHeat);
		this.#maxHeat = $state<number>(saved?.restraints.maxHeat ?? maxHeat);
		this.#neutralHeat = $state<number>(saved?.restraints.neutralHeat ?? neutralHeat);

		this.#heat = $state<number>(saved?.values.heat ?? this.#neutralHeat);

		// Cold: percentage from neutral to min edge (0-100%)
		this.#cold = $derived<number>(
			this.#heat < this.#neutralHeat
				? ((this.#neutralHeat - this.#heat) / (this.#neutralHeat - this.#minHeat)) * 100
				: 0
		);

		// Hot: percentage from neutral to max edge (0-100%)
		this.#hot = $derived<number>(
			this.#heat > this.#neutralHeat
				? ((this.#heat - this.#neutralHeat) / (this.#maxHeat - this.#neutralHeat)) * 100
				: 0
		);

		// Neutral: inverse of whichever is active
		this.#neutral = $derived<number>(100 - this.#cold - this.#hot);

		this.#cleanupStorage = $effect.root(() => {
			$effect(() => {
				try {
					const data: localStorage = {
						restraints: {
							maxHeat: this.#maxHeat,
							minHeat: this.#minHeat,
							neutralHeat: this.#neutralHeat
						},
						values: {
							heat: this.#heat,
							cold: this.#cold,
							hot: this.#hot,
							neutral: this.#neutral
						}
					};
					window.localStorage.setItem(this.#storageKey, JSON.stringify(data));
				} catch (error) {
					console.error('Failed to save to localStorage:', error);
				}
			});
		});
	}

	#loadFromStorage(): localStorage | null {
		if (typeof window === 'undefined') return null;

		try {
			const stored = window.localStorage.getItem(this.#storageKey);
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			console.error('Failed to load from localStorage:', error);
			return null;
		}
	}

	clearStorage(): void {
		if (typeof window === 'undefined') return;
		window.localStorage.removeItem(this.#storageKey);
	}

	incrementHeat(amount: number) {
		this.heat = this.heat + amount;
	}

	decrementHeat(amount: number) {
		this.heat = this.heat - amount;
	}

	resetHeat() {
		this.#heat = this.#neutralHeat;
	}

	get minHeat() {
		return this.#minHeat;
	}

	get maxHeat() {
		return this.#maxHeat;
	}

	get neutralHeat() {
		return this.#neutralHeat;
	}

	get heat() {
		return this.#heat;
	}

	get hot() {
		return this.#hot;
	}

	get cold() {
		return this.#cold;
	}

	get neutral() {
		return this.#neutral;
	}

	set heat(value: number) {
		this.#heat = Math.max(this.#minHeat, Math.min(this.#maxHeat, value));
	}

	set cold(value: number) {
		this.heat = this.#neutralHeat - value;
	}

	set hot(value: number) {
		this.heat = this.#neutralHeat + value;
	}

	set neutralHeat(value: number) {
		this.#neutralHeat = value;
	}

	set minHeat(value: number) {
		this.#minHeat = value;
	}

	set maxHeat(value: number) {
		this.#maxHeat = value;
	}

	// Call this when you're done with the instance
	destroy(): void {
		this.#cleanupStorage();
	}
}
