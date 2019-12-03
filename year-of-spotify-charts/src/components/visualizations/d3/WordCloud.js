const d3 = require('d3')
const cloud = require('d3-cloud')

const WordCloud = function (parentSelector, data, options) {
    const cfg = {
        w: 600,				                                  // Width of the circle
        h: 600,				                                  // Height of the circle
        margin: { top: 10, right: 30, bottom: 30, left: 60 }, // The margins of the SVG
        wordsPadding: 5,
        color: d3.scaleOrdinal(d3.schemeSet2),                // Color function
        textAttribute: '',
        sizeAttribute: '',
        onWordClick: d => { },
        // tooltipHtml: d => `${cfg.xAttribute}: ${d[cfg.xAttribute]}<br />${cfg.yAttribute}: ${d[cfg.yAttribute]}`
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

    let layout = cloud()
        .size([width, height])
        .words(data.map(d => {
            return {
                text: d[cfg.textAttribute],
                size: d[cfg.sizeAttribute]
            }
        }))
        .padding(cfg.wordsPadding)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.size)
        .on('end', draw)

    layout.start()
    
    function draw(words) {
        svg.append('g')
            .attr('transform', `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`)
            .selectAll('text')
            .data(words).enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', (d, i) => cfg.color(i))
            .attr('text-anchor', 'middle')
            // .attr('font-family', 'Impact')
            .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text)
    }
}

module.exports = WordCloud