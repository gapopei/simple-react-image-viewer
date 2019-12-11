import React, { Component } from 'react'
import { findDOMNode } from "react-dom"
import styles from "../../styles/content.module.scss"
import Interactive from "../../../interactjs"
import interact from "interactjs"

export default class Content extends Component {

    currentPage = this.props.currentPage

    contentScroller = null

    contentDragged = null

    contentDrag = null

    scrolling = null

    pages = []

    positions = []

    draggableOptions = {
        startAxis: 'y',
        lockAxis: 'y',
        modifiers: [
            interact.modifiers.restrict({
                restriction: "parent"
            })
        ],
        onstart: event => {

            clearTimeout(this.contentDragged)

            this.contentDrag = true

            this.scrolling = true

            // this.props.contentIsScrolling(this.scrolling)

        },
        onmove: event => {
            
            let target   = event.target,
                t2       = findDOMNode(this.contentScroller),
                y        = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy,
                max      = this.reverse(t2.clientHeight - t2.parentElement.clientHeight - 4),
                overflow = +t2.clientHeight > +t2.parentElement.clientHeight
            
            if (overflow) {

                y = y > 0 ? 0 : y

                y = y < max ? max : y

                target.style.marginTop = `${y}px`

                target.setAttribute('data-y', y)

            }

        },
        onend: event => {

            this.scrolling = false

            // this.props.contentIsScrolling(this.scrolling)

            this.contentDragged = setTimeout(() => {

                this.contentDrag = false

                if (this.props.snapScroll) {

                    this.props.updatePage(this.getCurrentPageIndex())

                }

            }, 100)
            
        }
    }

    componentDidUpdate() {

        if (this.props.currentPage !== this.currentPage) {

            this.updatePage()

        }

    }

    updatePage = () => {

        let scroller = findDOMNode(this).childNodes[0]

        scroller.style.marginTop = `${-this.positions[this.props.currentPage]}px`

        scroller.setAttribute('data-y', -this.positions[this.props.currentPage])

        this.currentPage = this.props.currentPage

    }

    getCurrentPageIndex = () => {

        let viewport  = findDOMNode(this.contentScroller),
            current   = +viewport.getAttribute('data-y') || 0
        
        return this.positions.indexOf(this.closest(this.positions, this.reverse(current)))

    }

    sortByKey(array, key) {

       return array.sort((a, b) => {

            let x = a[key], 
                y = b[key]

            return ((x < y) ? -1 : ((x > y) ? 1 : 0))

        })

    }

    closest(a, b) {

        return a.reduce((c, d) => (Math.abs(d - b) < Math.abs(c - b) ? d : c))

    }

    reverse(a) {

        return a > 0 ? -Math.abs(a) : Math.abs(a)

    }

    onImageLoad = ({target:img}) => {

        let newImage = {
            id: parseInt(img.getAttribute("data-id")),
            height:img.clientHeight,
            width:img.clientHeight,
            position: img.offsetTop
        }

        this.pages.push(newImage)

        if(this.props.pages.length === this.pages.length) {

            this.pages = this.sortByKey(this.pages, "id")

            this.pages.forEach((page, i) => {

                this.positions.push(page.position <= (page.height + 4) * i ? (page.height + 4) * i : page.position)

            })

        }

    }

    render() {

        return (
            
            <div className={styles.content}>
                <Interactive 
                    onRef={node => this.contentScroller = node} 
                    draggable 
                    draggableOptions={this.draggableOptions}>
                        <div className={`${styles.content_scroll_wrap} ${this.props.animateScroll ? styles.animate : null}`}>
                            {this.props.pages.map((imgSrc, i) => <img key={i} 
                                                                    alt={`Content page ${i+1}`} 
                                                                    onLoad={this.onImageLoad} 
                                                                    className={styles.scroll_image} 
                                                                    data-id={i} 
                                                                    src={imgSrc}></img>
                            )}
                        </div>
                </Interactive>
            </div>

        )

    }

}