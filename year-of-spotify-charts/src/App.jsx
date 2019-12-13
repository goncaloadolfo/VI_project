import React, { Component } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Tracks from './components/Tracks'
import Visualizations from './components/Visualizations'

const d3 = require('d3')

const originalDataset = require('./data/spotify-charts.json')
// Search for duplicated tracks with different ids
for (let i = 0; i < originalDataset.length; i++) {
    const t1 = originalDataset[i]
    for (let j = i + 1; j < originalDataset.length; j++) {
        const t2 = originalDataset[j]
        if (
            t1['Track Name'] === t2['Track Name'] &&
            t1.Artist === t2.Artist &&
            t1.Id !== t2.Id
        )
            originalDataset[j].Id = t1.Id
    }
}

const allTracksMap = originalDataset.reduce(
    (acc, t) => {
        if (!acc[t.Id]) {
            acc[t.Id] = {
                track: t,
                allEntries: originalDataset.filter(e => e.Id === t.Id)
            }
        }
        return acc
    },
    {}
)
const MAX_TRACKS_SELECTED = 3
const colors = ['Magenta', 'OrangeRed', 'Chartreuse']
const defaultColors = d3.scaleOrdinal(d3.schemeDark2)

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
            selectedTracks: {},
            nSelectedTracks: 0,
            defaultTracks: {
                [tracks[0].Id]: {
                    color: defaultColors(0),
                    track: tracks[0],
                    allEntries: allTracksMap[tracks[0].Id].allEntries
                },
                [tracks[1].Id]: {
                    color: defaultColors(1),
                    track: tracks[1],
                    allEntries: allTracksMap[tracks[1].Id].allEntries
                },
                [tracks[2].Id]: {
                    color: defaultColors(2),
                    track: tracks[2],
                    allEntries: allTracksMap[tracks[2].Id].allEntries
                },
            },
            filters: [],
            numExplicit: this.countExplicitTracks(tracks),
            date: date
        }
    }

    getTracksByDates(dates) {
        let dataset = JSON.parse(JSON.stringify(originalDataset))

        if (dates.length === 1)
            return dataset.filter(t => t.Date === dates[0])

        if (dates.length === 2) {
            let fromDate = new Date(dates[0]).valueOf()
            let toDate = new Date(dates[1]).valueOf()
            let tracks = dataset.filter(t => {
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

    filterTracks(tracks, filters) {
        return tracks.filter(t => filters.reduce(
            (acc, curr) => acc && curr(t),
            true
        ))
    }

    countExplicitTracks(tracks) {
        return tracks.reduce((acc, t) => t.Explicit ? acc + 1 : acc, 0)
    }

    getDefaultTracks(tracks) {
        switch (tracks.length) {
            case 0:
                return {}
            case 1:
                return {
                    [tracks[0].Id]: {
                        color: defaultColors(0),
                        track: tracks[0],
                        allEntries: allTracksMap[tracks[0].Id].allEntries
                    }
                }
            case 2:
                return {
                    [tracks[0].Id]: {
                        color: defaultColors(0),
                        track: tracks[0],
                        allEntries: allTracksMap[tracks[0].Id].allEntries
                    },
                    [tracks[1].Id]: {
                        color: defaultColors(1),
                        track: tracks[1],
                        allEntries: allTracksMap[tracks[1].Id].allEntries
                    }
                }
            default:
                return {
                    [tracks[0].Id]: {
                        color: defaultColors(0),
                        track: tracks[0],
                        allEntries: allTracksMap[tracks[0].Id].allEntries
                    },
                    [tracks[1].Id]: {
                        color: defaultColors(1),
                        track: tracks[1],
                        allEntries: allTracksMap[tracks[1].Id].allEntries
                    },
                    [tracks[2].Id]: {
                        color: defaultColors(2),
                        track: tracks[2],
                        allEntries: allTracksMap[tracks[2].Id].allEntries
                    },
                }
        }
    }

    handleOnDateChange = (days) => {
        let tracks = this.filterTracks(this.getTracksByDates(days), this.state.filters)
        let numExplicit = this.countExplicitTracks(tracks)
        for (const selTrack in this.state.selectedTracks)
            if (this.state.selectedTracks.hasOwnProperty(selTrack) && this.state.selectedTracks[selTrack])
                colors.push(this.state.selectedTracks[selTrack].color)
        let defaultTracks = this.getDefaultTracks(tracks)
        this.setState({
            tracks: tracks,
            numExplicit: numExplicit,
            selectedTracks: {},
            nSelectedTracks: 0,
            defaultTracks: defaultTracks,
            date: days
        })
    }

    handleOnFiltersChange = (filters) => {
        let tracks = this.filterTracks(this.getTracksByDates(this.state.date), filters)
        let numExplicit = this.countExplicitTracks(tracks)
        for (const selTrack in this.state.selectedTracks)
            if (this.state.selectedTracks.hasOwnProperty(selTrack) && this.state.selectedTracks[selTrack])
                colors.push(this.state.selectedTracks[selTrack].color)
        let defaultTracks = this.getDefaultTracks(tracks)
        this.setState({
            tracks: tracks,
            numExplicit: numExplicit,
            selectedTracks: {},
            nSelectedTracks: 0,
            defaultTracks: defaultTracks,
            filters: filters
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
            allEntries: allTracksMap[track.Id].allEntries
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
                            onTrackClick={this.handleOnTrackClick}
                            selectedTracks={this.state.nSelectedTracks === 0 ? this.state.defaultTracks : this.state.selectedTracks}
                            onFiltersChange={this.handleOnFiltersChange}
                        />
                    </Col>
                    <Col>
                        <Visualizations tracks={this.state.tracks}
                            selectedTracks={this.state.nSelectedTracks === 0 ? this.state.defaultTracks : this.state.selectedTracks}
                            allTracksMap={allTracksMap} onTrackClick={this.handleOnTrackClick}
                            date={this.state.date}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}
