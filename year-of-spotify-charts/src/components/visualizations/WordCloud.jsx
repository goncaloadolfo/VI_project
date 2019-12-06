import React, { Component } from 'react'

const d3WordCloud = require('./d3/WordCloud')

const MAX_FONT_SIZE = 40
const MIN_FONT_SIZE = 7

export default class WordCloud extends Component {
    constructor(props) {
        super(props)
        this.state = {
            artistsStreams: []
        }
        this.wordCloudDivRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
        let accStreams = props.tracks.reduce((acc, t) => {
            if (!acc[t.Artist])
                acc[t.Artist] = +t.Streams
            else
                acc[t.Artist] += +t.Streams
            return acc
        }, {})
        let artistsStreams = []
        for (const key in accStreams)
            if (accStreams.hasOwnProperty(key))
                artistsStreams.push({ artist: key, streams: accStreams[key] })
        artistsStreams = artistsStreams.sort((a1, a2) => a2.streams - a1.streams)
        return { artistsStreams: artistsStreams }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.tracks === this.props.tracks
            && nextProps.height === this.props.height)
            return false
        return true
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        let artistsStreams = this.state.artistsStreams
        let max = artistsStreams[0].streams
        let min = artistsStreams[artistsStreams.length - 1].streams
        let streamsDiff = max - min
        let fontSizeDiff = MAX_FONT_SIZE - MIN_FONT_SIZE

        d3WordCloud('#word-cloud', this.state.artistsStreams, {
            w: this.wordCloudDivRef.current.offsetWidth,
            h: this.props.height - 15,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            textAttribute: 'artist',
            valueAttribute: 'streams',
            sizeScale: v => {
                let dif = v - min
                let percentage = dif / streamsDiff
                v = fontSizeDiff * percentage + MIN_FONT_SIZE
                return v
            },
            wordsPadding: 3
        })
    }

    render() {
        return (
            <>
                <div id="word-cloud" ref={this.wordCloudDivRef}></div>
            </>
        )
    }
}