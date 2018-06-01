import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	header: {
		backgroundColor: "#be3817"
	},
	footer: {
		backgroundColor: "#be3817"
	},
	headerImage: {
		width: 35,
		height: 35
	},
	left: {
		maxWidth: 25
	},
	right: {
		maxWidth: 50
	},
	container: {
		backgroundColor: "white"
	},
	// ListMenu
	listItem: {
		marginLeft: 0,
		minHeight: 10
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
		position: "absolute",
		left: 60,
		top: 90,
		fontSize: 20,
		color: "white"
	},
	// Signature, DescriptionError, Encryption
	sign_enc_view: {
		paddingBottom: 20,
		paddingTop: 20,
	},
	sign_enc_title: {
		fontSize: 23,
		color: "grey",
		width: "80%"
	},
	sign_enc_prompt: {
		fontSize: 17,
		color: "lightgrey",
		textAlign: "center"
	},
	sign_enc_button: {
		position: "absolute",
		marginTop: 6,
		right: 10
	},
	// PropertiesCert
	prop_cert_righttext: {
		position: "absolute",
		width: "60%",
		right: 5,
		textAlign: "right",
		color: "blue"
	},
	prop_cert_status: {
		fontSize: 17,
		color: "grey",
		position: "absolute",
		left: 110,
		top: 50,
		right: 5
	},
	prop_cert_img: {
		height: 70,
		width: 70,
		margin: 20
	},
	prop_cert_title: {
		fontSize: 20,
		position: "absolute",
		left: 110,
		top: 20
	}
});