// CONSTANTS
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.85,
  margin = { top: 25, bottom: 50, left: 50, right: 25 };

/**
 * APPLICATION STATE
 * */
let state = {};
let svg;

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([d3.json("all_countries.geo.json"), d3.csv("concap.csv")]).then(
  ([geojson, data]) => {
    state.geojson = geojson;
    state.data = data;

    console.log("geojson: ", state.geojson);
    console.log("data: ", state.data);

    init();
  }
);

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const projection = d3
    .geoNaturalEarth1()
    .fitSize([width - margin.right, height], state.geojson);
  // Fit size tells D3 to fit usMapData into the specified x and y area

  // CREATE SVG
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  // .style("background-color", "lavender");

  // PATH GENERATOR FOR MAP
  const pathGen = d3.geoPath(projection);

  // DRAW THE US MAP USING THE PATH GEN
  const countries = svg
    .selectAll(".state-path")
    .data(state.geojson.features)
    .join("path")
    .attr("class", "state-path")
    .attr("stroke", "black")
    .attr("fill", "transparent")
    .attr("d", pathGen)
    .style("border", "1px solid black");

  // DRAW Country Capitals ======================

  svg
    .selectAll(".capital")
    .data(state.data)
    .join("circle")
    .attr("class", "capital")
    .attr("r", 3)
    .attr("stroke", "red")
    .attr("fill", "yellow")
    .attr("transform", (d) => {
      const [x, y] = projection([d.CapitalLongitude, d.CapitalLatitude]);

      return `translate(${x}, ${y})`;
    });
}
