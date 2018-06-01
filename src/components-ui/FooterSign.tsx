import * as React from "react";
import { NativeModules, Alert, AlertIOS } from "react-native";
import * as RNFS from "react-native-fs";
import { Footer, FooterTab } from "native-base";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { signFile, verifySign } from "../actions/SignVerifyAction";
import { uploadFile, deleteFile } from "../actions/UploadFileAction";
import { FooterButton } from "../components/FooterButton";
import ModalDropdown from "react-native-modal-dropdown";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		footer: state.footer,
		personalCert: state.personalCert
	};
}

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch)
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
	files?: IFile[];
	personalCert?: any;
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean): void;
	verifySign?(files: IFile[], personalCert: string[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps> {

	onPressUnSignFile() {
		for (let i = 0; i < this.props.footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + this.props.files[this.props.footer.arrButton[i]].name + "." + this.props.files[this.props.footer.arrButton[i]].extensionAll;
			NativeModules.Wrap_Signer.unSign(
				path,
				"BASE64",
				path.substr(0, path.length - 4),
				(err, verify) => {
					if (err) {
						Alert.alert(err + "");
					} else {
						Alert.alert(verify + "");
						console.log(verify);
					}
				});
		}
	}

	render() {
		const { files, personalCert, verifySign, signFile, uploadFile, deleteFile, footer } = this.props;
		let footerleft = null;
		let certIsNotNull, isSign, allIsSign = null;
		if (!personalCert.title) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		if (footer.arrExtension.filter(extension => extension === "sig").length !== 0) {
			isSign = "sig";
		}
		return (
			<Footer>
				<FooterTab>
					<FooterButton title="Проверить"
						disabled={allIsSign === "sig" ? false : true}
						icon="md-done-all"
						nav={() => verifySign(files, personalCert, footer)} />
					<FooterButton title="Подписать"
						disabled={certIsNotNull === "noCert" ? true : (isSign === "sig" ? true : false)}
						icon="md-create"
						nav={() => AlertIOS.alert(
							"Подписать",
							null,
							[
								{ text: "совмещенной подписью", onPress: () => signFile(files, personalCert, footer, false) },
								{ text: "отделенной подписью", onPress: () => signFile(files, personalCert, footer, true) },
								{ text: "Отмена", onPress: () => null, style: "destructive" }
							]
						)} />
					<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => this.onPressUnSignFile()} />
					<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
					<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
				</FooterTab>
			</Footer>
		);
	}
}