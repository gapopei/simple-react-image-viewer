/**
 * Created by George on 10/08/2019.
 */
import React from 'react'
import PropTypes from 'prop-types'

function touchX(event) {
  return event.touches[0].clientX
}

function touchY(event) {
  return event.touches[0].clientY
}

class ReactTouchEvents extends React.Component {
  handleTouchStart = (event) => {
    if (this.touchStarted) {
      return
    }

    this.touchStarted = true

    this.touchMoved = false
    this.swipeOutBounded = false

    this.startX = touchX(event)
    this.startY = touchY(event)

    this.currentX = 0
    this.currentY = 0
  }

  handleTouchMove = (event) => {
    this.currentX = touchX(event)
    this.currentY = touchY(event)

    if (!this.touchMoved) {
      const tapTolerance = this.props.tapTolerance

      this.touchMoved = Math.abs(this.startX - this.currentX) > tapTolerance ||
        Math.abs(this.startY - this.currentY) > tapTolerance

    } else if (!this.swipeOutBounded) {
      const swipeOutBounded = this.props.swipeTolerance

      this.swipeOutBounded = Math.abs(this.startX - this.currentX) > swipeOutBounded &&
        Math.abs(this.startY - this.currentY) > swipeOutBounded

    }
  }

  handleTouchCancel = () => {
    this.touchStarted = this.touchMoved = false
    this.startX = this.startY = 0
  }

  handleTouchEnd = (event) => {
    this.touchStarted = false

    if (!this.touchMoved) {
      if (this.props.onTap) {
        this.props.onTap(event)
      }

    } else if (!this.swipeOutBounded) {
      if (this.props.onSwipe) {
        let swipeOutBounded = this.props.swipeTolerance,
          direction

        if (Math.abs(this.startX - this.currentX) < swipeOutBounded) {
          direction = this.startY > this.currentY ? "top" : "bottom"

        } else {
          direction = this.startX > this.currentX ? "left" : "right"
        }

        this.props.onSwipe(direction, event)
      }
    }
  }

  render() {
    const children = this.props.children
    const element = children ? React.Children.only(children) : React.createElement("button", null)
    
    let events = {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
      onTouchEnd: this.handleTouchEnd,
    }
    
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_TOUCH !== 'true') {
      events = {
        onClick: this.props.onTap
      }
    }

    return React.cloneElement(element, events)
  }
}


ReactTouchEvents.defaultProps = {
  tapTolerance: 10,
  swipeTolerance: 30,
}


ReactTouchEvents.propTypes = {
  children: PropTypes.node,
  tapTolerance: PropTypes.number,
  swipeTolerance: PropTypes.number,
  onTap: PropTypes.func,
  onSwipe: PropTypes.func,
}


export default ReactTouchEvents