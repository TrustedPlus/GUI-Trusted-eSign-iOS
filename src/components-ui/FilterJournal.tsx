import * as React from "react";
import {
	Container, Content, Text, Footer, FooterTab, Form, Item, Label, Input, Icon, Left, Right,
	ListItem, Button, Body, List
} from "native-base";
import { View, Image } from "react-native";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";
import DateTimePicker from "react-native-modal-datetime-picker";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeFilter } from "../actions/filterAction";

function mapStateToProps(state) {
	return {
		filter: state.filter
	};
}

function mapDispatchToProps(dispatch) {
	return {
		changeFilter: bindActionCreators(changeFilter, dispatch),
	};
}

interface TypesOfOperationsProps {
	title: string;
	icon?: boolean;
	changeSelected?(): void;
}

interface TypesOfOperationsState {
	click: boolean;
}

class TypesOfOperations extends React.Component<TypesOfOperationsProps, TypesOfOperationsState> {
	constructor(props) {
		super(props);

		this.state = {
			click: false
		};
	}

	render() {
		const { title, icon } = this.props;
		return (
			<ListItem icon last onPress={() => { this.props.changeSelected(); }}>
				<Body>
					<Text style={{ fontSize: 13 }}>{title}</Text>
				</Body>
				<Right>
					{icon ? <Icon style={{ color: "black" }} name="md-checkmark" /> : null}
				</Right>
			</ListItem>
		);
	}
}

interface FilterJournalProps {
	changeFilter?(filterSetting: object): void;
	filter: {
		SelectedFilters: ISelectedFilters,
		filename: string;
		data1: any;
		data2: any;
	};
	navigation: any;
	goBack: void;
}

interface ISelectedFilters {
	sign: boolean;
	addSign: boolean;
	enc: boolean;
	dec: boolean;
	createRequest: boolean;
	installCert: boolean;
	deleteCert: boolean;
	addFile: boolean;
	deleteFile: boolean;
}

interface FilterJournalState {
	SelectedFilters: ISelectedFilters;
	filename: string;
	isDateTimePickerVisible1: boolean;
	isDateTimePickerVisible2: boolean;
	data1: any;
	data2: any;
}

const options = {
	year: "numeric", month: "long", day: "numeric",
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FilterJournal extends React.Component<FilterJournalProps, FilterJournalState> {

	constructor(props) {
		super(props);
		this.state = {
			SelectedFilters: this.props.filter.SelectedFilters,
			filename: this.props.filter.filename,
			isDateTimePickerVisible1: false,
			isDateTimePickerVisible2: false,
			data1: this.props.filter.data1,
			data2: this.props.filter.data2 ? this.props.filter.data2 : new Date(new Date().setHours(23, 59, 59, 999))
		};
	}

	_showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });

	_hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });

	_handleDatePicked1 = (date) => {
		this.setState({ data1: new Date(date.getFullYear(), date.getMonth(), date.getDate()) });
		this._hideDateTimePicker1();
	}

	_showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });

	_hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });

	_handleDatePicked2 = (date) => {
		this.setState({ data2: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999) });
		this._hideDateTimePicker2();
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Настройка фильтра" goBack={() => goBack()} />
				<Form>
					<Item stackedLabel>
						<Label>Наименование файла:</Label>
						<Input placeholder={"Введите имя файла"} placeholderTextColor={"lightgrey"} value={this.state.filename} onChangeText={(filename) => this.setState({ filename })} />
					</Item>
				</Form>
				<View style={{ paddingLeft: 15, paddingTop: 15, height: 80 }}>
					<Text style={{ fontSize: 15, color: "grey" }}>Дата создания (изменения):</Text>
					<View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row", width: "75%", paddingTop: 15 }}>
						<Image style={{ width: 25, height: 25 }} source={require("../../imgs/ios/clock.png")} />
						<Text style={{ fontSize: 13 }} onPress={this._showDateTimePicker1}> {this.state.data1.toLocaleString("ru", options)}</Text>
						<Text style={{ fontSize: 13 }}>  -  </Text>
						<Image style={{ width: 25, height: 25 }} source={require("../../imgs/ios/clock.png")} />
						<Text style={{ fontSize: 13 }} onPress={this._showDateTimePicker2}> {this.state.data2.toLocaleString("ru", options)}</Text>
					</View>
				</View>
				<View style={{ paddingTop: 15 }}>
					<Text style={{ paddingLeft: 15, fontSize: 15, color: "grey" }}>Типы операций:</Text>
				</View>
				<Content>
					<List>
						<TypesOfOperations title={"Подпись"}
							icon={this.state.SelectedFilters.sign}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, sign: !this.state.SelectedFilters.sign } })} />
						<TypesOfOperations title={"Добавление подписи"}
							icon={this.state.SelectedFilters.addSign}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, addSign: !this.state.SelectedFilters.addSign } })} />
						<TypesOfOperations title={"Шифрование"}
							icon={this.state.SelectedFilters.enc}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, enc: !this.state.SelectedFilters.enc } })} />
						<TypesOfOperations title={"Расшифрование"}
							icon={this.state.SelectedFilters.dec}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, dec: !this.state.SelectedFilters.dec } })} />
						<TypesOfOperations title={"Запрос на сертификат"}
							icon={this.state.SelectedFilters.createRequest}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, createRequest: !this.state.SelectedFilters.createRequest } })} />
						<TypesOfOperations title={"Установка сертификата"}
							icon={this.state.SelectedFilters.installCert}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, installCert: !this.state.SelectedFilters.installCert } })} />
						<TypesOfOperations title={"Удаление сертификата"}
							icon={this.state.SelectedFilters.deleteCert}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, deleteCert: !this.state.SelectedFilters.deleteCert } })} />
						<TypesOfOperations title={"Добавление файла"}
							icon={this.state.SelectedFilters.addFile}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, addFile: !this.state.SelectedFilters.addFile } })} />
						<TypesOfOperations title={"Удаление файла"}
							icon={this.state.SelectedFilters.deleteFile}
							changeSelected={() => this.setState({ SelectedFilters: { ...this.state.SelectedFilters, deleteFile: !this.state.SelectedFilters.deleteFile } })} />
					</List>
				</Content>
				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible1}
					onConfirm={this._handleDatePicked1}
					onCancel={this._hideDateTimePicker1}
					cancelTextIOS="Отмена"
					confirmTextIOS="Подтвердить"
					date={new Date(2018, 0, 1)}
					maximumDate={this.state.data2} />
				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible2}
					onConfirm={this._handleDatePicked2}
					onCancel={this._hideDateTimePicker2}
					cancelTextIOS="Отмена"
					confirmTextIOS="Подтвердить"
					date={new Date()}
					minimumDate={this.state.data1} />
				<Footer>
					<FooterTab>
						<FooterButton title="Сбросить"
							img={require("../../imgs/ios/filter_clean.png")}
							nav={() => {
								this.props.changeFilter({
									filterEnabled: false,
									SelectedFilters: {
										sign: false,
										addSign: false,
										enc: false,
										dec: false,
										createRequest: false,
										installCert: false,
										deleteCert: false,
										addFile: false,
										deleteFile: false
									},
									data1: new Date(2018, 0, 1),
									data2: new Date(),
									filename: ""
								}); goBack();
							}} />
						<FooterButton
							title="Применить"
							img={require("../../imgs/ios/filter_apply.png")}
							nav={() => {
								this.props.changeFilter({
									filterEnabled: true,
									SelectedFilters: this.state.SelectedFilters,
									data1: this.state.data1,
									data2: this.state.data2,
									filename: this.state.filename
								});
								goBack();
							}} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}