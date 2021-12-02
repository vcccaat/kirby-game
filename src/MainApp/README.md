# AniGraph Demo Template

What's in the starter code?

If you run it off the bat you will see this dragon game, where you control a dragon and there are light balls that will chase you if you get too close, until you click to spin, at which point they will run away...

![](../../docs/images/DragonGamePreview.gif)

There is a lot of example code with comments for you to use as reference. Here are some highlights...


## [./MainAppState.ts](./MainAppState.ts):
You can think of the `MainAppState` class as a container for all of your app's global state. You can access this state with the `GetAppState() function from any of the files you will be customizing.

- `appState.gameSceneController`: the 3D scene controller on the right side of the screen
- `appState.sceneModel`: the scene model. See the example Dragon game for how to query the scene for all nodes fitting specific criteria (e.g., [all of the lights](https://www.youtube.com/watch?v=HAfFfqiYLp0), or [all the small things](https://www.youtube.com/watch?v=9Ht5RZpzPqw)...)
- `appState.selectedModel`: currently selected model

## Setting up your scene 

### `initSceneModel()`
Use this function to set up the initial scene. A few different examples are provided with comments explaining what they do.

## Making things go...
### `onAnimationFrameCallback()`
This will be called every time a frame is rendered. You can think of it as a heartbeat for the game logic. If you want to implement things sequentially and not worry about asynchronous logic, you can try to do most of the work here.



## [./Nodes](./Nodes):

## [./PlayerControls](./PlayerControls):

## [./Materials](./Materials):

## [./SceneControllers](./SceneControllers):







