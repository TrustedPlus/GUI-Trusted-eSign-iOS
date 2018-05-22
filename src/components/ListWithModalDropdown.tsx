import * as React from "react";
import { List } from "native-base";
import { Dropdown } from "react-native-material-dropdown";

interface ListWithModalDropdownProps {
   text: string;
   defaultValue: string;
   changeValue: any;
   options: any;
}

export class ListWithModalDropdown extends React.Component<ListWithModalDropdownProps> {

   render() {
      return (
         <List>
            <Dropdown
               onChangeText={this.props.changeValue}
               value={this.props.defaultValue}
               label={this.props.text}
               data={this.props.options} />
         </List>
      );
   }
}