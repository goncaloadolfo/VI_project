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
        return (
            <Container fluid={true}>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={{ width: '50%' }}>
                        <SpiderChart tracks={this.props.tracks} selectedTracks={this.props.selectedTracks} height={this.state.rowHeight} />
                    </Col>
                    <Col style={{ width: '50%' }}>
                        <ScatterPlot tracks={this.props.tracks} selectedTracks={this.props.selectedTracks} height={this.state.rowHeight} />
                    </Col>
                </Row>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={{ width: '50%' }}>
                        <AreaChart selectedTracks={this.props.selectedTracks} height={this.state.rowHeight} />
                    </Col>
                    <Col style={{ width: '50%' }}>
                        <ForceLayout tracks={this.props.tracks} selectedTracks={this.props.selectedTracks} height={this.state.rowHeight} />
                    </Col>
                </Row>
                <Row style={{ height: this.state.rowHeight }}>
                    <Col style={{ width: '50%' }}>
                        <WordCloud tracks={this.props.tracks} height={this.state.rowHeight} />
                    </Col>
                    <Col style={{ width: '50%' }}>
                        <BarChart tracks={this.props.tracks} height={this.state.rowHeight} />
                    </Col>
                </Row>
            </Container>
        )
    }
}