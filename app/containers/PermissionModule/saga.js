import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  DELETE_ITEM_BY_ID,
  GET_PERMISSION_BY_ID,
  QUERY_PERMISSION,
  SUBMIT_FORM,
  VALIDATE_FORM,
} from 'containers/PermissionModule/constants';
import ApiEndpoint from 'utils/api';
import AuthService from 'services/auth.service';
import deleteMessage from 'components/DeleteModal/messages';
import commonMessage from 'common/messages';
import request from 'utils/request';
import {
  assignPermissionAction,
  asyncEndAction,
  asyncStartAction,
  changeFieldAction,
  clearFormAction,
  enterValidationErrorAction,
  queryPermissionAction,
  submitFormAction,
} from 'containers/PermissionModule/actions';
import {
  makeDescriptionSelector,
  makeFormMethodSelector,
  makeKeywordsSelector,
  makeMethodNameSelector,
  makePageNumberSelector,
  makePathNameSelector,
  makeResourceNameSelector,
  makeUpdateIdSelector,
  makeLimitSelector,
} from 'containers/PermissionModule/selectors';
import { enqueueSnackbarAction } from 'containers/SnackBar/actions';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { checkError } from 'helpers/Validation';

export function* handleSubmitForm() {
  const resource = yield select(makeResourceNameSelector());
  const description = yield select(makeDescriptionSelector());
  const method = yield select(makeMethodNameSelector());
  const path = yield select(makePathNameSelector());
  const formMethod = yield select(makeFormMethodSelector());
  const id = yield select(makeUpdateIdSelector());
  const api = new ApiEndpoint();
  const auth = new AuthService();
  const token = auth.getToken();
  const requestURL = `${api.getBasePath()}/permissions${
    formMethod === 'put' ? `/${id}` : ''
  }`;
  const payload = api.makeApiPayload(formMethod.toUpperCase(), token, {
    resource,
    description,
    method,
    path,
  });
  try {
    const response = yield call(request, requestURL, payload);
    yield put(asyncEndAction());
    if (response && response.error) {
      return yield put(enterValidationErrorAction(response.error));
    }
    yield put(queryPermissionAction());
    yield put(changeFieldAction('formPage', false));
    yield put(clearFormAction());
    const message =
      formMethod === 'put'
        ? commonMessage.updateSuccess
        : commonMessage.addSuccess;
    return yield put(
      enqueueSnackbarAction({
        message: <FormattedMessage {...message} />,
        type: 'success',
        autoHide: true,
      }),
    );
  } catch (error) {
    yield put(asyncEndAction());
    return yield put(
      enqueueSnackbarAction({
        message: <FormattedMessage {...commonMessage.serverError} />,
        type: 'danger',
        autoHide: true,
      }),
    );
  }
}

export function* handleValidateForm() {
  yield put(asyncStartAction());
  const resource = yield select(makeResourceNameSelector());
  const description = yield select(makeDescriptionSelector());
  const method = yield select(makeMethodNameSelector());
  const path = yield select(makePathNameSelector());
  const model = {
    resource: {
      value: resource,
      validator: ['isString', 'isNotEmpty'],
    },
    description: {
      value: description,
      validator: ['isString', 'isNotEmpty'],
    },
    method: {
      value: method,
      validator: ['isString', 'isNotEmpty'],
    },
    path: {
      value: path,
      validator: ['isString', 'isNotEmpty'],
    },
  };
  const err = checkError(model);
  if (Object.keys(err).length > 0) {
    yield put(asyncEndAction());
    return yield put(enterValidationErrorAction(err));
  }
  return yield put(submitFormAction());
}

export function* handleDeleteItemById(data) {
  yield put(asyncStartAction());
  const api = new ApiEndpoint();
  const auth = new AuthService();
  const token = auth.getToken();
  const requestURL = `${api.getBasePath()}/permissions/${data.id}`;
  const payload = api.makeApiPayload('DELETE', token);
  try {
    yield call(request, requestURL, payload);
    yield put(queryPermissionAction());
    yield put(asyncEndAction());
    return yield put(
      enqueueSnackbarAction({
        message: <FormattedMessage {...deleteMessage.deleteSuccess} />,
        type: 'success',
        autoHide: true,
      }),
    );
  } catch (error) {
    yield put(asyncEndAction());
    return yield put(
      enqueueSnackbarAction({
        message: <FormattedMessage {...deleteMessage.deleteError} />,
        type: 'danger',
        autoHide: true,
      }),
    );
  }
}

export function* handleQueryPermission() {
  const api = new ApiEndpoint();
  const auth = new AuthService();
  const token = auth.getToken();
  const pageNumber = yield select(makePageNumberSelector());
  const keywords = yield select(makeKeywordsSelector());
  const limit = yield select(makeLimitSelector());
  const queryObj = {
    page: pageNumber > 0 ? pageNumber : 1,
    limit: limit > 0 ? limit : 10,
  };
  if (keywords && keywords.trim().length > 0) {
    queryObj.keywords = keywords;
  }
  const queryString = Object.keys(queryObj)
    .map((key) => `${key}=${queryObj[key]}`)
    .join('&');
  yield put(asyncStartAction());
  const requestURL = `${api.getBasePath()}/permissions?${queryString}`;
  const payload = api.makeApiPayload('GET', token);
  try {
    const response = yield call(request, requestURL, payload);
    return yield put(assignPermissionAction(response));
  } catch (error) {
    return yield put(asyncEndAction());
  }
}

export function* handleGetPermissionById() {
  yield put(asyncStartAction());
  const api = new ApiEndpoint();
  const auth = new AuthService();
  const token = auth.getToken();
  const id = yield select(makeUpdateIdSelector());
  const requestURL = `${api.getBasePath()}/permissions/${id}`;
  const payload = api.makeApiPayload('GET', token);
  try {
    const response = yield call(request, requestURL, payload);
    yield put(changeFieldAction('resource', response.resource));
    yield put(changeFieldAction('description', response.description));
    yield put(changeFieldAction('method', response.method));
    yield put(changeFieldAction('path', response.path));
    return yield put(asyncEndAction());
  } catch (error) {
    return yield put(asyncEndAction());
  }
}

export default function* permissionModuleSaga() {
  yield takeLatest(QUERY_PERMISSION, handleQueryPermission);
  yield takeLatest(GET_PERMISSION_BY_ID, handleGetPermissionById);
  yield takeLatest(SUBMIT_FORM, handleSubmitForm);
  yield takeLatest(VALIDATE_FORM, handleValidateForm);
  yield takeLatest(DELETE_ITEM_BY_ID, handleDeleteItemById);
}