import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import Header from "./components/Header"
import Content from "./components/Content"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import styles from "./styles/style.module.scss"
import headerStyles from "./styles/header.module.scss"
import Interactive from "../interactjs"
import interact from 'interactjs'

export default class PdfViewer extends Component {

	moving = false

	moveEl = null

	draggableOptions = {
		allowFrom: `.${headerStyles['move']}`,
		modifiers: [
			interact.modifiers.restrict({
				restriction: "parent",
				elementRect: {
					left: 0,
					right: 1,
					top: 0,
					bottom: 1
				}
			})
		],
		onstart: event => {

			this.moving = true

			this.isMoving(this.moving)

		},
		onmove: event => {

			let target = event.target,
				x = (event.client.x - target.offsetWidth) + 40,
				y = (event.client.y) - 35

			target.style.top = `${y}px`

			target.setAttribute("data-x", x)

			target.style.left = `${x}px`

			target.setAttribute("data-y", y)

		},
		onend: event => {

			this.adjustPosition(event.target)

		}
	}

	state = {
		currentPage: 0,
		moving: false,
		animateScroll: false,
		snapScroll: false,
		active: true
	}

	adjustPosition = target => {

		let top = target.offsetTop,
			left = target.offsetLeft,
			bottom = top + target.offsetHeight,
			right = left + target.offsetWidth,
			props = {
				top: top,
				left: left
			}

		if (top < 0) {

			props.top += Math.abs(top)

		} else if (bottom > document.body.offsetHeight) {

			props.top += document.body.offsetHeight - Math.abs(bottom)

		}

		if (left < 0) {

			props.left += Math.abs(left)

		} else if (right > document.body.offsetWidth) {

			props.left += document.body.offsetWidth - Math.abs(right)

		}

		target.style.top = `${props.top}px`

		target.setAttribute("data-x", props.top)

		target.style.left = `${props.left}px`

		target.setAttribute("data-y", props.left)

		this.moving = false

		this.isMoving(this.moving)

	}

	onDocumentClose = () => {

		this.setState({
			active: false
		})

		setTimeout(() => {

			this.props.onDocumentClose(this.props.data)

		}, 500)

	}

	isMoving = isMoving => {

		if (isMoving !== this.state.moving) {

			this.setState({
				moving: isMoving
			})

		}

	}

	contentIsScrolling = isScrolling => {

		if (!isScrolling !== this.state.animateScroll) {

			this.setState({
				animateScroll: !isScrolling
			})

		}

	}

	onPageClicked = id => {

		if (id !== this.state.currentPage) {

			this.setState({
				currentPage: id
			})

		}

	}

	contentUpdatePage = index => {

		if (index !== this.state.currentPage) {

			this.setState({
				currentPage: index
			})

		}

	}

	nextPage = () => {

		if (this.state.currentPage + 1 <= this.props.data.pages.length - 1) {

			this.setState({
				currentPage: this.state.currentPage + 1
			})

		}

	}

	prevPage = () => {

		if (this.state.currentPage - 1 >= 0) {

			this.setState({
				currentPage: this.state.currentPage - 1
			})

		}

	}

	onSendClicked = e => {

		console.log("Send to passport clicked! Document ID", this.state.id)

	}

	componentDidMount() {

		this.moveEl = findDOMNode(this)

	}

	render() {

		return (

			<Interactive
				onRef={node => this.moveEl = node}
				draggable
				draggableOptions={this.draggableOptions}>
					<div className={`${styles.pdfViewer} ${!this.state.moving ? styles.animate : null} ${this.state.active ? styles.opening : styles.closing}`}
							style={{top: 500,
								left:(this.props.data.position && this.props.data.position.length ? this.props.data.position[0] : 0) + 400}}
							onAnimationEnd={() => this.adjustPosition(this.moveEl)}
						>
					<Header
						isMoving={this.isMoving}
						onDocumentClose={this.onDocumentClose}
					/>
					<Content
						pages={this.props.data.pages}
						currentPage={this.state.currentPage}
						animateScroll={this.state.animateScroll}
						snapScroll={this.state.snapScroll}
						contentIsScrolling={this.contentIsScrolling}
						updatePage={this.contentUpdatePage}
					/>
					<Sidebar
						pages={this.props.data.pages}
						sendActive={this.props.sendActive ? this.props.sendActive : false}
						onSendClicked={this.onSendClicked}
						onPageClicked={this.onPageClicked}
					/>
					<Footer 
						nextPage={this.nextPage}
						prevPage={this.prevPage}
					/>
				</div>
			</Interactive>

		)

	}

}