/**
 * Redux Demo Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    this.onStorageUpdate = this.onStorageUpdate.bind(this);
  }

  loadView(state) {
    console.log('sift-redux-demo: loadView', state);
    // Register for storage update events on the "x" bucket so we can update the UI
    
    const buckets = [
      'bucket1',
      'bucket2',
      'bucket3',
      'bucket4',
    ];

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
          data: await getAllBuckets({ buckets }),
        };
      default:
        console.error('sift-redux-demo: unknown Sift type: ', state.type);
    }
  }

  onStorageUpdate(bucket) {
    console.log('sift-redux-demo: onStorageUpdate: ', value);
    return this.getBucket({ bucket }).then(xe => {
      // Publish events from 'x' to view
      this.publish('counts', xe);
    });
  }

  async getAllBuckets({ buckets }) {
    const result = {};

    for (let idx = 0; idx < buckets.length; idx++) {
      const bucket = buckets[idx];

      result[bucket] = await getBucket({ bucket });
    }

    return result;
  }

  getBucket({ bucket }) {
    return this.storage.getAll({
      bucket,
    }).then((values) => {
      console.log('sift-redux-demo: getBucket returned:', values);
      return values;
    });
  }

}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
