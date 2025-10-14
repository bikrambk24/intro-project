
# Property Management System

This is a web-based application for managing property-related data, including people, landlords, buildings, and rooms. It was developed as a job test submission to demonstrate skills in full-stack development using Node.js, SQLite, and modern JavaScript. The app features a clean, UI and a robust backend with a relational database.

## Features
- **Manage Entities**: Add, edit, and view people, landlords, buildings, and rooms using intuitive tables and popup forms.
- **Relational Data**:
  - Buildings are linked to landlords (each building has a landlord).
  - Rooms are linked to buildings (each room belongs to a building).
  - People are standalone (e.g., for staff or tenants, with a placeholder schedule).
- **Modern UI**: Responsive design with styled tables, blue buttons, and centered modal forms.
- **Backend**: SQLite database (`data.db`) with foreign key constraints to ensure data integrity.
- **Testing**: Mocha/Chai tests for backend functions (`people` and `landlords`).

## Setup Instructions
1. **Clone the Repository**:
   git clone <repository-url>
   cd .....
   git checkout feature/task-work
2. **Install Dependencies**:
   npm install
   - Installs `sqlite3`, `mocha`, `chai`, and `eslint`.
3. **Run the App**:
   node index.js
   - Opens at `http://localhost:3000`.
   - Creates `data.db` with tables and sample data (one landlord, building, room).
4. **Test the App**:
   - Open `http://localhost:3000` in a browser.
   - Click "Add Person", "Add Landlord", "Add Building", or "Add Room" to open forms.
   - Edit entries via "Edit" buttons in tables.
   - Verify relationships (e.g., Building table shows landlord name).
5. **Run Tests**:
   npm test
   - Runs Mocha tests in `test/people.test.js` and `test/landlords.test.js` to verify backend functionality.

## File Structure
- **data.db**: SQLite database (generated at runtime, not in Git) with tables: `people`, `landlords`, `buildings`, `rooms`.
- **index.js**: Main server file, serves the frontend (`public/index.html`) and routes API requests to `lib/api.js`.
- **lib/**:
  - `db.js`: Sets up SQLite database (`data.db`), creates tables with foreign keys, seeds sample data.
  - `api.js`: Handles API requests (e.g., GET `/api/people`, PUT `/api/buildings`).
  - `people.js`, `landlords.js`, `buildings.js`, `rooms.js`: Backend logic to add, update, and fetch each entity.
- **public/**:
  - `index.html`: Main webpage with tables and modal forms for all entities.
  - `css/styles.css`: Styles for responsive UI (tables, buttons, modals).
  - `js/start.js`: Initializes the app, sets up schedule headers (Mon–Sun) for People table.
  - `js/api.js`: Sends API requests from frontend to backend.
  - `js/form.js`: Manages modal forms (show, save, close).
  - `js/dom.js`: Helper for finding table rows (used for "Edit" buttons).
  - `js/people.js`, `landlords.js`, `buildings.js`, `rooms.js`: Frontend logic to populate tables and handle forms.
- **test/**:
  - `people.test.js`: Tests for adding, updating, and fetching people.
  - `landlords.test.js`: Tests for adding, updating, and fetching landlords.

## Notes
- **Database**: Uses `data.db` exclusively.
- **Schedule Column**: The People table has schedule columns (Mon–Sun) as placeholders (shows "N/A"). Future versions could add scheduling functionality.
- **Foreign Keys**: Buildings require a valid landlord, rooms require a valid building, enforced by SQLite.
- **Error Handling**: Frontend validates required fields; backend handles database errors (e.g., missing name, invalid foreign keys).

