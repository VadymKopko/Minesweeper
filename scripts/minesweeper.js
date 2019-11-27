(function(){
    /*
        Minesweeper Script
        Author: Vadym Kopko
        Version: 1.0.0
    */

    /* modelGrid - 3D Array:
        [i] - row
        [j] - column
        [k] - type
            0 - boolean - isMineHere
            1 - boolean - isHiddenCell
            2 - boolean - isCellAlreadyUsedInThisTurn
            3 - boolean - isFlagHere
            4 - int - numberOfBombsAround
    */

    // Constant variables:
    const SPREAD = 16; // Determines how spread mines are on the grid.

    // Board settings: 
    var gridRows = 16;  // Determines  number of rows in a grid.
    var gridCols = 30;  // Determines  number of columns in a grid.
    var numOfMines = 99;  // Determines the number of mines on the grid.

    // Initializes a new 1D Array:
    var grid = new Array(gridRows);

    // Sellects all cells in the HTML document
    var cells;

    // Global boolean variables:
    var gameStarted = false;
    var userLeftClick = true;

    // Debugginb mode:
    var debug = true;

    // Mathematical functions:
    // Function returns a random intager
    function getRandomInt(max){
        return Math.floor(Math.random() * Math.floor(max));
    }

    // Function returns a number of cells
    function getNumOfCells(){
        return gridRows*gridCols;
    }

    // Funtion which returns row and col based on the ellement in the document.
    function docToCell(doc){
        var cells = document.querySelectorAll("td");
        for(var cell = 0; cell < cells.length; cell++){
            if(cells[cell] == doc){
                var row = Math.floor(cell/gridCols);
                var col = cell % gridCols;
                return {
                    "row": row, 
                    "col": col
                };
            }
        }
    }

    // Funtion which returns row and col based on the ellement in the document.
    function cellToDoc(row, col){
        return (gridCols*row)+col;
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
                grid[row][col] = new Array(5);
                
                // Set satus of a mine to false
                grid[row][col][0] = false;

                // Set status of hidden cell to true
                grid[row][col][1] = true;

                // Set status of check to false
                grid[row][col][2] = false;

                // Set all numbers of mines around to zero
                grid[row][col][4] = 0;

            }   
        }
        // This is done for easier access of all cells
        cells = document.querySelectorAll("td");
    }

    // Runs and checks for bombs
    function checkCell(row, col){

        if(debug){
            console.log("checkCell")
        }

        // Set this cell is already checked
        grid[row][col][2] = true;

        // Find the right cell
        var n = cellToDoc(row, col);

        if(debug){
            console.log("var n = " + n);
        }

        // When user clicked on the mine, aka imposible on the first turn
        if(grid[row][col][0] && userLeftClick){

            // Remove the hidden class
            setVisible(cells[n]);
            // TODO: LOST FUNCTION

        } else if(!grid[row][col][0] || userLeftClick){
            // Only open new cells when a number of mines around less than 3.
            if(debug){
                console.log("Open: " + row + " " + col);
            }

            // Remove the hidden class
            setVisible(cells[n]);

            // Set all other iterations of check cell funtion by computer
            userLeftClick = false;

            if(grid[row][col][4] <= 1){
                // Check other cells around this one if possible:
                if(row-1>=0){if(!grid[row-1][col][2]){checkCell((row-1),col);}}  // North 
                if(row+1<gridRows){if(!grid[row+1][col][2]){checkCell(row+1,col);}}  // South 
                if(col+1<gridCols){if(!grid[row][col+1][2]){checkCell(row,col+1);}}  // East
                if(col-1>=0){if(!grid[row][col-1][2]){checkCell(row,col-1);}}    // West
            }
            
        }
    }

    // Populates the gird with mines:
    function populateMines(){

        if(debug){
            console.log("populateMines");
        }

        // Copies the number of mines.
        var mines = numOfMines;

        // Forward populate tracking variables:
        var fwdRow = 0;
        var fwdCol = 0;

        // Backward populate tracking variables:
        var bwdRow = gridRows-1; 
        var bwdCol = gridCols-1;

        // Populates the grid with mines from both ends until the are no more mines to place
        while(mines > 0){

            // Reset the values in case couldn't populate until the end of the grid
            if(fwdCol >= gridCols-1){
                fwdRow++;
                fwdCol = 0;
            }
            if(fwdRow >= gridRows-1){
                fwdRow = 0;
            }
            if(bwdCol <= 0){
                bwdRow--;
                bwdCol = gridCols-1; 
            }
            if(bwdRow <= 0){
                bwdRow = gridRows-1; 
            }
            
            // Forward populate:
            // Populate with a mine in current cell
            if(getRandomInt(SPREAD) == 0 && mines > 0){

                // Only if it was not users first pick and the mine is not here yet
                if(grid[fwdRow][fwdCol][1] && !grid[fwdRow][fwdCol][0]){
                    placeMine(fwdRow, fwdCol);
                    mines--;
                }
            }

            // Backward populate:
            if(getRandomInt(SPREAD) == 0 && mines > 0){

                // Only if it was not users first pick
                if(grid[bwdRow][bwdCol][1] && !grid[bwdRow][bwdCol][0]){
                    placeMine(bwdRow, bwdCol);
                    mines--;
                }
            }

            // Move tracking
            fwdCol++;
            bwdCol--;

        }
    }

    // Populates the grid with numbers:
    function populateNumbers(){

        if(debug){
            console.log("populateNumbers");
        }

        // Runs around the mine and add increaes a number by 1
        for(var row = 0; row < gridRows; row++){
            for(var col = 0; col < gridCols; col++){
                if(grid[row][col][0]){
                    if(row-1>=0 && col-1>=0){grid[row-1][col-1][4]++;}//North West
                    if(row-1>=0){grid[row-1][col][4]++;}//North
                    if(row-1>=0 && col+1<gridCols){grid[row-1][col+1][4]++;}//North East 
                    if(col+1<gridCols){grid[row][col+1][4]++;}//East
                    if(row+1<gridRows && col+1<gridCols){grid[row+1][col+1][4]++;}//South East 
                    if(row+1<gridRows){grid[row+1][col][4]++;}//South 
                    if(row+1<gridRows && col-1>=0){grid[row+1][col-1][4]++;}//South West
                    if(col-1>=0){grid[row][col-1][4]++;}//West
                }
            }
        }

        // Update numbers inside html
        for(var row = 0; row < gridRows; row++){
            for(var col = 0; col < gridCols; col++){
                if(!grid[row][col][0] && grid[row][col][4] != 0){
                    cells[cellToDoc(row, col)].childNodes[1].innerHTML = grid[row][col][4];
                    // TODO: Change the color depending on the number
                    
                }
            }
        }


    }

    // Function to reset all possible clikces to false
    function resetAllClicks(){
        // Users left click set false
        userLeftClick = false;
    }

    // Event functions:
    function gridLeftClick(){
        
        // Set that this is a user click
        userLeftClick = true;

        // If game has already started, aka this is not a first click
        if(gameStarted){ 

            // Check around for mines
            var {row, col} = docToCell(this);
            checkCell(row, col);

        } else {

            if(debug){
                console.log("gridLeftClick -> else");
            }

            // This code is olny run one every time the board is created.
            gameStarted = true;  // Game has started

            // Set the first cell to be visible so the mine is not populated here
            setVisible(this);

            // Populate grid with mines
            populateMines();

            // Poulate grid with numbers
            populateNumbers();

            // Check around for mines
            var {row, col} = docToCell(this);
            checkCell(row, col);
        }
        // Reset all clicks
        // resetAllClicks();
    } 

    // Functions to manipulate HTML document:
    // Adds a new div to a cell
    function addDiv(td){
        var div = document.createElement("div");
        td.appendChild(div);
    }

    // Adds a new span to a cell
    function addSpan(td){
        var span = document.createElement("span");
        td.appendChild(span);
    }

    // Adds a new cell to a row 
    function addCell(tr){
        var td = document.createElement("td");

        // Adds a new spans to the cell.
        addSpan(td);  // // Hover div, only exists as a visual effect.
        addSpan(td);  // Div which represents eather a number of mines around or a mine itself.

        // Adds a hover effect.
        // td.childNodes[0].classList.add("hover");

        // Adds a hidden effect
        td.classList.add("hidden-cell");
        td.childNodes[1].classList.add("text");
        td.childNodes[1].classList.add("hidden-text");

        tr.appendChild(td);
    }

    // Adds a new row to a table
    function addRow(tbl){
        var tr = document.createElement("tr");
        tbl.appendChild(tr);
    }

    // Set cell to be visible
    function setVisible(cell){
        
        if(debug){
            console.log(cell);
        }

        var {row, col} = docToCell(cell);
        
        if(grid[row][col][1]){
            if(debug){
                console.log("setVisible " + row + " " + col);
            }
            cell.classList.remove("hidden-cell");
            cell.childNodes[1].classList.remove("hidden-text");
            grid[row][col][1] = false;
        }
    }

    // Place a mine
    function placeMine(row, col){

        grid[row][col][0] = true;  // ID: 0 is isMineHere

        // Place a mine
        if(debug){
            console.log(row + " " + col);
        }
        cells[cellToDoc(row, col)].childNodes[1].innerHTML = "X";
    } 

    // Main:
    function main(){

        // Creats a new grid.
        createGrid();  

        // Runs over all cells
        for(var cell = 0; cell < getNumOfCells(); cell++){
            // Adds left click event
            cells[cell].addEventListener("click", gridLeftClick);
        }
    }

    // Launcher 
    main();

})();