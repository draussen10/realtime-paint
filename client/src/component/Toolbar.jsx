import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";

const Toolbar = () => {

	const changeColor = e => {
		toolState.setStrokeColor(e.target.value)
		toolState.setFillColor(e.target.value)

	}

	return (
		<div className="toolbar">
			<button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
			<button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
			<button className="toolbar__btn circle"></button>
			<button className="toolbar__btn eraser"></button>
			<button className="toolbar__btn line"></button>
			<input id="color-picker" onChange={e => changeColor(e)} style={{marginLeft: 10}} type="color"/>
			<button className="toolbar__btn undo" onClick={() => canvasState.undo()}></button>
			<button className="toolbar__btn redo" onClick={() => canvasState.redo()}></button>
			<button className="toolbar__btn save"></button>
		</div>
	);
};

export default Toolbar;