# DSA Sim: An Interactive Data Structures & Algorithms Learning Platform

## 1. Project Overview
**DSA Sim** is a web-based coding game designed to help users practice Data Structures and Algorithms (DSA) through interactive, step-by-step visualizations. Users can select coding problems, write solutions in a fully-featured code editor, and run their code against test cases.  

The core feature is a dynamic simulation engine that animates the user's algorithm, providing visual feedback on execution, including successes and points of failure. The application is built entirely with **React** and **Tailwind CSS**, with all state and problem data managed locally.

---

## 2. Features

- **Problem Categories:** Sorting, Graphs, Arrays, Dynamic Programming, Recursion.
- **In-Browser Code Editor:** Powered by Monaco Editor with syntax highlighting, code formatting (Prettier), and a clean editing experience.
- **Dynamic Simulation Engine:** Animates the execution of the user's code directly.
- **Step-by-Step Controls:** Play, Pause, Next, Previous, Reset.
- **Playback Speed Control:** Adjustable speeds – Slow, Default, Fast, Very Fast.
- **Descriptive Steps:** Each animation step includes clear text explanations.
- **Code-Driven Visualizations:** Animation is manipulated by the user's implementation via a recorder API.
- **Visual Debugging:**  
  - Highlights the exact step where an error occurs.  
  - "Watch" feature to monitor variables in real-time.  
  - Infinite loop and timeout detection.
- **Custom Input:** Users can provide their own JSON input for problems; validation logic adapts dynamically.
- **Gamification Elements:** Tracks solved problems, maintains daily streaks, and awards badges stored in `localStorage`.
- **Responsive UI:** Styled with Tailwind CSS for seamless experience on all devices.

---

## 3. Technology Stack

- **Frontend Framework:** React (Create React App)  
- **Styling:** Tailwind CSS  
- **Routing:** React Router  
- **Code Editor:** Monaco Editor for React  
- **Code Formatting:** Prettier  
- **State Management:** React Hooks (`useState`, `useMemo`, `useContext`) + `localStorage`  

---

## 4. Project Development and Iterations

### Iteration 1: Initial Scaffolding and Core Functionality
- Set up React project with Tailwind CSS.
- Created main pages: Home, Problem List, Solve, Dashboard.
- Implemented a foundational simulation engine (Bubble Sort, DFS Traversal).
- Basic gamification via `localStorage`.

### Iteration 2: Content Expansion and UI Enhancements
- Added all problem categories by default.
- Expanded problem library:  
  - **Sorting:** Insertion Sort, Selection Sort  
  - **Graphs:** BFS Traversal  
  - **Arrays:** Two Sum, Longest Substring (Sliding Window)  
  - **Dynamic Programming:** Fibonacci (Tabulation)  
  - **Recursion:** Tower of Hanoi
- Improved starter code readability and test cases.
- Added playback speed selector.

### Iteration 3: Advanced, Code-Driven Simulation and Debugging
- Introduced **recorder API**:
  - `record.record(step)` – Push animation frames.
  - `record.watch(vars)` – Display live variable states.
  - `record.assert(condition, message)` – Flag errors on failed assertions.
  - `record.error(message)` – Manually flag an error step.
- UI updated to show step-by-step explanations, variable watches, and errors.

### Iteration 4: Dynamic Input and Validation
- Added **Custom Input** textarea on Solve page.
- Evaluation engine enhanced to parse custom JSON input.
- Test case validation dynamically computes expected output.

### Iteration 5: Final Fixes and Deployment Guidance
- Resolved bugs and JSX parsing errors.
- Fully integrated Prettier for editor formatting.
- Documented deployment instructions for **Netlify, Vercel, GitHub Pages**.

---

## 5. How to Run Locally

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd dsa-sim

# Install dependencies
npm install

# Start development server
npm start
```
If port 3000 is in use:


# PowerShell
```bash
$env:PORT=3001; npm start

# macOS/Linux
PORT=3001 npm start
```
Open the app at http://localhost:3000.

# 6. How to Add a New Problem
Add Data: Append a new problem object in src/state/problems.json. Use an existing simType (e.g., 'bubble', 'dfs', 'hanoi').
Create Visualization (if new simType):
Create a new React component in src/visuals/.
Update src/ui/SimulationPanel.js to render the new component based on its simType.
Add a reference step-generator in src/utils/evaluator.js for users who don’t use the recorder.

