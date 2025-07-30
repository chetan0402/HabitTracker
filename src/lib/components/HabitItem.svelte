<script lang="ts">
	import type { HabitWithEntries } from '$lib/types';
	import { habitService } from '$lib/habitService';

	export let habit: HabitWithEntries;

	let inputValue = habit.todayEntry?.value || habit.target || 0;
	let isUpdating = false;

	async function toggleBoolean() {
		if (isUpdating) return;
		isUpdating = true;

		try {
			if (habit.todayEntry?.completed) {
				await habitService.uncompleteHabit(habit.id);
			} else {
				await habitService.completeHabit(habit.id);
			}
		} catch (error) {
			console.error('Failed to update habit:', error);
		} finally {
			isUpdating = false;
		}
	}

	async function updateNumerical() {
		if (isUpdating || inputValue < 0) return;
		isUpdating = true;

		try {
			if (inputValue === 0) {
				await habitService.uncompleteHabit(habit.id);
			} else {
				await habitService.completeHabit(habit.id, inputValue);
			}
		} catch (error) {
			console.error('Failed to update habit:', error);
		} finally {
			isUpdating = false;
		}
	}

	function getFrequencyText(): string {
		switch (habit.frequency.type) {
			case 'daily':
				return 'Daily';
			case 'weekly':
				return `${habit.frequency.value} times/week`;
			case 'monthly':
				return `${habit.frequency.value} times/month`;
			case 'interval':
				return `Every ${habit.frequency.value} days`;
			case 'specific_days':
				const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
				const selectedDays = habit.frequency.days?.map(d => days[d]).join(', ') || '';
				return selectedDays;
			default:
				return '';
		}
	}
</script>

<div class="habit-item" class:overdue={habit.isOverdue} class:completed={habit.todayEntry?.completed}>
	<div class="habit-info">
		<h3 class="habit-name">{habit.name}</h3>
		<div class="habit-details">
			<span class="frequency">{getFrequencyText()}</span>
			{#if habit.streak && habit.streak > 0}
				<span class="streak">🔥 {habit.streak}</span>
			{/if}
		</div>
	</div>

	<div class="habit-action">
		{#if habit.type === 'boolean'}
			<button
				class="checkbox"
				class:checked={habit.todayEntry?.completed}
				disabled={isUpdating}
				on:click={toggleBoolean}
			>
				{#if habit.todayEntry?.completed}
					✓
				{:else}
					&nbsp;
				{/if}
			</button>
		{:else}
			<div class="numerical-input">
				<input
					type="number"
					min="0"
					max="9999"
					bind:value={inputValue}
					on:change={updateNumerical}
					disabled={isUpdating}
					class:completed={habit.todayEntry?.completed && (habit.todayEntry?.value || 0) >= (habit.target || 1)}
				/>
				{#if habit.unit}
					<span class="unit">{habit.unit}</span>
				{/if}
				{#if habit.target}
					<span class="target">/ {habit.target}</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.habit-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px;
		margin-bottom: 8px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	.habit-item.overdue {
		border-left: 4px solid #ef4444;
		background: #fef2f2;
	}

	.habit-item.completed {
		background: #f0fdf4;
		border-left: 4px solid #22c55e;
	}

	.habit-info {
		flex: 1;
		min-width: 0;
	}

	.habit-name {
		margin: 0 0 4px 0;
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		word-break: break-word;
	}

	.habit-details {
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: 14px;
		color: #6b7280;
	}

	.frequency {
		background: #f3f4f6;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 12px;
	}

	.streak {
		font-weight: 600;
		color: #f59e0b;
	}

	.habit-action {
		margin-left: 16px;
		flex-shrink: 0;
	}

	.checkbox {
		width: 48px;
		height: 48px;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		font-size: 24px;
		font-weight: bold;
		color: white;
		transition: all 0.2s ease;
	}

	.checkbox:hover {
		border-color: #3b82f6;
	}

	.checkbox.checked {
		background: #22c55e;
		border-color: #22c55e;
		color: white;
	}

	.checkbox:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.numerical-input {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 14px;
	}

	.numerical-input input {
		width: 60px;
		padding: 8px;
		border: 2px solid #d1d5db;
		border-radius: 6px;
		text-align: center;
		font-size: 14px;
		background: white;
	}

	.numerical-input input.completed {
		border-color: #22c55e;
		background: #f0fdf4;
	}

	.numerical-input input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.unit, .target {
		color: #6b7280;
		font-size: 12px;
	}

	.target {
		font-weight: 600;
	}
</style>
