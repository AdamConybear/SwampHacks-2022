import React, { useState } from "react";
// import {v4 as uuidV4 } from 'uuid'; // save reference to "v4" function from uuid library, but rename function to "uuidV4"
// import Grid from '@mui/material/Grid';
import { IoStatsChartSharp } from "react-icons/io5";
import { BsQuestionCircle } from "react-icons/bs";
import "./main.css";

const Header = () => {
	return (
		<div className="header-container">
			<div>WEBSITE NAME</div>
			<div className="header-right-web">
				<div className="clickable">How to play</div>
				<div className="clickable">Stats</div>
			</div>
			<div className="header-right-mobile">
				<div className="clickable">
					<BsQuestionCircle size={25} />
				</div>
				<div className="clickable">
					<IoStatsChartSharp size={25} />
				</div>
			</div>
		</div>
	);
};

export default Header;
