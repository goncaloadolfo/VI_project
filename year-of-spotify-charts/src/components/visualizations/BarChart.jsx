import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

const d3BarChart = require('./d3/BarChart')
const MAX_N_TRACKS = 15

export default class BarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nTracks: 4
        }
        this.barChartDivRef = React.createRef()
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        let data = this.getTopNTracks(this.state.nTracks)
        let selectedTracks = this.props.selectedTracks

        for (const key in selectedTracks) {
            if (selectedTracks.hasOwnProperty(key)) {
                const element = selectedTracks[key]
                if (!element) continue
                data.push(this.getNumberOfDays(element))
            }
        }

        d3BarChart('#bar-chart', data, {
            w: this.barChartDivRef.current.offsetWidth,
            h: this.props.height - 60,
            margin: { top: 10, right: 30, bottom: 30, left: 60 },
            xAttribute: 'nDays',
            yAttribute: 'track',
            idAttribute: 'id',
            color: d => {
                if (selectedTracks[d.id])
                    return selectedTracks[d.id].color
                return 'SlateGrey'
            },
            tooltipHtml: d => {
                let text = `Track: ${d.track}<br />`
                text += this.props.date.length === 2 ? 'Max number' : 'Number'
                text += ` of consecutive days on the charts: ${d.nDays}`
                return text
            },
            onBarClick: d => this.props.onTrackClick(d.id)
        })
    }

    getNumberOfDays(element) {
        let dates = this.props.date
            .map(d => new Date(d))

        let res = {
            track: element.track['Track Name'],
            id: element.track.Id,
            nDays: 0
        }

        let entries = element.allEntries.filter(e => {
            let date = new Date(e.Date)
            if (dates.length === 2)
                return date.valueOf() <= dates[1].valueOf() && date.valueOf() >= dates[0].valueOf()
            return date.valueOf() <= dates[0].valueOf()
        })

        let prevDate = new Date(entries[0].Date)
        let counter = 1
        for (let i = 1; i < entries.length; i++) {
            const date = new Date(entries[i].Date)
            if ((prevDate.getTime() - date.getTime()) / (1000 * 3600 * 24) === 1)
                ++counter
            else
                res.nDays = res.nDays > counter ? res.nDays : counter
            prevDate = date
        }
        res.nDays = res.nDays > counter ? res.nDays : counter

        return res
    }

    getTopNTracks(n) {
        let map = this.props.allTracksMap
        let tracks = this.props.tracks.map(t => this.getNumberOfDays(map[t.Id]))
        return tracks.sort((t1, t2) => t2.nDays - t1.nDays).slice(0, n)
    }

    handleOnNTracksChange = (ev) => {
        this.setState({ nTracks: ev.target.value })
    }

    render() {
        return (
            <>
                <Form inline style={{ marginTop: 10, float: 'right' }}>
                    <Form.Control type='number' min={0} max={MAX_N_TRACKS}
                        value={this.state.nTracks} onChange={this.handleOnNTracksChange} />
                </Form>
                <div id="bar-chart" ref={this.barChartDivRef}></div>
            </>
        )
    }
}