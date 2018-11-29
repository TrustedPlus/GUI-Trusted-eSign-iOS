import * as React from "react";
import { Text, View, Header, Title, Button } from "native-base";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";
import { styles } from "../styles";
import * as Modal from "react-native-modalbox";

interface ModalSignSettingProps {
	basicModal?: Modal.default;
}

interface ModalSignSettingState {
	signature: string;
	detached: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

export class ModalSignSetting extends React.Component<{}, ModalSignSettingState> {

	constructor(props) {
		super(props);

		this.state = {
			signature: "BASE-64",
			detached: false
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	render() {
		return (
			<Modal
				ref={ref => this.modals.basicModal = ref}
				style={[styles.modal, {
					height: "auto",
					width: 300,
					backgroundColor: "white",
				}]}
				position={"center"}
				swipeToClose={false}>
				<View style={{ width: "100%" }}>
					<Header
						style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
						<Title>
							<Text style={{
								color: "white",
								fontSize: 15
							}}>Настройка подписи</Text>
						</Title>
					</Header>
					<ListWithModalDropdown text="Кодировка"
						defaultValue={this.state.signature}
						changeValue={(value) => this.setState({ signature: value })}
						options={[{ value: "BASE-64" }, { value: "DER" }]} />
					<ListWithSwitch text="Сохранить подпись отдельно" value={this.state.detached} changeValue={() => this.setState({ detached: !this.state.detached })} />
					<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
						<Button transparent style={styles.modalMain} onPress={() => this.modals.basicModal.close()}>
							<Text style={ styles.buttonModal }>Отмена</Text>
						</Button>
						<Button transparent style={styles.modalMain} onPress={() => {/*
							this.modals.basicModal.close();
							signFile(files, personalCert, footer, this.state.detached, this.state.signature, (num) => this.props.clearselectedFiles(num), this.props.tempFiles, navigate, (isSuccess) => this.props.modalSuccessUpload(isSuccess));
						*/}}>
							<Text style={ styles.buttonModal }>Применить</Text>
						</Button>
					</View>
				</View>
			</Modal>
		);
	}
}

