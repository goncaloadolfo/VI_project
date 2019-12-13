import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

const d3 = require('d3')
const d3AreaChart = require('./d3/AreaChart')

const MAX_N_DAYS = 365

export default class AreaChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accumulated: false,
            nDays: 30,
            minDate: null,
            maxDate: null
        }
        this.areaChartDivRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
        let minDate = null
        let maxDate = null
        let date = props.date

        if (date.length === 2) {
            minDate = date[0]
            maxDate = date[1]
        } else {
            maxDate = date[0]
        }

        return {
            minDate: minDate,
            maxDate: maxDate
        }
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        let data = []
        let colorDomain = []
        let colorRange = []
        let nDays = this.state.nDays - 1

        let selectedTracks = this.props.selectedTracks
        let maxDate = new Date(this.state.maxDate)
        let maxMinusNDays = new Date(this.state.maxDate)
        maxMinusNDays.setDate(maxMinusNDays.getDate() - nDays)
        let minDate
        if (!this.state.minDate)
            minDate = maxMinusNDays
        else {
            let min = new Date(this.state.minDate)
            if (min.valueOf() > maxMinusNDays.valueOf()) {
                minDate = min
                nDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24)
            } else
                minDate = maxMinusNDays
        }

        for (const key in selectedTracks) {
            if (selectedTracks.hasOwnProperty(key)) {
                const element = selectedTracks[key]
                if (!element) continue
                data.push(element.allEntries.filter(e => {
                    let date = new Date(e.Date)
                    return date.valueOf() <= maxDate.valueOf() && date.valueOf() >= minDate.valueOf()
                }))
                colorDomain.push(key)
                colorRange.push(element.color)
            }
        }

        if (this.state.accumulated) {
            data = JSON.parse(JSON.stringify(data))
            data = data.map(
                e => e.reverse().map(
                    (d, mapIdx) => {
                        let dCopy = JSON.parse(JSON.stringify(d))
                        for (let i = 0; i < mapIdx; i++)
                            dCopy.Streams = `${+dCopy.Streams + +e[i].Streams}`
                        return dCopy
                    }
                )
            )
        }

        d3AreaChart('#area-chart', data, {
            w: this.areaChartDivRef.current.offsetWidth,
            h: this.props.height - 60,
            margin: { top: 10, right: 30, bottom: 30, left: 60 },
            xAttribute: 'Date',
            yAttribute: 'Streams',
            colorAttribute: 'Id',
            dotRadius: 3,
            lineWidth: 1.5,
            areaOpacity: .15,
            numberOfValues: nDays + 1,
            color: d3.scaleOrdinal()
                .domain(colorDomain)
                .range(colorRange)
        })
    }

    handleOnNDaysChange = (ev) => {
        this.setState({ nDays: ev.target.value })
    }

    handleOnAccumulatedChange = (ev) => {
        this.setState({ accumulated: ev.target.checked })
    }

    render() {
        return (
            <>
                <Form inline style={{ marginTop: 10, float: 'right' }}>
                    <Form.Check type='switch' label='accumulated' id='accumulated'
                        checked={this.state.accumulated} onChange={this.handleOnAccumulatedChange} />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control type='number' min={2} max={MAX_N_DAYS}
                        value={this.state.nDays} onChange={this.handleOnNDaysChange} />
                </Form>
                <div id="area-chart" ref={this.areaChartDivRef}></div>
            </>
        )
    }
}