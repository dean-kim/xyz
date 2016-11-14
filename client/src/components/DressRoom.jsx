import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import OuterEntryList from './OuterEntryList'
import exampleOuterData from './ExampleOuterData'
import {fabric, Canvas, Image, renderAll} from 'fabric'

// const canvas = new fabric.Canvas('canvas', {
// 			hoverCursor: 'pointer',
// 			selection: false
// 		})
// 		canvas.on({
// 			'object:moving': function(e) {
// 				e.target.opacity = 0.5
// 			},
// 			'object:modified': function(e) {
// 				e.target.opacity = 1
// 			}
// 		})

const appElement = document.getElementById('your-app-element');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#ffc'
  }
};

class DressRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			outerDatas: window.exampleOuterData,
			selectCloth: []
		}
		this.openModal = this.openModal.bind(this)
		this.afterOpenModal = this.afterOpenModal.bind(this)
		this.closeModal = this.closeModal.bind(this)
		this.setCodi = this.setCodi.bind(this)
	}

	// componentdidmount() {
	// 	const canvas = new fabric.Canvas('c', {
	// 		hoverCursor: 'pointer',
	// 		selection: false
	// 	})
	// 	canvas.on({
	// 		'object:moving': function(e) {
	// 			e.target.opacity = 0.5
	// 		},
	// 		'object:modified': function(e) {
	// 			e.target.opacity = 1
	// 		}
	// 	})

	// }

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
		const canvas = this.__canvas = new fabric.Canvas('canvas', {
			hoverCursor: 'pointer',
			selection: false
		})
		const ctx = canvas.getContext("2d")

		arr.forEach((selectedCloth) => {
			fabric.Image.fromURL(selectedCloth, function(image) {
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

	}


	setCodi (outer) {
		let arr = this.state.selectCloth;
		arr.push(outer);
		this.setState({
			selectCloth: arr
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
        	</div>
			)
	}
}


module.exports = DressRoom