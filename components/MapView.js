// import React from "react";
// import { WebView } from "react-native-webview";

// const MapView = ({ webViewRef, handleMessage, selectedLocation }) => {
//   return (
//     <WebView
//       ref={webViewRef}
//       source={{
//         uri: `http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#17.07/${
//           selectedLocation && selectedLocation.geometry
//             ? `${selectedLocation.geometry.coordinates[1]}/${selectedLocation.geometry.coordinates[0]}/0/21`
//             : ""
//         }`,
//       }}
//       style={{ flex: 1 }}
//       onMessage={handleMessage}
//       injectedJavaScript={`
//         (function() {
//           document.addEventListener('message', function(e) {
//             const data = JSON.parse(e.data);
//             console.log(e.data)
//             // if (data.type === 'reverseGeocode') {
//             //   reverseGeocode(data.lat, data.lng);
//             // }
//           });
//           document.addEventListener('click', function(e) {
//             const data = JSON.parse(e.data);
//             console.log(e.data)
//             // if (data.type === 'reverseGeocode') {
//             //   reverseGeocode(data.lat, data.lng);
//             // }
//           });
//         })();
//       `}
//     />
//   );
// };

// export default MapView;
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const MapView = () => {
  const [currentUrl, setCurrentUrl] = useState(
    "http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#17.07/18.995512/72.852926/0/21"
  );
  const webViewRef = useRef(null);
  useEffect(() => {
    const { lat, lng } = parseLatLongFromUrl(currentUrl);
    reverseGeocode(lat, lng);
  }, [currentUrl]);
  const reverseGeocode = (lat, lng) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          window.postMessage(JSON.stringify({
            type: 'reverseGeocode',
            lat: ${lat},
            lng: ${lng}
          }));
        })();
      `);
    }
  };

  const onNavigationStateChange = (navState) => {
    setCurrentUrl(navState.url);
    // console.log(navState.url);
  };
  const parseLatLongFromUrl = (url) => {
    const urlObj = new URL(url);
    const hash = urlObj.hash; // Extract the hash part of the URL
    const parts = hash.substring(1).split("/"); // Remove the leading '#' and split the parts
    const lat = parseFloat(parts[1]);
    const lng = parseFloat(parts[2]);
    return { lat, lng };
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: currentUrl }}
      style={{ flex: 1 }}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  urlText: {
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f1f1f1",
    width: "100%",
    textAlign: "center",
  },
});

export default MapView;
