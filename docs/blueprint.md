# **App Name**: VoltView

## Core Features:

- Daily Reading Input: Allow users to input daily electrical meter readings (kWh) with date selection, defaulting to the current date. Provide validation to prevent submission of un-realistic data. Units should not be able to be non-numerical.
- Reading List: Display an editable list/table of past readings with options to edit or delete entries.
- Data Visualization: Generate simple charts (line/bar) to visualize daily, weekly, and monthly consumption trends.
- File-based storage CRUD: Implement Next.js API routes for CRUD operations (add, update, delete, get all) using a file-based database (JSON or lowdb) to store readings locally with data persistence.
- Consumption Analysis: Calculate and display daily consumption differences (compared to the previous day), weekly and monthly totals, average daily usage, peak consumption day and total units for the month. Average daily use is calculated relative to a moving average with configurable span (such as the last 7 days).
- Insight Generation: Provide insights based on consumption data using AI. Compare average daily consumption this week to last week.
- CSV Support: Implement functionality to export readings and analysis to CSV and import CSV files to restore readings.

## Style Guidelines:

- Primary color: Deep sky blue (#42A5F5). A vibrant, inviting blue suggesting the sky, vast data, and positive energy management.
- Background color: Very light blue (#E3F2FD), nearly white, creating a clean, bright interface and high readability.
- Accent color: Cyan (#00BCD4), a contrasting hue analogous to the primary color, for key interactive elements and data highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif (modern, neutral) well-suited for both headlines and body text.
- Use flat, minimalist icons representing energy, meters, charts, and data, ensuring clarity and visual appeal. AVOID gradients.
- Implement a clean, responsive dashboard layout using Tailwind CSS, with the input form, data table, and charts organized intuitively for easy navigation.
- Incorporate subtle animations for data loading, updates, and transitions to enhance the user experience without being distracting.