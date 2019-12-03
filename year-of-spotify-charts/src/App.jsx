import React, { Component } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Tracks from './components/Tracks'
import Visualizations from './components/Visualizations'

const originalDataset = require('./data/spotify-charts.json')
const MAX_TRACKS_SELECTED = 3
const colors = ['Magenta', 'OrangeRed', 'Chartreuse']

console.log(originalDataset[0])
/*
let res = {
    'count': 0,
    'Danceability': 0,
    'Energy': 0,
    'Key': 0,
    'Loudness': 0,
    'Mode': 0,
    'Speechiness': 0,
    'Acousticness': 0,
    'Instrumentalness': 0,
    'Liveness': 0,
    'Valence': 0,
    'Tempo': 0,
    'Duration ms': 0,
    'Time Signature': 0,
    'Position': 0,
    'Track Name': 0,
    'Artist': 0,
    'Streams': 0,
    'URL': 0,
    'Date': 0,
    'Id': 0,
    'Album Art URL': 0,
    'Explicit': 0,
    'Preview URL': 0
}

originalDataset.forEach(element => {
    res.count++
    for (const key in element) {
        if (element.hasOwnProperty(key)) {
            res[key]++
        }
    }
})

console.log(res)
*/
export default class App extends Component {
    constructor(props) {
        super(props)
        let date = [originalDataset[0].Date]
        let tracks = this.getTracksByDates(date)
        this.state = {
            maxDate: originalDataset[0].Date,
            tracks: tracks,
            selectedTracks: {
                [tracks[0].Id]: {
                    color: colors.pop(),
                    track: tracks[0],
                    allEntries: originalDataset.filter(t => t.Id === tracks[0].Id)
                }
            },
            nSelectedTracks: 1,
            numExplicit: this.countExplicitTracks(tracks),
            date: date
        }
    }

    getTracksByDates(dates) {
        if (dates.length === 1)
            return originalDataset.filter(t => t.Date === dates[0])

        if (dates.length === 2) {
            let fromDate = new Date(dates[0]).valueOf()
            let toDate = new Date(dates[1]).valueOf()
            let tracks = originalDataset.filter(t => {
                let date = new Date(t.Date)
                return date >= fromDate && date <= toDate
            })
            let tracksMap = tracks.reduce((acc, t) => {
                if (acc[t.Id]) {
                    acc[t.Id].Streams = `${+acc[t.Id].Streams + +t.Streams}`
                    return acc
                }
                acc[t.Id] = t
                return acc
            }, {})
            tracks = []
            for (const key in tracksMap)
                if (tracksMap.hasOwnProperty(key))
                    tracks.push(tracksMap[key])
            tracks = tracks.sort((t1, t2) => (+t2.Streams) - (+t1.Streams))
            tracks = tracks.map((t, idx) => {
                t.Position = `${idx + 1}`
                return t
            })
            return tracks
        }

        return null
    }

    countExplicitTracks(tracks) {
        return tracks.reduce((acc, t) => t.Explicit ? acc + 1 : acc, 0)
    }

    handleOnDateChange = (days) => {
        let tracks = this.getTracksByDates(days)
        let numExplicit = this.countExplicitTracks(tracks)
        for (const selTrack in this.state.selectedTracks)
            if (this.state.selectedTracks.hasOwnProperty(selTrack) && this.state.selectedTracks[selTrack])
                colors.push(this.state.selectedTracks[selTrack].color)
        this.setState({
            tracks: tracks,
            numExplicit: numExplicit,
            selectedTracks: {
                [tracks[0].Id]: {
                    color: colors.pop(),
                    track: tracks[0],
                    allEntries: originalDataset.filter(t => t.Id === tracks[0].Id)
                }
            },
            nSelectedTracks: 1,
            date: days
        })
    }

    handleOnTrackClick = (track) => {
        let selectedTracks = this.state.selectedTracks
        if (selectedTracks[track.Id]) {
            colors.push(selectedTracks[track.Id].color)
            selectedTracks[track.Id] = undefined
            this.setState({
                selectedTracks: selectedTracks,
                nSelectedTracks: this.state.nSelectedTracks - 1
            })
            return
        }
        if (this.state.nSelectedTracks === MAX_TRACKS_SELECTED) {
            alert(`You have already reached the maximum number of tracks selected, ${MAX_TRACKS_SELECTED}, deselect one`)
            return
        }
        selectedTracks[track.Id] = {
            color: colors.pop(),
            track: track,
            allEntries: originalDataset.filter(t => t.Id === track.Id)
        }
        this.setState({
            selectedTracks: selectedTracks,
            nSelectedTracks: this.state.nSelectedTracks + 1
        })
    }

    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col xs md lg="3">
                        <Tracks tracks={this.state.tracks} date={this.state.date} maxDate={this.state.maxDate}
                            numExplicit={this.state.numExplicit} onDateChange={this.handleOnDateChange}
                            onTrackClick={this.handleOnTrackClick} selectedTracks={this.state.selectedTracks}
                        />
                    </Col>
                    <Col>
                        <Visualizations tracks={this.state.tracks} selectedTracks={this.state.selectedTracks}
                            onTrackClick={this.handleOnTrackClick} />
                    </Col>
                </Row>
            </Container>
        )
    }
}
