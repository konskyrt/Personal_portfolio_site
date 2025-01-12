import React, { useEffect } from 'react'
import { Fade } from 'react-reveal';
// import {
//   IFCBUILDINGELEMENTPROXY,
//   IFCSLAB,
//   IFCBEAM
// } from 'web-ifc';
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
      ifcLoader.load("/ifcs/three.ifc", (ifcModel) => {
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

      const pick = async (event) => {
        const found = cast(event)[0];
        if (found) {
          const index = found.faceIndex;
          const geometry = found.object.geometry;
          const id = ifcLoader.ifcManager.getExpressId(geometry, index);

          const props = await ifcLoader.ifcManager.getItemProperties(0, id);

          console.log("props ", props)

          if (props) {
            alert(`ID = ${id} | Name = ${props.Name.value}`)
          }

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
      // Sets up optimized picking
      ifcLoader.ifcManager.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);

      // Reference to the previous selection
      let preselectModel = { id: - 1 };

      const highlight = async (event, material, model) => {
        const found = cast(event)[0];

        if (found) {
          // Gets model ID
          model.id = found.object.modelID;

          // Gets Express ID
          const index = found.faceIndex;
          const geometry = found.object.geometry;
          const id = ifcLoader.ifcManager.getExpressId(geometry, index);

          const subsetConfig = {
            modelID: 0,
            ids: [id],
            material: material,
            scene: scene,
            removePrevious: true,
            applyBVH: true
          }

          // Creates subset
          ifcLoader.ifcManager.createSubset(subsetConfig)
        } else {
          // Removes previous highlight
          ifcLoader.ifcManager.removeSubset(model.id, material);
        }
      }

      window.onmousemove = (event) => highlight(
        event,
        preselectMat,
        preselectModel);

      // // List of categories names
      // const categories = {
      //   IFCBUILDINGELEMENTPROXY,
      //   IFCBEAM,
      //   IFCSLAB,
      // };

      // // Gets the name of a category
      // const getName = (category) => {
      //   const names = Object.keys(categories);
      //   return names.find(name => categories[name] === category);
      // }

      // // Gets the IDs of all the items of a specific category
      // const getAll = async (category) => {
      //   return ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
      // }

      // // Creates a new subset containing all elements of a category
      // const newSubsetOfType = async (category) => {
      //   const ids = await getAll(category);
      //   return ifcLoader.ifcManager.createSubset({
      //     modelID: 0,
      //     scene,
      //     ids,
      //     removePrevious: true,
      //     customID: category.toString()
      //   })
      // }

      // // Stores the created subsets
      // const subsets = {};

      // const setupAllCategories = async () => {
      //   const allCategories = Object.values(categories);
      //   for (let i = 0; i < allCategories.length; i++) {
      //     const category = allCategories[i];
      //     await setupCategory(category);
      //   }
      // }

      // // Creates a new subset and configures the checkbox
      // const setupCategory = async (category) => {
      //   subsets[category] = await newSubsetOfType(category);
      //   setupCheckBox(category);
      // }

      // // Sets up the checkbox event to hide / show elements
      // const setupCheckBox = (category) => {
      //   const name = getName(category);
      //   const checkBox = document.getElementById(name);

      //   checkBox.addEventListener('change', (event) => {

      //     const checked = event.target.checked;

      //     console.log("changeee", checked, category)

      //     const subset = subsets[category];
      //     // if (checked) scene.add(subset);
      //     // else subset.removeFromParent();

      //     console.log("subset ", subset)

      //     //scene.remove(subset)
          
      //     subset.removeFromParent();
      //   });
      // }

      // setTimeout(() => {
      //   setupAllCategories()
      //   console.log("setupAllCategories")
      // }, 3000);
    }

    init()
  }, [])

  return (
    <Fade>
      <div className='ifc-component-container'>
        <canvas id="three-canvas"></canvas>
      </div>

      {/*<div className="checkboxes">
        <div>
          <input id="IFCBEAM" type="checkbox" />
          IFCBEAM
        </div>
        <div>
          <input id="IFCBUILDINGELEMENTPROXY" type="checkbox" />
          IFCBUILDINGELEMENTPROXY
        </div>
        <div>
          <input id="IFCSLAB" type="checkbox" />
          Slabs
        </div>
      </div>*/}
    </Fade>
  )
}

export default IFC;
