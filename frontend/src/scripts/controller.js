/**
 * Redux Demo Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

// TODO: read this list from sift.json exports!
const buckets = [
  '_org',
  '_user.default',
  '_redsift',
];

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
        console.log(`[SiftController::_getAllBuckets] ERROR reading bucket, it may not exist in the IndexedDB | bucket: ${bucket}`);
        console.log('ERROR:', err);
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
