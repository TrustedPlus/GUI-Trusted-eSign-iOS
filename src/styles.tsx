import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  // Menu, Headers
  header: {
    backgroundColor: "#be3817"
  },
  headerImage: {
    width: 30,
    height: 30
  },
  left: {
    maxWidth: 50
  },
  right: {
    maxWidth: 50
  },
  // ListMenu
  listItem: {
    marginLeft: 0
  },
  listItemText: {
    fontSize: 20,
    marginRight: 5
  },
  thumbnail: {
    marginLeft: 5
  },
  // SideListItem
  sideListItem: {
    marginLeft: 2,
    height: 50
  },
  sidethumbnail: {
    marginRight: 5
  },
  // SideBar
  splash_screen: {
    width: "100%",
    height: "100%"
  },
  splash_icon: {
    position: "absolute",
    left: 100,
    top: 10,
    width: 70,
    height: 70
  },
  splash_text: {
    position: "absolute" ,
    left: 60,
    top: 90,
    fontSize: 20,
    color: "white"
  }
});