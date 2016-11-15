import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import OuterEntryList from './OuterEntryList'
import exampleOuterData from './ExampleOuterData'
import {fabric, Canvas, Image, renderAll, toJSON, loadFromJSON} from 'fabric'

const appElement = document.getElementById('your-app-element');

//Modal dialog style
const customStyles = {
  content : {
    top                   : '200',
    left                  : '100',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#ffc'
  }
};

let canvas
let jsonData

class DressRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			outerDatas: window.exampleOuterData,
			selectCloth: [],
			saveCodiset: ''
		}
		this.openModal = this.openModal.bind(this)
		this.afterOpenModal = this.afterOpenModal.bind(this)
		this.closeModal = this.closeModal.bind(this)
		this.setCodi = this.setCodi.bind(this)
		this.saveCodi = this.saveCodi.bind(this)
		this.loadCodi = this.loadCodi.bind(this)
	}

	openModal () {
		this.setState({
			modalIsOpen: true,
			outerDatas: window.exampleOuterData
		})
	}
	afterOpenModal () {
		this.refs.subtitle.style.color = '#f00'
	}
	closeModal () {
		let arr = this.state.selectCloth;

		let x = 0
		let y = 0

		this.setState({
			modalIsOpen: false,
			selectCloth: arr
		})
		console.log(this.state)
		canvas = this.__canvas = new fabric.Canvas('canvas', {
			hoverCursor: 'pointer',
			selection: false
		})
		const ctx = canvas.getContext("2d")

		arr.forEach((selectedCloth) => {
			fabric.Image.fromURL(selectedCloth, function(image) {
				image.height = 150
				image.width = 100
				image.setLeft(x)
				image.setTop(y)
				image.on('selected', function() {
					image.bringToFront()
				})
				x = y += 50
				canvas.add(image)
				canvas.renderAll()
			})
		})
		console.log(ctx)
		console.log(canvas)
	}

	setCodi (outer) {
		let arr = this.state.selectCloth;
		arr.push(outer);
		this.setState({
			selectCloth: arr
		})
	}

	saveCodi () {
		//let canvas = document.getElementById('canvas')
		let jsonData = JSON.stringify(canvas.toDatalessJSON())
		console.log(jsonData)
		this.setState({
			saveCodiset: jsonData
		})
		canvas.clear()

	}

	loadCodi () {
		console.log(jsonData)
		canvas.loadFromJSON(this.state.saveCodiset, function () {
    //render the canvas
    canvas.renderAll()
})
	}

	render() {
		return (
			<div>
        		<button onClick={this.openModal}>Outer</button>
        		<Modal
        		isOpen={this.state.modalIsOpen}
            	onAfterOpen={this.afterOpenModal}
            	onRequestClose={this.closeModal}
            	style={customStyles}
            	contentLabel="Example Modal"
            	>
            		<h2 ref="subtitle">Outer</h2>
            		{this.state.outerDatas.map(outer =>
                <OuterEntryList setCodi={this.setCodi} outer={outer} />)}
            		<button onClick={this.closeModal}>USE</button>
        		</Modal>
        		<div>
        		<canvas id="canvas" width="800" height="600"></canvas>
        		</div>
        		<div>
        		<button onClick={this.saveCodi}>Save</button>
        		</div>
        		<div>
        		<button onClick={this.loadCodi}>Load</button>
        		</div>
        	</div>
			)
	}
}


module.exports = DressRoom