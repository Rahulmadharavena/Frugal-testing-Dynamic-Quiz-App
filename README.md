# Frugal Testing - Dynamic Quiz App (PHP, HTML, CSS, JS)

This project implements the Dynamic Quiz Application required by the Frugal Testing assignment.

## Features
- Select category and difficulty (client-side filter)
- Per-question countdown timer with auto-submit on timeout
- Per-question time tracking
- Result analysis with Chart.js (pie and bar charts)
- Questions embedded in PHP (no database required)

## How to run (local)
1. Ensure PHP is installed (php -v)
2. From project folder run PHP built-in server:
   php -S localhost:8000
3. Open: http://localhost:8000/index.php

## Run Selenium automation (requires Python)
1. Install Python packages:
   pip install selenium webdriver-manager
2. Start PHP server (see above)
3. Run automation script:
   python selenium_quiz_test.py "http://localhost:8000/index.php"

## Files
- index.php - main page (embeds questions)
- styles.css - styles
- app.js - client-side logic
- selenium_quiz_test.py - automation using webdriver-manager
