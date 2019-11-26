/*
    Minesweeper Script
    Author: Vadym Kopko
    Version: 1.0.0
*/

// Constant variables:
const SPREAD = 2; // Determines how spread mines are on the grid.

// Board settings: 
var gridRows = 20;  // Determines  number of rows in a grid.
var gridCols = 31;  // Determines  number of columns in a grid.
var numOfMines = 10;  // Determines the number of mines on the grid.

// Initializes a new 1D Array:
var grid = new Array(gridRows);

// Global boolean variables:
var gameStarted = false;

// Mathematical functions:
// Function returns a random intager
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

// Function returns a number of cells
function getNumOfCells(){
    return gridRows*gridCols;
}

// Initializing functions:
// Creates a new grid 
function createGrid(){

    // Initializes a 2D Array:
    for(var row = 0; row < gridRows; row++){

        // Adds a new row to the HTML document.
        addRow(document.querySelector("tbody"));

        // Adds a new column.
        grid[row] = new Array(gridCols);
    } 

    // Runs over rows and columns.
    for (var row = 0; row < gridRows; row++){ 
        for (var col = 0; col < gridCols; col++){

            // Adds new columns to the HTML document.
            addCell(document.querySelectorAll("tr")[row]);

            // Initializes a 3D Array:
            grid[row][col] = new Array(1);
        }   
    }
}

// Populates the gird with mines:
function populateMines(){

    // Copies the number of mines.
    var mines = numOfMines;

    // Runs over rows and columns.
    for (var row = 0; row < gridRows; row++){ 
        for (var col = 0; col < gridCols; col++){
            // TODO: Add mines!
        }
    }
}

// Event functions:
function gridLeftClick(){

    // If game has already started, aka this is not a first click
    if(gameStarted){


    } else {

        // This code is olny run one every time the board is created.
        gameStarted = true;  // Game has started

        // Open the first cell

        // Populate grid with mines

        // Check around for mines



    }
} 

// Functions to manipulate HTML document:
// Adds a new div to a cell
function addDiv(td){
    var div = document.createElement("div");
    td.appendChild(div);
}
// Adds a new cell to a row 
function addCell(tr){
    var td = document.createElement("td");

    // Adds a new div to the cell.
    addDiv(td);  // Hover div, only exists as a visual effect.
    addDiv(td);  // Div which represents fog, aka player cannot see whats under them.

    // Adds a hover effect.
    td.childNodes[0].classList.add("hover");
    // Adds a hidden effect
    td.childNodes[1].classList.add("hidden-cell");

    tr.appendChild(td);
}
// Adds a new row to a table
function addRow(tbl){
    var tr = document.createElement("tr");
    tbl.appendChild(tr);
}

// Main:
function main(){

    // Creats a new grid.
    createGrid();  

    // Sellects all cells in the HTML document
    cells = document.querySelectorAll("td");

    // Runs over all cells
    for(var cell = 0; cell < getNumOfCells(); cell++){
        // Adds left click event
        cells[cell].addEventListener("click", gridLeftClick);
    }
}

// Launcher 
main();

    