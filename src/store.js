import { configureStore, createSlice } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import usersSaga from './sagas/userSaga';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload,
    addUser: (state, action) => { state.push(action.payload); },
    updateUser: (state, action) => {
      const idx = state.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteUser: (state, action) => state.filter(u => u.id !== action.payload)
  }
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;

// --- SAGA MIDDLEWARE SETUP ---
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    users: usersSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(usersSaga);

export default store;