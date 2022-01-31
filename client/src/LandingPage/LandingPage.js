import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import "./main.css";

const [r, c] = [8, 8];

let tempGrid = Array(r)
	.fill()
	.map(() => Array(c).fill("#"));

let tempLetters = Array(13).fill("#");

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
    return res;
};

const LandingPage = () => {
	const [letters, setLetters] = useState(parseLetterArray(tempLetters));
    // const [gridState, setGridState] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [userGrid, setUserGrid] = useState(tempGrid);
    const [correctSubmission, setCorrectSubmission] = useState(false);
    const [score, setScore] = useState(0);
    const [badAttempt,setBadAttempt] = useState(false);
	
    useEffect(()=>{
        const state = JSON.parse(window.localStorage.getItem("state"));
        // console.log(state);
        // console.log(state.date);
        
        const now = new Date();
        const cur_date_formatted = now.getUTCDate()+"-"+now.getUTCMonth()+"-"+now.getUTCFullYear();
        // console.log(cur_date_formatted);

        if(!state || state.date !== cur_date_formatted){
            //api call
            // console.log("getting state from api");
            getGameData();

        }else{
            // console.log("retrieved from local state");
            //get from local storage
            const {letters, userGrid, correctSubmission} = state;

            setLetters(letters);
            setUserGrid(userGrid);
            setCorrectSubmission(correctSubmission);
        }


    },[]);
    
    
    const getGameData = async () =>{
        // setIsLoading(true);
        try{
            let address;

            if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                // dev code
                address = "http://localhost:5000";
            } else {
                // production code
                address = process.env.BASE_URL || "https://adamconybear.github.io";
            }

            const result = await axios.get(address + '/get-letters')
            .then((res) => {
                // console.log(res.data);
                setLetters(parseLetterArray(res.data.array));
                // setGridState(res.data.grid);
                // setIsLoading(false);
				const now = new Date();
                const cur_date_formatted = now.getUTCDate()+"-"+now.getUTCMonth()+"-"+now.getUTCFullYear();
                const state = {
                    date: cur_date_formatted,
                    letters: parseLetterArray(res.data.array),
                    userGrid: userGrid,
                    correctSubmission: false
                }
                window.localStorage.setItem("state", JSON.stringify(state));
                

                })
                .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                });;
        }catch(error){
            console.log(error);
        }
    } 
	


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
        const [sourceRow, sourceCol] = startIndexes.split("-");
        const [destRow, destCol] = endIndexes.split("-");
        //get letter and replace with #
        const letter = result[sourceRow][sourceCol];
        result[sourceRow][sourceCol] = result[destRow][destCol];
        result[destRow][destCol] = letter;
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
            const [destRow, destCol] = droppableDestination.droppableId.split("-");
			//get letter and replace with #
			const letter = sourceClone[sourceRow][sourceCol];
			sourceClone[sourceRow][sourceCol] = destClone[destRow][destCol];
            destClone[destRow][destCol] = letter;
			//place letter in letter array

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
		const { destination, source } = result;
		// console.log("drag ended");

		//dropped outside container
		if (!destination) {
			// console.log("outside of dropzone");
			return;
        }
        const sourceLen = source.droppableId.length;
		const destLen = destination.droppableId.length;

		//dropped within a container
		if (sourceLen === 3 && destLen === 3) {
			// console.log("reorder in letters container");
			//reorder in letters

			const data = reorderLetters(letters, source.droppableId, destination.droppableId);
            setLetters(data);
            updateLocalStorageLetters(data);
		} else if (sourceLen === 2 && destLen === 2) {
			// console.log("reorder in grid container");
			//reorder in grid

			const data = reorderGrid(userGrid, source.droppableId, destination.droppableId);
            setUserGrid(data);
            updateLocalStorageGrid(data);
		} else {
			// console.log("Dropped in different container");
			const result = move(getList(sourceLen), getList(destLen), source, destination);

			//set state
			setLetters(result["letters"]);
            setUserGrid(result["grid"]);
            
            updateLocalStorageLetters(result["letters"]);
            updateLocalStorageGrid(result["grid"]);
		}
    };

    const updateLocalStorageLetters = (letters) => {
        let state = JSON.parse(window.localStorage.getItem("state"));
        state.letters = letters;
        window.localStorage.setItem("state", JSON.stringify(state));
    }
    const updateLocalStorageGrid = (grid) => {
        let state = JSON.parse(window.localStorage.getItem("state"));
        state.userGrid = grid;
        window.localStorage.setItem("state", JSON.stringify(state));
    }
    const updateLocalStorageSubmission = (success) => {
        let state = JSON.parse(window.localStorage.getItem("state"));
        state.correctSubmission = success;
        window.localStorage.setItem("state", JSON.stringify(state));
    }
    

    const handleSubmit = () => {
        try{
            let address;

            if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                // dev code
                address = "http://localhost:5000";
            } else {
                // production code
                // address = process.env.BASE_URL || "https://lit-anchorage-94851.herokuapp.com";
            }

            axios.post(address + '/check-grid',{
                grid: userGrid
            })
            .then((res) => {
                // console.log(res.data);
                setCorrectSubmission(res.data.board_is_valid);
                setScore(10*res.data.score);
                if(res.data.board_is_valid){
                    setCorrectSubmission(res.data.board_is_valid);
                }else{
                    setBadAttempt(true);

                    setTimeout(()=>{
                        setBadAttempt(false);
                    },2000)
                }


                updateLocalStorageSubmission(res.data.board_is_valid);
                
              })
              .catch((error) => {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                }
              });;

        }catch(error){
            console.log(error);
        }

    }

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
											isDropDisabled={letter !== "#" || correctSubmission ? true : false}
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
                                                                    id={correctSubmission ? "turn-green": badAttempt ? "flash-red" : null}
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
											isDropDisabled={correctSubmission ? true : false}
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

			<div className="submit" onClick={handleSubmit}>Submit</div>
		</div>
	);
};

export default LandingPage;
