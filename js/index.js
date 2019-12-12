// JavaScript Document
$(document).ready(function ()
{
    var boardSize = 0; // Init board size
    var numSquares = 0; // Init variable numSquares
    var board = $("#game"); // Store #game inside of variable board
    var o_win = $("#o_win").text(); // Store #o_win text to its variable
    var x_win = $("#x_win").text(); // Store #x_win text to its variable
    var turnIndicator = $("#turn-indicator"); // Store #turn-indicator in a variable for easy access
    
    // Capture #boardsize-form value to determine board size and set up the board
    $( "#boardsize-form" ).submit(function( event )
    {
        event.preventDefault(); // Prevent from page reload after form is submitted
        boardSize = parseInt($("#boardsize-input").val()); // Set #boardsize-input according to its value parsed to integer
        numSquares = (boardSize * boardSize); // Set numSquares value, which is #boardsize-input squared
        
        gameStart(); // Start the game
        
        $("#boardsize").hide(); // Hide #boardsize
        $("#play").show(); // Show #play
    });
    
    // Capture #reset button when clicked
    $("#reset").click(function ()
    {
        gameStart(); // Restart the game
    });
    
    function gameStart()
    {
        console.clear();
        board.html(""); // Clear the board
        
        // To make scalable, set wrapper #game width and height 82px * boardSize
        board.css({
            "width": ((82) * boardSize) + 'px',
            "height": ((82) * boardSize) + 'px'
        });

        // Iterate over numSquares, for every index in numSquares, print to document a "li"
        for (var i = 0; i < numSquares; i++)
        {
            board.append('<li id="'+String(i)+'" class="btn span1 square" data-ttt="" >+</li>'); // Need to append or else "li" overwrite each other!!
        }
        
        var squares = $(".square"); // Store all square "li" in a variable
        
        turnIndicator.css("color","black").text("O's Turn"); // After board is made, indicate who goes first
        
        var boardClicks = 0; // Declare a click counter
        
        // If board is clicked, increment click counter
        board.on("click", "li", function ()
        {
            // determineWinner will return true if it finds a winning combination
            if (determineWinner(true))
            {
                turnIndicator.css("color","blue").text(winningPlayer[0].toUpperCase() + ' wins!'); // Show who is the winner in the turnIndicator
                
                // If after won, player continues clicking, then restart the game
                if(boardClicks === 0)
                {
                    alert(winningPlayer[0].toUpperCase() + ' has won the game. Start a new game');
                    gameStart();
                    
                    return;
                }
                else
                {
                    alert(winningPlayer[0].toUpperCase() + ' wins');
                    boardClicks = 0;
                
                    if(winningPlayer[0] === 'o')
                    {
                        o_win++;
                        $('#o_win').text(o_win);
                    }
                    else if(winningPlayer[0] === 'x')
                    {
                        x_win++;
                        $('#x_win').text(x_win);
                    }
                }
            }
            else if (isEven(boardClicks))
            {
                turnIndicator.css("color","red").text("X's Turn");
                boardClicks++;
            }
            else
            {
                turnIndicator.css("color","black").text("O's Turn");
                boardClicks++;
            }
        });
        
        // Make an array to hold square click data
        var squareClicks = [];
        
        // Set squareclick data for each square to 0
        for (var i = 0; i < numSquares; i++)
        {
            squareClicks[i] = 0;
        }
        
        // Make a variable to store winning combination
        var winningPlayer;
        
        // Add function to determine winner based on clicks array
        function determineWinner(printConsole = true)
        {
            // Check for win by row
            var rowNum = 1;
            for (i = 0; i < numSquares; i += 1)
            {
                if ((i % boardSize) === 0)
                {
                    var rowCheck = [];
                    for (var squareNum = i; squareNum < (i + boardSize); squareNum += 1)
                    {
                        rowCheck.push(squares.eq(squareNum).data("ttt"));
                    }
                    
                    if(printConsole)
                    {
                        console.log('Row ' + rowNum++, rowCheck);
                        console.log(allSame(rowCheck));
                    }

                    if (allSame(rowCheck))
                    {
                        winningPlayer = rowCheck; // Push winning player data
                        return true;
                    }
                }
            }
            
            // Check for win by column
            var colNum = 1;
            for (i = 0; i < numSquares; i += 1)
            {
                if (i < boardSize)
                {
                    var colCheck = [];
                    for (var squareNum = i; squareNum < numSquares; squareNum += boardSize)
                    {
                        colCheck.push(squares.eq(squareNum).data("ttt"));
                    }
                    
                    if(printConsole)
                    {
                        console.log('Column ' + colNum++, colCheck);
                        console.log(allSame(colCheck));
                    }

                    if (allSame(colCheck))
                    {
                        winningPlayer = colCheck;
                        return true;
                    }
                }
            }
            
            // Check for win by left diagonal
            var diag1Check = []; // Needs to be outside of for loop to prevent overwriting array
            for (i = 0; i < numSquares; i += 1)
            {
                // use condition if iterator % boardSize + 1 === 0 to get left diagonals
                if ((i % (boardSize + 1)) === 0)
                {
//                    console.log(i);
                    diag1Check.push(squares.eq(i).data("ttt"));
                }
            }
            
            if(printConsole)
            {
                console.log('Left diagonal', diag1Check);
                console.log(allSame(diag1Check));
            }
            
            if (allSame(diag1Check))
            {
                winningPlayer = diag1Check;
                return true;
            }
            
            // Check for win by right diagonal
            var diag2Check = [];
            for (i = (boardSize - 1); i < (numSquares - 1); i += 1)
            {
                if ((i % (boardSize - 1)) === 0)
                {
//                    console.log(i);
                    diag2Check.push(squares.eq(i).data("ttt"));
                }
            }
            
            if(printConsole)
            {
                console.log('Right diagonal', diag2Check);
                console.log(allSame(diag2Check));
            }
            
            if (allSame(diag2Check))
            {
                winningPlayer = diag2Check;
                return true;
            }
        }; // End determineWinner function
        
        // Add function to count square clicks
        function countClicks()
        {
            var divID = $(this).attr("id");
            squareClicks[divID] += 1;
            if (isEven(boardClicks) && squareClicks[divID] === 1)
            {
                $(this).addClass('disable o btn-primary').data("ttt", "o").text("o");
            }
            else if (isOdd(boardClicks) && squareClicks[divID] === 1)
            {
                $(this).addClass('disable x btn-info').data("ttt", "x").text( "x");
            }
            else if (!determineWinner(false))
            {
                alert('Already selected');
                boardClicks -= 1;
            }
            
            console.log('Turn', squareClicks.reduce(sum));
            
            if (determineWinner(false))
            {
                for (var i = 0; i < numSquares; i++)
                {
                    squareClicks[i] = 2;
                }
            }
        };
        
        for (var i = 0; i < numSquares; i++)
        {
            squares.eq(i).on("click", countClicks);
        }
    }
    
    function isEven(value)
    {
        if (value % 2 === 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function isOdd(value)
    {
        if (value % 1 === 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function allSame(array)
    {
        var first = array[0];

        if (array[0] === "")
        {
            return false;
        }
        else
        {
            return array.every(function (element)
            {
                return element === first;
            });
        }
    }
    
    function sum(total, num) {
        return total + num;
    }
});
