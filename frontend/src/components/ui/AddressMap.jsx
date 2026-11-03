import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useState } from "react";
import {
  getInitialCoordinates,
  getStoredCoordinates,
  requestCurrentLocation,
  saveCoordinates,
} from "../../utils/location-service";

const coordinatesToPosition = ({ latitude, longitude }) => [
  latitude,
  longitude,
];

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 15, { animate: true, duration: 0.8 });
  }, [map, position]);

  return null;
}

function DraggableMarker({ position, setPosition, setCoordinates }) {
  const updateLocation = (latitude, longitude) => {
    const coordinates = saveCoordinates({ latitude, longitude });
    const nextPosition = coordinatesToPosition(coordinates);

    setPosition(nextPosition);
    setCoordinates(coordinates);
  };

  useMapEvents({
    click(e) {
      updateLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;

          const latlng = marker.getLatLng();

          updateLocation(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

export default function AddressMap({ setCoordinates }) {
  const initialCoordinates = getInitialCoordinates();
  const [position, setPosition] = useState(
    coordinatesToPosition(initialCoordinates),
  );

  useEffect(() => {
    let isMounted = true;

    requestCurrentLocation()
      .then((coordinates) => {
        if (!isMounted) return;

        const nextPosition = coordinatesToPosition(coordinates);
        setPosition(nextPosition);
        setCoordinates(coordinates);
      })
      .catch(() => {
        setCoordinates(
          getStoredCoordinates() || { latitude: null, longitude: null },
        );
      });

    return () => {
      isMounted = false;
    };
  }, [setCoordinates]);

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "10px",
      }}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController position={position} />
      <DraggableMarker
        position={position}
        setPosition={setPosition}
        setCoordinates={setCoordinates}
      />
    </MapContainer>
  );
}

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMap,
//   useMapEvents,
// } from "react-leaflet";

// import { useEffect, useState } from "react";
// import L from "leaflet";

// const DEFAULT_POSITION = [28.6139, 77.209];

// function DraggableMarker({ position, setPosition, setCoordinates }) {
//   useMapEvents({
//     click(e) {
//       const pos = [e.latlng.lat, e.latlng.lng];

//       setPosition(pos);

//       setCoordinates({
//         latitude: e.latlng.lat,
//         longitude: e.latlng.lng,
//       });
//     },
//   });

//   return (
//     <Marker
//       draggable
//       position={position}
//       eventHandlers={{
//         dragend: (e) => {
//           const marker = e.target;
//           const latlng = marker.getLatLng();

//           const pos = [latlng.lat, latlng.lng];

//           setPosition(pos);

//           setCoordinates({
//             latitude: latlng.lat,
//             longitude: latlng.lng,
//           });
//         },
//       }}
//     />
//   );
// }

// /**
//  * Changes the map center whenever `position` changes.
//  */
// function MapController({ position }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!position) return;

//     map.flyTo(position, 16, {
//       animate: true,
//       duration: 1,
//     });
//   }, [position, map]);

//   return null;
// }

// /**
//  * Requests browser location permission.
//  */
// function LocationPermission({
//   setPosition,
//   setCoordinates,
//   setLocationPermission,
// }) {
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocationPermission("denied");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (location) => {
//         const { latitude, longitude } = location.coords;

//         const position = [latitude, longitude];

//         setPosition(position);

//         setCoordinates({
//           latitude,
//           longitude,
//         });

//         setLocationPermission("granted");
//       },
//       (error) => {
//         console.log("Location permission error:", error);

//         setLocationPermission("denied");
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   }, [setCoordinates, setPosition, setLocationPermission]);

//   return null;
// }

// /**
//  * Search locations using Nominatim.
//  */
// function LocationSearch({ setPosition, setCoordinates }) {
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();

//     if (!search.trim()) return;

//     try {
//       setLoading(true);

//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
//           search
//         )}`
//       );

//       const data = await response.json();

//       setResults(data);
//     } catch (error) {
//       console.error("Location search failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (location) => {
//     const latitude = Number(location.lat);
//     const longitude = Number(location.lon);

//     const position = [latitude, longitude];

//     setPosition(position);

//     setCoordinates({
//       latitude,
//       longitude,
//     });

//     setResults([]);
//     setSearch(location.display_name);
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "15px",
//         left: "15px",
//         right: "15px",
//         zIndex: 1000,
//       }}
//     >
//       <form
//         onSubmit={handleSearch}
//         style={{
//           display: "flex",
//           gap: "8px",
//           background: "white",
//           padding: "8px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//         }}
//       >
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search city, state, pincode or address"
//           style={{
//             flex: 1,
//             padding: "10px 12px",
//             border: "1px solid #ddd",
//             borderRadius: "6px",
//             outline: "none",
//           }}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px 16px",
//             border: "none",
//             borderRadius: "6px",
//             background: "#2563eb",
//             color: "white",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Searching..." : "Search"}
//         </button>
//       </form>

//       {results.length > 0 && (
//         <div
//           style={{
//             marginTop: "5px",
//             background: "white",
//             borderRadius: "8px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//             overflow: "hidden",
//           }}
//         >
//           {results.map((location) => (
//             <button
//               key={location.place_id}
//               type="button"
//               onClick={() => handleSelect(location)}
//               style={{
//                 display: "block",
//                 width: "100%",
//                 padding: "12px",
//                 border: "none",
//                 borderBottom: "1px solid #eee",
//                 background: "white",
//                 textAlign: "left",
//                 cursor: "pointer",
//               }}
//             >
//               {location.display_name}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function AddressMap({ setCoordinates }) {
//   const [position, setPosition] = useState(DEFAULT_POSITION);

//   const [locationPermission, setLocationPermission] = useState(
//     "requesting"
//   );

//   return (
//     <div
//       style={{
//         position: "relative",
//         height: "100%",
//         width: "100%",
//       }}
//     >
//       <MapContainer
//         center={DEFAULT_POSITION}
//         zoom={14}
//         style={{
//           height: "100%",
//           width: "100%",
//           borderRadius: "10px",
//         }}
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Ask browser for location */}
//         <LocationPermission
//           setPosition={setPosition}
//           setCoordinates={setCoordinates}
//           setLocationPermission={setLocationPermission}
//         />

//         {/* Move map whenever position changes */}
//         <MapController position={position} />

//         {/* Draggable marker */}
//         <DraggableMarker
//           position={position}
//           setPosition={setPosition}
//           setCoordinates={setCoordinates}
//         />

//         {/* Search only if location permission failed */}
//         {locationPermission === "denied" && (
//           <LocationSearch
//             setPosition={setPosition}
//             setCoordinates={setCoordinates}
//           />
//         )}
//       </MapContainer>
//     </div>
//   );
// }
