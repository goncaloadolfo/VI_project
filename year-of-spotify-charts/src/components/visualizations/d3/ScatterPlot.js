const d3 = require('d3')

const ScatterPlot = function (parentSelector, data, options) {
    const cfg = {
        w: 600,				                                  // Width of the circle
        h: 600,				                                  // Height of the circle
        margin: { top: 10, right: 30, bottom: 30, left: 60 }, // The margins of the SVG
        xDomain: [0, 100],
        xAttribute: '',
        yDomain: [0, 100],
        yAttribute: '',
        dotRadius: 1.5,
        color: d3.scaleOrdinal().range(['white']),	          // Color function
        onDotClick: d => { },
        tooltipHtml: d => `${cfg.xAttribute}: ${d[cfg.xAttribute]}<br />${cfg.yAttribute}: ${d[cfg.yAttribute]}`
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
        .attr('transform', `translate(${cfg.margin.left}, ${cfg.margin.top})`)

    let height = cfg.h - cfg.margin.top - cfg.margin.bottom
    let width = cfg.w - cfg.margin.left - cfg.margin.right

    // Add X axis
    let x = d3.scaleLinear()
        .domain(cfg.xDomain)
        .range([0, width])

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    // Add Y axis
    let y = d3.scaleLinear()
        .domain(cfg.yDomain)
        .range([height, 0])

    svg.append('g')
        .call(d3.axisLeft(y))

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

    // Add dots
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d[cfg.xAttribute]))
        .attr('cy', d => y(d[cfg.yAttribute]))
        .attr('r', cfg.dotRadius)
        .style('fill', d => cfg.color(d))
        .on('mouseover', () => tooltip.style('opacity', 1))
        .on('mousemove', function (d) {
            tooltip
                .html(cfg.tooltipHtml(d))
                .style('left', `${d3.mouse(this)[0] + 90}px`)
                .style('top', `${d3.mouse(this)[1]}px`)
        })
        .on('mouseleave', () => tooltip
            // .transition()
            // .duration(200)
            .style('opacity', 0)
            .style('left', '0px')
            .style('top', '0px')
        )
        .on('click', d => {
            tooltip
                .style('opacity', 0)
                .style('left', '0px')
                .style('top', '0px')
            cfg.onDotClick(d)
        })
}

module.exports = ScatterPlot