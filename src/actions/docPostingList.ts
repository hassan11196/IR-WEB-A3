import { GetState, Dispatch } from '../reducers/types';

export const UPDATE_DOCS = 'UPDATE_DOCS';
export const CLEAR_DOCS = 'CLEAR_DOCS';
export const GET_DOCS = 'GET_DOCS';

export function updateDocs(payload:any) {
  return {
    type: UPDATE_DOCS,
    payload
  };
}

export function clearDocs() {
  return {
    type: CLEAR_DOCS
  };
}

export function getPostingList() {
  return {
    type: CLEAR_DOCS,
    
  };
}

// export function incrementIfOdd() {
//   return (dispatch: Dispatch, getState: GetState) => {
//     const { counter } = getState();

//     if (counter % 2 === 0) {
//       return;
//     }

//     dispatch(increment());
//   };
// }

// export function incrementAsync(delay = 1000) {
//   return (dispatch: Dispatch) => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
