import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

const MainSearchBar = ({ handleItemPress,onRoutingIconPress }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);



  async function performAutoComplete(query, setResults) {
    const response = await fetch(
      `http://103.163.69.241/api/v1/places/autocomplete?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&text=${query}`
    );
    const data = await response.json();
    setResults(data.features);
  }

  useEffect(() => {
    if (searchQuery.length > 2) {
      performAutoComplete(searchQuery, setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <View style={styles.mainContainer}>

      <View style={styles.searchContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder={"Search for a location"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
              <TouchableOpacity
                style={styles.clearIconContainer}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons name="close-circle" size={24} color="gray" />
              </TouchableOpacity>
            ) : null}

        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onRoutingIconPress}
        >
          <Ionicons name="add-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex:1, maxHeight: 280 }}>
        {searchResults.map((item) => {
          const name = item?.properties?.name + (item?.properties?.locality?`, ${item?.properties?.locality}`:'')
          return (<TouchableOpacity
            style={{height: 40}}
            key={item.eLoc}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.resultItem}>{name}</Text>
          </TouchableOpacity>)
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    top: 35,
    left: 10,
    right: 10,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 9999999,
    marginRight: 35,
  },
  searchContainer:{
    flex:1,
    flexDirection: "row",
    alignItems: "center"
  },
  textInputContainer: {
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    height: 40
  },
  iconContainer: {
    padding: 10,
  },
  clearIconContainer: {
    paddingHorizontal: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default MainSearchBar;
