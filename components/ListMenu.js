import React, { Component } from 'react';
import { Container, Header, Content, Left, Right, Button, Icon, Body, Title,
    List, ListItem, Thumbnail} from 'native-base';
import {StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image} from 'react-native';
  
export default class ListMenu extends Component {
    
    onPress() {
        this.props.nav();
    }
    
    render() {
        return(
        <ListItem style={{marginLeft:0}} avatar onPress={this.onPress.bind(this)} >
            <Left>
                <Icon name='settings' style={{fontSize:30, width: 35, padding: 5}}/>  
            </Left>
            <Body>
                <Text style={{fontSize:20}}>{this.props.title}</Text>
                <Text note>выбрано файлов: 4</Text>
            </Body>
        </ListItem>
        )
    }
}