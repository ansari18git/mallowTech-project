import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { setUsers, addUser, updateUser, deleteUser } from "../store";

// Fetch users
function* fetchUsersSaga() {
  try {
    const res = yield call(axios.get, "https://reqres.in/api/users?page=1&per_page=10");
    yield put(setUsers(res.data.data));
  } catch (e) {
    yield put(setUsers([]));
  }
}

// Add user
function* addUserSaga(action) {
  try {
    // Simulate API POST (reqres.in will not actually save, but returns what you send)
    const res = yield call(axios.post, "https://reqres.in/api/users", action.payload);
    // Use the returned user or fallback to payload with a random id
    yield put(addUser({ ...action.payload, id: res.data.id || Math.floor(Math.random() * 10000) }));
  } catch (e) {
    // fallback: just add locally
    yield put(addUser({ ...action.payload, id: Math.floor(Math.random() * 10000) }));
  }
}

// Edit user
function* updateUserSaga(action) {
  try {
    // Simulate API PUT (reqres.in will not actually update, but returns what you send)
    yield call(axios.put, `https://reqres.in/api/users/${action.payload.id}`, action.payload);
    yield put(updateUser(action.payload));
  } catch (e) {
    yield put(updateUser(action.payload));
  }
}

// Delete user
function* deleteUserSaga(action) {
  try {
    // Simulate API DELETE (reqres.in will not actually delete)
    yield call(axios.delete, `https://reqres.in/api/users/${action.payload}`);
    yield put(deleteUser(action.payload));
  } catch (e) {
    yield put(deleteUser(action.payload));
  }
}

function* usersSaga() {
  yield all([
    takeLatest("users/FETCH_USERS", fetchUsersSaga),
    takeLatest("users/ADD_USER_SAGA", addUserSaga),
    takeLatest("users/UPDATE_USER_SAGA", updateUserSaga),
    takeLatest("users/DELETE_USER_SAGA", deleteUserSaga),
  ]);
}

export default usersSaga;