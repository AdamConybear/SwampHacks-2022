import React, { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid"; // save reference to "v4" function from uuid library, but rename function to "uuidV4"
// import Grid from '@mui/material/Grid';
import Header from "./Header";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import "./main.css";

const [r, c] = [8, 8];

let tempGrid = Array(r)
	.fill()
	.map(() => Array(c).fill("#"));
tempGrid[4][4] = "A";

var tempLetters = [
	["A", "D", "A", "M", "C", "O"],
	["N", "Y", "B", "E", "#", "R"],
	["Y", "O", "T", "T", "#", "#"],
];

// let lettersCount = 0;

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

const windowDemensions = getWindowDimensions();

let LETTERS_PER_ROW;
if (windowDemensions.width >= 680) {
	LETTERS_PER_ROW = 7;
} else {
	LETTERS_PER_ROW = 6;
}

const parseLetterArray = (arr) => {
	//coming in a 1d array
	let res = [];
	let r = 0;
	let i = 0;
	while (arr[i]) {
		let row = new Array(LETTERS_PER_ROW).fill("#");
		let j = 0;
		while (j < LETTERS_PER_ROW && arr[i]) {
			row[j] = arr[i];
			j++;
			i++;
		}
		res[r] = row;
		r++;
	}
};

const LandingPage = () => {
	const [letters, setLetters] = useState(tempLetters);
	// const [lettersTest, setLettersTest] = useState(["A", "D", "A", "M", "C", "O", "N", "Y", "B", "E", "A", "R"]);
	const [letterMap, setLetterMap] = useState({});
	const [gridState, setGridState] = useState([]);
	// const [userGrid, setUserGrid] = useState(
	// 	Array(r)
	// 		.fill()
	// 		.map(() => Array(c).fill("#"))
	// );
	const [userGrid, setUserGrid] = useState(tempGrid);

	// retrieve letters and grid from local storage (if there)
	// useEffect(() => {
	// 	//if letters are there, grid will also be there
	// 	const storedLetters = window.localStorage.getItem("letters");

	// 	if (!storedLetters) {
	// 		//api call to get letters/grid for the day
	//remove
	// 		//update local storage once call is complete
	// 	} else {
	// 		//get from local storage
	// 		window.localStorage.setItem("letters", letters);
	// 		window.localStorage.setItem("userGrid", userGrid);
	// 	}
	// }, [letters]);

	//update userGrid as they move stuff
	// useEffect(() => {
	// 	console.log(userGrid);
	// 	let temp = userGrid;
	// 	temp[4][4] = "A";
	// 	setUserGrid(temp);
	// 	console.log(userGrid);
	// 	// setUserGrid(JSON.parse(window.localStorage.getItem("userGrid")));
	// }, []);

	const getTileStyle = (isDraggingOver) => ({
		background: isDraggingOver ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
	});
	const getLetterStyle = (isDraggingOver) => ({
		background: isDraggingOver ? "rgba(0, 0, 0, 0.2)" : "none",
		display: "flex",
		overflow: "hidden",
	});

	const reorderLetters = (letterArray, startIndexes, endIndexes) => {
		//remember to set letter arr..maybe useeffect does this
		const result = Array.from(letterArray);
		//get indexes
		const [startRow, startCol] = startIndexes.split("-");
		const [endRow, endCol] = endIndexes.split("-");

		if (startRow == endRow) {
			const [removedLetter] = result[startRow].splice(startCol, 1);
			const temp = result[endRow][endCol];
			result[endRow].splice(endCol, 0, removedLetter);
			result[startRow][startCol] = temp;
		} else {
			const letter = result[startRow][startCol];
			result[startRow][startCol] = result[endRow][endCol];
			result[endRow][endCol] = letter;
		}
		// const [removedLetter] = result[startRow].splice(startCol, 1);

		return result;
	};

	const reorderGrid = (grid, startIndexes, endIndexes) => {
		const result = Array.from(grid);

		const [startRow, startCol] = startIndexes.split("");
		const [endRow, endCol] = endIndexes.split("");

		//get letter and replace with #
		const letter = result[startRow][startCol];
		result[startRow][startCol] = "#";

		//update new index
		result[endRow][endCol] = letter;

		return result;
	};

	const move = (sourceArr, destinationArr, droppableSource, droppableDestination) => {
		const sourceClone = Array.from(sourceArr);
		const destClone = Array.from(destinationArr);
		const result = {};

		if (droppableSource.droppableId.length === 3) {
			//came from letters and dropping into grid

			//get index from letter array
			const [sourceRow, sourceCol] = droppableSource.droppableId.split("-");

			const letter = sourceClone[sourceRow][sourceCol];
			sourceClone[sourceRow][sourceCol] = "#";

			//add in grid
			const [destRow, destCol] = droppableDestination.droppableId.split("");
			destClone[destRow][destCol] = letter;

			result["letters"] = sourceClone;
			result["grid"] = destClone;
			// destClone[destRow].splice(destCol, 0, removedLetter);
		} else {
			//came from grid and dropping into letters

			//remove from grid
			const [sourceRow, sourceCol] = droppableSource.droppableId.split("");

			//get letter and replace with #
			const letter = sourceClone[sourceRow][sourceCol];
			sourceClone[sourceRow][sourceCol] = "#";

			//place letter in letter array
			const [destRow, destCol] = droppableDestination.droppableId.split("-");
			destClone[destRow][destCol] = letter;

			result["grid"] = sourceClone;
			result["letters"] = destClone;
		}

		return result;
	};

	const getList = (len) => {
		if (len === 3) {
			return letters;
		}
		return userGrid;
	};

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;
		console.log("drag ended");
		// console.log(source);
		// console.log(destination);

		const sourceLen = source.droppableId.length;
		const destLen = destination.droppableId.length;

		//dropped outside container
		if (!destination) {
			console.log("outside of dropzone");
			return;
		}

		//dropped within a container
		if (sourceLen === 3 && destLen === 3) {
			console.log("reorder in letters container");
			//reorder in letters

			const data = reorderLetters(letters, source.droppableId, destination.droppableId);
			setLetters(data);
		} else if (sourceLen === 2 && destLen === 2) {
			console.log("reorder in grid container");
			//reorder in grid

			const data = reorderGrid(userGrid, source.droppableId, destination.droppableId);
			setUserGrid(data);
		} else {
			console.log("Dropped in different container");
			const result = move(getList(sourceLen), getList(destLen), source, destination);

			//set state
			setLetters(result["letters"]);
			setUserGrid(result["grid"]);
		}
	};

	// const Test = (i, len) => {
	// 	console.log("i: " + i + " -- len:" + len);
	// };

	return (
		<div className="app-container">
			<Header />
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="grid-container">
					{userGrid.map((row, i) => {
						return (
							<div className="grid-row" key={i}>
								{row.map((letter, j) => {
									return (
										<Droppable
											key={`${i}${j}`}
											droppableId={`${i}${j}`}
											isDropDisabled={letter !== "#" ? true : false}
										>
											{(provided, snapshot) => (
												<div
													className="grid-tile"
													ref={provided.innerRef}
													{...provided.droppableProps}
													style={getTileStyle(snapshot.isDraggingOver)}
												>
													{letter !== "#" ? (
														<Draggable
															key={parseInt(`${i}${j}`)}
															draggableId={`${i}${j}`}
															index={parseInt(`${i}${j}`)}
														>
															{(provided, snapshot) => (
																<div
																	className="letter-grid disable-select"
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	{letter}
																</div>
															)}
														</Draggable>
													) : null}

													{provided.placeholder}
												</div>
											)}
										</Droppable>
									);
								})}
							</div>
						);
					})}
				</div>
				<div className="letters-container">
					{letters.map((row, i) => {
						return (
							<div className="letters-row" key={i}>
								{row.map((letter, j) => {
									return (
										<Droppable
											key={`${i}-${j}`}
											droppableId={`${i}-${j}`}
											// isDropDisabled={letter !== "#" ? true : false}
										>
											{(provided, snapshot) => (
												<div
													className="letter-droppable"
													ref={provided.innerRef}
													// {...provided.droppableProps}
													style={getLetterStyle(snapshot.isDraggingOver)}
												>
													{letter !== "#" ? (
														<Draggable
															key={parseInt(`${i}-${j}`)}
															draggableId={`${i}-${j}`}
															index={parseInt(`${i}-${j}`)}
														>
															{(provided, snapshot) => (
																<div
																	className="letter disable-select"
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	{letter}
																</div>
															)}
														</Draggable>
													) : undefined}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
									);
								})}
							</div>
						);
					})}
				</div>
			</DragDropContext>

			<div className="submit">Submit</div>
		</div>
	);
};

export default LandingPage;
