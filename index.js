var slidingPuzzle = function (board2dArray, solvedBoard) {
  // Array of: [board, numberOfSteps]
  let queue = []
  // { [stringified_array]: true }
  let visited = {}
  //
  const path = {}
  //
  const initialBoardStr = JSON.stringify(board2dArray)
  // Solved Board
  const solvedBoardStr = JSON.stringify(solvedBoard)

  // Start with the current board, and 0 steps
  queue.push([board2dArray, 0])
  path[JSON.stringify(board2dArray)] = null
  visited[board2dArray] = true

  while (queue.length > 0) {
    // Remove first element from the queue
    const currentBoardToAssess = queue.shift()
    const [currentBoard, currentSteps] = currentBoardToAssess

    // Check if the board is solved yet
    if (JSON.stringify(currentBoard) === solvedBoardStr) {
      // return currentSteps
      return {
        initialBoardStr,
        solvedBoardStr,
        numSteps: currentSteps,
        path: reconstructPath(path, solvedBoardStr)
      }
    }

    //
    const newBoardsToConsider = getNext(currentBoard)
    for (potentialBoardToConsider of newBoardsToConsider) {
      if (!visited[potentialBoardToConsider]) {
        visited[potentialBoardToConsider] = true
        // Add the new board to the end, and save how many steps it took so far
        queue.push([potentialBoardToConsider, currentSteps + 1, ])
        //
        path[JSON.stringify(potentialBoardToConsider)] = JSON.stringify(currentBoard)
      }
    }
  }

  return null
}

function reconstructPath (pathObj, solvedStateStr) {
  let safetyCounter = 0
  let currentPathStr = solvedStateStr
  let path = [solvedStateStr]
  while (currentPathStr) {
    safetyCounter++
    if (safetyCounter > 1000) {
      throw new Error('Could not reconstruct path.')
    }
    currentPathStr = pathObj[currentPathStr]
    if (currentPathStr) {
      path.push(currentPathStr)
    }
  }
  return path.reverse()
}

function getNext(board) {
  // Which row is the blank tile in
  const indexOfBlankTile = board.flat().findIndex(x => x === 0)
  const r = Math.floor(indexOfBlankTile / board[0].length)
  // Which column is the blank tile in
  const c = indexOfBlankTile % board[0].length

  const nextBoards = []
  nextBoards.push(swap(board, r, c, r + 1, c))
  nextBoards.push(swap(board, r, c, r - 1, c))
  nextBoards.push(swap(board, r, c, r, c + 1))
  nextBoards.push(swap(board, r, c, r, c - 1))
  return nextBoards.filter((board) => board !== null)
}

/**
 * 
 * @param {*} board 
 * @param {*} blankTileRow row idx where space is
 * @param {*} blankTileCol column idx where space is
 * @param {*} nr potential row idx where we want to move the blank tile
 * @param {*} nc potential column idx where we want to move the blank tile
 * @returns 
 */
function swap(board, blankTileRow, blankTileCol, nr, nc) {
  // Make sure the new cell location is still on the board (within the bounds)
  if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
    // Clone the board
    let newBoard = board.map(x => [...x])
    // Swap the two cells
    newBoard[blankTileRow][blankTileCol] = board[nr][nc]
    newBoard[nr][nc] = board[blankTileRow][blankTileCol]
    return newBoard
  }
  return null
}

// ====================================================
const boardToSolve = [
  [1, 3, 0],
  [4, 2, 6],
  [7, 5, 8],
]

const solvedBoardState = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
]

const solution = slidingPuzzle(boardToSolve, solvedBoardState)
if (solution) {
  console.log(solution)
  for (let path of solution.path) {
    const arr = JSON.parse(path);
    let str = arr.reduce((acc, subArr, idx) => {
      acc += '| '
      acc += subArr.map((value) => value).join(', ')
      acc += ' |'
      if (idx < arr.length - 1) {
        acc += '\n'
      }
      return acc
    }, '')
    console.log(` ---------\n${str}\n ---------`)
  }
} else {
  console.log("Board could not be solved.")
}
