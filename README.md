# Operating Model Resource Calculator

A web-based tool to calculate and manage resource allocation across products and work types, with integrated demand planning and capacity analysis.

## Features

### Operating Model View
- Add/remove products and work types dynamically
- Calculate resource totals automatically
- Auto-sync enhancements from demand planning
- Export data to CSV

### Demand Planning View
- Track enhancement requirements per product
- Calculate total enhancement demand
- Automatically updates Operating Model enhancements

### Capacity Analysis View
- Compare capacity vs demand per product
- Visual indicators for capacity issues
- Real-time variance calculations

## Technical Details
- Pure JavaScript implementation
- CSS Grid and Flexbox for responsive layouts
- Event-driven architecture for real-time updates
- Browser LocalStorage for data persistence

## Testing
Project includes Playwright end-to-end tests covering:
- [x] Navigation between views

### TODOs
- [ ] Dynamic table operations
- [ ] Data synchronization
- [ ] CSV export functionality

### Running Tests
```sh
# Install dependencies
npm install

# Run tests
npx playwright test
```

## Setup
1. Clone the repository
2. Open project in VS Code
3. Use Live Server extension (port 5500)
4. Access at http://localhost:5500

## Development
The project structure follows a simple MVC pattern:
- `index.html` - Core HTML structure
- `css/styles.css` - All styling and responsive design
- `js/app.js` - Application logic and event handlers