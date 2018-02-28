import { READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR } from "../constants";

const initialState = {
  id: [],
  title: [],
  extension: [],
  note: []
};

export function Files(state = initialState, action) {
  switch (action.type) {
    case READ_FILES:
      return {
        ...state
      };
    case READ_FILES_SUCCESS:
      let arrTitle = [], arrExtension = [], arrId = [], arrNote = [], arrPath = [];
      for (let i = 0; i < action.payload.length; i++) {
        if (action.payload[i].name !== "") {
          arrTitle.push(action.payload[i].name);
          arrExtension.push(action.payload[i].extension);
          arrId.push(i);
        arrNote.push(action.payload[i].mtime);
        }
      }
      return {
          ...state,
          title: arrTitle,
          extension: arrExtension,
          id: arrId,
          note: arrNote
        };
    case READ_FILES_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}