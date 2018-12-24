import * as React from "react";
import * as RNFS from "react-native-fs";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, View, Input, Button, Text, Item, Header,
	Footer, FooterTab, Spinner, Title, ListItem, Right, Icon, Left, Content, List } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { Image, NativeModules, Linking, AlertIOS } from "react-native";
import { showToast, showToastDanger } from "../utils/toast";
import { ListMenu } from "../components/ListMenu";
import * as Modal from "react-native-modalbox";
import * as soap from "soap-everywhere";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createService, selectedService } from "../actions/ServiceAction";

function mapStateToProps(state) {
	return {
		services: state.services
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createService: bindActionCreators(createService, dispatch),
		selectedService: bindActionCreators(selectedService, dispatch)
	};
}

interface ServiceSignatureProps {
	navigation: any;
	services: {
		services: Array<any>,
		lengthServices: number,
		lastid: number
	};
	createService(nameService: string): void;
	selectedService(key): void;
}

interface ServiceSignatureState {
	nameService: string;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class ServiceSignature extends React.Component<ServiceSignatureProps, ServiceSignatureState> {

	constructor(props) {
		super(props);

		this.state = {
			nameService: "МЭП МЕГАФОН #"
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	showList() {
		return (
			this.props.services.services.map((service, key) => <ListMenu
				key={key + Math.random()}
				title={service.name}
				note={service.status}
				img={require("../../imgs/general/megafon.png")}
				selected={service.isSelected}
				nav={() => this.props.selectedService(service.key)} />));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		let numService;
		if (this.props.services.lengthServices) { // выбраны ли файлы
			numService = <Text style={styles.selectFiles}>
				выбрано: {this.props.services.lengthServices} </Text>;
		} else {
			if (this.props.services.services) {
				numService = <Text style={styles.selectFiles}>
					всего сервисов: {this.props.services.services.length}</Text>;
			} else {
				numService = null;
			}
		}
		return (
			<Container style={styles.container}>
				<Headers title="Сервисы подписи" goBack={() => goBack()} />
				{
					this.props.services.services.length
						? <>
							<View style={styles.sign_enc_view}>
								<Text style={styles.sign_enc_title}>Сервисы</Text>
								{numService}
							</View>
							<Content>
								<List>{this.showList()}</List>
							</Content>
						</>
						: <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сервисы подписи не подключены</Text>
				}
				<Button
					transparent
					style={{
						position: "absolute",
						bottom: 80,
						right: 30
					}}
					onPressIn={() => this.modals.basicModal.open()}>
					<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
				</Button>
				{
					this.props.services.lengthServices ?
				<Footer>
					<FooterTab>
						<FooterButton title="Настроить"
							disabled={this.props.services.lengthServices !== 1}
							img={require("../../imgs/general/setting_icon.png")}
							nav={() => navigate("SettingService")} />
						<FooterButton title="Удалить"
							img={require("../../imgs/ios/delete.png")}
							nav={() => null} />
					</FooterTab>
				</Footer>
				: null
				}
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={styles.modal}
					position={"center"}
					swipeToClose={false}>
					<Header
						style={{ backgroundColor: "#be3817", height: 45.7, width: 300, paddingTop: 13 }}>
						<Title>
							<Text style={{
								color: "white",
								fontSize: 15
							}}>Добавление подключений</Text>
						</Title>
					</Header>
					<View>
						<ListItem style={{ borderBottomColor: "white" }}>
							<Text style={{ fontSize: 14, width: "100%" }}>Доступные сервисы:</Text>
						</ListItem>
						<ListItem style={{ borderBottomColor: "white" }}>
							<Left>
								<Text style={{ fontSize: 12, width: "100%" }}>Сервис подписи МЭП Мегафон</Text>
							</Left>
							<Right>
								<Icon style={{ color: "black" }} name="md-checkmark" />
							</Right>
						</ListItem>
						{/*<ListItem style={{ height: 10 }}>
							<Text>Сервис подписи КриптоПро DSS</Text>
						</ListItem>*/}
					</View>
					<ListItem style={{ borderBottomColor: "white" }}>
						<Text style={{ fontSize: 12, width: "100%" }}>Наименование:</Text>
					</ListItem>
					<Item style={{ paddingLeft: 10, paddingBottom: 10 }}>
						<Input placeholder="Введите имя" onChangeText={(value) => this.setState({ nameService: value })} value={this.state.nameService + (this.props.services.lastid + 1)} style={{ fontSize: 12 }} />
					</Item>
					<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
						<Button transparent style={styles.modalMain} onPress={() => this.modals.basicModal.close()}>
							<Text style={{ fontSize: 15, textAlign: "center", color: "black" }}>Отмена</Text>
						</Button>
						<Button transparent style={styles.modalMain} onPress={() => { this.props.createService(this.state.nameService + (this.props.services.lastid + 1)); this.modals.basicModal.close(); }}>
							<Text style={{ fontSize: 15, textAlign: "center", color: "black" }}>Применить</Text>
						</Button>
					</View>
				</Modal>
			</Container>
		);
	}
}