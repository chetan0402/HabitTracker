<script lang="ts">
	import { onMount } from 'svelte';
	import { habits, isLoading, habitService } from '$lib/habitService';
	import HabitItem from '$lib/components/HabitItem.svelte';
	import AddHabitForm from '$lib/components/AddHabitForm.svelte';
	import { formatDate } from '$lib/utils';

	let showAddForm = false;
	let currentDate = new Date();

	onMount(async () => {
		await habitService.init();
	});

	function openAddForm() {
		showAddForm = true;
	}

	function closeAddForm() {
		showAddForm = false;
	}

	function getTodayString(): string {
		const today = new Date();
		const options: Intl.DateTimeFormatOptions = { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		};
		return today.toLocaleDateString('en-US', options);
	}

	function getOverdueHabits() {
		return $habits.filter(h => h.isOverdue && !h.todayEntry?.completed);
	}

	function getTodayHabits() {
		return $habits.filter(h => !h.isOverdue || h.todayEntry?.completed);
	}
</script>

<svelte:head>
	<title>Habit Tracker</title>
	<meta name="description" content="Track your daily habits and build better routines" />
</svelte:head>

<main class="app">
	<header class="header">
		<div class="header-content">
			<h1>Habit Tracker</h1>
			<p class="date">{getTodayString()}</p>
		</div>
	</header>

	<div class="content">
		{#if $isLoading}
			<div class="loading">
				<div class="spinner"></div>
				<p>Loading your habits...</p>
			</div>
		{:else}
			{#if $habits.length === 0}
				<div class="empty-state">
					<div class="empty-icon">📝</div>
					<h2>No habits yet</h2>
					<p>Start building better routines by adding your first habit!</p>
					<button class="btn btn-primary" on:click={openAddForm}>
						Add Your First Habit
					</button>
				</div>
			{:else}
				<div class="habits-container">
					<!-- Overdue Habits -->
					{#if getOverdueHabits().length > 0}
						<section class="habits-section">
							<h2 class="section-title overdue-title">
								⚠️ Overdue ({getOverdueHabits().length})
							</h2>
							<div class="habits-list">
								{#each getOverdueHabits() as habit (habit.id)}
									<HabitItem {habit} />
								{/each}
							</div>
						</section>
					{/if}

					<!-- Today's Habits -->
					{#if getTodayHabits().length > 0}
						<section class="habits-section">
							<h2 class="section-title">
								📅 Today ({getTodayHabits().length})
							</h2>
							<div class="habits-list">
								{#each getTodayHabits() as habit (habit.id)}
									<HabitItem {habit} />
								{/each}
							</div>
						</section>
					{/if}
				</div>
			{/if}
		{/if}
	</div>

	<!-- Floating Action Button -->
	<button class="fab" on:click={openAddForm} aria-label="Add new habit">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	</button>

	<!-- Add Habit Modal -->
	{#if showAddForm}
		<AddHabitForm on:close={closeAddForm} />
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f8fafc;
		color: #1f2937;
		line-height: 1.5;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		max-width: 600px;
		margin: 0 auto;
		background: white;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
	}

	.header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px;
		text-align: center;
	}

	.header-content h1 {
		margin: 0 0 8px 0;
		font-size: 28px;
		font-weight: 700;
	}

	.date {
		margin: 0;
		font-size: 14px;
		opacity: 0.9;
	}

	.content {
		flex: 1;
		padding: 20px;
		padding-bottom: 80px; /* Space for FAB */
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #e5e7eb;
		border-top: 3px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
	}

	.empty-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}

	.empty-state h2 {
		margin: 0 0 8px 0;
		font-size: 24px;
		color: #1f2937;
	}

	.empty-state p {
		margin: 0 0 24px 0;
		color: #6b7280;
		font-size: 16px;
	}

	.habits-container {
		max-width: 100%;
	}

	.habits-section {
		margin-bottom: 32px;
	}

	.section-title {
		margin: 0 0 16px 0;
		font-size: 18px;
		font-weight: 600;
		color: #1f2937;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.overdue-title {
		color: #dc2626;
	}

	.habits-list {
		display: flex;
		flex-direction: column;
	}

	.fab {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #3b82f6;
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
		transition: all 0.2s ease;
		z-index: 100;
	}

	.fab:hover {
		background: #2563eb;
		transform: scale(1.05);
	}

	.fab:active {
		transform: scale(0.95);
	}

	.btn {
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.app {
			box-shadow: none;
		}
		
		.content {
			padding: 16px;
			padding-bottom: 80px;
		}
		
		.fab {
			bottom: 16px;
			right: 16px;
		}
	}
</style>