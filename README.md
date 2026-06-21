# Carbon Footprint Tracker

## Executive Summary
This application is designed to help individuals monitor, understand, and reduce their environmental impact. It translates global emissions data into a personalized, gamified digital experience.

## Architecture and Tech Stack
- **Framework**: React 18 with Vite.
- **Language**: TypeScript for absolute domain safety.
- **State Management**: Zustand with zero-backend `localStorage` persistence.
- **Visualization**: Recharts for accessible visual feedback.

The application purposefully omits a dedicated backend to remain strictly under the 10 MB payload threshold, bypass ongoing cloud hosting costs, and minimize the barrier to entry. User inputs traverse through the `emissionsEngine` utility into the Zustand global store, terminating in the Recharts UI components.

## Problem Statement
Climate change is a critical global crisis, but individuals often feel their actions are disconnected from the larger impact. It is difficult for people to accurately track their carbon footprint without complex tools. This project solves this by providing a highly accessible, gamified, and local-first carbon footprint tracker. By transforming abstract emissions into understandable metrics and rewarding sustainable streaks, we empower individuals to take measurable climate action.

## Calculation Methodology
Calculations rely on scientific matrices. Baseline factors include:
- **Electricity**: 0.727 kg CO2e / kWh
- **Public Transit (Bus)**: 0.015 kg CO2e / km
- **Personal Car**: 0.111 kg CO2e / km

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Run tests: `npm test`

## Open Source Contributions
Contributors should adhere to the feature-sliced project structure and standard conventional commits. Keep feature logic isolated in `/src/features/` and pure math utilities in `/src/utils/`.
