import React from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

const AutocompleteInput = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  handleLocationSelect,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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

export default AutocompleteInput;
