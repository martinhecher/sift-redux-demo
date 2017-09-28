/**
 * Redux Demo Sift. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';
import { createStore } from 'redux';

const demoApp = (state = {}, action) => {
  switch (action.type) {
    case 'STORAGE_UPDATE': {
      const storage = action.payload;

      return {
        ...state,
        ...storage,
      };
    }
    default:
      return state;
  }
}

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this._store = null;
  }

  presentView(value) {
    console.log('[SiftView::presentView] value:', value);

    if (!this._store) {
      const initialState = value.data;

      this._store = this._createStore(demoApp, initialState);

      this._store.subscribe(() => {
        this._updateUI({
          data: this._store.getState(),
        });
      });
    }

    this._updateUI({
      data: this._store.getState(),
    });
  };

  willPresentView(value) {
    this._updateUI({
      data: this._store.getState(),
    });
  };

  _createStore(reducer, initialState) {
    const store = createStore(reducer, initialState);

    this.controller.subscribe('onStorageUpdate', (storage) => {
      console.log('VIEW: storage', storage);

      store.dispatch({
        type: 'STORAGE_UPDATE',
        payload: storage,
      });
    });

    return store;
  }

  _updateUI({ data }) {
    document.getElementById('text').innerText = JSON.stringify(data, null, 4);
  }
}

registerSiftView(new MyView(window));
