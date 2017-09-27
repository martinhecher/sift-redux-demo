/**
 * Redux Demo Sift. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this.controller.subscribe('onStorageUpdate', (data) => {
      console.log('VIEW: data', data);

      this._updateUI({
        data,
      });
    })
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    this._updateUI({
      data: value ? value.data : null,
    });
  };

  willPresentView(value) {
    this._updateUI({
      data: value ? value.data : null,
    });
  };

  _updateUI({ data }) {
    document.getElementById('text').innerText = JSON.stringify(data, null, 4);
  }
}

registerSiftView(new MyView(window));
