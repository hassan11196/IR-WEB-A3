import { UPDATE_DOCS, CLEAR_DOCS, GET_DOCS } from '../actions/docPostingList';

const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_DOCS:
      return { ...state, ...payload };

    case GET_DOCS:
      return { ...state, ...payload };

    case CLEAR_DOCS:
      return {};

    default:
      return state;
  }
};
