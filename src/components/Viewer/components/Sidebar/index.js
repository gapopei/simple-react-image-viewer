import React, { Component } from 'react'
import { findDOMNode } from "react-dom"
import styles from "../../styles/sidebar.module.scss"
import sendImg from "../../images/passport_send.png"
import Interactive from "../../../interactjs"
import interact from "interactjs"
import ReactTouchEvents from '../../../ReactTouchEvents'

export default class Sidebar extends Component {

    sidebarScroller = null

    sidebarDragged = null

    sidebarDrag = null

    scrolling = null

    startY = null

    draggableOptions = {
        startAxis: 'y',
        lockAxis: 'y',
        modifiers: [
            interact.modifiers.restrict({
                restriction: "parent"
            })
        ],
        onstart: event => {

            this.startY = event.clientY

            clearTimeout(this.sidebarDragged)

        },
        onmove: event => {

            if (Math.abs(this.startY - event.clientY) >= this.props.maxDistance) {

                this.sidebarDrag = true

                this.scrolling = true

                let target = event.target,
                    t2 = findDOMNode(this.sidebarScroller),
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy,
                    max = this.reverse(t2.clientHeight - t2.parentElement.clientHeight - 4),
                    overflow = +t2.clientHeight > +t2.parentElement.clientHeight

                if (overflow) {

                    y = y > 0 ? 0 : y

                    y = y < max ? max : y

                    target.style.marginTop = `${y}px`

                    target.setAttribute('data-y', y)

                }

            }

        },
        onend: event => {

            if (this.scrolling) {

                this.sidebarDragged = setTimeout(() => this.sidebarDrag = false, 100)

                this.scrolling = false
                
            }

        }
    }

    static defaultProps = {
        maxDistance: 50
    }

    reverse(a) {

        return a > 0 ? -Math.abs(a) : Math.abs(a)

    }

    onPageClicked = (e) => {

        if(!this.sidebarDrag && !this.scrolling) {

            this.props.onPageClicked(parseInt(e.target.dataset.id))

        }

    }
    
    render() {

        return (

            <div className={styles.sidebar}>
                <div className={styles.sidebar_scroll}>
                    <Interactive 
                        onRef={node => this.sidebarScroller = node} 
                        draggable 
                        draggableOptions={this.draggableOptions}>
                        <div className={styles.sidebar_scroll_wrap}>
                            {this.props.pages.map((imgSrc, i) => <ReactTouchEvents key={i} onTap={this.onPageClicked}>
                                <img
                                    alt={`Sidebar icon ${i+1}`} 
                                    className={styles.scroll_image} 
                                    data-id={i} src={imgSrc} />
                            </ReactTouchEvents>)}
                        </div>
                    </Interactive>
                </div>
                <ReactTouchEvents onTap={this.props.onSendClicked}>
                    <img alt={`Send button`} 
                        className={`${styles.send} ${this.props.sendActive ? styles.active : null}`} 
                        src={sendImg} />
                </ReactTouchEvents>
            </div>
            
        )

    }

}