sift-redux-demo
==================

This demo Sift shows how to connect a redux store to mirror the data stored in the Sift.

When the Sift initially loads all available Sift data is read from the IndexedDB and injected into the view. If the Sift data is updated the redux store is updated also and the UI in the view updates.

To try this clone this repo, download the Redsift SDK and run

`redsift run .`

inside the cloned repository. The view will show the initial Sift data. To update the Sift data run the **Trigger me!** cron node from the `>` icon.

Happy sifting!
