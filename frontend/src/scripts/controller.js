/**
 * Redux Demo Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

import siftJSON from '../../../sift.json';

// read export buckets from sift.json:
let buckets = siftJSON.dag.outputs && siftJSON.dag.outputs.exports ? Object.keys(siftJSON.dag.outputs.exports) : [];

// add system buckets:
buckets = [
  ...buckets,
  '_user.default',
  '_redsift',
];

console.log('sift-redux-demo: buckets:', buckets);

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this._onStorageUpdate = this._onStorageUpdate.bind(this);
  }

  loadView(state) {
    console.log('sift-redux-demo: loadView', state);

    // TODO: replace test code below with this line after adding exports to backend!
    // this.storage.subscribe(buckets, this._onStorageUpdate);

    // TEST: simulate storageUpdate events:
    setInterval(() => {
      const randomId = Math.floor(Math.random() * buckets.length);

      this.publish('onStorageUpdate', {
        bucket: buckets[randomId],
        data: new Date(),
      });
    }, 2000);

    switch (state.type) {
      case 'summary':
        return {
          html: 'summary.html',
          data: this._getInitialData({ buckets }),
        };
      default:
        console.error('sift-redux-demo: unknown Sift type: ', state.type);
    }
  }

  async _onStorageUpdate(bucket) {
    console.log('sift-redux-demo: onStorageUpdate: ', value);

    const storage = await this._getAllBuckets();

    this.publish('onStorageUpdate', storage);
  }

  async _getInitialData({ buckets }) {
    return this._getAllBuckets({ buckets });
  }

  async _getAllBuckets({ buckets }) {
    const result = {};

    for (let idx = 0; idx < buckets.length; idx++) {
      const bucket = buckets[idx];

      try {
        result[bucket] = await this._getBucket({ bucket });
      } catch(err) {
        console.log(`[SiftController::_getAllBuckets] ERROR reading bucket, it may not exist in the IndexedDB | bucket: ${bucket} | error:`, err);
        console.log('[SiftController::_getAllBuckets] We continue with the next bucket...');
      }
    }

    return result;
  }

  _getBucket({ bucket }) {
    return this.storage.getAll({
      bucket,
    }).then((values) => {
      console.log(`sift-redux-demo: getBucket() | bucket: ${bucket} | values:`, values);
      return values;
    });
  }

}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
