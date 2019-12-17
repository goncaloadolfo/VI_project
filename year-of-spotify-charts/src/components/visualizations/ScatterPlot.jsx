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
        this.state = {}
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
            xAttribute: this.props.feature,
            yDomain: [0, this.props.tracks.length !== 0 ? this.props.tracks[0].Streams : 0],
            yAttribute: 'Streams',
            dotRadius: track => {
                if (this.props.selectedTracks[track.Id])
                    return 3.0
                return 1.5
            },
            color: track => {
                if (this.props.selectedTracks[track.Id])
                    return this.props.selectedTracks[track.Id].color
                return 'white'
            },
            onDotClick: this.props.onTrackClick,
            tooltipHtml: t => `Track Name: ${t['Track Name']}<br />${this.props.feature}: ${t[this.props.feature]}<br />Streams: ${t.Streams}`
        })
    }

    getFeatureMax() {
        if (this.props.tracks.length === 0) return 0
        let max = this.props.tracks.reduce(
            (acc, t) => t[this.props.feature] > acc ? t[this.props.feature] : acc,
            this.props.tracks[0][this.props.feature]
        )
        if (max < 1 && max > 0) return 1
        if (max > -60 && max < 0) return 0
        return max
    }

    getFeatureMin() {
        if (this.props.tracks.length === 0) return 0
        let min = this.props.tracks.reduce(
            (acc, t) => t[this.props.feature] < acc ? t[this.props.feature] : acc,
            this.props.tracks[0][this.props.feature]
        )
        if (min < 1 && min > 0) return 0
        if (min > -60 && min < 0) return -60
        return min
    }

    handleOnFeatureChange = (ev) => {
        this.props.onFeatureChange(ev.target.value)
    }

    render() {
        return (
            <>
                <Form inline style={{ marginTop: 10, float: 'right' }}>
                    <Form.Control as="select" value={this.props.feature} onChange={this.handleOnFeatureChange}>
                        {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                    </Form.Control>
                </Form>
                <div id="scatter-plot" ref={this.scatterPlotDivRef}></div>
            </>
        )
    }
}