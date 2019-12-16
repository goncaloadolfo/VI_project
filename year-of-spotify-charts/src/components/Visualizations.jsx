import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SpiderChart from './visualizations/SpiderChart'
import ScatterPlot from './visualizations/ScatterPlot'
import AreaChart from './visualizations/AreaChart'
import ForceLayout from './visualizations/ForceLayout'
import WordCloud from './visualizations/WordCloud'
import BarChart from './visualizations/BarChart'

export default class Visualizations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rowHeight: window.innerHeight / 3
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateRowHeight)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateRowHeight)
    }

    updateRowHeight = () => {
        this.setState({ rowHeight: window.innerHeight / 3 })
    }

    render() {
        let style = {
            width: '50%'
        }
        return (
            <Container fluid={true}>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={style}>
                        <SpiderChart tracks={this.props.tracks} selectedTracks={this.props.selectedTracks} height={this.state.rowHeight} />
                    </Col>
                    <Col style={style}>
                        <ScatterPlot tracks={this.props.tracks} selectedTracks={this.props.selectedTracks}
                            onTrackClick={this.props.onTrackClick} height={this.state.rowHeight}
                        />
                    </Col>
                </Row>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={style}>
                        <AreaChart selectedTracks={this.props.selectedTracks} date={this.props.date} height={this.state.rowHeight} />
                    </Col>
                    <Col style={style}>
                        <ForceLayout tracks={this.props.tracks} selectedTracks={this.props.selectedTracks}
                            height={this.state.rowHeight} onTrackClick={this.props.onTrackClick}
                        />
                    </Col>
                </Row>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={style}>
                        <WordCloud tracks={this.props.tracks} height={this.state.rowHeight} />
                    </Col>
                    <Col style={style}>
                        <BarChart tracks={this.props.tracks} selectedTracks={this.props.selectedTracks}
                            allTracksMap={this.props.allTracksMap} date={this.props.date} height={this.state.rowHeight}
                            onTrackClick={this.props.onTrackClick}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}