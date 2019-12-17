import React, { Component } from 'react'
const d3 = require('d3')
let RadarChart = require('./d3/RadarChart')

export default class SpiderChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            means: {}
        }
        this.spiderChartDivRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
        let means = props.tracks.reduce((acc, t) => {
            return {
                Acousticness: acc.Acousticness + t.Acousticness,
                Danceability: acc.Danceability + t.Danceability,
                Energy: acc.Energy + t.Energy,
                Instrumentalness: acc.Instrumentalness + t.Instrumentalness,
                Liveness: acc.Liveness + t.Liveness,
                Speechiness: acc.Speechiness + t.Speechiness,
                Valence: acc.Valence + t.Valence
            }
        }, {
            Acousticness: 0,
            Danceability: 0,
            // 'Duration ms': 0,
            Energy: 0,
            Instrumentalness: 0,
            // Key: 6,
            Liveness: 0,
            // Loudness: -6.401,
            // Mode: 0,
            Speechiness: 0,
            // Tempo: 98.078,
            // 'Time Signature': 4,
            Valence: 0,
        })
        means.Acousticness /= props.tracks.length
        means.Danceability /= props.tracks.length
        means.Energy /= props.tracks.length
        means.Instrumentalness /= props.tracks.length
        means.Liveness /= props.tracks.length
        means.Speechiness /= props.tracks.length
        means.Valence /= props.tracks.length
        return { means: means }
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        let colors = ['DarkKhaki']
        let data = [
            {
                name: 'mean',
                axes: [
                    { axis: 'Acousticness', value: this.state.means.Acousticness },
                    { axis: 'Danceability', value: this.state.means.Danceability },
                    { axis: 'Energy', value: this.state.means.Energy },
                    { axis: 'Instrumentalness', value: this.state.means.Instrumentalness },
                    { axis: 'Liveness', value: this.state.means.Liveness },
                    { axis: 'Speechiness', value: this.state.means.Speechiness },
                    { axis: 'Valence', value: this.state.means.Valence }
                ],
                color: colors[0]
            }
        ]
        for (const track in this.props.selectedTracks) {
            if (this.props.selectedTracks.hasOwnProperty(track)) {
                let t = this.props.selectedTracks[track]
                if (!t) continue
                let color = t.color
                t = t.track
                colors.push(color)
                data.push({
                    name: t['Track Name'],
                    axes: [
                        { axis: 'Acousticness', value: t.Acousticness },
                        { axis: 'Danceability', value: t.Danceability },
                        { axis: 'Energy', value: t.Energy },
                        { axis: 'Instrumentalness', value: t.Instrumentalness },
                        { axis: 'Liveness', value: t.Liveness },
                        { axis: 'Speechiness', value: t.Speechiness },
                        { axis: 'Valence', value: t.Valence }
                    ],
                    color: color
                })
            }
        }
        
        RadarChart('#spider-chart', data, {
            w: this.spiderChartDivRef.current.offsetWidth,
            h: this.props.height - 60,
            maxValue: 1,
            roundStrokes: false,
            margin: { top: 30, right: 0, bottom: 30, left: 0 },
            format: '.3f',
            unit: '',
            color: d3.scaleOrdinal().range(colors),
            legend: { title: 'Tracks:', translateX: -120, translateY: 40 },
            opacityArea: .05,
            opacityCircles: .05,
            onLabelClick: this.props.onLabelClick
        })
    }

    render() {
        return (
            <>
                <div id="spider-chart" ref={this.spiderChartDivRef}></div>
            </>
        )
    }
}