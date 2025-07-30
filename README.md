# Habit Tracker PWA

A modern, privacy-focused habit tracking Progressive Web App built with SvelteKit. Track your daily habits, build streaks, and improve your routines - all data stored locally on your device.

## Features

- ✅ **Boolean & Numerical Habits**: Track yes/no habits or count-based habits
- 📅 **Flexible Scheduling**: Daily, weekly, monthly, specific days, or custom intervals
- 📱 **PWA Support**: Install on Android as a native app
- 🔒 **Privacy First**: All data stored locally using IndexedDB
- 📊 **Overdue Tracking**: See missed habits and backlogs
- 🎯 **Daily Focus**: Clean daily view with today's due habits
- ⚡ **Fast & Responsive**: Built with SvelteKit for optimal performance

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

```sh
# Clone the repository
git clone https://github.com/YOUR_USERNAME/HabitTracker.git
cd HabitTracker

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:5173` to see the app.

## Usage

### Adding Habits

1. Click the floating action button (+) at the bottom right
2. Enter habit name (e.g., "Drink water", "Exercise")
3. Choose type:
   - **Boolean**: Simple yes/no completion
   - **Numerical**: Track counts/amounts with targets
4. Set frequency:
   - Daily
   - X times per week (any days)
   - X times per month
   - Specific weekdays
   - Every X days
5. For numerical habits, set target and unit (optional)

### Completing Habits

- **Boolean habits**: Click the checkbox to toggle completion
- **Numerical habits**: Enter the amount and it will auto-save

### Daily View

- **Today section**: Habits due today
- **Overdue section**: Missed habits that need attention
- Streaks are shown with 🔥 icon

## Building

To create a production build:

```sh
pnpm run build
```

Preview the production build:

```sh
pnpm run preview
```

## Deployment

### GitHub Pages (Automatic)

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as source
4. Every push to main branch auto-deploys

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Manual Deployment

```sh
pnpm run deploy
```

## Technology Stack

- **SvelteKit**: Full-stack framework with static adapter
- **TypeScript**: Type-safe development
- **IndexedDB**: Local database for habit data
- **Vite PWA**: Progressive Web App features
- **CSS**: Custom responsive styling

## Browser Support

- Modern browsers with IndexedDB support
- PWA features require HTTPS (auto-enabled on GitHub Pages)
- Optimized for mobile/Android devices

## Privacy & Data

- **100% Local**: No data sent to servers
- **IndexedDB**: Persistent local storage
- **No Analytics**: No tracking or telemetry
- **Offline Ready**: Works without internet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Weekly/monthly views
- [ ] Habit statistics and charts
- [ ] Export/import functionality
- [ ] Habit categories
- [ ] Dark mode
- [ ] Reminder notifications
