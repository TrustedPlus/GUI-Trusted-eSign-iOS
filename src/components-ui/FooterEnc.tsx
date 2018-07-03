import * as React from "react";
import { Footer, FooterTab, View, Button, Text} from "native-base";
import { FooterButton } from "../components//FooterButton";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { encAssymmetric, decAssymmetric } from "../actions/encDecAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";

import * as Modal from "react-native-modalbox";
import { styles } from "../styles";

function mapDispatchToProps(dispatch) {
	return {
		encAssymmetric: bindActionCreators(encAssymmetric, dispatch),
		decAssymmetric: bindActionCreators(decAssymmetric, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch)
	};
}

interface IFile {
	mtime: string;
	extension: string;
	name: string;
}

interface FooterEncProps {
	footer?: any;
	files?: any;
	otherCert?: any;
	encAssymmetric?(files: IFile[], otherCert: string[], footer: string[], signature: string, deleteAfter: boolean): void;
	decAssymmetric?(files: IFile[], footer: string[]): void;
	uploadFile?(files: IFile[], footer): void;
	deleteFile?(files: IFile[], footer: string[]): void;
}

interface FooterEncState {
	signature: string;
	deleteAfter: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(null, mapDispatchToProps) as any)
export class FooterEnc extends React.Component<FooterEncProps, FooterEncState> {

	constructor(props) {
		super(props);
		this.state = {
			signature: "BASE-64",
			deleteAfter: false
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	render() {
		const { files, otherCert, encAssymmetric, decAssymmetric, uploadFile, deleteFile, footer } = this.props;
		let certIsNotNull, isDec, isEnc = null;

		if (footer.arrExtension.filter(extension => extension === "enc").length !== 0) {
			isEnc = "enc";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "enc").length) {
			isDec = "dec";
		}
		if (!otherCert.arrEncCertificates.length) {
			certIsNotNull = "noCert";
		}
		return (
			<>
				<Footer>
					<FooterTab>
						<FooterButton title="Зашифровать"
							disabled={certIsNotNull ? true : (isEnc === "enc" ? true : false)}
							icon="md-lock"
							nav={() => this.modals.basicModal.open()} />
						<FooterButton title="Расшифровать"
							disabled={isDec === "dec" ? false : true}
							icon="md-unlock"
							nav={() => decAssymmetric(files, footer)} />
						<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
						<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
					</FooterTab>
				</Footer>
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={[styles.modal, styles.modal3]}
					position={"center"}
					swipeToClose={false}>
					<View style={{ width: "100%", height: "100%" }}>
						<ListWithModalDropdown text="Кодировка"
							defaultValue={this.state.signature}
							changeValue={(value) => this.setState({ signature: value })}
							options={[{ value: "BASE-64" }, { value: "DER" }]} />
						<ListWithSwitch text="Удалить после шифрования" disabled={this.state.deleteAfter} value={this.state.deleteAfter} changeValue={() => this.setState({ deleteAfter: !this.state.deleteAfter })} />
						<Button transparent onPress={() => { this.modals.basicModal.close(); encAssymmetric(files, otherCert, footer, this.state.signature, this.state.deleteAfter); }} style={{ borderTopWidth: 1, borderRightWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0 }}>
							<Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>ОК</Text>
						</Button>
						<Button transparent onPress={() => this.modals.basicModal.close()} style={{ borderTopWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0, right: 0 }}><Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>Отмена</Text></Button>
					</View>
				</Modal>
			</>
		);
	}
}