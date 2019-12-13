import React, { Component } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const d3ForceLayout = require('./d3/ForceLayout')

const N_MIN_FEATURES = 1
const N_MAX_FEATURES = 4

const options = [
    'Acousticness',
    'Danceability',
    'Duration ms',
    'Energy',
    'Instrumentalness',
    'Liveness',
    'Loudness',
    'Speechiness',
    'Tempo',
    'Valence',
]

export default class ForceLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showForm: false,
            features: ['Energy']
        }
        this.forceLayoutDivRef = React.createRef()
    }

    componentDidMount() {
        this.addD3()
    }

    componentDidUpdate() {
        this.addD3()
    }

    addD3() {
        d3ForceLayout('#force-layout', this.props.tracks, {
            w: this.forceLayoutDivRef.current.offsetWidth,
            h: this.props.height - 20,
            margin: { top: 10, right: 30, bottom: 30, left: 60 },
            fociAttributes: this.state.features,
            fociDomains: this.state.features.map(f => [this.getFeatureMin(f), this.getFeatureMax(f)]),
            dotRadius: track => {
                if (this.props.selectedTracks[track.Id])
                    return 3.0
                return 1.5
            },
            collideForceStrength: track => {
                if (this.props.selectedTracks[track.Id])
                    return 3.0
                return 1.5
            },
            color: track => {
                if (this.props.selectedTracks[track.Id])
                    return this.props.selectedTracks[track.Id].color
                return 'white'
            }
        })
    }

    getFeatureMax(feature) {
        if (this.props.tracks.length === 0) return 0
        let max = this.props.tracks.reduce(
            (acc, t) => t[feature] > acc ? t[feature] : acc,
            this.props.tracks[0][feature]
        )
        if (max < 1 && max > 0) return 1
        if (max > -60 && max < 0) return 0
        return max
    }

    getFeatureMin(feature) {
        if (this.props.tracks.length === 0) return 0
        let min = this.props.tracks.reduce(
            (acc, t) => t[feature] < acc ? t[feature] : acc,
            this.props.tracks[0][feature]
        )
        if (min < 1 && min > 0) return 0
        if (min > -60 && min < 0) return -60
        return min
    }

    handleOnClick = () => {
        this.setState({ showForm: true })
    }

    handleOnCancel = () => {
        this.setState({ showForm: false })
    }

    handleOnSave = (features) => {
        this.setState({
            showForm: false,
            features: features
        })
    }

    render() {
        return (
            <>
                <Button variant="outline-light" onClick={this.handleOnClick}
                    style={{ marginTop: 10, textAlign: 'right', float: 'right' }}
                >
                    &#11607;
                </Button>
                <div id="force-layout" ref={this.forceLayoutDivRef}></div>
                <FeaturesForm min={N_MIN_FEATURES} max={N_MAX_FEATURES} show={this.state.showForm}
                    onCancel={this.handleOnCancel} onSave={this.handleOnSave} />
            </>
        )
    }
}

class FeaturesForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            features: ['Energy']
        }
    }

    handleOnChange = (ev) => {
        if (this.state.features.includes(ev.target.value))
            this.setState({
                features: this.state.features.filter(f => f !== ev.target.value)
            })
        else {
            let features = this.state.features
            features.push(ev.target.value)
            this.setState({
                features: features
            })
        }
    }

    handleOnSave = () => {
        let len = this.state.features.length
        if (len > N_MAX_FEATURES || len < N_MIN_FEATURES) return
        this.props.onSave(this.state.features)
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Feature(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Select between {N_MIN_FEATURES} and {N_MAX_FEATURES} features.
                    <Form>
                        <Form.Control as="select" multiple value={this.state.features}
                            onChange={this.handleOnChange}
                        >
                            {options.map((f, idx) => (<option key={idx}>{f}</option>))}
                        </Form.Control>
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