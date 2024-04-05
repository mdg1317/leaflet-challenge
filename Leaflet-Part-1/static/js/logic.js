// Set arrays for bins and color for use with the markers and legend
let bins = [10, 30, 50, 70, 90]
let colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FCA25D", "#FF5F64"];

function createMap(data){
    // Create the map object
    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5
    });

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Iterate through the data
    let earthquakes = data.features;
    for(let i = 0; i < earthquakes.length; i++){
        // Get the lat, lon, magnitude, and depth of the current earthquake
        let lat = earthquakes[i].geometry.coordinates[1];
        let lon = earthquakes[i].geometry.coordinates[0];
        let mag = earthquakes[i].properties.mag;
        let depth = earthquakes[i].geometry.coordinates[2];

        // Get the correct color from the array based on depth
        let colorIndex = -1;
        if(depth < bins[0]){
            colorIndex  = 0;
        } else if(depth < bins[1]){
            colorIndex  = 1;
        } else if(depth < bins[2]){
            colorIndex  = 2;
        } else if(depth < bins[3]){
            colorIndex  = 3;
        } else if(depth < bins[4]){
            colorIndex  = 4;
        } else {
            colorIndex  = 5;
        }

        // Add the circle to the map
        L.circle([lat, lon], {
            color: "black",
            fillColor: colors[colorIndex],
            weight: 1,
            fillOpacity: 0.75,
            radius: mag * 15000
        })
        .bindPopup(`Location: ${earthquakes[i].properties.place}<br>Coordinates: ${lat}, ${lon}<br>Magnitude: ${mag}<br>Depth: ${depth}`)
        .addTo(myMap);
    }

    // Set up the legend.
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<h4>Earthquake<br>Depth</h4>";

        // For each bin, add it to the legend with its corresponding color
        for(let i = 0; i < bins.length; i++){
            if(i == 0){
                div.innerHTML += `<li style="background: ${colors[i]}"></li><span>< ${bins[i]}</span><br>`;
            } else {
                div.innerHTML += `<li style="background: ${colors[i]}"></li><span>${bins[i - 1]} - ${bins[i] - 1}</span><br>`;
            }

            if(i + 1 == bins.length){
                div.innerHTML += `<li style="background: ${colors[i + 1]}"></li><span>> ${bins[i]}</span><br>`;
            }
        }
        
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

}

// Get the data from the URL and create the map
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data) {
    createMap(data);
});