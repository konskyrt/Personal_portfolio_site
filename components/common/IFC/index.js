import React, { useEffect } from 'react'
import { Fade } from 'react-reveal';
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshLambertMaterial,
  Raycaster,
  Vector2
} from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

const IFC = () => {
  const scene = new Scene();

  useEffect(() => {

    const init = async () => {
      const IFCLoader = (await import('web-ifc-three/IFCLoader'))

      //Object to store the size of the viewport
      const size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      //Creates the camera (point of view of the user)
      const aspect = size.width / size.height;
      const camera = new PerspectiveCamera(75, aspect);
      camera.position.z = 15;
      camera.position.y = 13;
      camera.position.x = 8;

      //Creates the lights of the scene
      const lightColor = 0xffffff;

      const ambientLight = new AmbientLight(lightColor, 0.5);
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(lightColor, 1);
      directionalLight.position.set(0, 10, 0);
      directionalLight.target.position.set(-5, 0, 0);
      scene.add(directionalLight);
      scene.add(directionalLight.target);

      //Sets up the renderer, fetching the canvas of the HTML
      const threeCanvas = document.getElementById("three-canvas");
      const renderer = new WebGLRenderer({
        canvas: threeCanvas,
        alpha: true
      });

      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      //Creates grids and axes in the scene
      const grid = new GridHelper(50, 30);
      scene.add(grid);

      const axes = new AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = 1;
      scene.add(axes);

      //Creates the orbit controls (to navigate the scene)
      const controls = new OrbitControls(camera, threeCanvas);
      controls.enableDamping = true;
      controls.target.set(-2, 0, 0);

      //Animation loop
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      //Adjust the viewport to the size of the browser
      window.addEventListener("resize", () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
      });

      // Sets up the IFC loading
      const ifcModels = [];
      const ifcLoader = new IFCLoader.IFCLoader();
      await ifcLoader.ifcManager.setWasmPath("../../../../");
      ifcLoader.load("/ifcs/one.ifc", (ifcModel) => {
        scene.add(ifcModel)
        ifcModels.push(ifcModel);
      });

      // === Picking ====
      const raycaster = new Raycaster();
      raycaster.firstHitOnly = true;
      const mouse = new Vector2();

      const cast = (event) => {
        // Computes the position of the mouse on the screen
        const bounds = threeCanvas.getBoundingClientRect();

        const x1 = event.clientX - bounds.left;
        const x2 = bounds.right - bounds.left;
        mouse.x = (x1 / x2) * 2 - 1;

        const y1 = event.clientY - bounds.top;
        const y2 = bounds.bottom - bounds.top;
        mouse.y = -(y1 / y2) * 2 + 1;

        // Places it on the camera pointing to the mouse
        raycaster.setFromCamera(mouse, camera);

        // Casts a ray
        return raycaster.intersectObjects(ifcModels);
      }

      const pick = (event) => {
        const found = cast(event)[0];
        if (found) {
          const index = found.faceIndex;
          const geometry = found.object.geometry;
          const ifc = ifcLoader.ifcManager;
          const id = ifc.getExpressId(geometry, index);
        }
      }

      threeCanvas.ondblclick = pick;

      // ==== Highlight ==== 
      const preselectMat = new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0xff88ff,
        depthTest: false
      })
      const ifc = ifcLoader.ifcManager;
      // Sets up optimized picking
      ifc.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);

      // Reference to the previous selection
      let preselectModel = { id: - 1 };

      const highlight = (event, material, model) => {
        const found = cast(event)[0];

        if (found) {
          // Gets model ID
          model.id = found.object.modelID;

          // Gets Express ID
          const index = found.faceIndex;
          const geometry = found.object.geometry;
          const id = ifc.getExpressId(geometry, index);

          const subsetConfig = {
            modelID: 0,
            ids: [id],
            material: material,
            scene: scene,
            removePrevious: true,
            applyBVH: true
          }

          // Creates subset
          ifc.createSubset(subsetConfig)
        } else {
          // Removes previous highlight
          ifc.removeSubset(model.id, material);
        }
      }

      window.onmousemove = (event) => highlight(
        event,
        preselectMat,
        preselectModel);
    }
    init()
  }, [])

  return (
    <Fade>
      <div className='ifc-component-container'>
        <canvas id="three-canvas"></canvas>
      </div>
    </Fade>
  )
}

export default IFC;