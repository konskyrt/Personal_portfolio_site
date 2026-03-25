import React, { useEffect, useRef, useState } from 'react'
import { Button, Slider, Tooltip, Descriptions, Space, Spin, Switch } from 'antd'
import Fade from 'react-reveal/Fade'
import {
  AmbientLight, DirectionalLight, HemisphereLight,
  GridHelper, AxesHelper,
  PerspectiveCamera, Scene, WebGLRenderer,
  Raycaster, Vector2, Vector3, Plane,
  MeshLambertMaterial, Box3, Color
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh'

const VIEWER_HEIGHT = 620

const IFCViewer = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef({})
  const loadModelFnRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [selectedProps, setSelectedProps] = useState(null)
  const [viewMode, setViewMode] = useState('normal')
  const [clippingEnabled, setClippingEnabled] = useState(false)
  const [clipValues, setClipValues] = useState({ x: 100, y: 100, z: 100 })
  const [gameMode, setGameMode] = useState(false)
  const [activeModel, setActiveModel] = useState('/ifcs/three.ifc')

  useEffect(() => {
    let disposed = false
    let animFrame = null

    const init = async () => {
      const { IFCLoader } = await import('web-ifc-three/IFCLoader')
      const { PointerLockControls } = await import(
        'three/examples/jsm/controls/PointerLockControls'
      )

      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container || disposed) return

      const width = container.clientWidth
      const height = VIEWER_HEIGHT

      const scene = new Scene()
      scene.background = new Color(0xf5f5f5)

      const camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
      camera.position.set(15, 20, 15)

      const renderer = new WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.localClippingEnabled = true

      scene.add(new HemisphereLight(0xffffff, 0x8d8d8d, 0.6))
      scene.add(new AmbientLight(0xffffff, 0.4))
      const dirLight = new DirectionalLight(0xffffff, 0.8)
      dirLight.position.set(20, 30, 20)
      scene.add(dirLight)

      const grid = new GridHelper(50, 30, 0xcccccc, 0xe0e0e0)
      scene.add(grid)
      const axes = new AxesHelper(3)
      axes.material.depthTest = false
      axes.renderOrder = 1
      scene.add(axes)

      const orbitControls = new OrbitControls(camera, canvas)
      orbitControls.enableDamping = true
      orbitControls.dampingFactor = 0.05
      orbitControls.target.set(0, 5, 0)

      const pointerControls = new PointerLockControls(camera, canvas)
      const gameMoveState = { forward: false, backward: false, left: false, right: false }
      const gameVelocity = new Vector3()
      let isGameMode = false

      pointerControls.addEventListener('lock', () => {
        isGameMode = true
        setGameMode(true)
        orbitControls.enabled = false
      })
      pointerControls.addEventListener('unlock', () => {
        isGameMode = false
        setGameMode(false)
        orbitControls.enabled = true
      })

      const ifcLoader = new IFCLoader()
      await ifcLoader.ifcManager.setWasmPath('../../../../')
      ifcLoader.ifcManager.setupThreeMeshBVH(
        computeBoundsTree,
        disposeBoundsTree,
        acceleratedRaycast
      )

      const raycaster = new Raycaster()
      raycaster.firstHitOnly = true
      const mouse = new Vector2()

      const preselectMat = new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0x5c8aff,
        depthTest: false,
      })
      const selectMat = new MeshLambertMaterial({
        transparent: true,
        opacity: 0.7,
        color: 0xff6b35,
        depthTest: false,
      })

      let ifcModels = []
      let modelBounds = null

      const cast = (event) => {
        const bounds = canvas.getBoundingClientRect()
        mouse.x =
          ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1
        mouse.y =
          -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        return raycaster.intersectObjects(ifcModels)
      }

      canvas.onmousemove = (event) => {
        if (isGameMode) return
        const found = cast(event)[0]
        if (found) {
          const id = ifcLoader.ifcManager.getExpressId(
            found.object.geometry,
            found.faceIndex
          )
          ifcLoader.ifcManager.createSubset({
            modelID: 0,
            ids: [id],
            material: preselectMat,
            scene,
            removePrevious: true,
          })
        } else {
          ifcLoader.ifcManager.removeSubset(0, preselectMat)
        }
      }

      canvas.onclick = async (event) => {
        if (isGameMode) return
        const found = cast(event)[0]
        if (found) {
          const id = ifcLoader.ifcManager.getExpressId(
            found.object.geometry,
            found.faceIndex
          )
          ifcLoader.ifcManager.createSubset({
            modelID: 0,
            ids: [id],
            material: selectMat,
            scene,
            removePrevious: true,
            customID: 'selection',
          })
          try {
            const props = await ifcLoader.ifcManager.getItemProperties(0, id)
            let psets = []
            try {
              psets = await ifcLoader.ifcManager.getPropertySets(0, id, true)
            } catch (_) {}
            setSelectedProps({
              id,
              name: props?.Name?.value || 'Unnamed',
              objectType: props?.ObjectType?.value || 'N/A',
              globalId: props?.GlobalId?.value || '',
              tag: props?.Tag?.value || '',
              description: props?.Description?.value || '',
              psets: Array.isArray(psets)
                ? psets.map((ps) => ({
                    name: ps?.Name?.value || 'PropertySet',
                    properties: Array.isArray(ps?.HasProperties)
                      ? ps.HasProperties.filter((p) => p?.Name?.value).map(
                          (p) => ({
                            name: p.Name.value,
                            value:
                              p.NominalValue?.value ??
                              p.NominalValue ??
                              '',
                          })
                        )
                      : [],
                  }))
                : [],
            })
          } catch (_) {
            setSelectedProps({ id, name: 'Element #' + id })
          }
        } else {
          ifcLoader.ifcManager.removeSubset(0, selectMat, 'selection')
          setSelectedProps(null)
        }
      }

      const loadModel = (path) => {
        ifcModels.forEach((m) => scene.remove(m))
        ifcModels = []
        setLoading(true)
        setSelectedProps(null)
        ifcLoader.load(path, (model) => {
          if (disposed) return
          scene.add(model)
          ifcModels = [model]
          const box = new Box3().setFromObject(model)
          modelBounds = box
          const center = box.getCenter(new Vector3())
          const size = box.getSize(new Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          camera.position.set(
            center.x + maxDim,
            center.y + maxDim * 0.7,
            center.z + maxDim
          )
          orbitControls.target.copy(center)
          orbitControls.update()
          engineRef.current.ifcModels = ifcModels
          engineRef.current.modelBounds = modelBounds
          setLoading(false)
        })
      }

      loadModelFnRef.current = loadModel
      loadModel('/ifcs/three.ifc')

      engineRef.current = {
        scene,
        camera,
        renderer,
        orbitControls,
        pointerControls,
        ifcLoader,
        ifcModels,
        modelBounds,
        selectMat,
      }

      const onKeyDown = (e) => {
        if (!isGameMode) return
        switch (e.code) {
          case 'KeyW': case 'ArrowUp': gameMoveState.forward = true; break
          case 'KeyS': case 'ArrowDown': gameMoveState.backward = true; break
          case 'KeyA': case 'ArrowLeft': gameMoveState.left = true; break
          case 'KeyD': case 'ArrowRight': gameMoveState.right = true; break
        }
      }
      const onKeyUp = (e) => {
        switch (e.code) {
          case 'KeyW': case 'ArrowUp': gameMoveState.forward = false; break
          case 'KeyS': case 'ArrowDown': gameMoveState.backward = false; break
          case 'KeyA': case 'ArrowLeft': gameMoveState.left = false; break
          case 'KeyD': case 'ArrowRight': gameMoveState.right = false; break
        }
      }
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('keyup', onKeyUp)

      let prevTime = performance.now()
      const direction = new Vector3()

      const animate = () => {
        animFrame = requestAnimationFrame(animate)
        const now = performance.now()
        const delta = (now - prevTime) / 1000

        if (isGameMode && pointerControls.isLocked) {
          gameVelocity.x -= gameVelocity.x * 10.0 * delta
          gameVelocity.z -= gameVelocity.z * 10.0 * delta
          direction.z =
            Number(gameMoveState.forward) - Number(gameMoveState.backward)
          direction.x =
            Number(gameMoveState.right) - Number(gameMoveState.left)
          direction.normalize()
          if (gameMoveState.forward || gameMoveState.backward)
            gameVelocity.z -= direction.z * 50 * delta
          if (gameMoveState.left || gameMoveState.right)
            gameVelocity.x -= direction.x * 50 * delta
          pointerControls.moveRight(-gameVelocity.x * delta)
          pointerControls.moveForward(-gameVelocity.z * delta)
        } else {
          orbitControls.update()
        }
        renderer.render(scene, camera)
        prevTime = now
      }
      animate()

      const onResize = () => {
        const w = container.clientWidth
        camera.aspect = w / VIEWER_HEIGHT
        camera.updateProjectionMatrix()
        renderer.setSize(w, VIEWER_HEIGHT)
      }
      window.addEventListener('resize', onResize)

      return () => {
        disposed = true
        window.removeEventListener('resize', onResize)
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)
        if (animFrame) cancelAnimationFrame(animFrame)
        renderer.dispose()
        orbitControls.dispose()
      }
    }

    const cleanup = init()
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((fn) => fn && fn())
      }
    }
  }, [])

  useEffect(() => {
    if (loadModelFnRef.current) {
      loadModelFnRef.current(activeModel)
    }
  }, [activeModel])

  useEffect(() => {
    const { renderer, modelBounds } = engineRef.current
    if (!renderer || !modelBounds) return
    if (clippingEnabled) {
      const size = modelBounds.getSize(new Vector3())
      const center = modelBounds.getCenter(new Vector3())
      renderer.clippingPlanes = [
        new Plane(new Vector3(-1, 0, 0), center.x + size.x * (clipValues.x / 100)),
        new Plane(new Vector3(0, -1, 0), center.y + size.y * (clipValues.y / 100)),
        new Plane(new Vector3(0, 0, -1), center.z + size.z * (clipValues.z / 100)),
      ]
    } else {
      renderer.clippingPlanes = []
    }
  }, [clippingEnabled, clipValues])

  useEffect(() => {
    const models = engineRef.current.ifcModels
    if (!models || !models.length) return
    models.forEach((model) => {
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          if (viewMode === 'wireframe') {
            child.material.wireframe = true
            child.material.opacity = 1
            child.material.transparent = false
          } else if (viewMode === 'xray') {
            child.material.wireframe = false
            child.material.opacity = 0.15
            child.material.transparent = true
          } else {
            child.material.wireframe = false
            child.material.opacity = 1
            child.material.transparent = false
          }
        }
      })
    })
  }, [viewMode, loading])

  const setCameraPreset = (preset) => {
    const { camera, orbitControls, modelBounds } = engineRef.current
    if (!camera || !orbitControls || !modelBounds) return
    const center = modelBounds.getCenter(new Vector3())
    const size = modelBounds.getSize(new Vector3())
    const d = Math.max(size.x, size.y, size.z) * 1.5
    switch (preset) {
      case 'top':
        camera.position.set(center.x, center.y + d, center.z + 0.01)
        break
      case 'front':
        camera.position.set(center.x, center.y, center.z + d)
        break
      case 'right':
        camera.position.set(center.x + d, center.y, center.z)
        break
      case 'iso':
        camera.position.set(
          center.x + d * 0.6,
          center.y + d * 0.5,
          center.z + d * 0.6
        )
        break
    }
    orbitControls.target.copy(center)
    orbitControls.update()
  }

  const enterGameMode = () => {
    engineRef.current.pointerControls?.lock()
  }

  return (
    <Fade>
      <div className='ifc-viewer-section'>
        <h1>Interactive BIM Viewer</h1>
        <p className='viewer-subtitle'>
          Explore a 3D building model with professional tools — select objects to
          inspect properties, clip sections, switch rendering modes, or walk
          through the building in first person.
        </p>

        <div className='viewer-toolbar'>
          <Space wrap size='small'>
            <Button.Group size='small'>
              <Tooltip title='Top View'>
                <Button onClick={() => setCameraPreset('top')}>Top</Button>
              </Tooltip>
              <Tooltip title='Front View'>
                <Button onClick={() => setCameraPreset('front')}>Front</Button>
              </Tooltip>
              <Tooltip title='Right View'>
                <Button onClick={() => setCameraPreset('right')}>Right</Button>
              </Tooltip>
              <Tooltip title='Isometric View'>
                <Button onClick={() => setCameraPreset('iso')}>Iso</Button>
              </Tooltip>
            </Button.Group>

            <Button.Group size='small'>
              <Button
                type={viewMode === 'normal' ? 'primary' : 'default'}
                onClick={() => setViewMode('normal')}
              >
                Solid
              </Button>
              <Button
                type={viewMode === 'wireframe' ? 'primary' : 'default'}
                onClick={() => setViewMode('wireframe')}
              >
                Wireframe
              </Button>
              <Button
                type={viewMode === 'xray' ? 'primary' : 'default'}
                onClick={() => setViewMode('xray')}
              >
                X-Ray
              </Button>
            </Button.Group>

            <Tooltip title='Clip the model with X / Y / Z planes'>
              <Button
                size='small'
                type={clippingEnabled ? 'primary' : 'default'}
                onClick={() => setClippingEnabled(!clippingEnabled)}
              >
                Clipping
              </Button>
            </Tooltip>

            <Tooltip title='Walk through the building — WASD to move, mouse to look, ESC to exit'>
              <Button
                size='small'
                type={gameMode ? 'primary' : 'default'}
                onClick={enterGameMode}
                danger={gameMode}
              >
                Walk Through
              </Button>
            </Tooltip>

            <Button.Group size='small'>
              <Button
                type={activeModel === '/ifcs/one.ifc' ? 'primary' : 'default'}
                onClick={() => setActiveModel('/ifcs/one.ifc')}
              >
                Model 1
              </Button>
              <Button
                type={activeModel === '/ifcs/two.ifc' ? 'primary' : 'default'}
                onClick={() => setActiveModel('/ifcs/two.ifc')}
              >
                Model 2
              </Button>
              <Button
                type={activeModel === '/ifcs/three.ifc' ? 'primary' : 'default'}
                onClick={() => setActiveModel('/ifcs/three.ifc')}
              >
                Model 3
              </Button>
            </Button.Group>
          </Space>
        </div>

        <div className='viewer-wrapper' ref={containerRef}>
          {loading && (
            <div className='viewer-loading'>
              <Spin size='large' />
              <p>Loading BIM model…</p>
            </div>
          )}
          <canvas ref={canvasRef} />

          {gameMode && (
            <div className='game-overlay'>
              <div className='crosshair'>+</div>
              <div className='game-instructions'>
                WASD to move &middot; Mouse to look &middot; ESC to exit
              </div>
            </div>
          )}

          {selectedProps && !gameMode && (
            <div className='properties-panel'>
              <div className='panel-header'>
                <h4>Element Properties</h4>
                <Button
                  size='small'
                  type='text'
                  onClick={() => {
                    setSelectedProps(null)
                    try {
                      engineRef.current.ifcLoader?.ifcManager.removeSubset(
                        0,
                        engineRef.current.selectMat,
                        'selection'
                      )
                    } catch (_) {}
                  }}
                >
                  ✕
                </Button>
              </div>
              <Descriptions column={1} size='small' bordered>
                <Descriptions.Item label='Express ID'>
                  {selectedProps.id}
                </Descriptions.Item>
                <Descriptions.Item label='Name'>
                  {selectedProps.name}
                </Descriptions.Item>
                {selectedProps.objectType && selectedProps.objectType !== 'N/A' && (
                  <Descriptions.Item label='Object Type'>
                    {selectedProps.objectType}
                  </Descriptions.Item>
                )}
                {selectedProps.globalId && (
                  <Descriptions.Item label='Global ID'>
                    <span style={{ fontSize: 11, wordBreak: 'break-all' }}>
                      {selectedProps.globalId}
                    </span>
                  </Descriptions.Item>
                )}
                {selectedProps.tag && (
                  <Descriptions.Item label='Tag'>
                    {selectedProps.tag}
                  </Descriptions.Item>
                )}
                {selectedProps.description && (
                  <Descriptions.Item label='Description'>
                    {selectedProps.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
              {selectedProps.psets?.length > 0 && (
                <div className='psets-section'>
                  {selectedProps.psets.map((ps, i) => (
                    <div key={i} className='pset-group'>
                      <h5>{ps.name}</h5>
                      {ps.properties.map((p, j) => (
                        <div key={j} className='pset-row'>
                          <span className='pset-key'>{p.name}</span>
                          <span className='pset-val'>{String(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {clippingEnabled && (
          <div className='clipping-controls'>
            <div className='clip-slider'>
              <span className='clip-label'>X</span>
              <Slider
                value={clipValues.x}
                onChange={(v) =>
                  setClipValues((prev) => ({ ...prev, x: v }))
                }
              />
            </div>
            <div className='clip-slider'>
              <span className='clip-label'>Y</span>
              <Slider
                value={clipValues.y}
                onChange={(v) =>
                  setClipValues((prev) => ({ ...prev, y: v }))
                }
              />
            </div>
            <div className='clip-slider'>
              <span className='clip-label'>Z</span>
              <Slider
                value={clipValues.z}
                onChange={(v) =>
                  setClipValues((prev) => ({ ...prev, z: v }))
                }
              />
            </div>
          </div>
        )}

        <p className='viewer-hint'>
          Click any element to view its IFC properties. Hover to highlight. Double-click in
          clipping mode to place section planes.
        </p>
      </div>
    </Fade>
  )
}

export default IFCViewer
