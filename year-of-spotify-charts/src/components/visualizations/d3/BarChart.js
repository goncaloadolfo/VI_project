const d3 = require('d3')

const BarChart = function (parentSelector, data, options) {
    const cfg = {
        w: 600,				                                  // Width of the circle
        h: 600,				                                  // Height of the circle
        margin: { top: 10, right: 30, bottom: 30, left: 60 }, // The margins of the SVG
        xAttribute: '',
        yAttribute: '',
        idAttribute: '',
        color: d3.scaleOrdinal(d3.schemeSet2),	              // Color function
        tooltipHtml: d => `${cfg.yAttribute}: ${d[cfg.yAttribute]}<br />${cfg.xAttribute}: ${d[cfg.xAttribute]}`
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
        .domain([0, d3.max(data, d => d[cfg.xAttribute])])
        .range([0, width])

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .append('text')
        .attr('x', 440)
        .attr('y', 9)
        .attr('dy', '.71em')
        .attr('fill', 'white')
        .text(cfg.xAttribute)

    // Add Y axis
    let y = d3.scaleBand()
        .domain(data.map(d => d[cfg.idAttribute]))
        .range([0, height])
        .padding(.1)

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

    // Add bars
    svg.selectAll('myRect')
        .data(data).enter()
        .append('rect')
        .attr('x', x(0))
        .attr('y', d => y(d[cfg.idAttribute]))
        .attr('width', d => x(d[cfg.xAttribute]))
        .attr('height', y.bandwidth())
        .attr('fill', cfg.color)
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
            .style('left', '-200px')
            .style('top', '-200px')
        )

    svg.append('g')
        .call(d3.axisLeft(y)
            .tickFormat(id => data.filter(e => e[cfg.idAttribute] === id)[0][cfg.yAttribute])
        )
        .selectAll('text')
        .attr('x', 6)
        .style('text-anchor', 'start')
}

module.exports = BarChart