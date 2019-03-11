mapboxgl.accessToken = 'pk.eyJ1IjoidGVtcHVzbmVtaW5pIiwiYSI6ImNqdDRjaWozcDAwNDQ0OW8zNGl4bHNseDIifQ.bnayrJTBXZWblicqzMfRlQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [30.32200, 59.93870],
  zoom: 17
});

map.on("load", function() {
    map.loadImage("../img/raster/map-pin.png", function(e, a) {
        if (e)
            throw e;
        map.addImage("pin", a),
        map.addLayer({
            id: "points",
            type: "symbol",
            source: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [30.32248, 59.93862]
                        }
                    }]
                }
            },
            layout: {
                "icon-image": "pin",
                "icon-size": 1
            }
        })
    })
});