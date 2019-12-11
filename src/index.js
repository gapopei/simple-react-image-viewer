import React from 'react'
import ReactDOM from 'react-dom'
import Viewer from './components/Viewer'
import styles from './styles/style.module.scss'
import Axios from 'axios'

class App extends React.Component {
  state = {
    config: null,
    viewers: []
  }

  onDocumentClose = (viewerData) => {
    this.setState({
        viewers: this.state.wheelActive ? [] : this.state.viewers.filter(vviewerData => vviewerData.key !== viewerData.key)
    })
    setTimeout(this.onDocumentSelected(null, 1, 1), 1000) // just for demo
  }

  onDocumentSelected = (e,document, hotspot) => {
    let theHotspot = this.state.config.hotspots[hotspot-1],
        theDocument = theHotspot.documents[document - 1],
        viewerData = {
          key:`${hotspot - 1}_${document - 1}`,
          hotspot: hotspot - 1,
          document: document - 1,
          pages:(new Array(theDocument.pages)).fill().map((a, i) => `${theDocument.file}/${i + 1}.png`),
          position: [100,100]
        }
    if (!this.state.viewers.filter(vviewerData => vviewerData.key === viewerData.key).length > 0) {
      this.setState({
        viewers: this.state.viewers.concat([viewerData])
      })
    }
  }

  componentDidMount() {
    Axios.get('/config.json').then(config => config.data || {}).then(config => {
      
      this.setState({ config })

      this.onDocumentSelected(null, 1, 1) // just for demo

    })
  }

  render() {
    return <>
        <div className={styles.stage}>
          <div className={styles.viewers}>
            {this.state.viewers.map((viewerData, i) => viewerData && viewerData.pages ? <Viewer 
                key={`${viewerData.hotspot}_${viewerData.document}`}
                data={viewerData}
                sendActive={false}
                onDocumentClose={this.onDocumentClose}
            />: "")}
          </div>
        </div>
    </>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))