import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AutocompleteInput from "./components/AutocompleteInput";
import MapView from "./components/MapView";

export default function App() {
  const webViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (searchQuery.length > 2) {
      performAutoComplete(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  async function performAutoComplete(query) {
    const response = await fetch(
      `http://103.163.69.241/api/v1/places/autocomplete?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&text=${query}`
    );
    const data = await response.json();
    setSearchResults(data.features);
  }

  const handleMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === "autocomplete") {
      console.log("Autocomplete suggestions:", message.suggestions);
    } else if (message.type === "reverseGeocode") {
      console.log("Reverse geocode results:", message.results);
    }
  };

  const handleLocationSelect = (item) => {
    setSelectedLocation(item);
    setSearchQuery(item.properties.name);
    setSearchResults([]);
  };

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

  return (
    <View style={styles.container}>
      <MapView
        webViewRef={webViewRef}
        handleMessage={handleMessage}
        selectedLocation={selectedLocation}
      />
      <AutocompleteInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        handleLocationSelect={handleLocationSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
