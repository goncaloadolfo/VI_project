var dataset, full_dataset;

d3.json("spotify-charts.json").then(function (data) {
    full_dataset = data;
    dataset = full_dataset.slice(0, 5);
    gen_vis();
});

function mostPlayedSongs(w,h,padding){
    var bar_w = 0

    var r = 5;
    data = [];
    var i = 0;

    var svg = d3.select("#the_chart").append("svg")
        .attr("width", w)
        .attr("height", h);

    var hscale = d3.scaleLinear()
        .domain([3000000,dataset[0].Streams])
        .range([h - padding, padding]);

    var xscale = d3.scaleLinear()
        .domain([0, 5])
        .range([padding, dataset.length]);

    var barOffset = 20; 
    var axisOffset = 40;

    svg.selectAll("rect")
        .data(dataset)
        .enter().append("rect")
        .attr("width", Math.floor(w / dataset.length)/2 - 1)
        .attr("height", function (d) {
            return h - padding - hscale(d.Streams);
        })
        .attr("fill", "purple")
        .attr("x", function (d) {
            return ((xscale(d.Position))*barOffset-axisOffset);
        })
        .attr("y", function (d) {
            return hscale(d.Streams);
        });

    var yaxis = d3.axisLeft()
        .scale(hscale);



    svg.selectAll("rect")
    .append("title")
    .data(dataset)
    .text(function(d){
        return d.Artist+"\n"+d["Track Name"]+"\n"+ d.Streams+" Streams";
    });


    var xaxis=d3.axisBottom()
        .scale(d3.scaleLinear()
        .domain([dataset[0].Streams,dataset[dataset.length-1].Streams])
        .range([padding+bar_w/2,w-padding-bar_w/2]))
         .tickFormat(d3.format("d"))
        .ticks(dataset.length/4);
        
    // var xaxis = d3.axisBottom()
    // .scale(d3.scaleOrdinal().domain([dataset.map(a => a["Track Name"])])
    // .range([padding + bar_w / 2, w - padding - bar_w / 2]))
    // .ticks(dataset.length);

    svg.append("g")
        .attr("transform", "translate(40," + (h - padding) + ")")
        .attr("class", "xaxis")
        .call(xaxis)
        .selectAll("text")
          .attr("transform", "translate(400,0)")
          .style("text-anchor", "end")
          .style("font-size", 14)
          .style("fill", "#69a3b2");

    svg.append("g")
        .attr("transform", "translate(60,0)")
        .attr("class", "yaxis")
        .call(yaxis);

    
}

function gen_vis() {
    var w = 450;
    var h = 250;

    var padding = 20;
    mostPlayedSongs(w,h,padding)
    
}