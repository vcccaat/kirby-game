
# Go to the [Project ReadMe](https://github.coecis.cornell.edu/CS4620-F2021/anigraph-finalproject/blob/main/src/MainApp/README.md) for details on the final project!


-------------
# AniGraph:

The main application for you to customize is defined by the files contained in [./src/MainApp](./src/MainApp).

[initial commit]

For now, try running the application and looking through some of the files in [./src/MainApp](./src/MainApp). We will have a tutorial in class on December 1 with new documentation. 

## What is AniGraph?
AniGraph is package designed for CS4620/CS5620 in an effort to modernize assignments for the course. The guiding principles of this effort were:
- To make it easy for students to explore creative uses of graphics
- To make it easy for students to share their creative exploration with others through a browser.

To this end, AniGraph is written in [TypeScript](https://www.typescriptlang.org/) and uses [three.js](https://threejs.org/) for rendering in a browser. AniGraph applications can be built as a static website that is easy to serve from a personal webpage.

At its core, AniGraph is a combination of a scene graph, a model-view-controller framework, and tools expressing interactions with various graphical elements.


To build and view the AniGraph Docs:
1. `yarn run genAndServeDocs` will generate all data needed to serve documentation locally + open the broswer and show you documentations there.
2. `yarn run serveDocs` will use local cache to serve documentations, which will be blazingly fast. (only run this after you have run yarn run genAndServeDocs before.)

You should run `yarn run genAndServeDocs` the first 

