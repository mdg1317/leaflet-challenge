function createMap(data){
    console.log(data.features);

    // Creating the map object
    var myMap = L.map("map", {
        center: [39.8283, -98.5795],
        zoom: 5
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    let earthquakes = data.features;
    for(let i = 0; i < earthquakes.length; i++){
        let lat = earthquakes[i].geometry.coordinates[1];
        let lon = earthquakes[i].geometry.coordinates[0];
        let mag = earthquakes[i].properties.mag;

        let depth = earthquakes[i].geometry.coordinates[2];
        let color = "";
        if(depth >= 90){
            color = "red";
        } else if(depth >= 70){
            color = "orange";
        } else if(depth >= 50){
            color = "yellow";
        } else if(depth >= 30){
            color = "green";
        } else if(depth >= 10){
            color = "blue";
        } else {
            color = "purple";
        }

        L.circle([lat, lon], {
            color: "black",
            fillColor: color,
            fillOpacity: 0.75,
            radius: mag * 5000
        }).addTo(myMap);
    }

}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data) {
    createMap(data);
});