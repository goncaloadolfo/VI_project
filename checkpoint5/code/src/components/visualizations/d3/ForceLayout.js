const d3 = require('d3')

const ForceLayout = function (parentSelector, data, options) {
    const cfg = {
        w: 600,				                                  // Width of the circle
        h: 600,				                                  // Height of the circle
        margin: { top: 10, right: 30, bottom: 30, left: 60 }, // The margins of the SVG
        fociAttributes: [],
        fociDomains: [[]],
        dotRadius: d => 1.5,
        onDotClick: d => { },
        collideForceStrength: 1.5,
        color: d => 'white',                	              // Color function
        tooltipHtml: d => cfg.fociAttributes.reduce((acc, curr) => {
            if (acc.length !== 0) acc += '<br />'
            return acc + `${curr}: ${d[curr]}`
        }, '')
    }

    // Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i] }
        }
    }

    const parent = d3.select(parentSelector)

    //Remove whatever chart with the same id/class was present before
    parent.select('svg').remove()

    let svg = parent
        .append('svg')
        .attr('width', cfg.w)
        .attr('height', cfg.h)
        .append('g')
        .attr('transform', `translate(${cfg.w / 2}, ${cfg.h / 2})`)

    let height = cfg.h - cfg.margin.top - cfg.margin.bottom
    let width = cfg.w - cfg.margin.left - cfg.margin.right

    let foci
    let forceRange = [175, 0]
    let x = width * 2 / 5
    let y = height * 2 / 5
    switch (cfg.fociAttributes.length) {
        case 1:
            foci = [{ x: 0, y: 0 }]
            break
        case 2:
            foci = [{ x: -x, y: 0 }, { x: x, y: 0 }]
            break
        case 3:
            foci = [{ x: 0, y: -y }, { x: -x, y: y }, { x: x, y: y }]
            break
        case 4:
            foci = [{ x: -x, y: -y }, { x: -x, y: y }, { x: x, y: -y }, { x: x, y: y }]
            break
        default:
            foci = []
            break
    }

    let scaleMap = cfg.fociAttributes.reduce((acc, curr, idx) => {
        acc[curr] = d3.scaleLinear()
            .domain(cfg.fociDomains[idx])
            .range(forceRange)
        return acc
    }, {})

    let node = svg.selectAll('circle')
        .data(data).enter()
        .append('circle')
        .attr('r', cfg.dotRadius)
        .attr('fill', cfg.color)

    let simulation = d3.forceSimulation()
        .force('charge', d3.forceCollide(cfg.collideForceStrength))

    cfg.fociAttributes.forEach((attr, idx) => {
        svg.append('circle')
            .attr('r', 15)
            .attr('fill', 'grey')
            .attr('opacity', .3)
            .attr('transform', `translate(${foci[idx].x}, ${foci[idx].y})`)
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('transform', `translate(${foci[idx].x}, ${foci[idx].y})`)
            .attr('fill', 'white')
            .style('cursor', 'default')
            .text(attr)
        simulation.force(attr, d3.forceRadial(d => scaleMap[attr](d[attr]), foci[idx].x, foci[idx].y))
    })

    // Add tooltip div
    let tooltip = d3.select(parentSelector)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'white')
        .style('color', 'black')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '2px')

    simulation
        .nodes(data)
        .on('tick', () => {
            node.attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .on('mouseover', () => tooltip.style('opacity', 1))
                .on('mousemove', function (d) {
                    tooltip
                        .html(cfg.tooltipHtml(d))
                        .style('left', `${width / 2 + d3.mouse(this)[0] + 80}px`)
                        .style('top', `${height / 2 + d3.mouse(this)[1]}px`)
                })
                .on('mouseleave', () => tooltip
                    // .transition()
                    // .duration(200)
                    .style('opacity', 0)
                    .style('left', '-200px')
                    .style('top', '-200px')
                )
                .on('click', d => {
                    tooltip
                        .style('opacity', 0)
                        .style('left', '0px')
                        .style('top', '0px')
                        .style('display', 'none')
                    cfg.onDotClick(d)
                })
        })
}

module.exports = ForceLayout