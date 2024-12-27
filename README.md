# Hidato Slover

**Author:** Yousuf Ahmed Khan

## Project Overview

Hidato Slover is a web application designed to generate, solve, and validate Hidato puzzles. A Hidato puzzle is a logic-based puzzle where players are given a grid with some numbers pre-filled. The goal is to fill in the remaining numbers such that each number consecutively connects either horizontally, vertically, or diagonally. The challenge lies in ensuring that the entire sequence from 1 to the highest number fits perfectly within the grid.

This project was developed to create an interactive platform for solving Hidato puzzles, complete with a frontend for user interaction and a backend for puzzle generation and validation.

## Features

- **Puzzle Generation:** The application generates random Hidato puzzles based on complex algorithms, ensuring that each puzzle is solvable and presents a unique challenge.
- **Puzzle Solver:** Users can input their solutions, and the application will validate the correctness of the solution using Depth-First Search (DFS) algorithms.
- **Responsive Design:** The frontend is built using React, JavaScript, HTML, and CSS to provide a seamless user experience across various devices.
- **Backend API:** The backend is powered by Python and Flask, deployed on Heroku, to handle puzzle generation, validation, and user interactions.

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

## Complex Algorithms

The Hidato puzzle generation and solving processes required the implementation of complex algorithms. These algorithms ensure that the puzzles are both challenging and solvable within a reasonable time frame. Specifically, Depth-First Search (DFS) was used to check the validity of the puzzles.

For inspiration and reference, I utilized discussions and solutions from the following Stack Overflow page:  
[Fill 2D Grid with Single Path](https://stackoverflow.com/questions/15898884/fill-2d-grid-with-single-path)

## Visit

[Hidato Puzzle Slover](https://hidato-slover.vercel.app/)

License
This project is licensed under the MIT License.

