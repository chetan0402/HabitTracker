export interface Habit {
	id: string;
	name: string;
	type: 'boolean' | 'numerical';
	frequency: HabitFrequency;
	target?: number; // for numerical habits
	unit?: string; // for numerical habits (e.g., "glasses", "minutes")
	createdAt: Date;
	isActive: boolean;
}

export interface HabitFrequency {
	type: 'daily' | 'weekly' | 'monthly' | 'interval' | 'specific_days';
	value?: number; // for 'weekly' (times per week), 'monthly' (times per month), 'interval' (every X days)
	days?: number[]; // for 'specific_days' (0=Monday, 1=Tuesday, ... 6=Sunday)
}

export interface HabitEntry {
	id: string;
	habitId: string;
	date: string; // YYYY-MM-DD format
	completed: boolean;
	value?: number; // for numerical habits
	completedAt?: Date;
}

export interface HabitWithEntries extends Habit {
	todayEntry?: HabitEntry;
	isOverdue?: boolean;
	streak?: number;
}
