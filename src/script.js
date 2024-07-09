import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// viewport size
const sizes= {
    height: window.innerHeight,
    width: window.innerWidth,
}

// 1. init canvas
const canvas = document.querySelector("canvas.webgl");
// 2. create scene
const scene = new THREE.Scene();
// 3. prepare camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/ sizes.height, 0.1, 100);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;
scene.add(camera);
// 4. add control on the scene
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
// 5 . add renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 6. start animation loop
const animations = ()=>{
    // update control for damping
    control.update();
    // render the scene for each animations
    renderer.render(scene, camera);
    // defines what to do in the next frame
    window.requestAnimationFrame(animations);
}

animations();

// 7. handle resize
window.onresize=(e)=>{
    // change size
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;
    // update camera ratio so that the control won't get distort
    camera.aspect = sizes.width/ sizes.height;
    camera.updateProjectionMatrix();
    // update render size
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// 8. toggle full screen
window.ondblclick = (e)=>{
    console.log(e);
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement){
        if (canvas.requestFullscreen){
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen();
        } else {
            // Add a placeholder statement here
            console.log("Fullscreen is not supported");
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        } else {
            // Add a placeholder statement here
            console.log("Fullscreen is not supported");
        }
    }
};

// add axes
const axes = new THREE.AxesHelper(100);
scene.add(axes);

// init your geometries for the game
const obj = new THREE.BoxGeometry(3,4,5,2,2,2);
const material = new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true});
const mesh = new THREE.Mesh(obj, material);
scene.add(mesh);

const positionsArray = new Float32Array(9);
// vertex 1
positionsArray[0]=0;
positionsArray[1]=0;
positionsArray[2]=0;
// vertex 2
positionsArray[3]=0;
positionsArray[4]=1;
positionsArray[5]=0;
// vertex 3
positionsArray[6]=1;
positionsArray[7]=0;
positionsArray[8]=0;

// end up a triangle

const positionsArray2 = new Float32Array([
    0,0,0, // vertex1, x, y, z
    0,1,0, // vertex2, x, y, z
    1,0,0, // vertex3, x, y, z
]);

const vertexSize = 3; // one vertex contains 3 information
const positionsAttribute = new THREE.BufferAttribute(positionsArray, vertexSize);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionsAttribute);// shader attribute position

const myItemMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color:0x00ff00, wireframe:true,
}))
scene.add(myItemMesh)

// create 50 个三角形
const geometryNew = new THREE.BufferGeometry();
const countOfTriangle = 50;

const arrayNew = new Float32Array(countOfTriangle * 3 * vertexSize); // triangle has 3 vertex, each needs x, y, z 

for (let i = 0; i < countOfTriangle * 3 * vertexSize; i+=1){
    arrayNew[i] = Math.random()*10;
}

const attributeNew = new THREE.BufferAttribute(arrayNew, vertexSize);
geometryNew.setAttribute("position", attributeNew);

const myItemMeshNew = new THREE.Mesh(geometryNew, new THREE.MeshBasicMaterial({
    color:0x0000ff, wireframe:true,
}))
scene.add(myItemMeshNew)

const geometry33 = new THREE.SphereGeometry(1)
const myItemMeshNew2 = new THREE.Mesh(geometry33, new THREE.MeshBasicMaterial({
    color:0x00ffff, wireframe:true,
}))
scene.add(myItemMeshNew2)


// unit 11. load some textures, under the hook
const image = new Image();
const texture = new THREE.Texture(image);
texture.colorSpace = THREE.SRGBColorSpace; // used as map and matcap needs to be encoded as sRGB

image.onload = ()=>{
    texture.needsUpdate = true;
    console.log(texture);
};
image.src = "/textures/door/color.jpg"


// add a new box geometry for texturing

const texturedBox = new THREE.BoxGeometry(3,3,3);
const texturedBoxMesh = new THREE.Mesh(texturedBox, new THREE.MeshBasicMaterial({
    map:texture
}))
texturedBoxMesh.position.x = 10;
scene.add(texturedBoxMesh);

// unit 11. load some textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = ()=>{
    console.log("onStart");
};
loadingManager.onLoad = ()=>{
    console.log("onLoad");
};
loadingManager.onProgress = ()=>{
    console.log("onProgress");
};
loadingManager.onError = ()=>{
    console.log("onError");
};
const texutreLoader = new THREE.TextureLoader(loadingManager);
const textureNew = texutreLoader.load(
    '/textures/door/color.jpg',
    // ()=>{
    //     console.log("load");
    // },
    // ()=>{
    //     console.log("progress");
    // },
    // ()=>{
    //     console.log("error");
    // },
);
const textureAlpha = texutreLoader.load('/textures/door/alpha.jpg');
textureNew.colorSpace = THREE.SRGBColorSpace; 
const texturedBoxV2 = new THREE.BoxGeometry(3,3,3);
const texturedBoxMeshV2 = new THREE.Mesh(texturedBoxV2, new THREE.MeshBasicMaterial({
    map:textureNew
}))
texturedBoxMeshV2.position.y = 10;
scene.add(texturedBoxMeshV2);