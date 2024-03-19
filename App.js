import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

const BookFinderApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setBooks(
          data.items.map((item) => ({
            title: item.volumeInfo.title || "Unknown",
            authors: item.volumeInfo.authors
              ? item.volumeInfo.authors.join(", ")
              : "Unknown",
            isbn: item.volumeInfo.industryIdentifiers
              ? item.volumeInfo.industryIdentifiers[0].identifier
              : "Unknown",
            description:
              item.volumeInfo.description || "Description not available",
            image: item.volumeInfo.imageLinks
              ? item.volumeInfo.imageLinks.thumbnail
              : null,
          }))
        );
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setBooks([]);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      {item.image && (
        <Image style={styles.bookImage} source={{ uri: item.image }} />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.authors}</Text>
        <Text style={styles.isbn}>ISBN: {item.isbn}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book Finder</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by ISBN, Author, or Title"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Search" onPress={searchBooks} />
      </View>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.isbn}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bookImage: {
    width: 50,
    height: 75,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 5,
  },
  isbn: {
    fontSize: 14,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
  },
});

export default BookFinderApp;
