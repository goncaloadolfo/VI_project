const d3 = require('d3')

const AreaChart = function (parentSelector, data, options) {
    const cfg = {
        w: 600,				                                  // Width of the circle
        h: 600,				                                  // Height of the circle
        margin: { top: 10, right: 30, bottom: 30, left: 60 }, // The margins of the SVG
        xAttribute: '',
        yAttribute: '',
        colorAttribute: '',
        dotRadius: 3,
        lineWidth: 4,
        areaOpacity: .3,
        numberOfValues: 5,
        color: d3.scaleOrdinal(d3.schemeSet2),	                          // Color function
        tooltipHtml: d => `${cfg.xAttribute}: ${d3.timeFormat('%d %B')(d.date)}<br />${cfg.yAttribute}: ${d.value}`
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

    data = data.map(d => {
        if (!d[0]) return {
            id: 0,
            values: []
        }
        return {
            id: d[0][cfg.colorAttribute],
            values: d.map(entry => {
                return {
                    date: d3.timeParse('%Y-%m-%d')(entry[cfg.xAttribute]),
                    value: entry[cfg.yAttribute]
                }
            })
        }
    })

    // Add X axis
    let x = d3.scaleTime()
        .domain([d3.min(data, entry => d3.min(entry.values, d => d.date)), d3.max(data, entry => d3.max(entry.values, d => d.date))])
        .range([0, width])

    let numberOfValues = cfg.numberOfValues
    if (numberOfValues > 75)
        numberOfValues = ~~(numberOfValues / 30)
    else if (numberOfValues > 14)
        numberOfValues = ~~(numberOfValues / 7)

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .ticks(numberOfValues)
            .tickSizeOuter(0)
            .tickFormat(d3.timeFormat('%d %b'))
        )

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, e => d3.max(e.values, d => +d.value))])
        .range([height, 0])

    svg.append('g')
        .call(d3.axisLeft(y)
            .tickSizeOuter(0)
            .tickFormat(d => {
                if (d / 1000000 >= 1)
                    return `${d / 1000000}M`
                if (d / 1000 >= 1)
                    return `${d / 1000}k`
                return d
            })
        )
    // .append('text')
    // .attr('transform', 'rotate(-90)')
    // .attr('y', 6)
    // .attr('dy', '.71em')
    // .attr('fill', 'white')
    // .text(cfg.yAttribute)

    // Add the areas
    let area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.value))

    svg.selectAll('.area')
        .data(data).enter()
        .append('g')
        .attr('class', d => `area ${d.id}`)
        .append('path')
        .attr('fill', d => cfg.color(d.id))
        .attr('fill-opacity', cfg.areaOpacity)
        .attr('stroke', 'none')
        .attr('d', d => area(d.values))

    // Add the lines
    let line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))

    svg.selectAll('.line')
        .data(data).enter()
        .append('g')
        .attr('class', d => `line ${d.id}`)
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => cfg.color(d.id))
        .attr('stroke-width', cfg.lineWidth)
        .attr('d', d => line(d.values))

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

    data.forEach((entry, idx) => {
        svg.selectAll(`idx${idx}-dots`)
            .data(entry.values)
            .enter()
            .append('circle')
            .attr('fill', d => cfg.color(entry.id))
            .attr('stroke', 'none')
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value))
            .attr('r', cfg.dotRadius)
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
    })
}

module.exports = AreaChart