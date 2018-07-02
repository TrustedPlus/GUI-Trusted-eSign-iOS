import * as React from "react";
import { Footer, FooterTab, Text, View, Button } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";
import { readFiles } from "../actions/index";

import * as Modal from "react-native-modalbox";
import { styles } from "../styles";

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		UnSignFile: bindActionCreators(UnSignFile, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch)
	};
}

interface IFile {
	mtime: string;
	extension: string;
	extensionAll?: string;
	name: string;
}

interface FooterSignProps {
	footer?: any;
	files?: any;
	personalCert?: any;
	modalView?: Function;
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean): void;
	verifySign?(files: IFile[], footer: string[]): void;
	UnSignFile?(files: IFile[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	readFiles?(): any;
}

interface FooterSignState {
	signature: string;
	detached: boolean;
	isSign: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(null, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps, FooterSignState> {

	constructor(props) {
		super(props);
		this.state = {
			signature: "BASE-64",
			detached: false,
			isSign: false
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	func(footer, files) {
		let isSign = false;
		footer.arrButton.forEach(function (i) {
			if (files[i].extension === "sig") { isSign = true; }
		});
		this.setState({ isSign: isSign });
	}

	render() {
		const { files, personalCert, verifySign, signFile, UnSignFile, uploadFile, deleteFile, footer } = this.props;
		let certIsNotNull, isSign = false, allIsSign = null;
		if (!personalCert.title) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		return (
			<>
				<Footer>
					<FooterTab>
						<FooterButton title="Проверить"
							disabled={allIsSign === "sig" ? false : true}
							icon="md-done-all"
							nav={() => verifySign(files, footer)} />
						<FooterButton title="Подписать"
							disabled={certIsNotNull === "noCert" ? true : false}
							icon="md-create"
							nav={() => { this.func(footer, files); this.modals.basicModal.open(); }} />
						<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer)} />
						<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
						<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
					</FooterTab>
				</Footer>
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={[styles.modal, styles.modal3]}
					position={"center"}
					isDisabled={false}>
					<View style={{ width: "100%", height: "100%" }}>
						<ListWithModalDropdown text="Кодировка"
							defaultValue={this.state.signature}
							changeValue={(value) => this.setState({ signature: value })}
							options={[{ value: "BASE-64" }, { value: "DER" }]} />
						<ListWithSwitch text="Сохранить подпись отдельно" disabled={this.state.isSign} value={this.state.detached} changeValue={() => this.setState({ detached: !this.state.detached })} />
						<Button transparent onPress={() => { this.modals.basicModal.close(); signFile(files, personalCert, footer, this.state.detached); }} style={{ borderTopWidth: 1, borderRightWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0 }}>
							<Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>ОК</Text>
						</Button>
						<Button transparent onPress={() => this.modals.basicModal.close()} style={{ borderTopWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0, right: 0 }}><Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>Отмена</Text></Button>
					</View>
				</Modal>
			</>
		);
	}
}