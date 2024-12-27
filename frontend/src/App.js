import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';



function App() {
  //const input = {n: 3, m:4, holes: []};
  const [data, setData] = useState([]);
  const [maskedData, setMaskedData] = useState([]);
  const [solution, setSolution] = useState([]);//Array(input.n).fill(Array(input.m).fill(0)));
  const [x, onChange] = useState(1);
  const [y, onChangeY] = useState(1);
  const [holes, setHoles] = useState("[]");
  const [checkSolution, setcheckSolution] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  //const [holeInput, setHoleInput] = useState("");

  function isValidJSONArray(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
  
      // Check if parsed is an array
      if (!Array.isArray(parsed)) return false;
  
      // Check if each element is an array with exactly 2 elements
      return parsed.every(
        item => Array.isArray(item) && item.length === 2
      );
    } catch (error) {
      return false;
    }
  }

  const handleClick = async () => { 
    if (isValidJSONArray(holes)){
      const tempHoles = JSON.parse(holes)
      for(const i of tempHoles){
        if (i[0] < x && i[0] >= 0 && i[1] < y && i[1] >= 0){
          setHoles(holes)
        }
        else{
          alert("invalid Holes")
          return
        }
      }
    }
    else{
      alert("invalid Holes")
      return
    }
    const input = {n: Number(x), m:Number(y), holes: JSON.parse(holes)}; // added holes here
    console.log(input)
    try {
      const response = await axios.post('https://hidato-slover-backend-a87cc6fbe0bc.herokuapp.com/', input); // Replace with your API endpoint
        const originalData = response.data
        setData(originalData)
        setMaskedData(createMaskedData(originalData))
        setSolution(Array(input.m).fill(Array(input.n).fill(0)))
        setcheckSolution("")
        setDisableButton(false)
        //setData(response.data); // Response data is automatically parsed as JSON
        //console.log(data)
    }
    catch(err){
      console.log("invalid puzzle parameters")
    }
  }

  const slovePuzzle = () => {
    const mergedData = maskedData.map((row, rowIndex) => 
      row.map((cell, cellIndex) => 
        cell === 0 ? solution[rowIndex][cellIndex] : cell
      )
    );
    var row, col;

    // starting point
    var numberHoles = 0;
    for (let rowIndex = 0; rowIndex < mergedData.length; rowIndex++) {
      for (let colIndex = 0; colIndex < mergedData[rowIndex].length; colIndex++) {
        if (mergedData[rowIndex][colIndex] === 1) {
          row = rowIndex;
          col = colIndex;
        }
        if (mergedData[rowIndex][colIndex] === -1) {
          numberHoles += 1
        }
      }
    }
    const maxNumber = ((mergedData.length) * (mergedData[0].length)) - numberHoles;
    
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // Up, Down, Left, Right
      [-1, -1], [1, 1], [-1, 1], [1, -1] // Diagonal directions
    ];
    console.log(mergedData)
    console.log(row, col, maxNumber, numberHoles)

    let isValidHidato = (table, row, col, currentNum, maxNum) => {
      const rows = table.length;
      const cols = table[0].length;
    
      // Base case: If the currentNum equals maxNum, the puzzle is valid
      if (currentNum === maxNum) return true;
    
      // Mark the current cell as visited (avoid cycles)
      const temp = table[row][col];
      table[row][col] = -1; // Mark as visited
    
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
    
        // Check bounds and if the neighboring cell matches currentNum + 1
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && table[newRow][newCol] === currentNum + 1) {
          // Recurse to the next number
          if (isValidHidato(table, newRow, newCol, currentNum + 1, maxNum)) {
            return true;
          }
        }
      }
    
      // Unmark the cell (backtrack)
      table[row][col] = temp;
    
      // If no valid path found, return false
      return false;
    };
    //console.log(isValidHidato(mergedData, row, col, 1, maxNumber));
    if (isValidHidato(mergedData, row, col, 1, maxNumber)){
      setcheckSolution("You Got it Right!")
    }
    else{
      setcheckSolution("Try Again!")
    }

  }

  const createMaskedData = (originalData) => {
    const totalCells = originalData.flat().length;
    const numbersToKeep = Math.floor(totalCells / 3); // Select 1/3 of numbers to keep
    const newMaskedData = originalData.map(row => row.map(() => 0)); // Create a blank array of zeros
  
    let chosenCoordinates = [];
  
    // Ensure the number 1 is always included
    // Find the coordinates of the number 1 in the original data
    for (let i = 0; i < originalData.length; i++) {
      for (let j = 0; j < originalData[i].length; j++) {
        if (originalData[i][j] === 1) {
          newMaskedData[i][j] = 1; // Place 1 in the same coordinate
          chosenCoordinates.push([i, j]); // Mark the coordinate as chosen
        }
        if (originalData[i][j] === -1){
          newMaskedData[i][j] = -1;
          chosenCoordinates.push([i, j]);
        }
      }
    }
  
    // Ensure the largest number is always included
    let maxNumber = -Infinity;
    let maxCoords = null;
  
    // Find the largest number and its coordinates in the original data
    for (let i = 0; i < originalData.length; i++) {
      for (let j = 0; j < originalData[i].length; j++) {
        if (originalData[i][j] > maxNumber) {
          maxNumber = originalData[i][j];
          maxCoords = [i, j];
        }
      }
    }
  
    if (maxCoords) {
      const [maxRow, maxCol] = maxCoords;
      newMaskedData[maxRow][maxCol] = maxNumber; // Place the largest number in the same coordinate
      chosenCoordinates.push([maxRow, maxCol]); // Mark the coordinate as chosen
    }
  
    // Randomly select the remaining numbers to fill 1/3 of the cells
    while (chosenCoordinates.length < numbersToKeep) {
      const randomRow = Math.floor(Math.random() * originalData.length);
      const randomCol = Math.floor(Math.random() * originalData[0].length);
  
      if (
        originalData[randomRow][randomCol] !== 0 &&
        !chosenCoordinates.some(([r, c]) => r === randomRow && c === randomCol)
      ) {
        newMaskedData[randomRow][randomCol] = originalData[randomRow][randomCol];
        chosenCoordinates.push([randomRow, randomCol]); // Mark the coordinate as chosen
      }
    }
  
    return newMaskedData;
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    console.log(value)
    const newSolutions = [...solution];
    newSolutions[rowIndex] = [...newSolutions[rowIndex]];
    newSolutions[rowIndex][cellIndex] = parseInt(value) || 0;
    setSolution(newSolutions);
  };

  const handleRangeChangeX = (event) => {
    if (event.target.name === "x") {
      onChange(event.target.value);
    }

    if (event.target.name === "y") {
      onChangeY(event.target.value);
    }
    if (event.target.name === "holes") {
      setHoles(event.target.value)
    }
    console.log(x, y)
    console.log(holes)
  }
  
  const ShowSolution = () => {
    setDisableButton(true)
    setMaskedData(data)
  }



  return (
    <div className="App">
    <div class="intro">
      <h1>Hidato Puzzle Solver </h1>
    </div>
      <div className="buttons">
        <button onClick={handleClick}>Get Puzzle</button>
        <button onClick={slovePuzzle} disabled={disableButton}>Check Puzzle</button> {/*fix this button*/}
        <button onClick={ShowSolution}>Show Solution</button>
      </div>

      <div className="sliders">
        <div className="x-slider">
          <input type="range" min="1" max="10" value={x} name="x" onChange={handleRangeChangeX}/>
          <p>x: {x}</p>
        </div>
        <div className="y-slider">
          <input type="range" min="1" max="10" value={y} name="y" onChange={handleRangeChangeX}/>
          <p>y: {y}</p>
        </div>
      </div>

      <div className="holes">
      <p>holes</p>
        <input type="text" name="holes" value={holes} onChange={handleRangeChangeX}/>
      </div>

      <p><b>{checkSolution}</b></p>
       {/*/: (<p></p>) */}
      <div className="puzzle-grid">
        {Array.isArray(maskedData) && maskedData.map((row, rowIndex) => (
          <div key={rowIndex} className="puzzle-row">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="puzzle-cell">
                {cell !== 0 ? ( // || solution[rowIndex][cellIndex] !== 0
                  <input
                  type="number"
                  value={cell}
                  readOnly
                  className="puzzle-input read-only"
                />
                ) : (
                  <input
                    type="number"
                    value={Number(solution[rowIndex][cellIndex])}
                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                    className="puzzle-input"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div class="instructions">
        <h3>Goal</h3>
        <p>Fill in the grid with consecutive numbers neighboring each other from 1 to the maximum number</p>
        <p>Numbers can be neighboring horizontally, vertically, or diagonally</p>
        <h2>Instructions</h2>
        <p>1. Click on <b>"Get Puzzle"</b> to get a new puzzle</p>
        <p>2. Click on <b>"Check Puzzle"</b> to check your solution</p>
        <p>3. Click on <b>"Show Solution"</b> to show the solution to the current puzzle</p>
        <p>4. Drag on <b>X</b> and <b>Y</b> axis sliders to set Puzzle size</p>
        <p>5. Enter the holes in the textbox in the format <b>[[x1, y1],[x2, y2], ...]</b></p>
        <p>5a. The holes will show up as <b>"-1"</b> on the table</p>

      </div>
    </div>
  );
}

export default App;
