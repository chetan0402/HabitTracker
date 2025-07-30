import type { Habit, HabitFrequency, HabitEntry } from './types';

export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function parseDate(dateString: string): Date {
	return new Date(dateString + 'T00:00:00');
}

export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday is first day
	return new Date(d.setDate(diff));
}

export function getStartOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getWeekDayNumber(date: Date): number {
	const day = date.getDay();
	return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Sunday=6, Monday=0
}

export function isHabitDueToday(habit: Habit, today: Date): boolean {
	const todayStr = formatDate(today);
	const createdDate = new Date(habit.createdAt);
	
	// If habit was created after today, it's not due
	if (createdDate > today) {
		return false;
	}

	switch (habit.frequency.type) {
		case 'daily':
			return true;

		case 'specific_days':
			const todayWeekDay = getWeekDayNumber(today);
			return habit.frequency.days?.includes(todayWeekDay) || false;

		case 'interval':
			const daysSinceCreated = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
			return daysSinceCreated % (habit.frequency.value || 1) === 0;

		case 'weekly':
			// For weekly frequency, we need to check if the habit should be done today
			// This is more complex and would require tracking completion within the week
			return true; // Simplified - always show weekly habits

		case 'monthly':
			// For monthly frequency, similar complexity
			return true; // Simplified - always show monthly habits

		default:
			return false;
	}
}

export function getHabitStatus(habit: Habit, entries: HabitEntry[], today: Date): {
	isOverdue: boolean;
	missedDays: number;
	currentStreak: number;
} {
	const todayStr = formatDate(today);
	const createdDate = new Date(habit.createdAt);
	
	let missedDays = 0;
	let currentStreak = 0;
	let isOverdue = false;

	// Check if habit is due today and not completed
	const todayEntry = entries.find(e => e.date === todayStr);
	if (isHabitDueToday(habit, today) && (!todayEntry || !todayEntry.completed)) {
		isOverdue = true;
	}

	// Calculate streak (simplified version)
	const sortedEntries = entries
		.filter(e => e.completed)
		.sort((a, b) => b.date.localeCompare(a.date));

	let checkDate = new Date(today);
	let consecutiveDays = 0;

	while (checkDate >= createdDate) {
		const checkDateStr = formatDate(checkDate);
		const entry = entries.find(e => e.date === checkDateStr);
		
		if (isHabitDueToday(habit, checkDate)) {
			if (entry && entry.completed) {
				consecutiveDays++;
			} else {
				break;
			}
		}
		
		checkDate = addDays(checkDate, -1);
	}

	currentStreak = consecutiveDays;

	return {
		isOverdue,
		missedDays,
		currentStreak
	};
}

export function generateHabitId(): string {
	return crypto.randomUUID();
}

export function generateEntryId(): string {
	return crypto.randomUUID();
}
