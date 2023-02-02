import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";


function MapArea() {
    const position = new LatLng(35.68, 139.76);

    // const [coordinate, setCoordinate] = useState({
    //     latitude: 35.6803997,
    //     longitude: 139.7690174,
    //     capital: "Tokyo"
    // });

    const MapContainerStyle = {
        width: "400px",
        height: "300px",
        display: "inline-block",
        padding: "10px"
    };

    return (
        <div 
            className=""
            style={{
                textAlign: "center",
                width: "100vw",
                // height: "50vh",
            }}
        >
            <MapContainer 
                center={position} 
                zoom={13}
                style={MapContainerStyle}
                // center={[coordinate.latitude, coordinate.longitude]}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                    // url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                />
                <Marker
                    // position={[coordinate.latitude, coordinate.longitude]}
                    position={position}
                >
                    <Popup>
                        {/* <img src='/images/Logo.png' width={28} height={28} alt="vlides_logo" /> */}
                        {/* {coordinate.capital} */}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default MapArea;