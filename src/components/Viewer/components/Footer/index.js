import React, { Component } from 'react'
import styles from "../../styles/footer.module.scss"
import upImg from "../../images/arrow_up.png"
import downImg from "../../images/arrow_down.png"
import ReactTouchEvents from '../../../ReactTouchEvents'

export default class Footer extends Component {

    render() {

        return (

            <div className={styles.footer}>
                <ReactTouchEvents onTap={this.props.prevPage}>
                    <img alt={`Previous page button`} className={styles.up} src={upImg} />
                </ReactTouchEvents>
                <ReactTouchEvents onTap={this.props.nextPage}>
                    <img alt={`Next page button`} className={styles.down} src={downImg} />
                </ReactTouchEvents>
            </div>

        )

    }
    
}

