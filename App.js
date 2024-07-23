import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";
import MainSearchBar from "./components/MainSearchBar";
import AutocompleteInput from "./components/AutocompleteInput";
import MapView from "./components/MapView";
import TransportationModeSelector from "./components/TransportationModeSelector";

export default function App() {
  const webViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryStart, setSearchQueryStart] = useState("");
  const [searchQueryEnd, setSearchQueryEnd] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsStart, setSearchResultsStart] = useState([]);
  const [searchResultsEnd, setSearchResultsEnd] = useState([]);
  const [selectedLocationStart, setSelectedLocationStart] = useState(null);
  const [selectedLocationEnd, setSelectedLocationEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [transportationMode, setTransportationMode] = useState("auto");
  const [showRoutingOptions, setShowRoutingOptions] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      performAutoComplete(searchQuery, setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQueryStart.length > 2) {
      performAutoComplete(searchQueryStart, setSearchResultsStart);
    } else {
      setSearchResultsStart([]);
    }
  }, [searchQueryStart]);

  useEffect(() => {
    if (searchQueryEnd.length > 2) {
      performAutoComplete(searchQueryEnd, setSearchResultsEnd);
    } else {
      setSearchResultsEnd([]);
    }
  }, [searchQueryEnd]);

  async function performAutoComplete(query, setResults) {
    const response = await fetch(
      `http://103.163.69.241/api/v1/places/autocomplete?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&text=${query}`
    );
    const data = await response.json();
    setResults(data.features);
  }

  async function getRoute() {
    if (!selectedLocationStart || !selectedLocationEnd) {
      Alert.alert("Error", "Please select both start and end locations");
      return;
    }

    const body = {
      costing: transportationMode,
      costing_options: {
        auto: {
          exclude_polygons: [],
          use_ferry: 1,
          use_living_streets: 0.5,
          use_tracks: 0,
          service_penalty: 15,
          service_factor: 1,
          shortest: false,
          use_hills: 0.5,
        },
      },
      exclude_polygons: [],
      locations: [
        {
          lon: selectedLocationStart.geometry.coordinates[0],
          lat: selectedLocationStart.geometry.coordinates[1],
          type: "break",
        },
        {
          lon: selectedLocationEnd.geometry.coordinates[0],
          lat: selectedLocationEnd.geometry.coordinates[1],
          type: "break",
        },
      ],
      directions_options: {
        units: "kilometers",
      },
      id: "valhalla_directions",
    };

    try {
      const response = await fetch(
        "http://103.163.69.241/api/v1/directions/route?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      setRoute(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch route");
    }
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
    setSearchQuery(item.properties.name);
    setSearchResults([]);
  };

  const handleLocationSelectStart = (item) => {
    setSelectedLocationStart(item);
    setSearchQueryStart(item.properties.name);
    setSearchResultsStart([]);
  };

  const handleLocationSelectEnd = (item) => {
    setSelectedLocationEnd(item);
    setSearchQueryEnd(item.properties.name);
    setSearchResultsEnd([]);
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
        selectedLocation={selectedLocationStart}
        route={route}
      />
      <MainSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRoutingIconPress={() => setShowRoutingOptions(!showRoutingOptions)}
      />
      {showRoutingOptions && (
        <View style={styles.routingContainer}>
          <AutocompleteInput
            placeholder="Start location"
            searchQuery={searchQueryStart}
            setSearchQuery={setSearchQueryStart}
            searchResults={searchResultsStart}
            handleLocationSelect={handleLocationSelectStart}
          />
          <AutocompleteInput
            placeholder="End location"
            searchQuery={searchQueryEnd}
            setSearchQuery={setSearchQueryEnd}
            searchResults={searchResultsEnd}
            handleLocationSelect={handleLocationSelectEnd}
          />
          <TransportationModeSelector
            setTransportationMode={setTransportationMode}
          />
          <Button title="Get Route" onPress={getRoute} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  routingContainer: {
    position: "absolute",
    top: 80, // Adjust this value if necessary
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: 999999,
  },
});
