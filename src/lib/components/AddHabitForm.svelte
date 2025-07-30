<script lang="ts">
	import type { Habit, HabitFrequency } from '$lib/types';
	import { habitService } from '$lib/habitService';
	import { generateHabitId } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let name = '';
	let type: 'boolean' | 'numerical' = 'boolean';
	let frequencyType: HabitFrequency['type'] = 'daily';
	let frequencyValue = 1;
	let selectedDays: number[] = [];
	let target: number | undefined = undefined;
	let unit = '';
	let isSubmitting = false;

	const weekDays = [
		{ label: 'Mon', value: 0 },
		{ label: 'Tue', value: 1 },
		{ label: 'Wed', value: 2 },
		{ label: 'Thu', value: 3 },
		{ label: 'Fri', value: 4 },
		{ label: 'Sat', value: 5 },
		{ label: 'Sun', value: 6 }
	];

	function toggleDay(day: number) {
		if (selectedDays.includes(day)) {
			selectedDays = selectedDays.filter(d => d !== day);
		} else {
			selectedDays = [...selectedDays, day];
		}
	}

	async function handleSubmit() {
		if (isSubmitting || !name.trim()) return;

		// Validate specific days
		if (frequencyType === 'specific_days' && selectedDays.length === 0) {
			alert('Please select at least one day');
			return;
		}

		// Validate numerical habits
		if (type === 'numerical' && (!target || target <= 0)) {
			alert('Please set a valid target for numerical habits');
			return;
		}

		isSubmitting = true;

		try {
			const frequency: HabitFrequency = {
				type: frequencyType,
				value: frequencyType === 'weekly' || frequencyType === 'monthly' || frequencyType === 'interval' 
					? frequencyValue 
					: undefined,
				days: frequencyType === 'specific_days' ? selectedDays : undefined
			};

			const habit: Habit = {
				id: generateHabitId(),
				name: name.trim(),
				type,
				frequency,
				target: type === 'numerical' ? target : undefined,
				unit: type === 'numerical' && unit.trim() ? unit.trim() : undefined,
				createdAt: new Date(),
				isActive: true
			};

			await habitService.addHabit(habit);
			
			// Reset form
			name = '';
			type = 'boolean';
			frequencyType = 'daily';
			frequencyValue = 1;
			selectedDays = [];
			target = undefined;
			unit = '';

			dispatch('close');
		} catch (error) {
			console.error('Failed to add habit:', error);
			alert('Failed to add habit. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		dispatch('close');
	}
</script>

<div class="modal-overlay" 
	on:click={handleCancel} 
	on:keydown={(e) => e.key === 'Escape' && handleCancel()}
	role="button"
	tabindex="0"
>
	<div class="modal" 
		on:click|stopPropagation 
		on:keydown|stopPropagation
		role="dialog"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="modal-header">
			<h2 id="modal-title">Add New Habit</h2>
			<button class="close-btn" on:click={handleCancel}>×</button>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="habit-form">
			<div class="form-group">
				<label for="name">Habit Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					placeholder="e.g., Drink water, Exercise, Read"
					required
				/>
			</div>

			<div class="form-group">
				<label for="type">Type</label>
				<select id="type" bind:value={type}>
					<option value="boolean">Yes/No (Boolean)</option>
					<option value="numerical">Count/Amount (Numerical)</option>
				</select>
			</div>

			{#if type === 'numerical'}
				<div class="form-row">
					<div class="form-group">
						<label for="target">Target</label>
						<input
							id="target"
							type="number"
							min="1"
							bind:value={target}
							placeholder="e.g., 8"
							required
						/>
					</div>
					<div class="form-group">
						<label for="unit">Unit (optional)</label>
						<input
							id="unit"
							type="text"
							bind:value={unit}
							placeholder="e.g., glasses, minutes"
						/>
					</div>
				</div>
			{/if}

			<div class="form-group">
				<label for="frequency">Frequency</label>
				<select id="frequency" bind:value={frequencyType}>
					<option value="daily">Daily</option>
					<option value="weekly">X times per week</option>
					<option value="monthly">X times per month</option>
					<option value="specific_days">Specific days of week</option>
					<option value="interval">Every X days</option>
				</select>
			</div>

			{#if frequencyType === 'weekly' || frequencyType === 'monthly' || frequencyType === 'interval'}
				<div class="form-group">
					<label for="frequency-value">
						{#if frequencyType === 'weekly'}
							Times per week
						{:else if frequencyType === 'monthly'}
							Times per month
						{:else}
							Every X days
						{/if}
					</label>
					<input
						id="frequency-value"
						type="number"
						min="1"
						max={frequencyType === 'weekly' ? 7 : frequencyType === 'monthly' ? 31 : 365}
						bind:value={frequencyValue}
						required
					/>
				</div>
			{/if}

			{#if frequencyType === 'specific_days'}
				<div class="form-group">
					<span class="label-text">Days of the week</span>
					<div class="day-selector" role="group" aria-label="Select days of the week">
						{#each weekDays as day}
							<button
								type="button"
								class="day-btn"
								class:selected={selectedDays.includes(day.value)}
								on:click={() => toggleDay(day.value)}
								aria-pressed={selectedDays.includes(day.value)}
							>
								{day.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="form-actions">
				<button type="button" class="btn btn-secondary" on:click={handleCancel}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary" disabled={isSubmitting || !name.trim()}>
					{isSubmitting ? 'Adding...' : 'Add Habit'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}

	.modal {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 20px 0;
		border-bottom: 1px solid #e5e7eb;
		margin-bottom: 20px;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 20px;
		font-weight: 600;
		color: #1f2937;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: #6b7280;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: #374151;
	}

	.habit-form {
		padding: 0 20px 20px;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	label, .label-text {
		display: block;
		margin-bottom: 4px;
		font-weight: 500;
		color: #374151;
		font-size: 14px;
	}

	input, select {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		background: white;
		box-sizing: border-box;
	}

	input:focus, select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.day-selector {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.day-btn {
		padding: 8px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.2s ease;
	}

	.day-btn:hover {
		border-color: #3b82f6;
	}

	.day-btn.selected {
		background: #3b82f6;
		border-color: #3b82f6;
		color: white;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 24px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.btn {
		padding: 10px 20px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
	}

	.btn-secondary {
		background: #f9fafb;
		color: #374151;
		border: 1px solid #d1d5db;
	}

	.btn-secondary:hover {
		background: #f3f4f6;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn-primary:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}
</style>
