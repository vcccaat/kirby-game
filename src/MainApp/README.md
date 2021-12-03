# AniGraph Demo Template

If you run the starter code right off, you will see this dragon game, where you control a dragon and there are light balls that will chase you if you get too close, until you click to spin, at which point they will run away...

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

Here you will find the implementation of custom nodes for the dragon, the enemies (which inherit from point light source models), and a third custom model that is textured with a custom shader.

## [./PlayerControls](./PlayerControls):

In this folder you will find example code for several different types of camera controls. 

To make new controls accessible and add them to this list, add them in the following function in [./SceneControllers/GameSceneController.ts](./SceneControllers/GameSceneController.ts)

```typescript
    initCameraControls(){
        this.addControlType(ExampleFlyingCameraControls)
        this.addControlType(ExampleDragOrbitControls)
        this.addControlType(RotateSelectedObject)
        this.addControlType(ExampleThirdPersonControls)
        this.addControlType(DragonGameControls);
        this.setCurrentInteractionMode(DragonGameControls);
    }
```

- DragonGameControls: Filtered camera view follows the dragon around. You move the dragon with the mouse. Scroll to zoom. Click to spin. This uses a Pointer Lock, meaning you will have to press escape to regain control of your pointer.
- ExampleDragOrbit: More classic drag orbit controls.
- ExampleFlyingPlayerControls: Fly around, mouse controls viewing angle, wasd controls movement.
- RotateSelectedObject: Click and drag to rotate the selected object.

If you are trying to compose a scene, consider having a key in one of the keyboard response callbacks print out whatever value you are trying to optimize to the console. For example, pressing Shift+P in ExampleDragOrbitControls will print out the current camera pose for reference:
```typescript
if(interaction.keysDownState['P']){
    console.log(this.camera.pose);
}
```

## [./Materials](./Materials):

AMaterialModel's specify types of materials. AMaterial's are instances that can take on modified values (i.e., AMaterialModel's are the factory in a factory class pattern, for those of you who may be familiar).

The example [TexturedMaterialModel.ts](./Materials/TexturedMaterialModel.ts) is a good starting point for anyone looking to make custom materials and use custom shaders. It uses the custom shader defined in [public/shaders/textured](../../public/shaders/textured).

If you want to create new custom material models, you will want to load them into the app by adding them in `MainAppState.PrepAssets()`:
```typescript
async PrepAssets(){
    let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
    this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
    let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
    this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
}
```

Note that you can specify different versions of the same model that differ only by texture, as shown above. You can also use the leva GUI to change the texture if you add controls for it to the MaterialModel's GUI specs. The relevant controls in the example are:
```typescript
...AShaderModelBase.ShaderTextureGUIUpload(material, 'maintexture'),
...AShaderModelBase.ShaderTextureGUIUpload(material, 'normalTexture'),
```
note that when you use `setTexture(name, t)`, the corresponding texture will be named according to `TextureKeyForName(name)` in the body of your actually shader. By default this takes a string like 'xxx' and assigns it to 'xxxMap'. I added this to help avoid naming conflicts with other parameters of the shader.




## [./SceneControllers](./SceneControllers):

If you create new custom nodes, you should specify what controllers and views each of the scene controllers should use for the node model. Mostly this specification is done in [./SceneControllers/SceneControllerSpecs.ts](./SceneControllers/SceneControllerSpecs.ts), so you can look there for exactly how this is done.







