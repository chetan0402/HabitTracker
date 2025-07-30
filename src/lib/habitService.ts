import { writable } from 'svelte/store';
import type { Habit, HabitEntry, HabitWithEntries } from './types';
import { habitDB } from './database';
import { formatDate, isHabitDueToday, getHabitStatus, generateEntryId } from './utils';

export const habits = writable<HabitWithEntries[]>([]);
export const isLoading = writable(true);

class HabitService {
	private initialized = false;

	async init() {
		if (this.initialized) return;
		
		await habitDB.init();
		this.initialized = true;
		await this.loadTodaysHabits();
	}

	async loadTodaysHabits() {
		isLoading.set(true);
		
		try {
			const today = new Date();
			const todayStr = formatDate(today);
			
			// Get all active habits
			const allHabits = await habitDB.getActiveHabits();
			
			// Get today's entries
			const todayEntries = await habitDB.getEntriesForDate(todayStr);
			
			// Combine habits with their entries and calculate status
			const habitsWithEntries: HabitWithEntries[] = [];
			
			for (const habit of allHabits) {
				// Get all entries for this habit to calculate streaks
				const allEntries = await habitDB.getEntriesForHabit(habit.id);
				const todayEntry = todayEntries.find(e => e.habitId === habit.id);
				
				// Check if habit is due today or overdue
				const isDueToday = isHabitDueToday(habit, today);
				const status = getHabitStatus(habit, allEntries, today);
				
				// Only include habits that are due today or have overdue items
				if (isDueToday || status.isOverdue) {
					habitsWithEntries.push({
						...habit,
						todayEntry,
						isOverdue: status.isOverdue,
						streak: status.currentStreak
					});
				}
			}
			
			// Sort habits: overdue first, then by creation time
			habitsWithEntries.sort((a, b) => {
				if (a.isOverdue && !b.isOverdue) return -1;
				if (!a.isOverdue && b.isOverdue) return 1;
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			});
			
			habits.set(habitsWithEntries);
		} catch (error) {
			console.error('Failed to load habits:', error);
		} finally {
			isLoading.set(false);
		}
	}

	async addHabit(habit: Habit) {
		await habitDB.addHabit(habit);
		await this.loadTodaysHabits();
	}

	async updateHabit(habit: Habit) {
		await habitDB.updateHabit(habit);
		await this.loadTodaysHabits();
	}

	async deleteHabit(id: string) {
		await habitDB.deleteHabit(id);
		await this.loadTodaysHabits();
	}

	async completeHabit(habitId: string, value?: number) {
		const today = new Date();
		const todayStr = formatDate(today);
		
		// Check if entry already exists
		let entry = await habitDB.getEntry(habitId, todayStr);
		
		if (entry) {
			// Update existing entry
			entry.completed = true;
			entry.value = value;
			entry.completedAt = new Date();
		} else {
			// Create new entry
			entry = {
				id: generateEntryId(),
				habitId,
				date: todayStr,
				completed: true,
				value,
				completedAt: new Date()
			};
		}
		
		await habitDB.addEntry(entry);
		await this.loadTodaysHabits();
	}

	async uncompleteHabit(habitId: string) {
		const today = new Date();
		const todayStr = formatDate(today);
		
		const entry = await habitDB.getEntry(habitId, todayStr);
		
		if (entry) {
			entry.completed = false;
			entry.value = undefined;
			entry.completedAt = undefined;
			await habitDB.addEntry(entry);
			await this.loadTodaysHabits();
		}
	}
}

export const habitService = new HabitService();
