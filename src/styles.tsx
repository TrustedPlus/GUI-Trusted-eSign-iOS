import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	header: {
		backgroundColor: "#be3817"
	},
	footer: {
		backgroundColor: "#be3817"
	},
	headerImage: {
		width: 44,
		height: 44
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
	numChain: {
		width: 30,
		height: 30,
		backgroundColor: "white",
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 15,
		borderColor: "darkblue",
		borderWidth: 1
	},
	vert: {
		position: "absolute",
		left: 25,
		top: 43,
		height: 35, // или сколько нужно в пикселях или процентах
		width: 1,
		borderWidth: 0,
		borderLeftWidth: 3,
		borderColor: "lightblue",
	},
	vertfirst: {
		position: "absolute",
		left: 25,
		top: -27,
		height: 35, // или сколько нужно в пикселях или процентах
		width: 1,
		borderWidth: 0,
		borderLeftWidth: 3,
		borderColor: "lightblue",
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
		width: "80%",
		paddingLeft: 3
	},
	sign_enc_prompt: {
		fontSize: 17,
		color: "lightgrey",
		textAlign: "center"
	},
	sign_enc_button: {
		position: "absolute",
		marginTop: 8,
		right: 10
	},
	selectFiles: {
		fontSize: 17,
		height: 20,
		color: "grey",
		width: "70%",
		paddingLeft: 4
	},
	// PropertiesCert
	prop_cert_righttext: {
		position: "absolute",
		width: "55%",
		right: 5,
		textAlign: "right",
		color: "darkblue"
	},
	prop_cert_status: {
		fontSize: 17,
		color: "grey",
		position: "absolute",
		left: 110,
		top: 60,
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
		right: 5,
		top: 15
	},
	// Modal
	wrapper: {
		paddingTop: 50,
		flex: 1
	},

	modal: {
		justifyContent: "center",
		alignItems: "center"
	},

	modal3: {
		height: 300,
		width: 300,
		backgroundColor: "rgba(255, 255, 255, 0.85)",
		borderRadius: 8,
	},

	btn: {
		margin: 10,
		backgroundColor: "#3B5998",
		color: "white",
		padding: 10
	},

	modalMain: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "50%",
		borderLeftWidth: 0.25,
		borderTopWidth: 0.5,
		borderColor: "grey",
		borderRadius: 0
	},

	buttonModal: {
		fontSize: 15,
		textAlign: "center",
		color: "black"
	},

	// FooterSignModal
	modalMore: {
		position: "absolute",
		bottom: 70,
		right: 20,
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1.0
	},

	modalMore4: {
		width: 200,
		height: 110
	},

	modalMore6: {
		width: 300,
		height: 110
	},

	buttonCollapsed: {
		width: "100%",
		backgroundColor: "white"
	},
	iconCollapsed: {
		color: "grey",
		position: "absolute",
		right: "5%"
	},
	// FooterSignModal
	loader: {
		position: "absolute",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
		backgroundColor: "rgba(0,0,0,0.1)"
	},
	loaderView: {
		width: "60%",
		height: "15%",
		backgroundColor: "white",
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowRadius: 1,
		shadowOpacity: 1.0,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around"
	}
});