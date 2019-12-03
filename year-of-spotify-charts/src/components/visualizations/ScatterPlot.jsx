import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

const d3ScatterPlot = require('./d3/ScatterPlot')

const options = [
    'Acousticness',
    'Danceability',
    'Duration ms',
    'Energy',
    'Instrumentalness',
    'Key',
    'Liveness',
    'Loudness',
    'Mode',
    'Speechiness',
    'Tempo',
    'Time Signature',
    'Valence',
]

export default class ScatterPlot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feature: 'Energy'
        }
        this.scatterPlotDivRef = React.createRef()
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        d3ScatterPlot('#scatter-plot', this.props.tracks, {
            w: this.scatterPlotDivRef.current.offsetWidth,
            h: this.props.height - 60,
            // margin: { top: 30, right: 0, bottom: 30, left: 0 },
            margin: { top: 20, right: 30, bottom: 20, left: 65 },
            xDomain: [this.getFeatureMin(), this.getFeatureMax()],
            xAttribute: this.state.feature,
            yDomain: [0, this.props.tracks[0].Streams],
            yAttribute: 'Streams',
            color: track => {
                if (this.props.selectedTracks[track.Id])
                    return this.props.selectedTracks[track.Id].color
                return 'white'
            },
            onDotClick: this.props.onTrackClick,
            tooltipHtml: t => `Track Name: ${t['Track Name']}<br />${this.state.feature}: ${t[this.state.feature]}<br />Streams: ${t.Streams}`
        })
    }

    getFeatureMax() {
        let max = this.props.tracks.reduce(
            (acc, t) => t[this.state.feature] > acc ? t[this.state.feature] : acc,
            this.props.tracks[0][this.state.feature]
        )
        return max
    }

    getFeatureMin() {
        let min = this.props.tracks.reduce(
            (acc, t) => t[this.state.feature] < acc ? t[this.state.feature] : acc,
            this.props.tracks[0][this.state.feature]
        )
        return min < 0 ? min : 0
    }

    handleOnFeatureChange = (ev) => {
        this.setState({ feature: ev.target.value })
    }

    render() {
        return (
            <>
                <Form inline style={{ marginTop: 10, float: 'right' }}>
                    <Form.Control as="select" value={this.state.feature} onChange={this.handleOnFeatureChange}>
                        {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                    </Form.Control>
                </Form>
                <div id="scatter-plot" ref={this.scatterPlotDivRef}></div>
            </>
        )
    }
}