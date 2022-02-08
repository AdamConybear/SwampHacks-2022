import React, { useState } from "react";
// import { IoStatsChartSharp } from "react-icons/io5";
import { BsQuestionCircle } from "react-icons/bs";
import GameRules from "./GameRules";
import "./main.css";

const Header = () => {

	return (
		<div className="header-container">
			<div className="header-title">JUMBLD</div>
			<div className="header-right-web">
				<GameRules trigger={<div className="clickable">How to play</div>} />
				{/* <div className="clickable">Stats</div> */}
			</div>
			<div className="header-right-mobile">
				<GameRules
					trigger={
						<div className="clickable">
							<BsQuestionCircle size={25} />
						</div>
					}
				/>
				{/* <div className="clickable">
					<IoStatsChartSharp size={25} />
				</div> */}
			</div>
		</div>
	);
};

export default Header;
