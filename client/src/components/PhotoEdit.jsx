import React from 'react';
import { fabric, freeDrawingBrush, Canvas, Image, isDrawingMode, clipTo, renderAll } from 'fabric';
import loadImage from 'blueimp-load-image-npm'
import $ from 'jquery'
import axios from 'axios'


class PhotoEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			file: '',
			imagePreviewURL: '',
			saveImageUrl: ''
		};
		this._handleImageChange = this._handleImageChange.bind(this)
		this._handleSubmit = this._handleSubmit.bind(this)
		this._handlePhoto = this._handlePhoto.bind(this)
		this._handleCrop = this._handleCrop.bind(this)
		this._handleSavePhoto = this._handleSavePhoto.bind(this)
	}

// preventDefault : 기본으로 정의된 이벤트를 작동하지 못하게 하는 메서드
	_handleSubmit(e) {
		e.preventDefault()
	}

	_handleImageChange(e) {
		e.preventDefault();

		let reader = new FileReader()
		let file = e.target.files[0]

		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewURL: reader.result
			});
		}
// readAsDataURL : 컨텐츠를 특정 Blob 이나 File에서 읽어 오는 메서드
		reader.readAsDataURL(file)
	}
	_handlePhoto(e) {

		//const selectFile = document.getElementById('photo').files[0]
		let file = this.state.file
		const img = document.createElement('IMG');
		const reader = new FileReader()
		const canvas = document.getElementById('c')
		//const thisImage = this.state
		const thisImageURL = this.state.imagePreviewURL
		
		reader.onloadend = function() {
			console.log('CHECK2')
			img.onload = function() {
				//console.log('hahaha2')
		    	const options = {
		    		canvas: true,
		    		maxWidth: 1200
		    	}
		    	//console.log('hahaha3')
		    	const currentfile = file
		    	//console.log('hahaha4')
		    	loadImage.parseMetaData(currentfile, function (data) {
		    		      //console.log(data.exif[0x0112]);
		    		      //console.log(data.exif.get('Orientation'))
		    		      options.orientation = data.exif.get('Orientation')
		    		      //const orientation = data.exif.get('Orientation')
		    		      //console.log(orientation)
		    		      //console.log(option.orientation)
		    		  }
		    	    )
		    	loadImage (
		    		currentfile,
		    		(img) => {
		    		    document.getElementById('c')
		    		}, 
		    		options
		    		)
			    } 
			    img.src = thisImageURL
			}
			reader.readAsDataURL(file)
	}

	_handleCrop() {

		let that = this

		const canvas = document.getElementById('c');
		const ctx = canvas.getContext('2d');
		const img = document.createElement('IMG')
		console.log(ctx)

		const base64data = canvas.toDataURL("image/jpeg")
		//console.log(base64data)
		//const img_src = base64data.replace(/^data\:image\/\w+\;base64\,/, '')
		//console.log(img_src)
	
		img.onload = function() {
			const OwnCanv = new fabric.Canvas('c', {
				isDrawingMode: true
			});
		
			OwnCanv.width = img.width;
		    OwnCanv.height = img.height;

			const imgInstance = new fabric.Image(img, {

				async: false,
				left: 0,
				top: 0,
				lockMovementX: true,
				lockMovementY: true

			});
			imgInstance.crossOrigin = 'anonymous'
			//console.log(imgInstance)
			OwnCanv.add(imgInstance);
			OwnCanv.renderAll()

			OwnCanv.freeDrawingBrush.color = "purple"
			OwnCanv.freeDrawingBrush.width = 5

			OwnCanv.on('path:created', function(option) {
				const path = option.path;
				OwnCanv.isDrawingMode = false;
				OwnCanv.remove(imgInstance);
				OwnCanv.remove(path);

				OwnCanv.clipTo = function(ctx) {
					path.render(ctx)
				};

				OwnCanv.add(imgInstance)
				const pathUrl = path.toDataURL()
				
				//console.log(pathUrl)
				
				function drawImage(alpha) {
					ctx.clearRect(0,0,cw,ch);
				    ctx.globalAlpha=alpha;
				    ctx.drawImage(img,0,0);
				    ctx.globalAlpha=1.00;
				  }

				let cw
				let ch

				cw = canvas.width = img.width
				ch = canvas.height = img.height

				let minX = 10000
				let minY = 10000
				let maxX = -10000
				let maxY = -10000
				for(var i=1;i<OwnCanv['freeDrawingBrush']['_points'].length;i++){
					let p = OwnCanv['freeDrawingBrush']['_points'][i]
					if(p.x < minX) {
						minX = p.x
					}
					if(p.y < minY) {
						minY = p.y
					}
					if(p.x > maxX) {
						maxX = p.x
					}
					if(p.y > maxY) {
						maxY = p.y
					}
				}
				let width = maxX - minX
				let height = maxY - minY

				ctx.save()
				ctx.clearRect(0,0,cw,ch)
				ctx.beginPath()
				ctx.moveTo(OwnCanv['freeDrawingBrush']['_points'][0].x, OwnCanv['freeDrawingBrush']['_points'][0].y)
				for(var i=1;i<OwnCanv['freeDrawingBrush']['_points'].length;i++){
					let p = OwnCanv['freeDrawingBrush']['_points'][i]
					ctx.lineTo(OwnCanv['freeDrawingBrush']['_points'][i].x, OwnCanv['freeDrawingBrush']['_points'][i].y)
					console.log(p)
				}

				ctx.closePath()
				ctx.clip()
				ctx.drawImage(img,0,0)
				ctx.restore()

				let c = document.createElement('canvas')
				let cx = c.getContext('2d')

				c.width = width
				c.height = height

				cx.drawImage(canvas, minX,minY,width,height, 0,0,width,height)
				console.log(cx)

				const clippedImage = new fabric.Image()
				clippedImage.src = c.toDataURL()
				document.getElementById('canvasImg').src = clippedImage.src
				//console.log(c.toDataURL())
				//inheritanceImageUrl = clippedImage.src
				//console.log(inheritanceImageUrl)

				that.setState({
				saveImageUrl: clippedImage.src
			});


				
				// console.log(path)
				// console.log(path['path'])
				//console.log(this.state.saveImageUrl)
				
				// console.log(imgInstance)
				// console.log(ctx)
				// console.log(OwnCanv)
				// console.log(OwnCanv['freeDrawingBrush'])
				// console.log(OwnCanv['freeDrawingBrush']['_points'])
				// console.log(OwnCanv['freeDrawingBrush']['_points'][0].x)
			});	
		}

    img.src = base64data
    //console.log(this.state.saveImageUrl)

	}

	_handleSavePhoto(e) {
		//console.log(this.state.saveImageUrl)
		axios.post('/dressimage', {
			dressImageData : this.state.saveImageUrl
		})
		.then((response) => {
			console.log("axios success")
		})	
	}
 

	render() {

		
		return (
			<div>
			    <input type='file' accept='image/*' capture id ='inputFile' onChange={this._handleImageChange} />
			    <button id='load' onClick={this._handlePhoto}>Load</button>
			    <button id='edit' onClick={this._handleCrop}>Edit</button>
			    <button id='save' onClick={this._handleSavePhoto}>Save</button>
			    <canvas id='c'></canvas>
			    <img id='canvasImg'></img>



			    
			</div>
			)
	}
}



module.exports = PhotoEdit;