# Setup and Run Instructions

## Step 1: Check Node.js Version

1. Ensure your Node.js version is 20 or higher.
2. If not, please upgrade to Node.js v20+.

## Step 2: Create Environment File

1. In the root folder of the frontend project, create a new file named: `.env.local`
2. Add the following line to the `.env.local` file: `VITE_API_HOST=http://localhost:8080`

## Step 3: Install Dependencies

1. Make sure you are in the root folder of the frontend project. If not, navigate to it using: `cd frontend-folder-name`
2. Run the following command to install the required dependencies: `npm install --force`
3. This will install all necessary Node modules.

## Step 4: Run the Frontend

1. Once dependencies are installed, start the frontend server with: `npm run dev`
2. The terminal will display a localhost URL `(e.g., http://localhost:5173)`.
3. Open this URL in your browser to access the frontend.