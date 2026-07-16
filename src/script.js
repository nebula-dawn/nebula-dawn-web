import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { Timer } from 'three/src/core/Timer.js'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()

/**
 * Models
 */
let model = null

gltfLoader.load(
  './models/dt-low-poly.glb',
  (gltf) =>
  {
    model = gltf.scene
    model.position.y = - 1.2
    scene.add(model)
  }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Update effect composer
  // effectComposer.setSize(sizes.width, sizes.height)
  // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 0)
scene.add(camera)

// Controls
const controls = new FlyControls(camera, canvas)
controls.rollSpeed = 0
controls.autoForward = false
controls.dragToLook = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Post processing
 */
// const renderTarget = new THREE.WebGLRenderTarget(
//   800,
//   600,
//   {
//     // samples: renderer.getPixelRatio() === 1 ? 2 : 0
//   }
// )

// const effectComposer = new EffectComposer(renderer, renderTarget)
// effectComposer.setSize(sizes.width, sizes.height)
// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()
timer.connect(document)

const tick = (timestamp) =>
{
  timer.update(timestamp)

  const delta = timer.getDelta()

  // Update passes

  // Update controls
  controls.update(delta)

  // Render using the composer, NOT the renderer
  // composer.render();

    // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()