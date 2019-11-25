import React, { Component } from 'react'
import { Jumbotron, Button, Table, Modal, Form } from 'react-bootstrap'

let monthAbbreviations = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

function searchInTracks(tracks, search) {
    search = search.toLocaleLowerCase('en-US')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    return tracks.filter(t =>
        t.Artist.toLocaleLowerCase('en-US')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(search)
        || t['Track Name'].toLocaleLowerCase('en-US')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(search)
    )
}

export default class Tracks extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tableHeight: 0,
            showDateForm: false,
            search: ''
        }

        this.changedDates = false
        this.topJumbotronRef = React.createRef()
        this.bottomJumbotronRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
        let date = props.date.map(d => {
            let dateSplit = d.split('-')
            return `${dateSplit[2]} ${monthAbbreviations[dateSplit[1]].toUpperCase()}`
        })

        return {
            date: date.join(' - '),
            tracks: searchInTracks(props.tracks, state.search)
        }
    }

    componentDidMount() {
        this.setState({ tableHeight: window.innerHeight - this.topJumbotronRef.current.clientHeight - this.bottomJumbotronRef.current.clientHeight })
        window.addEventListener('resize', this.updateHeights)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeights)
    }

    shouldComponentUpdate(nextProps) {
        this.changedDates = this.props.date.length !== nextProps.date.length
        return true
    }

    componentDidUpdate() {
        if (this.changedDates) {
            this.updateHeights()
            this.changedDates = false
        }
    }

    updateHeights = () => {
        this.setState({
            tableHeight: window.innerHeight - this.topJumbotronRef.current.clientHeight - this.bottomJumbotronRef.current.clientHeight
        })
    }

    handleChangeDateOnClick = () => {
        this.setState({ showDateForm: true })
    }

    handleDateFormOnCancel = () => {
        this.setState({ showDateForm: false })
    }

    handleDateFormOnSave = (dateArray) => {
        this.setState({ showDateForm: false })
        this.props.onDateChange(dateArray)
    }

    handleOnSearchChange = (ev) => {
        let search = ev.target.value
        this.setState({
            search: search,
            tracks: searchInTracks(this.props.tracks, search)
        })
    }

    handleOnTrackClick = (track) => {
        console.log(track)
    }

    render() {
        let jumbotronStyle = {
            marginBottom: 0,
            padding: '2rem 2rem'
        }

        return (
            <>
                <Jumbotron ref={this.topJumbotronRef} style={jumbotronStyle}>
                    <h1>{this.state.date}</h1>
                    <p>
                        <Button variant="outline-light" onClick={this.handleChangeDateOnClick}>Change date(s)</Button>
                        &nbsp;
                        <Button variant="outline-light">Filter</Button>
                    </p>
                    <Form.Control type="search" placeholder="Search..." value={this.state.search} onChange={this.handleOnSearchChange} />
                </Jumbotron>
                <div style={{ overflow: 'auto', height: `${this.state.tableHeight}px` }}>
                    <Table responsive hover>
                        <tbody>
                            {this.state.tracks.map(t => {
                                let style = { cursor: 'pointer' }
                                if (this.props.selectedTracks[t.Id])
                                    style.backgroundColor = this.props.selectedTracks[t.Id].color
                                return (
                                    <tr key={t.Position} onClick={() => this.props.onTrackClick(t)} style={style}>
                                        <td><b>{t.Position}</b></td>
                                        <td><b>{t['Track Name']}</b> {t.Explicit ? '\ud83c\udd74' : ''} <small>by {t.Artist}</small></td>
                                        <td><b>{t.Streams}</b></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
                <Jumbotron ref={this.bottomJumbotronRef} style={jumbotronStyle}>
                    <div className="lead">{this.props.numExplicit} &#x1f174; tracks in {this.props.tracks.length}</div>
                </Jumbotron>
                <DateForm maxDate={this.props.maxDate} show={this.state.showDateForm}
                    onCancel={this.handleDateFormOnCancel} onSave={this.handleDateFormOnSave}
                />
            </>
        )
    }
}

class DateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            check: 'singleDay',
            day: '',
            fromDay: '',
            toDay: ''
        }
    }

    handleOnCheckChange = (event) => {
        this.setState({ check: event.target.name })
    }

    handleOnChange = (ev) => {
        this.setState({ [ev.target.name]: ev.target.value })
    }

    handleOnSave = () => {
        let dateArray = []
        if (this.state.check === 'singleDay') {
            if (this.state.day.length === 0) return
            dateArray.push(this.state.day)
        } else if (this.state.check === 'timeInterval') {
            if (this.state.fromDay.length === 0 || this.state.toDay.length === 0) return
            dateArray.push(this.state.fromDay)
            dateArray.push(this.state.toDay)
        }

        this.props.onSave(dateArray)
    }

    render() {
        let maxDate = this.props.maxDate
        return (
            <Modal show={this.props.show} onHide={this.props.onCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Date(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form inline>
                        <Form.Check type="radio">
                            <Form.Check.Input name="singleDay" type="radio"
                                onChange={this.handleOnCheckChange} checked={this.state.check === "singleDay"}
                            />
                            <Form.Check.Label>Single Day:</Form.Check.Label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Form.Control name="day" value={this.state.day} disabled={this.state.check !== "singleDay"}
                                onChange={this.handleOnChange} type="date" min="2019-01-01" max={maxDate}
                            />
                        </Form.Check>
                        <Form.Check type="radio">
                            <Form.Check.Input name="timeInterval" type="radio"
                                onChange={this.handleOnCheckChange} checked={this.state.check === "timeInterval"}
                            />
                            <Form.Check.Label>Interval:</Form.Check.Label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Form.Control name="fromDay" value={this.state.fromDay} disabled={this.state.check !== "timeInterval"}
                                min="2019-01-01" max={this.state.toDay.length === 0 ? maxDate : this.state.toDay}
                                onChange={this.handleOnChange} type="date"
                            />
                            &nbsp;to&nbsp;
                            <Form.Control name="toDay" value={this.state.toDay} disabled={this.state.check !== "timeInterval"}
                                min={this.state.fromDay.length === 0 ? "2019-01-01" : this.state.fromDay} max={maxDate}
                                onChange={this.handleOnChange} type="date"
                            />
                        </Form.Check>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onCancel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleOnSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
