import * as React from "react";
import { Footer, FooterTab, Text, View, Button } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile, getSignInfo } from "../actions/signVerifyAction";
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
		readFiles: bindActionCreators(readFiles, dispatch),
		getSignInfo: bindActionCreators(getSignInfo, dispatch)
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
	navigate?: any;
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean, signature: string): void;
	verifySign?(files: IFile[], footer: string[]): void;
	UnSignFile?(files: IFile[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	getSignInfo?(files: IFile[], footer: string[], navigate): void;
	readFiles?(): any;
}

interface FooterSignState {
	signature: string;
	detached: boolean;
	isSign: boolean;
	modalMore: boolean;
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
			isSign: false,
			modalMore: false
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	render() {
		const { files, personalCert, verifySign, signFile, UnSignFile, uploadFile, deleteFile, footer, getSignInfo, navigate } = this.props;
		let certIsNotNull, allIsSign = null, numSelectedFilesIsOne = false;
		if (!personalCert.title) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		if (footer.arrExtension.length === 1) {
			numSelectedFilesIsOne = true;
		}
		// deleteFile(files, footer)
		// <FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer)} />
		// <FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
		//
		return (
			<>
				<Footer>
					<FooterTab>
						{this.state.modalMore
							? <View style={{
								width: 200, height: 110, position: "absolute", bottom: 70, right: 20, shadowColor: "#000000",
								shadowOffset: {
									width: 0,
									height: 3
								},
								shadowRadius: 5,
								shadowOpacity: 1.0
							}}>
								<Footer>
									<FooterTab>
										<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer)} />
										<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
									</FooterTab>
								</Footer>
								<Footer>
									<FooterTab>
										<FooterButton style={{ backgroundColor: "#F8F8F8" }} title="Архивировать" icon="help" nav={() => null} />
										<FooterButton style={{ backgroundColor: "#F8F8F8" }} title="Удалить" icon="ios-trash" nav={() => deleteFile(files, footer)} />
									</FooterTab>
								</Footer>
							</View>
							: null}
						<FooterButton title="Проверить"
							disabled={allIsSign === "sig" ? false : true}
							icon="md-done-all"
							nav={() => { this.setState({ modalMore: false }); verifySign(files, footer); }} />
						<FooterButton title="Подписать"
							disabled={certIsNotNull === "noCert" ? true : false}
							icon="md-create"
							nav={() => { allIsSign === "sig" ? signFile(files, personalCert, footer, null, null) : this.modals.basicModal.open(); }} />
						<FooterButton title="Свойства" disabled={numSelectedFilesIsOne ? allIsSign === "sig" ? false : true : true} icon="ios-information" nav={() => getSignInfo(files, footer, (page, cert) => navigate(page, { cert: cert }))} />
						<FooterButton title="Больше" icon="ios-more" nav={() => this.setState({ modalMore: !this.state.modalMore })} />
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
						<ListWithSwitch text="Сохранить подпись отдельно" value={this.state.detached} changeValue={() => this.setState({ detached: !this.state.detached })} />
						<Button transparent onPress={() => { this.modals.basicModal.close(); signFile(files, personalCert, footer, this.state.detached, this.state.signature); }} style={{ borderTopWidth: 1, borderRightWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0 }}>
							<Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>ОК</Text>
						</Button>
						<Button transparent onPress={() => this.modals.basicModal.close()} style={{ borderTopWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0, right: 0 }}><Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>Отмена</Text></Button>
					</View>
				</Modal>
			</>
		);
	}
}