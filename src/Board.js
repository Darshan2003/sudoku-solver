import './Board.css';
import Header from "./Header";
import React from 'react';
import ParticleComponent from './ParticleComponent';
import Footer from './Footer';
import puzzles from './Puzzles';


const SIZE = 9;

const isPuzzleValid = (puzzle) =>{
  let rows = [];
  let columns = [];
  let boxes = [];
  
  for (let i = 0; i < 9; i++) {
    rows.push([]);
    columns.push([]);
    boxes.push([]);
}

  for (let i = 0; i < SIZE; i++) { 
      for (let j = 0; j < SIZE; j++) {
  
        let cell = puzzle[i][j];
  
        if(cell !== 0) {
          if (rows[i].includes(cell))
          {
            return false;
          } 
          else 
          {rows[i].push(cell);}
  
          if (columns[j].includes(cell)) {
            return false;
          } else columns[j].push(cell);
  
          let boxIndex = Math.floor((i / 3)) * 3 + Math.floor(j / 3);
  
          if (boxes[boxIndex].includes(cell)) {
            return false;
          } else boxes[boxIndex].push(cell);
  
        }
      }
    } 
  
    return true;
}

const check = (puzzle, row, col, value) =>
{
  for (let x = 0; x <= 8; x++) 
    {   if (puzzle[row][x] === value) 
       {
            return 0; 
       }
    }
  
    for (let x = 0; x <= 8; x++) 
    {
        if (puzzle[x][col] === value) 
        {
           return 0; 
        }
    }

    let smallrow = row - row % 3;
    let smallcol = col - col % 3; 
    
    for (let i = 0; i < 3; i++)
    {    for (let j = 0; j < 3; j++) 
        {
            if (puzzle[i + smallrow][j + smallcol] === value) 
            {    
                return 0;
            } 
        }
    }
    return 1; 
}
const solveSudoku = (puzzle, row, col) => {
  
  if (row === SIZE - 1 && col === SIZE)
  {
    return 1;
  } 


  if (col === SIZE) 
  {
      row++; 
      col = 0; 
  } 
  

  if (puzzle[row][col] > 0)
  {
      return solveSudoku(puzzle, row, col + 1); 
  }
  for (let value = 1;value <=SIZE;value++)  
  { 
    
      if (check(puzzle, row, col, value)===1)  
      { 
         
          puzzle[row][col] = value;
          
          if (solveSudoku(puzzle, row, col + 1)===1) 
              return 1; 
      } 
      puzzle[row][col] = 0;
      
  } 
  return 0; 
}

const validateInput = (identify) => {
  let temp = document.getElementById(identify);
  
  if(!(temp.value >= '1' && temp.value <='9'))
  {
    temp.value = '';
    temp.style.backgroundColor = "white";
  }
  else
    temp.style.backgroundColor = "#f3f783";
}
const Square = ({identify}) =>{
  let classManager = 'square';
  if(identify%3===0)
  {
    classManager += ' right';
  }

  if((identify>=19 && identify<=27)||(identify>=46 && identify<=54)||(identify>=73 && identify<=81))
  {
    classManager += ' bottom';
  }

  if(identify<=9) {
    classManager += ' top';    
  }
  if((identify-1)%9 === 0)
  {
    classManager += ' left'
  }
  return(
  <input type="text" inputMode="numeric" id={identify} onInput={() =>validateInput(identify)} className={classManager} maxLength="1" />
)
}

const displayPopUp = (message,time) => {
  document.getElementById('popup').innerHTML = message;
  document.getElementById('overlay').style.display = "flex";
      setTimeout(() => {
        document.getElementById('overlay').style.display = "none";
      }, time);
} 
class Board extends React.Component {
  constructor()
  {
    super();
    this.state={
      isValidPuzzle: true
    };
  
  }
  
  samplePuzzle = (puzzleID) => {
    let sample = puzzles[puzzleID-1];
    let row = 0, col = 0;
    for(let i=1;i<=81;i++)
    {
      let temp = document.getElementById(i);
      if(sample[row][col]===0)
      {
        temp.value = '';
        temp.style.backgroundColor = 'white';
      }
      else
      {
        temp.value = sample[row][col];
        temp.style.backgroundColor = '#f3f783';
      }
      col++;
      if(col===9)
      {
        col = 0;
        row++;
      }
    }
  }
  extractValue = () => {
    const puzzle = [];
    let flag = 0;
    for(let i=1;i<=80;i=i+9)
    {
      const temp = [];
      for (let j = 0; j<9; j++) 
      {
        if(document.getElementById(i+j).value === '')
          temp.push(0);
        else
        {
          flag++;
          temp.push(parseInt(document.getElementById(i+j).value));
        }
      }
      puzzle.push(temp);
    }

    if(flag<17)
    {
      this.setState({isPuzzleValid:false},()=>{
        displayPopUp('<div style="padding: 0 10px">A Standard Sudoku Puzzle should have minimum 17 clues!</div>',2000);
      })
      return;
    }

    let check = isPuzzleValid(puzzle);
    
    if(check)
    {

      if((solveSudoku(puzzle, 0, 0)===1))
      {
        let ele = 1;
        for(let i = 0; i<9; i++)
        {
          for(let j = 0; j<9; j++)
          {
            document.getElementById(ele++).value = puzzle[i][j];
          }
        }
        this.setState({isValidPuzzle: true});
      }
      else
      {
        this.setState(
          {isValidPuzzle: false},()=>{displayPopUp('No Solution!',1100);});
        }
    }
    else
    {
      displayPopUp('<div class="popupContent"><h4>Invalid Puzzle!</h4><div class="popupDetails">There Should be Unique Values (from 1-9) in: <br>1. Each Row.<br>2. Each Column.<br>3. Each Sub-Grid.</div></div>',4000);
    }
  }
  reset(){
    for(let i=1;i<=81;i++)
    {
      document.getElementById(i).value = '';
      document.getElementById(i).style.backgroundColor = "white";
    }
  }
  renderSquare(keyValue) {
    const rows = [];
    let i=0;
    for(i=0;i<9;i++)
    {
      rows.push(<Square key={keyValue+i} identify={keyValue+i}/>);
    }
    return (<div className="gridRow" key={keyValue+i+1}>
      {rows}
    </div>);
}

render(){
    let key = 1;
    const squares = [];
    for(let i=0;i<9;i++)
    {
      squares.push(this.renderSquare(key));
      key = key + 9;
    }

    
    return (
      <div className='Board'>
        <ParticleComponent/>
        <Header/>
        <div className='Grid'>
        {
          squares
        }
        </div>
        <div className="buttons">
        <button className="solve" onClick={this.extractValue}>
          Solve!
        </button>
        <button className="reset" onClick={this.reset}>
          Reset
        </button>
        <div className="dropup">
            <button className="randomPuzzle" >
            Sample Puzzles
            </button>
            <div className="dropup-content">
              <button onClick={()=>this.samplePuzzle(1)}>Sample #1</button>
              <button onClick={()=>this.samplePuzzle(2)}>Sample #2</button>
              <button onClick={()=>this.samplePuzzle(3)}>Sample #3</button>
              <button onClick={()=>this.samplePuzzle(4)}>Sample #4</button>
              <button onClick={()=>this.samplePuzzle(5)}>Sample #5</button>
            </div>
          </div>
        </div>
        <div id="overlay">
          <div id="popup">
          </div>
        </div>
        <Footer popup={displayPopUp}/>
      </div>
    );
  }
}

export default Board;
