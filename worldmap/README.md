# D3 Map Visualization - Worldmap

This project is a React application that visualizes geographic data using D3.js. It features an interactive map where users can hover over countries to view additional information and their neighboring countries using nested tooltips.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Scripts](#scripts)

## Features
- Interactive map visualization using D3.js.
- Tooltips displaying country names and their neighbors.
- Nested tooltips
- Zoom and pan functionality.
- Data fetching from a local server.

## Installation
Follow these steps to set up the project locally:

1. Clone the repository:
   
   `git clone https://github.com/NenadPetkovicSW/nested-tooltips-world-map.git`
   
   `cd nested-tooltips-world-map`

2. Install the dependencies:
   
   `npm install`

3. Start the local server:
   
   `npm start`


## Usage
After starting the development server, open your browser and navigate to `http://localhost:4001` to view the interactive map.

## File Structure
The project's file structure is organized as follows:

<pre>
worldmap/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── api/
│   │   └── featureApi.ts      # API functions to fetch data
│   ├── components/
│   │   └── D3Map.tsx   # Main D3 map component
│   ├── hooks/
│   │   └── useFetchFeatureData.ts  # Custom hook for data fetching
│   ├── types/
│   │   └── Feature.ts  # TypeScript interface for Feature
│   ├── utils/
│   │   └── constants.ts    # Constants used in the project
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
├── .env
└── ...
</pre>


### Key Components
- **D3Map.tsx**: Contains the main D3 map visualization logic.
- **useFetchFeatureData.ts**: Custom hook for fetching data.
- **Feature.ts**: TypeScript interface for geographic features.
- **constants.ts**: Contains constants used across the project.
- **featureApi.ts**: API functions for data fetching.

## Dependencies
- `react`: 18.3.1
- `react-dom`: 18.3.1
- `d3`: 7.9.0
- `typescript`: 4.9.5

## Scripts
- `npm start`: Starts the development server.
- `npm build`: Builds the application for production.
- `npm test`: Runs the test suite.
- `npm eject`: Ejects the Create React App configuration.

