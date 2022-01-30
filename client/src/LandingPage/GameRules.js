import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./main.css";

const GameRules = ({ rulesClicked, setRulesClicked, trigger }) => {
	const contentStyle = { background: "#f6dfa1" };
	const arrowStyle = { color: "#f6dfa1" };
	return (
		<Popup
			trigger={trigger}
			// open={rulesClicked}
			position="bottom right"
			{...{ contentStyle, arrowStyle }}
			// styles={(ju: "center")}
			// onClose={() => setRulesClicked(false)}
			className="rules-popup"
		>
			<div>
				Everyday, you are presented with 10 to 14 letter tiles. Combine as many of these tiles as possible to
				create words. Words are validated from left to right and top to bottom. All tiles used must be placed
				contiguously. Try to use as many tiles as possible. A perfect solution is always guaranteed to exist.
				Make sure you are completly done before you hit submit. Have fun! 🦴
			</div>
		</Popup>
	);
};

export default GameRules;
