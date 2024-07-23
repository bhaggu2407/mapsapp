import React, { useState, useRef, useEffect } from "react";
import { WebView } from "react-native-webview";

const MapView = ({location}) => {
  const [currentUrl, setCurrentUrl] = useState("http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#17.07/18.995512/72.852926/0/21");
  const webViewRef = useRef(null);


  useEffect(() => {
    if(location){
      console.log(JSON.stringify(location, null, 2))
      setCurrentUrl(constructUrlFromLocation(location))
    }
  }, [location]);

  const constructUrlFromLocation = (location) => {
    lat = location.geometry.coordinates[0]
    lng = location.geometry.coordinates[1]
    const baseUrl = "http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector";
    // Constructing the new URL with the latitude and longitude as parameters
    const updatedUrl = `${baseUrl}#17.07/${lat}/${lng}/0/21`;
    return updatedUrl;
  };



  // const reverseGeocode = (lat, lng) => {
  //   if (webViewRef.current) {
  //     webViewRef.current.injectJavaScript(`
  //       (function() {
  //         window.postMessage(JSON.stringify({
  //           type: 'reverseGeocode',
  //           lat: ${lat},
  //           lng: ${lng}
  //         }));
  //       })();
  //     `);
  //   }
  // };

  const onNavigationStateChange = (navState) => {
    setCurrentUrl(navState.url);
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
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

export default MapView;
