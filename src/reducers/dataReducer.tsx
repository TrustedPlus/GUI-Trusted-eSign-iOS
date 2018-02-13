import { FOOTER_ACTION } from "../constants";

const initialState = {
  arrButton: []
};

export default function dataReducer (state = initialState, action) {
  switch (action.type) {
    case FOOTER_ACTION:
        function arrButtonFunc() {
          let index = state.arrButton.indexOf(action.payload);
          if (index !== -1) {
            let arr = state.arrButton.splice(index, 1);
            console.log(arr);
            return(arr);
          } else {
            let arr = state.arrButton.unshift(action.payload);
            console.log(arr);
            return(arr);
          }
        }
        let arrButtonReturn = arrButtonFunc();
      return {
        ...state
      };
    default:
      return state;
  }
}