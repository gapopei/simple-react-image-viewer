import React, { Component } from "react"
import styles from "../../styles/header.module.scss"
import closeImg from "../../images/close.png"
import moveImg from "../../images/dragger.png"
import ReactTouchEvents from '../../../ReactTouchEvents'

export default class Header extends Component {

  	render() {

      	return (

			<div className={styles.header}>
				<ReactTouchEvents onTap={this.props.onDocumentClose}>
					<img alt={`Close button`} 
						className={styles.close} 
						src={closeImg} />
				</ReactTouchEvents>
				<img alt={`Drag handle`} 
					className={styles.move} 
					src={moveImg}>
				</img>
			</div>

    	)

  	}

}