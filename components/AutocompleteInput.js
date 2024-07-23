import React from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AutocompleteInput = ({
  placeholder,
  searchQuery,
  setSearchQuery,
  searchResults,
  handleLocationSelect,
}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => console.log("focused")}
      />
      <ScrollView>
        {searchResults.map((item) => (
          <TouchableOpacity
            key={item.eLoc}
            onPress={() => handleLocationSelect(item)}
          >
            <Text style={styles.resultItem}>{item.properties.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 9999999,
    marginVertical: 5,
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
