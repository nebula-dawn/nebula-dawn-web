import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => 
{
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

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

})

window.addEventListener('mousemove', (event) => 
{
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxZoom = 3
controls.maxDistance = 1.2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(canvas)

// Interactable names
const stationNames = [
  'dt-stellar-orientation',
  'dt-hd-propulsion',
  'dt-life-support',
  'dt-oracle',
  'dt-stellar-shield-matrix',
  'dt-qf-calibrator',
  'dt-omni-core',
  'dt-door'
];


// Selection variable
let selectOffset = null
let selectBool = false
let initScale = new THREE.Vector3(0, 0, 0)
let initObject = null
let initTime = null

/**
 * Animate
 */
const timer = new Timer()
timer.connect(document)

const tick = (timestamp) =>
{
  timer.update(timestamp)

  const elapsedTime = timer.getElapsed()

  // When model is loaded
  if (model) {
    // Cast a ray
    raycaster.setFromCamera(mouse, camera)

    // Test Ray intersections, with the model and its children
    const intersects = raycaster.intersectObject(model, true)

    if (intersects.length > 0) {
      let currentObject = intersects[0].object
      let target = null

      while (currentObject) {
        if (stationNames.includes(currentObject.name)) {
          target = currentObject
          break
        }
        currentObject = currentObject.parent
      }

      
      // If the mouse is hovering a valid target
      if (target) {
        if (!initObject) {
          initTime = elapsedTime
          initObject = target
          initScale = target.scale.clone()
        }
        // console.log(`Hovered over: ${target.name}`)
        selectOffset = Math.sin((elapsedTime - initTime) * 4) * 0.005

        target.scale.x += selectOffset
        target.scale.y += selectOffset
        target.scale.z += selectOffset
        selectBool = true
        console.log(selectOffset)
      } 
      else {
        // If the mouse is not hovering a valid target, reset the scale of the previously hovered target
        if (selectBool && initScale.x) {
          // Reset the scale of the previously hovered target
          initObject.scale.copy(initScale)
          initObject = null
          initScale.set(0,0,0)
          selectBool = false
        }
      }
    }
  }


  // Update controls
  controls.update()

    // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()