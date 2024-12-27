# Hidato Puzzel Slover

Hidato Solver is a web application designed to generate, solve, and validate Hidato puzzles. In a Hidato puzzle, players are given a grid with some numbers already filled in. The objective is to fill in the remaining numbers so that each number in the sequence connects to the next one, either horizontally, vertically, or diagonally. The challenge is ensuring that the sequence from 1 to the highest number fits perfectly within the grid.

This project was developed to provide an interactive platform for solving Hidato puzzles, featuring a user-friendly frontend and a robust backend for puzzle generation and validation.

## Features

- **Puzzle Generation:** The app generates random Hidato puzzles using complex algorithms, ensuring each puzzle is solvable and offers a unique challenge.
- **Puzzle Solver:** Users can submit their solutions, and the app validates them using Depth-First Search (DFS) algorithms to check for correctness.
- **Responsive Design:** Built with React, JavaScript, HTML, and CSS, the frontend adapts seamlessly across devices.
- **Backend API:** Powered by Python and Flask, the backend is hosted on Heroku to manage puzzle generation, validation, and user interaction.

## Technologies Used

- **Frontend:**
  - React
  - JavaScript
  - HTML
  - CSS
  - Deployed on [Vercel](https://vercel.com)

- **Backend:**
  - Python
  - Flask
  - Deployed on [Heroku](https://heroku.com)

## Algorithms

The puzzle generation and solution validation are driven by advanced algorithms to ensure the puzzles are both solvable and challenging within a reasonable time frame. Specifically, the application uses a Depth-First Search (DFS) algorithm to verify puzzle validity.

For reference and inspiration, I referred to the following Stack Overflow discussion:  
[Fill 2D Grid with Single Path](https://stackoverflow.com/questions/15898884/fill-2d-grid-with-single-path)
