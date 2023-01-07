import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";

const SettingBar = () => {
	return (
		<div className="settings-bar">
			<label htmlFor="line-width">Толщина линии</label>
			<input
				onChange={e => toolState.setLineWidth(e.target.value)}
				id="line-width"
				type="number"
				min="1"
				max="50"
				defaultValue="1"/>
		</div>
	);
};

export default SettingBar;