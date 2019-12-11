import { Component, cloneElement } from 'react'
import { findDOMNode } from 'react-dom'

import interact from 'interactjs'

export default class Interactable extends Component {
	static defaultProps = {
		draggable: false,
		resizable: false,
		draggableOptions: {},
		resizableOptions: {}
	}

	currentValue = Object.assign({}, Interactable.defaultProps)

	render() {
		return cloneElement(this.props.children, { 
			ref: node => {
				this.node = node
				if (this.props.onRef) {
					this.props.onRef(node)
				}
				return node
			}, 
			draggable: false
		})
	}

	setCurrentValue(props) {
		let prop,
			updated = false
		
		for (prop in Interactable.defaultProps) {
			if (JSON.stringify(this.currentValue[prop]) !== JSON.stringify(props[prop])) {
				this.currentValue[prop] = props[prop]
				updated = true
			}
		}

		return updated
	}

	componentDidMount() {
		this.interact = interact(findDOMNode(this.node))

		if (this.setCurrentValue(this.props)) {
			this.setInteractions()
		}
	}

	componentDidUpdate(props) {
		this.interact = interact(findDOMNode(this.node))

		if (this.setCurrentValue(props)) {
			this.setInteractions()
		}
	}

	componentWillUnmount() {
		this.interact.unset()
		this.interact = null
	}

	setInteractions() {
		if (this.props.draggable) this.interact.draggable(this.props.draggableOptions)
		if (this.props.resizable) this.interact.resizable(this.props.resizableOptions)
	}
}