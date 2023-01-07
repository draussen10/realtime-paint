import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import canvasState from "../store/canvasState";
import {observer} from "mobx-react-lite";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Modal, Button} from "react-bootstrap"
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";

const Canvas = observer(() => {
	const canvasRef = useRef()
	const usernameRef = useRef()
	const [modal, setModal] = useState(true)
	const params = useParams()


	useEffect(() => {
		canvasState.setCanvas(canvasRef.current)
		let ctx = canvasRef.current.getContext('2d')
		axios.get(`http://localhost:5000/image?id=${params.id}`)
			.then(response => {
				const img = new Image()
				img.src = response.data
				img.onload = () => {
					ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
					ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
				}
			})
	}, [])

	useEffect( () => {
		if(canvasState.username){
			const socket = new WebSocket('ws://localhost:5000/')
			canvasState.setSocket(socket)
			canvasState.setSessionId(params.id)
			toolState.setTool(new Brush(canvasRef.current, socket, params.id))
			socket.onopen = () => {
				console.log("Подлючение установлено!")
				socket.send(JSON.stringify({
					id: params.id,
					username: canvasState.username,
					method: "connection"
				}))
			}
			socket.onmessage = (e) => {
				let msg = JSON.parse(e.data)
				switch (msg.method) {
					case "connection":
						console.log(`Пользователь ${msg.username} подключен`)
						break
					case "draw":
						drawHandler(msg)
						break
				}
				console.log(msg)
			}
		}
	}, [canvasState.username])

	function drawHandler(msg) {
		const figure = msg.figure
		const ctx = canvasRef.current.getContext('2d')

		switch (figure.type) {
			case "brush":
				Brush.draw(ctx, figure.x, figure.y)
				break
			case "rect":
				Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
				break
			case "finish":
				ctx.beginPath()
				break
		}
	}

	const mouseDownHandler = () => {
		canvasState.pushToUndo(canvasRef.current.toDataURL())
		axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
			.then(response => console.log(response.data))

		const colorPicker = document.getElementById('color-picker')
		toolState.setStrokeColor(colorPicker.value)
		toolState.setFillColor(colorPicker.value)
	}

	const connectionHandler = () => {
		canvasState.setUsername(usernameRef.current.value)
		setModal(false)
	}

	return (
		<div className="canvas">
			<Modal show={modal}>

			<Modal.Header closeButton>
				<Modal.Title>Введите ваше имя</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<input type="text" ref={usernameRef}/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={() => connectionHandler()}
				>Войти</Button>
			</Modal.Footer>
		</Modal>

			<canvas
				ref={canvasRef}
				onMouseDown={() => mouseDownHandler()}
				width={600} height={400} />
		</div>
	);
});

export default Canvas;