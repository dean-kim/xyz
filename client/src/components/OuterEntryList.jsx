import React from 'react'
import ReactDOM from 'react-dom'

class OuterEntryList extends React.Component {
	render() 
  {
		return (
			<div>
      <div onClick={(event)=>this.props.setCodi(this.props.outer.src)}>
      <img src={this.props.outer.src} alt="" width="150" height="200"/>
      </div>
    </div>
			)
	}
}

module.exports = OuterEntryList