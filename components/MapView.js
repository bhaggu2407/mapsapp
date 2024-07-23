import React from "react";
import { WebView } from "react-native-webview";

const MapView = ({ webViewRef, handleMessage, selectedLocation }) => {
  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: `http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#17.07/${
          selectedLocation && selectedLocation.geometry
            ? `${selectedLocation.geometry.coordinates[1]}/${selectedLocation.geometry.coordinates[0]}/0/21`
            : ""
        }`,
      }}
      style={{ flex: 1 }}
      onMessage={handleMessage}
      injectedJavaScript={`
        (function() {
          document.addEventListener('message', function(e) {
            const data = JSON.parse(e.data);
            if (data.type === 'reverseGeocode') {
              reverseGeocode(data.lat, data.lng);
            }
          });
        })();
      `}
    />
  );
};

export default MapView;
