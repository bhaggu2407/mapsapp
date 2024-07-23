import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

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
  const handleMapPress = async (event) => {
    console.log(event);
    // const { coordinates } = event.geometry;
    // const address = await reverseGeocode(coordinates[1], coordinates[0]);
    // if (address) {
    //   setSelectedLocation({
    //     latitude: coordinates[1],
    //     longitude: coordinates[0],
    //   });
    //   setSearchQuery(address);
    // }
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
  // console.log("search query", searchQuery);
  console.log(
    `http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#17.07/${
      selectedLocation && selectedLocation.geometry
        ? `${selectedLocation.geometry.coordinates[1]}/${selectedLocation.geometry.coordinates[0]}/180/21`
        : ""
    }`
  );
  // console.log(selectedLocation);
  return (
    <View style={styles.container}>
      <WebView
        onPress={handleMapPress}
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => console.log("focused")}
        />
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationSelect(item)}>
              <Text style={styles.resultItem}>{item.properties.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.eLoc}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    width: 200,
    marginTop: 100,
    marginLeft: 100,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 9999999,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    zIndex: 999999,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
