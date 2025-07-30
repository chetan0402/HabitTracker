import type { Habit, HabitEntry } from './types';

class HabitDatabase {
	private db: IDBDatabase | null = null;
	private dbName = 'HabitTrackerDB';
	private version = 1;

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Create habits store
				if (!db.objectStoreNames.contains('habits')) {
					const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
					habitStore.createIndex('isActive', 'isActive', { unique: false });
				}

				// Create entries store
				if (!db.objectStoreNames.contains('entries')) {
					const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
					entryStore.createIndex('habitId', 'habitId', { unique: false });
					entryStore.createIndex('date', 'date', { unique: false });
					entryStore.createIndex('habitId_date', ['habitId', 'date'], { unique: true });
				}
			};
		});
	}

	// Habits CRUD
	async addHabit(habit: Habit): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['habits'], 'readwrite');
			const store = transaction.objectStore('habits');
			const request = store.add(habit);
			
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async updateHabit(habit: Habit): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['habits'], 'readwrite');
			const store = transaction.objectStore('habits');
			const request = store.put(habit);
			
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async deleteHabit(id: string): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['habits', 'entries'], 'readwrite');
			const habitStore = transaction.objectStore('habits');
			const entryStore = transaction.objectStore('entries');
			
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			
			// Delete habit
			habitStore.delete(id);
			
			// Delete all related entries
			const index = entryStore.index('habitId');
			const entriesRequest = index.getAll(id);
			entriesRequest.onsuccess = () => {
				const entries = entriesRequest.result;
				for (const entry of entries) {
					entryStore.delete(entry.id);
				}
			};
		});
	}

	async getActiveHabits(): Promise<Habit[]> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['habits'], 'readonly');
			const store = transaction.objectStore('habits');
			const request = store.getAll();
			
			request.onsuccess = () => {
				const habits = request.result.filter((habit: Habit) => habit.isActive);
				resolve(habits);
			};
			request.onerror = () => reject(request.error);
		});
	}

	async getHabit(id: string): Promise<Habit | undefined> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['habits'], 'readonly');
			const store = transaction.objectStore('habits');
			const request = store.get(id);
			
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	// Entries CRUD
	async addEntry(entry: HabitEntry): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['entries'], 'readwrite');
			const store = transaction.objectStore('entries');
			const request = store.put(entry); // Use put to allow updating existing entries
			
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async getEntry(habitId: string, date: string): Promise<HabitEntry | undefined> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['entries'], 'readonly');
			const store = transaction.objectStore('entries');
			const index = store.index('habitId_date');
			const request = index.get([habitId, date]);
			
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async getEntriesForHabit(habitId: string): Promise<HabitEntry[]> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['entries'], 'readonly');
			const store = transaction.objectStore('entries');
			const index = store.index('habitId');
			const request = index.getAll(habitId);
			
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async getEntriesForDate(date: string): Promise<HabitEntry[]> {
		if (!this.db) throw new Error('Database not initialized');
		
		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(['entries'], 'readonly');
			const store = transaction.objectStore('entries');
			const index = store.index('date');
			const request = index.getAll(date);
			
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
}

export const habitDB = new HabitDatabase();
