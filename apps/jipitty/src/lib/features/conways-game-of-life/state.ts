import { useInterval } from "@/lib/utils/use-interval"
import * as React from "react"

interface State {
	grid: boolean[][]
	cache: {
		liveCells: Set<string>
		candidates: Set<string>
	}
}

type ConwaysGameOfLifeAction =
	| InitializeGameAction
	| ToggleCellAction
	| CreateColonyAction
	| NextGenerationAction

interface InitializeGameAction {
	type: "INITIALIZE_GAME"
	payload: {
		initialNumRows: number
		initialNumColumns: number
	}
}

interface ToggleCellAction {
	type: "TOGGLE_CELL"
	payload: {
		y: number
		x: number
	}
}

interface NextGenerationAction {
	type: "NEXT_GENERATION"
}

interface CreateColonyAction {
	type: "CREATE_COLONY"
	payload: {
		radius: number
		originationPoint?: {
			x: number
			y: number
		}
	}
}

const createEmptyBoard = (action: InitializeGameAction["payload"]) => {
	const { initialNumRows, initialNumColumns } = action
	const grid = Array(initialNumRows)
		.fill(undefined)
		.map(() => Array(initialNumColumns).fill(false))
	return grid
}

export const gameOfLifeReducer = (
	state: State,
	action: ConwaysGameOfLifeAction
) => {
	switch (action.type) {
		case "INITIALIZE_GAME": {
			return { ...state, grid: createEmptyBoard(action.payload) }
		}

		case "TOGGLE_CELL": {
			const { y: y, x: x } = action.payload
			const newGrid = [...state.grid]
			newGrid[y][x] = !newGrid[y][x]
			return { ...state, grid: newGrid }
		}

		case "CREATE_COLONY": {
			const { radius } = action.payload
			const newGrid = [...state.grid]
			const rows = newGrid.length
			const cols = newGrid[0].length
			const { x, y } = action.payload.originationPoint ?? {
				x: Math.floor(Math.random() * rows),
				y: Math.floor(Math.random() * cols)
			}

			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					const distance = Math.sqrt((x - i) ** 2 + (y - j) ** 2)

					if (distance <= radius) {
						newGrid[i][j] = Math.random() < 0.95
					}
				}
			}

			return { ...state, grid: newGrid }
		}

		case "NEXT_GENERATION": {
			const liveCells = new Set()
			const candidates = new Set()

			for (let i = 0; i < state.grid.length; i++) {
				for (let j = 0; j < state.grid[0].length; j++) {
					if (state.grid[i][j]) {
						liveCells.add(`${i},${j}`)
						for (let dx = -1; dx <= 1; dx++) {
							for (let dy = -1; dy <= 1; dy++) {
								candidates.add(`${i + dx},${j + dy}`)
							}
						}
					}
				}
			}

			const newGrid = state.grid.map((rowArr, row) => {
				return rowArr.map((cell, col) => {
					const key = `${row},${col}`
					let liveNeighbors = 0

					for (let dx = -1; dx <= 1; dx++) {
						for (let dy = -1; dy <= 1; dy++) {
							if (dx === 0 && dy === 0) continue
							if (liveCells.has(`${row + dx},${col + dy}`)) liveNeighbors++
						}
					}

					if (cell && (liveNeighbors < 2 || liveNeighbors > 3)) {
						liveCells.delete(key)
						return false
					}
					if (!cell && liveNeighbors === 3) {
						liveCells.add(key)
						return true
					}
					return cell
				})
			})

			return { ...state, grid: newGrid, cache: { liveCells, candidates } }
		}

		default:
			return state
	}
}

interface GameOfLifeOptions {
	rows: number
	columns: number
	tickIntervalMilliseconds: number
}

export const useConwaysGameOfLife = (options: GameOfLifeOptions) => {
	const [state, dispatch] = React.useReducer<typeof gameOfLifeReducer>(
		gameOfLifeReducer,
		{
			grid: createEmptyBoard({
				initialNumColumns: options.columns,
				initialNumRows: options.rows
			}),
			cache: {
				liveCells: new Set(),
				candidates: new Set()
			}
		}
	)

	/**
	 * Use the options.tickIntervalMilliseconds to tick the game forward
	 */
	useInterval(() => {
		console.log("Generating next generation...")
		dispatch({
			type: "NEXT_GENERATION"
		})
	}, options.tickIntervalMilliseconds)

	const initializeGame = (
		initialNumRows: number,
		initialNumColumns: number
	) => {
		dispatch({
			type: "INITIALIZE_GAME",
			payload: {
				initialNumRows,
				initialNumColumns
			}
		})
	}

	const toggleCell = (y: number, x: number) => {
		dispatch({
			type: "TOGGLE_CELL",
			payload: {
				y,
				x
			}
		})
	}

	const createColony = () => {
		dispatch({
			type: "CREATE_COLONY",
			payload: {
				radius: 5
			}
		})
	}

	return {
		grid: state.grid,
		initializeGame,
		toggleCell,
		createColony
	}
}
