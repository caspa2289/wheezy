"use strict";
(self["webpackChunk_wheezy_demos"] = self["webpackChunk_wheezy_demos"] || []).push([["index"],{

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wheezy/engine */ "../engine/index.ts");
/* harmony import */ var _src_Demo0__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Demo0 */ "./src/Demo0.ts");


const canvas = document.getElementById('webgpu-canvas');
const run = async () => {
    const engine = (await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.Engine.getOrInit({ canvas }));
    const scene = new _src_Demo0__WEBPACK_IMPORTED_MODULE_1__.Demo0();
    await scene.init();
    engine.scene = scene;
    engine.render();
};
run();


/***/ }),

/***/ "./src/Demo0.ts":
/*!**********************!*\
  !*** ./src/Demo0.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Demo0: () => (/* binding */ Demo0)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wheezy/engine */ "../engine/index.ts");
/* harmony import */ var _wheezy_engine_src_engine_core_cameras_ArcBallCamera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wheezy/engine/src/engine/core/cameras/ArcBallCamera */ "../engine/src/engine/core/cameras/ArcBallCamera/index.ts");



//This is supposed to demonstrate basic workflow
class Demo0 extends _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.Scene {
    constructor() {
        super();
        this.mercuryHook = this._createTransformObject();
        this.venusHook = this._createTransformObject();
        this.earthHook = this._createTransformObject();
        this.marsHook = this._createTransformObject();
        this.jupiterHook = this._createTransformObject();
        this.saturnHook = this._createTransformObject();
        this.uranusHook = this._createTransformObject();
        this.neptuneHook = this._createTransformObject();
        this.yearsPerMinute = 1;
        this.camera = new _wheezy_engine_src_engine_core_cameras_ArcBallCamera__WEBPACK_IMPORTED_MODULE_1__.ArcBallCamera({
            zFar: 1000,
            zNear: 0.1,
            canvasWidth: this._engine.renderer.context.canvas.width,
            canvasHeight: this._engine.renderer.context.canvas.height,
            position: wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0, 4, 5),
        });
    }
    _createTransformObject() {
        const gameObject = new _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.GameObject();
        this.objectManager.addObject(gameObject, this.root);
        new _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.Transform(gameObject);
        return gameObject;
    }
    async _setupSun() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/sun.glb');
        this.sun = await this.uploadModel({
            modelData: planetMD,
        });
        this.sun.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.12, 0.12, 0.12));
    }
    async _setupMercury() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/mercury.glb');
        this.mercury = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.mercury, this.mercuryHook);
        this.mercuryHook.transform.rotateDegreesEuler({ y: 80 });
        this.mercury.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.08, 0.08, 0.08));
        this.mercury.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(1.4));
    }
    async _setupVenus() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/venus.glb');
        this.venus = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.venus, this.venusHook);
        this.venusHook.transform.rotateDegreesEuler({ y: 160 });
        this.venus.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.12, 0.12, 0.12));
        this.venus.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(1.7, 0, 0));
    }
    async _setupEarth() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/earth.glb');
        this.earth = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.earth, this.earthHook);
        this.earthHook.transform.rotateDegreesEuler({ y: 10 });
        this.earth.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.16, 0.16, 0.16));
        this.earth.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(2.2, 0, 0));
    }
    async _setupMars() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/mars.glb');
        this.mars = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.mars, this.marsHook);
        this.marsHook.transform.rotateDegreesEuler({ y: 50 });
        this.mars.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.14, 0.14, 0.14));
        this.mars.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(2.7, 0, 0));
    }
    async _setupJupiter() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/jupiter.glb');
        this.jupiter = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.jupiter, this.jupiterHook);
        this.jupiterHook.transform.rotateDegreesEuler({ y: 150 });
        this.jupiter.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.15, 0.15, 0.15));
        this.jupiter.transform.rotateDegreesEuler({ x: 90 });
        this.jupiter.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(3.4, 0, 0));
    }
    async _setupSaturn() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/saturn.glb');
        this.saturn = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.saturn, this.saturnHook);
        this.saturnHook.transform.rotateDegreesEuler({ y: 210 });
        this.saturn.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.0012, 0.0012, 0.0012));
        this.saturn.transform.rotateDegreesEuler({ x: 76 });
        this.saturn.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(4.3, 0, 0));
    }
    async _setupUranus() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/uranus.glb');
        this.uranus = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.uranus, this.uranusHook);
        this.uranusHook.transform.rotateDegreesEuler({ y: 270 });
        this.uranus.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.2, 0.2, 0.2));
        this.uranus.transform.rotateDegreesEuler({ x: 90 });
        this.uranus.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(5.2, 0, 0));
    }
    async _setupNeptune() {
        const planetMD = await _wheezy_engine__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader.loadFromUrl('static/models/planets/neptune.glb');
        this.neptune = await this.uploadModel({
            modelData: planetMD,
        });
        this.objectManager.reparentObject(this.neptune, this.neptuneHook);
        this.neptuneHook.transform.rotateDegreesEuler({ y: 100 });
        this.neptune.transform.scale(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0.2, 0.2, 0.2));
        this.neptune.transform.rotateDegreesEuler({ x: 90 });
        this.neptune.transform.translate(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(5.8, 0, 0));
    }
    async init() {
        await this._setupSun();
        await this._setupMercury();
        await this._setupVenus();
        await this._setupEarth();
        await this._setupMars();
        await this._setupJupiter();
        await this._setupSaturn();
        await this._setupUranus();
        await this._setupNeptune();
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.zIndex = '10';
        const button0 = document.createElement('button');
        button0.textContent = '1 год в минуту';
        button0.addEventListener('click', () => {
            this.yearsPerMinute = 1;
        });
        const button1 = document.createElement('button');
        button1.textContent = '100 лет в минуту';
        button1.addEventListener('click', () => {
            this.yearsPerMinute = 100;
        });
        wrapper.appendChild(button0);
        wrapper.appendChild(button1);
        document.body.appendChild(wrapper);
    }
    getOrbitRotationPerFrame(name) {
        const commonDivider = 3600 / this.yearsPerMinute;
        switch (name) {
            case 'mercury':
                return (360 * 4.17) / commonDivider;
            case 'venus':
                return (360 * 1.63) / commonDivider;
            case 'earth':
                return (360 * 1) / commonDivider;
            case 'mars':
                return (360 * 0.53) / commonDivider;
            case 'jupiter':
                return (360 * 0.084) / commonDivider;
            case 'saturn':
                return (360 * 0.034) / commonDivider;
            case 'uranus':
                return (360 * 0.012) / commonDivider;
            case 'neptune':
                return (360 * 0.006) / commonDivider;
            default:
                return 0;
        }
    }
    getSelfRotationPerFrame(name) {
        const commonDivider = 3600 / this.yearsPerMinute;
        switch (name) {
            case 'sun':
                return (360 * 0.04 * 365) / commonDivider;
            case 'mercury':
                return (360 * 1.5 * 365) / commonDivider;
            case 'venus':
                return (360 * 1.502 * 365) / commonDivider;
            case 'earth':
                return (360 * 1 * 365) / commonDivider;
            case 'mars':
                return (360 * 1.03 * 365) / commonDivider;
            case 'jupiter':
                return (360 * 0.41 * 365) / commonDivider;
            case 'saturn':
                return (360 * 0.45 * 365) / commonDivider;
            case 'uranus':
                return (360 * 0.666 * 365) / commonDivider;
            case 'neptune':
                return (360 * 0.708 * 365) / commonDivider;
            default:
                return 0;
        }
    }
    onRender(deltaTime) {
        //FYI: Always remember to reset orientation in blender :/
        this.sun.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('sun'),
        });
        this.mercury.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('mercury'),
        });
        this.mercuryHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('mercury'),
        });
        this.venus.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('venus'),
        });
        this.venusHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('venus'),
        });
        this.earth.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('earth'),
        });
        this.earthHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('earth'),
        });
        this.mars.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('mars'),
        });
        this.marsHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('mars'),
        });
        this.jupiter.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('jupiter'),
        });
        this.jupiterHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('jupiter'),
        });
        this.saturn.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('saturn'),
        });
        this.saturnHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('saturn'),
        });
        this.uranus.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('uranus'),
        });
        this.uranusHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('uranus'),
        });
        this.neptune.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('neptune'),
        });
        this.neptuneHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('neptune'),
        });
    }
}


/***/ }),

/***/ "../engine/index.ts":
/*!**************************!*\
  !*** ../engine/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BufferStorage: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.BufferStorage),
/* harmony export */   Camera: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Camera),
/* harmony export */   Collider: () => (/* reexport safe */ _src_physics__WEBPACK_IMPORTED_MODULE_2__.Collider),
/* harmony export */   Component: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   DEFAULT_DEPTH_FORMAT: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_DEPTH_FORMAT),
/* harmony export */   DEFAULT_SWAP_CHAIN_FORMAT: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_SWAP_CHAIN_FORMAT),
/* harmony export */   Engine: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Engine),
/* harmony export */   Entity: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Entity),
/* harmony export */   EntityTypes: () => (/* reexport safe */ _src_engine_types__WEBPACK_IMPORTED_MODULE_1__.EntityTypes),
/* harmony export */   GLTFTextureFilter: () => (/* reexport safe */ _src_engine_types__WEBPACK_IMPORTED_MODULE_1__.GLTFTextureFilter),
/* harmony export */   GLTFTextureWrap: () => (/* reexport safe */ _src_engine_types__WEBPACK_IMPORTED_MODULE_1__.GLTFTextureWrap),
/* harmony export */   GameObject: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.GameObject),
/* harmony export */   ImageStorage: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.ImageStorage),
/* harmony export */   MSAA_SAMPLE_COUNT: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.MSAA_SAMPLE_COUNT),
/* harmony export */   MaterialStorage: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.MaterialStorage),
/* harmony export */   Mesh: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Mesh),
/* harmony export */   ObjectManager: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.ObjectManager),
/* harmony export */   PerspectiveCamera: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera),
/* harmony export */   PhysicsObject: () => (/* reexport safe */ _src_physics__WEBPACK_IMPORTED_MODULE_2__.PhysicsObject),
/* harmony export */   Renderer: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Renderer),
/* harmony export */   SamplerStorage: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.SamplerStorage),
/* harmony export */   Scene: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Scene),
/* harmony export */   SceneTree: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.SceneTree),
/* harmony export */   TextureStorage: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.TextureStorage),
/* harmony export */   Transform: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.Transform),
/* harmony export */   VIEW_PARAMS_BUFFER_SIZE: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.VIEW_PARAMS_BUFFER_SIZE),
/* harmony export */   WheezyGLBLoader: () => (/* reexport safe */ _src_utils__WEBPACK_IMPORTED_MODULE_3__.WheezyGLBLoader),
/* harmony export */   alignTo: () => (/* reexport safe */ _src_engine_core__WEBPACK_IMPORTED_MODULE_0__.alignTo)
/* harmony export */ });
/* harmony import */ var _src_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/engine/core */ "../engine/src/engine/core/index.ts");
/* harmony import */ var _src_engine_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/engine/types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _src_physics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/physics */ "../engine/src/physics/index.ts");
/* harmony import */ var _src_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/utils */ "../engine/src/utils/index.ts");






/***/ }),

/***/ "../engine/src/engine/core/BufferStorage/BufferStorage.ts":
/*!****************************************************************!*\
  !*** ../engine/src/engine/core/BufferStorage/BufferStorage.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BufferStorage: () => (/* binding */ BufferStorage)
/* harmony export */ });
class BufferStorage {
    constructor() {
        this._buffers = new Map();
    }
    get buffers() {
        return this._buffers;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/BufferStorage/index.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/BufferStorage/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BufferStorage: () => (/* reexport safe */ _BufferStorage__WEBPACK_IMPORTED_MODULE_0__.BufferStorage)
/* harmony export */ });
/* harmony import */ var _BufferStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BufferStorage */ "../engine/src/engine/core/BufferStorage/BufferStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/Component/Component.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/Component/Component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Entity */ "../engine/src/engine/core/Entity/index.ts");

class Component extends _Entity__WEBPACK_IMPORTED_MODULE_0__.Entity {
    constructor(parent, componentType) {
        super(componentType);
        this._parent = parent;
        this._parent.addComponent(this);
    }
    get parent() {
        return this._parent;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Component/index.ts":
/*!****************************************************!*\
  !*** ../engine/src/engine/core/Component/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_0__.Component)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "../engine/src/engine/core/Component/Component.ts");



/***/ }),

/***/ "../engine/src/engine/core/Engine/Engine.ts":
/*!**************************************************!*\
  !*** ../engine/src/engine/core/Engine/Engine.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Engine: () => (/* binding */ Engine)
/* harmony export */ });
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Renderer */ "../engine/src/engine/core/Renderer/index.ts");

class Engine {
    constructor() {
        this._prevFrameTime = 0;
    }
    async initRenderer(canvas) {
        this._renderer = new _Renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer({ canvas });
        await this._renderer.init();
    }
    static async getOrInit({ canvas, }) {
        //FIXME: types
        try {
            if (window.WheezyEngine) {
                console.warn('Engine has already been instanced');
                return window.WheezyEngine;
            }
            const engineInstance = new Engine();
            await engineInstance.initRenderer(canvas);
            window.WheezyEngine = engineInstance;
            return engineInstance;
        }
        catch (err) {
            alert(err);
        }
    }
    get renderer() {
        return this._renderer;
    }
    get scene() {
        return this._scene;
    }
    set scene(scene) {
        this._scene = scene;
    }
    render(time = 0) {
        if (!this.scene)
            return;
        const dt = (time - this._prevFrameTime) / 100;
        this._prevFrameTime = time;
        this._renderer.render(dt, this.scene);
        requestAnimationFrame((time) => this.render(time));
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Engine/index.ts":
/*!*************************************************!*\
  !*** ../engine/src/engine/core/Engine/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_DEPTH_FORMAT: () => (/* reexport safe */ _Renderer_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_DEPTH_FORMAT),
/* harmony export */   DEFAULT_SWAP_CHAIN_FORMAT: () => (/* reexport safe */ _Renderer_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_SWAP_CHAIN_FORMAT),
/* harmony export */   Engine: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_0__.Engine),
/* harmony export */   MSAA_SAMPLE_COUNT: () => (/* reexport safe */ _Renderer_constants__WEBPACK_IMPORTED_MODULE_1__.MSAA_SAMPLE_COUNT),
/* harmony export */   VIEW_PARAMS_BUFFER_SIZE: () => (/* reexport safe */ _Renderer_constants__WEBPACK_IMPORTED_MODULE_1__.VIEW_PARAMS_BUFFER_SIZE)
/* harmony export */ });
/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine */ "../engine/src/engine/core/Engine/Engine.ts");
/* harmony import */ var _Renderer_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Renderer/constants */ "../engine/src/engine/core/Renderer/constants.ts");




/***/ }),

/***/ "../engine/src/engine/core/Entity/Entity.ts":
/*!**************************************************!*\
  !*** ../engine/src/engine/core/Entity/Entity.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: () => (/* binding */ Entity)
/* harmony export */ });
class Entity {
    constructor(type) {
        this._id = this._generateId();
        this._type = type;
    }
    _generateId() {
        return String(Math.random());
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Entity/index.ts":
/*!*************************************************!*\
  !*** ../engine/src/engine/core/Entity/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: () => (/* reexport safe */ _Entity__WEBPACK_IMPORTED_MODULE_0__.Entity)
/* harmony export */ });
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Entity */ "../engine/src/engine/core/Entity/Entity.ts");



/***/ }),

/***/ "../engine/src/engine/core/GameObject/GameObject.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/core/GameObject/GameObject.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameObject: () => (/* binding */ GameObject)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Entity */ "../engine/src/engine/core/Entity/index.ts");


class GameObject extends _Entity__WEBPACK_IMPORTED_MODULE_1__.Entity {
    constructor() {
        super(_types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.gameObject);
        this._components = new Map();
        this._name = `GameObject ${super.id}`;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get components() {
        return this._components;
    }
    get transform() {
        //FIXME: find a less dumb way to do it
        if (this._transform) {
            return this._transform;
        }
        return [...this.components.values()].find((component) => component.type === _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.transform);
    }
    addComponent(component) {
        this._components.set(component.id, component);
    }
    removeComponent(id) {
        this._components.delete(id);
    }
}


/***/ }),

/***/ "../engine/src/engine/core/GameObject/index.ts":
/*!*****************************************************!*\
  !*** ../engine/src/engine/core/GameObject/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameObject: () => (/* reexport safe */ _GameObject__WEBPACK_IMPORTED_MODULE_0__.GameObject)
/* harmony export */ });
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameObject */ "../engine/src/engine/core/GameObject/GameObject.ts");



/***/ }),

/***/ "../engine/src/engine/core/ImageStorage/ImageStorage.ts":
/*!**************************************************************!*\
  !*** ../engine/src/engine/core/ImageStorage/ImageStorage.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageStorage: () => (/* binding */ ImageStorage)
/* harmony export */ });
class ImageStorage {
    constructor() {
        this._images = new Map();
    }
    get images() {
        return this._images;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/ImageStorage/index.ts":
/*!*******************************************************!*\
  !*** ../engine/src/engine/core/ImageStorage/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageStorage: () => (/* reexport safe */ _ImageStorage__WEBPACK_IMPORTED_MODULE_0__.ImageStorage)
/* harmony export */ });
/* harmony import */ var _ImageStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageStorage */ "../engine/src/engine/core/ImageStorage/ImageStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/MaterialStorage/MaterialStorage.ts":
/*!********************************************************************!*\
  !*** ../engine/src/engine/core/MaterialStorage/MaterialStorage.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaterialStorage: () => (/* binding */ MaterialStorage)
/* harmony export */ });
class MaterialStorage {
    constructor() {
        this._materials = new Map();
    }
    get materials() {
        return this._materials;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/MaterialStorage/index.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/core/MaterialStorage/index.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaterialStorage: () => (/* reexport safe */ _MaterialStorage__WEBPACK_IMPORTED_MODULE_0__.MaterialStorage)
/* harmony export */ });
/* harmony import */ var _MaterialStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MaterialStorage */ "../engine/src/engine/core/MaterialStorage/MaterialStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/Mesh/Mesh.ts":
/*!**********************************************!*\
  !*** ../engine/src/engine/core/Mesh/Mesh.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mesh: () => (/* binding */ Mesh)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Component */ "../engine/src/engine/core/Component/index.ts");


class Mesh extends _Component__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor(parent, positions, indices, normals, textureCoordinates, material) {
        super(parent, _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.mesh);
        this.mode = 4; // GPU topology mode
        this.isPipelineBuilt = false;
        this.positions = positions;
        this.indices = indices;
        this.textureCoordinates = textureCoordinates;
        this.material = material;
        this.normals = normals;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Mesh/index.ts":
/*!***********************************************!*\
  !*** ../engine/src/engine/core/Mesh/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mesh: () => (/* reexport safe */ _Mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh)
/* harmony export */ });
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Mesh */ "../engine/src/engine/core/Mesh/Mesh.ts");



/***/ }),

/***/ "../engine/src/engine/core/MeshRenderDataStorage/MeshRenderDataStorage.ts":
/*!********************************************************************************!*\
  !*** ../engine/src/engine/core/MeshRenderDataStorage/MeshRenderDataStorage.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MeshRenderDataStorage: () => (/* binding */ MeshRenderDataStorage)
/* harmony export */ });
class MeshRenderDataStorage {
    constructor() {
        this._data = new Map();
    }
    get data() {
        return this._data;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/MeshRenderDataStorage/index.ts":
/*!****************************************************************!*\
  !*** ../engine/src/engine/core/MeshRenderDataStorage/index.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MeshRenderDataStorage: () => (/* reexport safe */ _MeshRenderDataStorage__WEBPACK_IMPORTED_MODULE_0__.MeshRenderDataStorage)
/* harmony export */ });
/* harmony import */ var _MeshRenderDataStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MeshRenderDataStorage */ "../engine/src/engine/core/MeshRenderDataStorage/MeshRenderDataStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/ModelUploader/ModelUploader.ts":
/*!****************************************************************!*\
  !*** ../engine/src/engine/core/ModelUploader/ModelUploader.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelUploader: () => (/* binding */ ModelUploader)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../GameObject */ "../engine/src/engine/core/GameObject/index.ts");
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Mesh */ "../engine/src/engine/core/Mesh/index.ts");
/* harmony import */ var _Transform__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Transform */ "../engine/src/engine/core/Transform/index.ts");





class ModelUploader {
    static getTextureFilterMode(filter) {
        switch (filter) {
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST:
                return 'nearest';
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR:
                return 'linear';
            default:
                return 'linear';
        }
    }
    static getTextureMipMapMode(filter) {
        switch (filter) {
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST:
                return 'nearest';
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureFilter.LINEAR:
                return 'linear';
        }
    }
    static getTextureAddressMode(mode) {
        switch (mode) {
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureWrap.REPEAT:
                return 'repeat';
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureWrap.CLAMP_TO_EDGE:
                return 'clamp-to-edge';
            case _types__WEBPACK_IMPORTED_MODULE_0__.GLTFTextureWrap.MIRRORED_REPEAT:
                return 'mirror-repeat';
            default:
                return 'repeat';
        }
    }
    static async uploadImages(modelData, bufferStorage, imageStorage) {
        for (let [key, value] of modelData.images.entries()) {
            const { bufferView: { buffer, byteLength, byteOffset }, mimeType, } = value;
            const imageView = new Uint8Array(bufferStorage.buffers.get(buffer), byteOffset, byteLength);
            const blob = new Blob([imageView], { type: mimeType });
            const bitmap = await createImageBitmap(blob);
            imageStorage.images.set(key, bitmap);
        }
    }
    static uploadBuffers(modelData, bufferStorage) {
        modelData.buffers.forEach((value, key) => {
            bufferStorage.buffers.set(key, value);
        });
    }
    static uploadSamplers(modelData, samplerStorage, device) {
        modelData.samplers.forEach((value, key) => {
            const gpuSampler = device.createSampler({
                magFilter: this.getTextureFilterMode(value?.magFilter),
                minFilter: this.getTextureFilterMode(value?.minFilter),
                addressModeU: this.getTextureAddressMode(value?.wrapS),
                addressModeV: this.getTextureAddressMode(value?.wrapT),
                //FIXME: use mipmap filtration
                mipmapFilter: 'nearest',
            });
            samplerStorage.samplers.set(key, gpuSampler);
        });
    }
    static uploadTextures(modelData, textureStorage) {
        modelData.textures.forEach((value, key) => {
            textureStorage.textures.set(key, value);
        });
    }
    static createGPUTexture(device, format, samplerStorage, imageStorage, texturePreloadData) {
        let textureView;
        let textureSampler;
        if (!texturePreloadData) {
            console.warn('No texture data');
            return;
        }
        if (!texturePreloadData.imageId) {
            throw new Error('No image view for this texture');
        }
        if (!texturePreloadData.samplerId) {
            throw new Error('No sampler for this texture');
        }
        textureSampler = samplerStorage.samplers.get(texturePreloadData.samplerId);
        const imageBitmap = imageStorage.images.get(texturePreloadData.imageId);
        const imageSize = [imageBitmap.width, imageBitmap.height, 1];
        const imageTexture = device.createTexture({
            size: imageSize,
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: imageTexture }, imageSize);
        textureView = imageTexture.createView();
        return { view: textureView, sampler: textureSampler };
    }
    static uploadMaterials(modelData, textureStorage, samplerStorage, imageStorage, materialStorage, device) {
        modelData.materials.forEach((value, key) => {
            const material = {
                name: value.name,
                emissiveFactor: value?.emissiveFactor ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.create(1, 1, 1),
                metallicFactor: value?.metallicFactor ?? 1,
                roughnessFactor: value.roughnessFactor ?? 1,
                baseColorFactor: value?.baseColorFactor ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.vec4.create(1, 1, 1, 1),
            };
            if (value.baseColorTextureId) {
                material.baseColorTexture = this.createGPUTexture(device, 'rgba8unorm-srgb', samplerStorage, imageStorage, textureStorage.textures.get(value.baseColorTextureId));
            }
            if (value.metallicRoughnessTextureId) {
                material.metallicRoughnessTexture = this.createGPUTexture(device, 'rgba8unorm', samplerStorage, imageStorage, textureStorage.textures.get(value.metallicRoughnessTextureId));
            }
            if (value.normalTextureId) {
                material.normalTexture = this.createGPUTexture(device, 'rgba8unorm-srgb', samplerStorage, imageStorage, textureStorage.textures.get(value.normalTextureId));
            }
            materialStorage.materials.set(key, material);
        });
    }
    static traversePreloadNode(node, parentGameObject, objectManager, bufferStorage, materialStorage, device) {
        const { trsMatrix, meshes, children } = node;
        const gameObject = new _GameObject__WEBPACK_IMPORTED_MODULE_1__.GameObject();
        objectManager.addObject(gameObject, parentGameObject);
        new _Transform__WEBPACK_IMPORTED_MODULE_3__.Transform(gameObject, trsMatrix);
        meshes.forEach((meshData) => {
            new _Mesh__WEBPACK_IMPORTED_MODULE_2__.Mesh(gameObject, meshData.positions, meshData.indices, meshData.normals, meshData.textureCoordinates, meshData.materialId
                ? materialStorage.materials.get(meshData.materialId)
                : undefined);
        });
        children.forEach((child) => {
            this.traversePreloadNode(child, gameObject, objectManager, bufferStorage, materialStorage, device);
        });
    }
    static async uploadModel(modelData, objectManager, bufferStorage, imageStorage, samplerStorage, materialStorage, textureStorage, sceneObject, device) {
        this.uploadBuffers(modelData, bufferStorage);
        await this.uploadImages(modelData, bufferStorage, imageStorage);
        this.uploadSamplers(modelData, samplerStorage, device);
        this.uploadTextures(modelData, textureStorage);
        this.uploadMaterials(modelData, textureStorage, samplerStorage, imageStorage, materialStorage, device);
        const { trsMatrix, meshes, children } = modelData.model;
        const meshObject = new _GameObject__WEBPACK_IMPORTED_MODULE_1__.GameObject();
        objectManager.addObject(meshObject, sceneObject);
        new _Transform__WEBPACK_IMPORTED_MODULE_3__.Transform(meshObject, trsMatrix);
        meshes.forEach((meshData) => {
            new _Mesh__WEBPACK_IMPORTED_MODULE_2__.Mesh(meshObject, meshData.positions, meshData.indices, meshData.normals, meshData.textureCoordinates, meshData.materialId
                ? materialStorage.materials.get(meshData.materialId)
                : undefined);
        });
        children.forEach((child) => {
            this.traversePreloadNode(child, meshObject, objectManager, bufferStorage, materialStorage, device);
        });
        return meshObject;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/ModelUploader/index.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/ModelUploader/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelUploader: () => (/* reexport safe */ _ModelUploader__WEBPACK_IMPORTED_MODULE_0__.ModelUploader)
/* harmony export */ });
/* harmony import */ var _ModelUploader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUploader */ "../engine/src/engine/core/ModelUploader/ModelUploader.ts");



/***/ }),

/***/ "../engine/src/engine/core/ObjectManager/ObjectManager.ts":
/*!****************************************************************!*\
  !*** ../engine/src/engine/core/ObjectManager/ObjectManager.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObjectManager: () => (/* binding */ ObjectManager)
/* harmony export */ });
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../SceneTree */ "../engine/src/engine/core/SceneTree/index.ts");

class ObjectManager {
    constructor() {
        this._objectPositions = new Map();
        this._sceneTree = new _SceneTree__WEBPACK_IMPORTED_MODULE_0__.SceneTree();
    }
    get sceneTree() {
        return this._sceneTree;
    }
    getObjectPosition(gameObject) {
        return gameObject
            ? this._objectPositions.get(gameObject.id) ?? null
            : null;
    }
    addObject(child, target) {
        const position = this._sceneTree.addNodeAt(this.getObjectPosition(target), {
            gameObject: child,
            children: new Map(),
        });
        this._objectPositions.set(child.id, position);
    }
    reparentObject(child, target) {
        const childPosition = this._objectPositions.get(child.id);
        if (!childPosition) {
            throw new Error(`Position record not found for ${child.id}`);
        }
        const newPosition = this._sceneTree.reparentNode(this.getObjectPosition(target), childPosition);
        this._objectPositions.set(child.id, newPosition);
    }
    destroyObject(gameObject) {
        const childPosition = this._objectPositions.get(gameObject.id);
        if (!childPosition) {
            throw new Error(`Position record not found for ${gameObject.id}`);
        }
        const idsToRemove = this._sceneTree.removeNode(childPosition);
        idsToRemove.forEach((id) => {
            this._objectPositions.delete(id);
        });
    }
}


/***/ }),

/***/ "../engine/src/engine/core/ObjectManager/index.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/ObjectManager/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObjectManager: () => (/* reexport safe */ _ObjectManager__WEBPACK_IMPORTED_MODULE_0__.ObjectManager)
/* harmony export */ });
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectManager */ "../engine/src/engine/core/ObjectManager/ObjectManager.ts");



/***/ }),

/***/ "../engine/src/engine/core/Renderer/Renderer.ts":
/*!******************************************************!*\
  !*** ../engine/src/engine/core/Renderer/Renderer.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer),
/* harmony export */   alignTo: () => (/* binding */ alignTo)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "../engine/src/engine/core/Renderer/constants.ts");
/* harmony import */ var _utils_Stuff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/Stuff */ "../engine/src/utils/Stuff.ts");
/* harmony import */ var _shaders_testShader_wgsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shaders/testShader.wgsl */ "../engine/src/engine/shaders/testShader.wgsl");





const alignTo = (val, align) => {
    return Math.floor((val + align - 1) / align) * align;
};
class Renderer {
    constructor({ canvas }) {
        this._swapChainFormat = _constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_SWAP_CHAIN_FORMAT;
        this._depthTextureFormat = _constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_DEPTH_FORMAT;
        this._viewParamsBufferSize = _constants__WEBPACK_IMPORTED_MODULE_1__.VIEW_PARAMS_BUFFER_SIZE;
        this._msaaSampleCount = _constants__WEBPACK_IMPORTED_MODULE_1__.MSAA_SAMPLE_COUNT;
        this._canvas = canvas;
    }
    async init() {
        await this._initializeContext(this._canvas);
        this._context.configure({
            device: this._device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: this._swapChainFormat,
        });
        this._depthTexture = this._device.createTexture({
            label: 'depthTexture',
            size: {
                width: this._context.canvas.width,
                height: this._context.canvas.height,
            },
            sampleCount: this._msaaSampleCount,
            format: this._depthTextureFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this._shaderModule = this.device.createShaderModule({
            code: _shaders_testShader_wgsl__WEBPACK_IMPORTED_MODULE_3__,
        });
        this._initializeBindGroupLayouts();
        this._initializeViewParams();
        if (this.msaaSampleCount !== 1) {
            this._multisampleTextureView = this.device
                .createTexture({
                size: [this._canvas.width, this._canvas.height],
                sampleCount: this.msaaSampleCount,
                format: this.swapChainFormat,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            })
                .createView();
        }
        else {
            this._multisampleTextureView = undefined;
        }
        this._renderPassDescriptor = {
            colorAttachments: [
                {
                    view: null,
                    resolveTarget: (this.msaaSampleCount === 1
                        ? undefined
                        : null),
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 1],
                    storeOp: this.msaaSampleCount === 1
                        ? 'store'
                        : 'discard',
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthLoadOp: 'clear',
                depthClearValue: 1.0,
                depthStoreOp: 'store',
                stencilLoadOp: 'clear',
                stencilClearValue: 0,
                stencilStoreOp: 'store',
            },
        };
    }
    get device() {
        return this._device;
    }
    get adapter() {
        return this._adapter;
    }
    get context() {
        return this._context;
    }
    get swapChainFormat() {
        return this._swapChainFormat;
    }
    get depthTextureFormat() {
        return this._depthTextureFormat;
    }
    get depthTexture() {
        return this._depthTexture;
    }
    get uniformsBGLayout() {
        return this._uniformsBGLayout;
    }
    get nodeParamsBGLayout() {
        return this._nodeParamsBGLayout;
    }
    get viewParamsBufferSize() {
        return this._viewParamsBufferSize;
    }
    get msaaSampleCount() {
        return this._msaaSampleCount;
    }
    get renderPassDescriptor() {
        return this._renderPassDescriptor;
    }
    get viewParamsBuffer() {
        return this._viewParamsBuffer;
    }
    get viewParamsBindGroup() {
        return this._viewParamsBindGroup;
    }
    get multisampleTextureView() {
        return this._multisampleTextureView;
    }
    _initializeViewParams() {
        this._viewParamsBuffer = this.device.createBuffer({
            size: this.viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this._viewParamsBindGroup = this.device.createBindGroup({
            layout: this.uniformsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._viewParamsBuffer } },
            ],
        });
    }
    _initializeBindGroupLayouts() {
        this._uniformsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' },
                },
            ],
        });
        this._nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' },
                },
            ],
        });
    }
    async _initializeContext(canvas) {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('GPU Adapter Unavailable');
        }
        const device = await adapter.requestDevice();
        this._device = device;
        this._adapter = adapter;
        canvas.width = document.body.clientWidth * window.devicePixelRatio;
        canvas.height = document.body.clientHeight * window.devicePixelRatio;
        this._context = canvas.getContext('webgpu');
        if (!this._context) {
            throw new Error('Failed to acquire GpuCanvasContext');
        }
    }
    buildRenderPipeline(mesh, scene) {
        const meshDataEntry = {};
        //FIXME: REFACTOR THIS SHIT
        meshDataEntry.materialParamsBuffer = this.device.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        });
        if (mesh.material) {
            const params = new Float32Array(meshDataEntry.materialParamsBuffer.getMappedRange());
            params.set(mesh.material.baseColorFactor, 0);
            params.set([mesh.material.metallicFactor, mesh.material.roughnessFactor], 4);
            meshDataEntry.materialParamsBuffer.unmap();
        }
        const sampleType = 'float';
        let materialBindGroupLayoutEntries = [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: {
                    type: 'uniform',
                },
            },
        ];
        let samplerBindGroupLayoutEntries = [];
        let samplerBindGroupEntries = [];
        let materialBindGroupEntries = [
            {
                binding: 0,
                resource: {
                    buffer: meshDataEntry.materialParamsBuffer,
                    size: 8 * 4,
                },
            },
        ];
        if (mesh.material?.baseColorTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            });
            materialBindGroupLayoutEntries.push({
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            });
            samplerBindGroupEntries.push({
                binding: 1,
                resource: mesh.material.baseColorTexture.sampler,
            });
            materialBindGroupEntries.push({
                binding: 1,
                resource: mesh.material.baseColorTexture.view,
            });
        }
        if (mesh.material?.metallicRoughnessTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            });
            materialBindGroupLayoutEntries.push({
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            });
            samplerBindGroupEntries.push({
                binding: 2,
                resource: mesh.material?.metallicRoughnessTexture.sampler,
            });
            materialBindGroupEntries.push({
                binding: 2,
                resource: mesh.material?.metallicRoughnessTexture.view,
            });
        }
        if (mesh.material?.normalTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            });
            materialBindGroupLayoutEntries.push({
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            });
            samplerBindGroupEntries.push({
                binding: 3,
                resource: mesh.material?.normalTexture.sampler,
            });
            materialBindGroupEntries.push({
                binding: 3,
                resource: mesh.material?.normalTexture.view,
            });
        }
        const vertexState = {
            module: this._shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: mesh.positions.byteStride,
                    attributes: [
                        {
                            format: mesh.positions.elementType,
                            offset: 0,
                            shaderLocation: 0,
                        },
                    ],
                },
            ],
        };
        if (mesh.textureCoordinates) {
            ;
            vertexState.buffers.push({
                arrayStride: mesh.textureCoordinates.byteStride,
                attributes: [
                    {
                        format: mesh.textureCoordinates.elementType,
                        offset: 0,
                        shaderLocation: 1,
                    },
                ],
            });
        }
        if (mesh.normals) {
            ;
            vertexState.buffers.push({
                arrayStride: mesh.normals.byteStride,
                attributes: [
                    {
                        format: mesh.normals.elementType,
                        offset: 0,
                        shaderLocation: 2,
                    },
                ],
            });
        }
        const fragmentState = {
            module: this._shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: this._swapChainFormat }],
        };
        const primitive = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
        };
        if (mesh.mode === 5) {
            primitive.topology = 'triangle-strip';
            primitive.stripIndexFormat = mesh?.indices
                ?.elementType;
        }
        const samplerBindGroupLayout = this.device.createBindGroupLayout({
            entries: samplerBindGroupLayoutEntries,
            label: 'samplerBindGroupLayout',
        });
        const materialBindGroupLayout = this.device.createBindGroupLayout({
            entries: materialBindGroupLayoutEntries,
            label: 'materialBindGroupLayout',
        });
        meshDataEntry.samplerBindGroup = this.device.createBindGroup({
            layout: samplerBindGroupLayout,
            entries: samplerBindGroupEntries,
        });
        meshDataEntry.materialBindGroup = this.device.createBindGroup({
            layout: materialBindGroupLayout,
            entries: materialBindGroupEntries,
        });
        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.uniformsBGLayout,
                this.nodeParamsBGLayout,
                materialBindGroupLayout,
                samplerBindGroupLayout,
            ],
        });
        meshDataEntry.renderPipeline = this.device.createRenderPipeline({
            layout: layout,
            vertex: vertexState,
            fragment: fragmentState,
            primitive: primitive,
            depthStencil: {
                format: this._depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: this.msaaSampleCount,
            },
        });
        const positionsView = new Uint8Array(scene.bufferStorage.buffers.get(mesh.positions.bufferId), mesh.positions.byteOffset, mesh.positions.byteLength);
        meshDataEntry.positionsBuffer = this.device.createBuffer({
            size: alignTo(mesh.positions.byteLength, 4),
            usage: mesh.positions.usage,
            mappedAtCreation: true,
        });
        new Uint8Array(meshDataEntry.positionsBuffer.getMappedRange()).set(positionsView);
        meshDataEntry.positionsBuffer.unmap();
        if (mesh.textureCoordinates) {
            const textureCoordinatesBuffer = scene.bufferStorage.buffers.get(mesh?.textureCoordinates.bufferId);
            const textureCoordinatesView = new Uint8Array(textureCoordinatesBuffer, mesh.textureCoordinates.byteOffset, mesh.textureCoordinates.byteLength);
            meshDataEntry.textureCoordinatesBuffer = this.device.createBuffer({
                size: alignTo(mesh.textureCoordinates.byteLength, 4),
                usage: mesh.textureCoordinates.usage,
                mappedAtCreation: true,
            });
            new Uint8Array(meshDataEntry.textureCoordinatesBuffer.getMappedRange()).set(textureCoordinatesView);
            meshDataEntry.textureCoordinatesBuffer.unmap();
        }
        if (mesh.normals) {
            const normalsBuffer = scene.bufferStorage.buffers.get(mesh?.normals.bufferId);
            const normalsView = new Uint8Array(normalsBuffer, mesh.normals.byteOffset, mesh.normals.byteLength);
            meshDataEntry.normalsBuffer = this.device.createBuffer({
                size: alignTo(mesh.normals.byteLength, 4),
                usage: mesh.normals.usage,
                mappedAtCreation: true,
            });
            new Uint8Array(meshDataEntry.normalsBuffer.getMappedRange()).set(normalsView);
            meshDataEntry.normalsBuffer.unmap();
        }
        if (mesh.indices) {
            const indicesBuffer = scene.bufferStorage.buffers.get(mesh?.indices.bufferId);
            const indicesView = new Uint8Array(indicesBuffer, mesh.indices.byteOffset, mesh.indices.byteLength);
            meshDataEntry.indicesBuffer = this.device.createBuffer({
                size: alignTo(mesh.indices.byteLength, 4),
                usage: mesh.indices.usage,
                mappedAtCreation: true,
            });
            new Uint8Array(meshDataEntry.indicesBuffer.getMappedRange()).set(indicesView);
            meshDataEntry.indicesBuffer.unmap();
        }
        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry);
        mesh.isPipelineBuilt = true;
    }
    renderMesh(mesh, scene, renderPassEncoder) {
        const { renderPipeline, materialBindGroup, samplerBindGroup, positionsBuffer, textureCoordinatesBuffer, normalsBuffer, indicesBuffer, nodeParamsBindGroup, } = scene.meshRenderDataStorage.data.get(mesh.id);
        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup);
        renderPassEncoder.setPipeline(renderPipeline);
        if (materialBindGroup) {
            renderPassEncoder.setBindGroup(2, materialBindGroup);
        }
        if (samplerBindGroup) {
            renderPassEncoder.setBindGroup(3, samplerBindGroup);
        }
        renderPassEncoder.setVertexBuffer(0, positionsBuffer, 0, mesh.positions.byteLength);
        if (mesh.textureCoordinates) {
            renderPassEncoder.setVertexBuffer(1, textureCoordinatesBuffer, 0, mesh.textureCoordinates.byteLength);
        }
        if (mesh.normals) {
            renderPassEncoder.setVertexBuffer(2, normalsBuffer, 0, mesh.normals.byteLength);
        }
        if (mesh.indices) {
            renderPassEncoder.setIndexBuffer(indicesBuffer, mesh.indices.elementType, 0, mesh.indices.byteLength);
            renderPassEncoder.drawIndexed(mesh.indices.count);
        }
        else {
            renderPassEncoder.draw(mesh.positions.count);
        }
    }
    render(deltaTime, scene) {
        scene.onRender(deltaTime);
        const meshesToRender = [];
        const nodeParamsBindGroups = [];
        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this.viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        });
        const viewMap = new Float32Array(viewParamsUploadBuffer.getMappedRange());
        viewMap.set(scene.camera.projectionMatrix);
        viewMap.set(scene.camera.position, 16);
        viewParamsUploadBuffer.unmap();
        const iterateNode = (node, worldMatrix) => {
            const nodeTransform = node.gameObject.transform;
            const meshMatrix = nodeTransform
                ? wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix;
            const viewMatrix = wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.copy(scene.camera.view);
            wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.translate(viewMatrix, wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.getTranslation(meshMatrix), viewMatrix);
            wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.scale(viewMatrix, wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.getScaling(meshMatrix), viewMatrix);
            //FIXME: Do this once on load
            const meshRotation = _utils_Stuff__WEBPACK_IMPORTED_MODULE_2__.Stuff.extractEulerRotation(meshMatrix);
            wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.rotateX(viewMatrix, meshRotation[0], viewMatrix);
            wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.rotateY(viewMatrix, meshRotation[1], viewMatrix);
            wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.rotateZ(viewMatrix, meshRotation[2], viewMatrix);
            const nodeParamsUploadBuffer = this.device.createBuffer({
                size: 16 * 4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            });
            const nodeParamsMap = new Float32Array(nodeParamsUploadBuffer.getMappedRange());
            nodeParamsMap.set(viewMatrix);
            nodeParamsUploadBuffer.unmap();
            const nodeParamsBindGroup = this.device.createBindGroup({
                layout: this.nodeParamsBGLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: nodeParamsUploadBuffer,
                        },
                    },
                ],
            });
            node?.gameObject?.components?.forEach((component) => {
                if (component.type === _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.mesh) {
                    meshesToRender.push(component);
                    if (!component.isPipelineBuilt) {
                        this.buildRenderPipeline(component, scene);
                    }
                    scene.meshRenderDataStorage.data.get(component.id).nodeParamsBindGroup = nodeParamsBindGroup;
                }
            });
            node?.children?.forEach((child) => {
                iterateNode(child, meshMatrix);
            });
        };
        scene.objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node, wgpu_matrix__WEBPACK_IMPORTED_MODULE_4__.mat4.identity());
        });
        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(viewParamsUploadBuffer, 0, this.viewParamsBuffer, 0, this.viewParamsBufferSize);
        this.renderPassDescriptor.colorAttachments[0].view =
            this.context.getCurrentTexture().createView();
        if (this.msaaSampleCount !== 1) {
            ;
            this.renderPassDescriptor.colorAttachments[0].view =
                this._multisampleTextureView;
            this.renderPassDescriptor.colorAttachments[0].resolveTarget = this.context
                .getCurrentTexture()
                .createView();
        }
        const renderPass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        renderPass.setBindGroup(0, this.viewParamsBindGroup);
        meshesToRender.forEach((mesh, index) => {
            this.renderMesh(mesh, scene, renderPass);
        });
        renderPass.end();
        this.device.queue.submit([commandEncoder.finish()]);
        viewParamsUploadBuffer.destroy();
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Renderer/constants.ts":
/*!*******************************************************!*\
  !*** ../engine/src/engine/core/Renderer/constants.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_DEPTH_FORMAT: () => (/* binding */ DEFAULT_DEPTH_FORMAT),
/* harmony export */   DEFAULT_SWAP_CHAIN_FORMAT: () => (/* binding */ DEFAULT_SWAP_CHAIN_FORMAT),
/* harmony export */   MSAA_SAMPLE_COUNT: () => (/* binding */ MSAA_SAMPLE_COUNT),
/* harmony export */   VIEW_PARAMS_BUFFER_SIZE: () => (/* binding */ VIEW_PARAMS_BUFFER_SIZE)
/* harmony export */ });
const DEFAULT_SWAP_CHAIN_FORMAT = 'bgra8unorm';
const DEFAULT_DEPTH_FORMAT = 'depth24plus-stencil8';
const VIEW_PARAMS_BUFFER_SIZE = 16 * 5;
const MSAA_SAMPLE_COUNT = 4;


/***/ }),

/***/ "../engine/src/engine/core/Renderer/index.ts":
/*!***************************************************!*\
  !*** ../engine/src/engine/core/Renderer/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* reexport safe */ _Renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer),
/* harmony export */   alignTo: () => (/* reexport safe */ _Renderer__WEBPACK_IMPORTED_MODULE_0__.alignTo)
/* harmony export */ });
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Renderer */ "../engine/src/engine/core/Renderer/Renderer.ts");



/***/ }),

/***/ "../engine/src/engine/core/SamplerStorage/SamplerStorage.ts":
/*!******************************************************************!*\
  !*** ../engine/src/engine/core/SamplerStorage/SamplerStorage.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SamplerStorage: () => (/* binding */ SamplerStorage)
/* harmony export */ });
class SamplerStorage {
    constructor() {
        this._samplers = new Map();
    }
    get samplers() {
        return this._samplers;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/SamplerStorage/index.ts":
/*!*********************************************************!*\
  !*** ../engine/src/engine/core/SamplerStorage/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SamplerStorage: () => (/* reexport safe */ _SamplerStorage__WEBPACK_IMPORTED_MODULE_0__.SamplerStorage)
/* harmony export */ });
/* harmony import */ var _SamplerStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SamplerStorage */ "../engine/src/engine/core/SamplerStorage/SamplerStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/Scene/Scene.ts":
/*!************************************************!*\
  !*** ../engine/src/engine/core/Scene/Scene.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scene: () => (/* binding */ Scene)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _BufferStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BufferStorage */ "../engine/src/engine/core/BufferStorage/index.ts");
/* harmony import */ var _cameras_ArcBallCamera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cameras/ArcBallCamera */ "../engine/src/engine/core/cameras/ArcBallCamera/index.ts");
/* harmony import */ var _ImageStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ImageStorage */ "../engine/src/engine/core/ImageStorage/index.ts");
/* harmony import */ var _MaterialStorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MaterialStorage */ "../engine/src/engine/core/MaterialStorage/index.ts");
/* harmony import */ var _ModelUploader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ModelUploader */ "../engine/src/engine/core/ModelUploader/index.ts");
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ObjectManager */ "../engine/src/engine/core/ObjectManager/index.ts");
/* harmony import */ var _SamplerStorage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../SamplerStorage */ "../engine/src/engine/core/SamplerStorage/index.ts");
/* harmony import */ var _TextureStorage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../TextureStorage */ "../engine/src/engine/core/TextureStorage/index.ts");
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../GameObject */ "../engine/src/engine/core/GameObject/index.ts");
/* harmony import */ var _MeshRenderDataStorage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../MeshRenderDataStorage */ "../engine/src/engine/core/MeshRenderDataStorage/index.ts");











class Scene {
    constructor(props) {
        this._objectManager = new _ObjectManager__WEBPACK_IMPORTED_MODULE_5__.ObjectManager();
        this._bufferStorage = new _BufferStorage__WEBPACK_IMPORTED_MODULE_0__.BufferStorage();
        this._imageStorage = new _ImageStorage__WEBPACK_IMPORTED_MODULE_2__.ImageStorage();
        this._samplerStorage = new _SamplerStorage__WEBPACK_IMPORTED_MODULE_6__.SamplerStorage();
        this._textureStorage = new _TextureStorage__WEBPACK_IMPORTED_MODULE_7__.TextureStorage();
        this._materialStorage = new _MaterialStorage__WEBPACK_IMPORTED_MODULE_3__.MaterialStorage();
        this._meshRenderDataStorage = new _MeshRenderDataStorage__WEBPACK_IMPORTED_MODULE_9__.MeshRenderDataStorage();
        const { camera } = props ?? {};
        //FIXME: types
        this._engine = window.WheezyEngine;
        if (!this._engine) {
            throw new Error('Failed to initialize scene as no instance of Wheezy Engine is found');
        }
        this._root = new _GameObject__WEBPACK_IMPORTED_MODULE_8__.GameObject();
        this._objectManager.addObject(this._root);
        this.camera =
            camera ??
                new _cameras_ArcBallCamera__WEBPACK_IMPORTED_MODULE_1__.ArcBallCamera({
                    zFar: 1000,
                    zNear: 0.1,
                    canvasWidth: this._engine.renderer.context.canvas.width,
                    canvasHeight: this._engine.renderer.context.canvas.height,
                    position: wgpu_matrix__WEBPACK_IMPORTED_MODULE_10__.vec3.create(0, 0, 5),
                });
    }
    get objectManager() {
        return this._objectManager;
    }
    get root() {
        return this._root;
    }
    get textureStorage() {
        return this._textureStorage;
    }
    get meshRenderDataStorage() {
        return this._meshRenderDataStorage;
    }
    get materialStorage() {
        return this._materialStorage;
    }
    get bufferStorage() {
        return this._bufferStorage;
    }
    get imageStorage() {
        return this._imageStorage;
    }
    get samplerStorage() {
        return this._samplerStorage;
    }
    get camera() {
        return this._camera;
    }
    set camera(value) {
        this._camera = value;
    }
    get engine() {
        return this._engine;
    }
    async uploadModel(props) {
        if (!this._engine) {
            throw new Error('Failed to upload model as no instance of Wheezy Engine is found');
        }
        return _ModelUploader__WEBPACK_IMPORTED_MODULE_4__.ModelUploader.uploadModel(props.modelData, this._objectManager, this._bufferStorage, this._imageStorage, this._samplerStorage, this._materialStorage, this._textureStorage, this._root, this._engine.renderer.device);
    }
    onRender(_) {
        throw new Error('onRender method should be redefined in extending class');
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Scene/index.ts":
/*!************************************************!*\
  !*** ../engine/src/engine/core/Scene/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scene: () => (/* reexport safe */ _Scene__WEBPACK_IMPORTED_MODULE_0__.Scene)
/* harmony export */ });
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scene */ "../engine/src/engine/core/Scene/Scene.ts");



/***/ }),

/***/ "../engine/src/engine/core/SceneTree/SceneTree.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/SceneTree/SceneTree.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneTree: () => (/* binding */ SceneTree)
/* harmony export */ });
class SceneTree {
    constructor() {
        this._nodes = new Map();
    }
    getNodeContentAt(position) {
        let currentTreeNode = this._nodes.get(position[0]);
        for (let i = 1; i < position.length; i++) {
            currentTreeNode = currentTreeNode?.children?.get(position[i]);
        }
        return currentTreeNode ?? null;
    }
    addNodeAt(position, nodeContent) {
        if (!position) {
            this._nodes.set(nodeContent.gameObject.id, nodeContent);
            return [nodeContent.gameObject.id];
        }
        let currentTreeNode = this.getNodeContentAt(position);
        currentTreeNode?.children?.set(nodeContent.gameObject.id, nodeContent);
        return [...position, nodeContent.gameObject.id];
    }
    reparentNode(target, child) {
        const nodeContent = this.getNodeContentAt(child);
        if (!nodeContent) {
            throw new Error(`No node found at position ${child.join()}`);
        }
        const newPosition = this.addNodeAt(target, nodeContent);
        this.removeNode(child);
        return newPosition;
    }
    removeNode(targetPosition) {
        const parentPosition = targetPosition.slice(0, targetPosition.length - 1);
        const parentNode = this.getNodeContentAt(parentPosition);
        const childrenIds = [];
        this.traverseNode(parentNode?.children, (nodeId) => {
            childrenIds.push(nodeId);
        });
        parentNode?.children?.delete(targetPosition[targetPosition.length - 1]);
        return childrenIds;
    }
    traverseNode(node, callback) {
        const iterate = (sceneNode) => {
            if (!sceneNode)
                return;
            sceneNode.forEach((value, key) => {
                callback(key, value);
                iterate(value.children);
            });
        };
        iterate(node);
    }
    get nodes() {
        return this._nodes;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/SceneTree/index.ts":
/*!****************************************************!*\
  !*** ../engine/src/engine/core/SceneTree/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneTree: () => (/* reexport safe */ _SceneTree__WEBPACK_IMPORTED_MODULE_0__.SceneTree)
/* harmony export */ });
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SceneTree */ "../engine/src/engine/core/SceneTree/SceneTree.ts");



/***/ }),

/***/ "../engine/src/engine/core/TextureStorage/TextureStorage.ts":
/*!******************************************************************!*\
  !*** ../engine/src/engine/core/TextureStorage/TextureStorage.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextureStorage: () => (/* binding */ TextureStorage)
/* harmony export */ });
class TextureStorage {
    constructor() {
        this._textures = new Map();
    }
    get textures() {
        return this._textures;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/TextureStorage/index.ts":
/*!*********************************************************!*\
  !*** ../engine/src/engine/core/TextureStorage/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextureStorage: () => (/* reexport safe */ _TextureStorage__WEBPACK_IMPORTED_MODULE_0__.TextureStorage)
/* harmony export */ });
/* harmony import */ var _TextureStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextureStorage */ "../engine/src/engine/core/TextureStorage/TextureStorage.ts");



/***/ }),

/***/ "../engine/src/engine/core/Transform/Transform.ts":
/*!********************************************************!*\
  !*** ../engine/src/engine/core/Transform/Transform.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transform: () => (/* binding */ Transform)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Component */ "../engine/src/engine/core/Component/index.ts");



class Transform extends _Component__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor(parent, matrix) {
        super(parent, _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.transform);
        this.matrix = matrix ? wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.copy(matrix) : wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.identity();
        this._position = new Float32Array(this.matrix.buffer, 4 * 12, 4);
    }
    scale(value) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.scale(this.matrix, value, this.matrix);
    }
    translate(value) {
        this._position = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(value, this._position);
    }
    rotateRadians({ x, y, z }) {
        const newMatrix = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.copy(this.matrix);
        x && wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.rotateX(newMatrix, x, newMatrix);
        y && wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.rotateY(newMatrix, y, newMatrix);
        z && wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.rotateZ(newMatrix, z, newMatrix);
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.copy(newMatrix, this.matrix);
    }
    rotateDegreesEuler({ x, y, z }) {
        const degreeToRad = 0.01745329252;
        this.rotateRadians({
            x: (x ?? 0) * degreeToRad,
            y: (y ?? 0) * degreeToRad,
            z: (z ?? 0) * degreeToRad,
        });
    }
}


/***/ }),

/***/ "../engine/src/engine/core/Transform/index.ts":
/*!****************************************************!*\
  !*** ../engine/src/engine/core/Transform/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transform: () => (/* reexport safe */ _Transform__WEBPACK_IMPORTED_MODULE_0__.Transform)
/* harmony export */ });
/* harmony import */ var _Transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Transform */ "../engine/src/engine/core/Transform/Transform.ts");



/***/ }),

/***/ "../engine/src/engine/core/cameras/ArcBallCamera/ArcBallCamera.ts":
/*!************************************************************************!*\
  !*** ../engine/src/engine/core/cameras/ArcBallCamera/ArcBallCamera.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArcBallCamera: () => (/* binding */ ArcBallCamera)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _Camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Camera */ "../engine/src/engine/core/cameras/Camera/index.ts");


class ArcBallCamera extends _Camera__WEBPACK_IMPORTED_MODULE_0__.Camera {
    constructor(props) {
        super(props);
        this._distance = 0;
        this._axis = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.create();
        const positionVec = props?.position ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.create(0, 0, 0);
        super.position = positionVec;
        this._distance = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.len(super.position);
        super.back = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.normalize(super.position);
        this.recalculateRight();
        this.recalculateUp();
        super.view = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.mat4.invert(super.matrix);
    }
    get axis() {
        return this._axis;
    }
    set axis(vec) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.copy(vec, this._axis);
    }
    get distance() {
        return this._distance;
    }
    set distance(value) {
        this._distance = value;
    }
    get matrix() {
        return super.matrix;
    }
    set matrix(mat) {
        super.matrix = mat;
        this._distance = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.len(super.position);
    }
    recalculateRight() {
        super.right = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.normalize(wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.cross(super.up, super.back));
    }
    recalculateUp() {
        super.up = wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.normalize(wgpu_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.cross(super.back, super.right));
    }
}


/***/ }),

/***/ "../engine/src/engine/core/cameras/ArcBallCamera/index.ts":
/*!****************************************************************!*\
  !*** ../engine/src/engine/core/cameras/ArcBallCamera/index.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArcBallCamera: () => (/* reexport safe */ _ArcBallCamera__WEBPACK_IMPORTED_MODULE_0__.ArcBallCamera)
/* harmony export */ });
/* harmony import */ var _ArcBallCamera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArcBallCamera */ "../engine/src/engine/core/cameras/ArcBallCamera/ArcBallCamera.ts");



/***/ }),

/***/ "../engine/src/engine/core/cameras/Camera/Camera.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/core/cameras/Camera/Camera.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Camera: () => (/* binding */ Camera)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../types */ "../engine/src/engine/types/index.ts");
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Entity */ "../engine/src/engine/core/Entity/index.ts");



class Camera extends _Entity__WEBPACK_IMPORTED_MODULE_1__.Entity {
    constructor(props) {
        super(_types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.camera);
        this._view = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.create();
        this._matrix = new Float32Array([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);
        this._right = new Float32Array(this._matrix.buffer, 4 * 0, 4);
        this._up = new Float32Array(this._matrix.buffer, 4 * 4, 4);
        this._back = new Float32Array(this._matrix.buffer, 4 * 8, 4);
        this._position = new Float32Array(this._matrix.buffer, 4 * 12, 4);
        this._zFar = props?.zFar ?? 1000;
        this._zNear = props?.zNear ?? 0.1;
        this._aspectRatio = props.canvasWidth / props.canvasHeight;
        this._projectionMatrix = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.perspective((2 * Math.PI) / 5, this._aspectRatio, this._zNear, this._zFar);
    }
    get aspectRatio() {
        return this._aspectRatio;
    }
    get zFar() {
        return this._zFar;
    }
    get zNear() {
        return this._zNear;
    }
    get projectionMatrix() {
        return this._projectionMatrix;
    }
    get view() {
        return this._view;
    }
    set view(mat) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.copy(mat, this._view);
    }
    get right() {
        return this._right;
    }
    set right(vec) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(vec, this._right);
    }
    get up() {
        return this._up;
    }
    set up(vec) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(vec, this._up);
    }
    get back() {
        return this._back;
    }
    set back(vec) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(vec, this._back);
    }
    get matrix() {
        return this._matrix;
    }
    set matrix(value) {
        this._matrix = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.copy(value, this._matrix);
    }
    get position() {
        return this._position;
    }
    set position(value) {
        wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(value, this._position);
    }
}


/***/ }),

/***/ "../engine/src/engine/core/cameras/Camera/index.ts":
/*!*********************************************************!*\
  !*** ../engine/src/engine/core/cameras/Camera/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Camera: () => (/* reexport safe */ _Camera__WEBPACK_IMPORTED_MODULE_0__.Camera)
/* harmony export */ });
/* harmony import */ var _Camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Camera */ "../engine/src/engine/core/cameras/Camera/Camera.ts");



/***/ }),

/***/ "../engine/src/engine/core/cameras/PerspectiveCamera/PerspectiveCamera.ts":
/*!********************************************************************************!*\
  !*** ../engine/src/engine/core/cameras/PerspectiveCamera/PerspectiveCamera.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PerspectiveCamera: () => (/* binding */ PerspectiveCamera)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _utils_Stuff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../utils/Stuff */ "../engine/src/utils/Stuff.ts");
/* harmony import */ var _Camera_Camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Camera/Camera */ "../engine/src/engine/core/cameras/Camera/Camera.ts");



class PerspectiveCamera extends _Camera_Camera__WEBPACK_IMPORTED_MODULE_1__.Camera {
    constructor(props) {
        super(props);
        this.pitch = 0;
        this.yaw = 0;
        const positionVec = props?.position ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0, 0, 0);
        const targetVec = props?.target ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(positionVec);
        const back = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.normalize(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.sub(positionVec, targetVec));
        this._recalculateAngles(back);
        super.position = positionVec;
    }
    _recalculateAngles(direction) {
        this.yaw = Math.atan2(direction[0], direction[2]);
        this.pitch = -Math.asin(direction[1]);
    }
    update() {
        this.yaw = _utils_Stuff__WEBPACK_IMPORTED_MODULE_0__.Stuff.mod(this.yaw, Math.PI * 2);
        this.pitch = _utils_Stuff__WEBPACK_IMPORTED_MODULE_0__.Stuff.clamp(this.pitch, -Math.PI / 2, Math.PI / 2);
        const position = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.copy(super.position);
        super.matrix = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.rotateX(wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.rotationY(this.yaw), this.pitch);
        super.position = position;
        super.view = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.mat4.invert(super.matrix);
        return super.view;
    }
}


/***/ }),

/***/ "../engine/src/engine/core/cameras/PerspectiveCamera/index.ts":
/*!********************************************************************!*\
  !*** ../engine/src/engine/core/cameras/PerspectiveCamera/index.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PerspectiveCamera: () => (/* reexport safe */ _PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera)
/* harmony export */ });
/* harmony import */ var _PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PerspectiveCamera */ "../engine/src/engine/core/cameras/PerspectiveCamera/PerspectiveCamera.ts");



/***/ }),

/***/ "../engine/src/engine/core/index.ts":
/*!******************************************!*\
  !*** ../engine/src/engine/core/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BufferStorage: () => (/* reexport safe */ _BufferStorage__WEBPACK_IMPORTED_MODULE_7__.BufferStorage),
/* harmony export */   Camera: () => (/* reexport safe */ _cameras_Camera__WEBPACK_IMPORTED_MODULE_12__.Camera),
/* harmony export */   Component: () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   DEFAULT_DEPTH_FORMAT: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_DEPTH_FORMAT),
/* harmony export */   DEFAULT_SWAP_CHAIN_FORMAT: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_14__.DEFAULT_SWAP_CHAIN_FORMAT),
/* harmony export */   Engine: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_14__.Engine),
/* harmony export */   Entity: () => (/* reexport safe */ _Entity__WEBPACK_IMPORTED_MODULE_1__.Entity),
/* harmony export */   GameObject: () => (/* reexport safe */ _GameObject__WEBPACK_IMPORTED_MODULE_2__.GameObject),
/* harmony export */   ImageStorage: () => (/* reexport safe */ _ImageStorage__WEBPACK_IMPORTED_MODULE_8__.ImageStorage),
/* harmony export */   MSAA_SAMPLE_COUNT: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_14__.MSAA_SAMPLE_COUNT),
/* harmony export */   MaterialStorage: () => (/* reexport safe */ _MaterialStorage__WEBPACK_IMPORTED_MODULE_11__.MaterialStorage),
/* harmony export */   Mesh: () => (/* reexport safe */ _Mesh__WEBPACK_IMPORTED_MODULE_6__.Mesh),
/* harmony export */   ObjectManager: () => (/* reexport safe */ _ObjectManager__WEBPACK_IMPORTED_MODULE_3__.ObjectManager),
/* harmony export */   PerspectiveCamera: () => (/* reexport safe */ _cameras_PerspectiveCamera__WEBPACK_IMPORTED_MODULE_13__.PerspectiveCamera),
/* harmony export */   Renderer: () => (/* reexport safe */ _Renderer__WEBPACK_IMPORTED_MODULE_16__.Renderer),
/* harmony export */   SamplerStorage: () => (/* reexport safe */ _SamplerStorage__WEBPACK_IMPORTED_MODULE_9__.SamplerStorage),
/* harmony export */   Scene: () => (/* reexport safe */ _Scene__WEBPACK_IMPORTED_MODULE_15__.Scene),
/* harmony export */   SceneTree: () => (/* reexport safe */ _SceneTree__WEBPACK_IMPORTED_MODULE_4__.SceneTree),
/* harmony export */   TextureStorage: () => (/* reexport safe */ _TextureStorage__WEBPACK_IMPORTED_MODULE_10__.TextureStorage),
/* harmony export */   Transform: () => (/* reexport safe */ _Transform__WEBPACK_IMPORTED_MODULE_5__.Transform),
/* harmony export */   VIEW_PARAMS_BUFFER_SIZE: () => (/* reexport safe */ _Engine__WEBPACK_IMPORTED_MODULE_14__.VIEW_PARAMS_BUFFER_SIZE),
/* harmony export */   alignTo: () => (/* reexport safe */ _Renderer__WEBPACK_IMPORTED_MODULE_16__.alignTo)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "../engine/src/engine/core/Component/index.ts");
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Entity */ "../engine/src/engine/core/Entity/index.ts");
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameObject */ "../engine/src/engine/core/GameObject/index.ts");
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ObjectManager */ "../engine/src/engine/core/ObjectManager/index.ts");
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SceneTree */ "../engine/src/engine/core/SceneTree/index.ts");
/* harmony import */ var _Transform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Transform */ "../engine/src/engine/core/Transform/index.ts");
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Mesh */ "../engine/src/engine/core/Mesh/index.ts");
/* harmony import */ var _BufferStorage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BufferStorage */ "../engine/src/engine/core/BufferStorage/index.ts");
/* harmony import */ var _ImageStorage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ImageStorage */ "../engine/src/engine/core/ImageStorage/index.ts");
/* harmony import */ var _SamplerStorage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SamplerStorage */ "../engine/src/engine/core/SamplerStorage/index.ts");
/* harmony import */ var _TextureStorage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./TextureStorage */ "../engine/src/engine/core/TextureStorage/index.ts");
/* harmony import */ var _MaterialStorage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MaterialStorage */ "../engine/src/engine/core/MaterialStorage/index.ts");
/* harmony import */ var _cameras_Camera__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./cameras/Camera */ "../engine/src/engine/core/cameras/Camera/index.ts");
/* harmony import */ var _cameras_PerspectiveCamera__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./cameras/PerspectiveCamera */ "../engine/src/engine/core/cameras/PerspectiveCamera/index.ts");
/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Engine */ "../engine/src/engine/core/Engine/index.ts");
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Scene */ "../engine/src/engine/core/Scene/index.ts");
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Renderer */ "../engine/src/engine/core/Renderer/index.ts");



















/***/ }),

/***/ "../engine/src/engine/types/core/BufferStorage/index.ts":
/*!**************************************************************!*\
  !*** ../engine/src/engine/types/core/BufferStorage/index.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Component/index.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/types/core/Component/index.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Engine/index.ts":
/*!*******************************************************!*\
  !*** ../engine/src/engine/types/core/Engine/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Entity/index.ts":
/*!*******************************************************!*\
  !*** ../engine/src/engine/types/core/Entity/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntityTypes: () => (/* binding */ EntityTypes)
/* harmony export */ });
var EntityTypes;
(function (EntityTypes) {
    EntityTypes["gameObject"] = "gameObject";
    EntityTypes["mesh"] = "mesh";
    EntityTypes["material"] = "material";
    EntityTypes["transform"] = "transform";
    EntityTypes["camera"] = "camera";
    EntityTypes["collider"] = "collider";
    EntityTypes["physicsObject"] = "physicsObject";
})(EntityTypes || (EntityTypes = {}));


/***/ }),

/***/ "../engine/src/engine/types/core/GameObject/index.ts":
/*!***********************************************************!*\
  !*** ../engine/src/engine/types/core/GameObject/index.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/ImageStorage/index.ts":
/*!*************************************************************!*\
  !*** ../engine/src/engine/types/core/ImageStorage/index.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Mesh/index.ts":
/*!*****************************************************!*\
  !*** ../engine/src/engine/types/core/Mesh/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/ObjectManager/index.ts":
/*!**************************************************************!*\
  !*** ../engine/src/engine/types/core/ObjectManager/index.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Renderer/index.ts":
/*!*********************************************************!*\
  !*** ../engine/src/engine/types/core/Renderer/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/SamplerStorage/index.ts":
/*!***************************************************************!*\
  !*** ../engine/src/engine/types/core/SamplerStorage/index.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Scene/Scene.ts":
/*!******************************************************!*\
  !*** ../engine/src/engine/types/core/Scene/Scene.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Scene/index.ts":
/*!******************************************************!*\
  !*** ../engine/src/engine/types/core/Scene/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scene */ "../engine/src/engine/types/core/Scene/Scene.ts");



/***/ }),

/***/ "../engine/src/engine/types/core/SceneTree/index.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/types/core/SceneTree/index.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/TextureStorage/index.ts":
/*!***************************************************************!*\
  !*** ../engine/src/engine/types/core/TextureStorage/index.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/core/Transform/index.ts":
/*!**********************************************************!*\
  !*** ../engine/src/engine/types/core/Transform/index.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../engine/src/engine/types/index.ts":
/*!*******************************************!*\
  !*** ../engine/src/engine/types/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntityTypes: () => (/* reexport safe */ _core_Entity__WEBPACK_IMPORTED_MODULE_0__.EntityTypes),
/* harmony export */   GLTFTextureFilter: () => (/* binding */ GLTFTextureFilter),
/* harmony export */   GLTFTextureWrap: () => (/* binding */ GLTFTextureWrap)
/* harmony export */ });
/* harmony import */ var _core_Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Entity */ "../engine/src/engine/types/core/Entity/index.ts");
/* harmony import */ var _core_GameObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/GameObject */ "../engine/src/engine/types/core/GameObject/index.ts");
/* harmony import */ var _core_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/Component */ "../engine/src/engine/types/core/Component/index.ts");
/* harmony import */ var _core_SceneTree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/SceneTree */ "../engine/src/engine/types/core/SceneTree/index.ts");
/* harmony import */ var _core_ObjectManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/ObjectManager */ "../engine/src/engine/types/core/ObjectManager/index.ts");
/* harmony import */ var _core_Mesh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/Mesh */ "../engine/src/engine/types/core/Mesh/index.ts");
/* harmony import */ var _core_Transform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/Transform */ "../engine/src/engine/types/core/Transform/index.ts");
/* harmony import */ var _core_BufferStorage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/BufferStorage */ "../engine/src/engine/types/core/BufferStorage/index.ts");
/* harmony import */ var _core_ImageStorage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/ImageStorage */ "../engine/src/engine/types/core/ImageStorage/index.ts");
/* harmony import */ var _core_SamplerStorage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/SamplerStorage */ "../engine/src/engine/types/core/SamplerStorage/index.ts");
/* harmony import */ var _core_TextureStorage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/TextureStorage */ "../engine/src/engine/types/core/TextureStorage/index.ts");
/* harmony import */ var _core_Scene__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core/Scene */ "../engine/src/engine/types/core/Scene/index.ts");
/* harmony import */ var _core_Engine__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/Engine */ "../engine/src/engine/types/core/Engine/index.ts");
/* harmony import */ var _core_Renderer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/Renderer */ "../engine/src/engine/types/core/Renderer/index.ts");














var GLTFTextureFilter;
(function (GLTFTextureFilter) {
    GLTFTextureFilter[GLTFTextureFilter["NEAREST"] = 9728] = "NEAREST";
    GLTFTextureFilter[GLTFTextureFilter["LINEAR"] = 9729] = "LINEAR";
    GLTFTextureFilter[GLTFTextureFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    GLTFTextureFilter[GLTFTextureFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    GLTFTextureFilter[GLTFTextureFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    GLTFTextureFilter[GLTFTextureFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(GLTFTextureFilter || (GLTFTextureFilter = {}));
var GLTFTextureWrap;
(function (GLTFTextureWrap) {
    GLTFTextureWrap[GLTFTextureWrap["REPEAT"] = 10497] = "REPEAT";
    GLTFTextureWrap[GLTFTextureWrap["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    GLTFTextureWrap[GLTFTextureWrap["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(GLTFTextureWrap || (GLTFTextureWrap = {}));


/***/ }),

/***/ "../engine/src/physics/Collider/index.ts":
/*!***********************************************!*\
  !*** ../engine/src/physics/Collider/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collider: () => (/* binding */ Collider)
/* harmony export */ });
/* harmony import */ var _engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../engine/core */ "../engine/src/engine/core/index.ts");
/* harmony import */ var _engine_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../engine/types */ "../engine/src/engine/types/index.ts");


class Collider extends _engine_core__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(parent) {
        super(parent, _engine_types__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.collider);
    }
}


/***/ }),

/***/ "../engine/src/physics/PhysicsObject/index.ts":
/*!****************************************************!*\
  !*** ../engine/src/physics/PhysicsObject/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PhysicsObject: () => (/* binding */ PhysicsObject)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");
/* harmony import */ var _engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../engine/core */ "../engine/src/engine/core/index.ts");
/* harmony import */ var _engine_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../engine/types */ "../engine/src/engine/types/index.ts");



class PhysicsObject extends _engine_core__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(parent) {
        super(parent, _engine_types__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.physicsObject);
        this.velocity = wgpu_matrix__WEBPACK_IMPORTED_MODULE_2__.vec3.create(0);
    }
}


/***/ }),

/***/ "../engine/src/physics/index.ts":
/*!**************************************!*\
  !*** ../engine/src/physics/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collider: () => (/* reexport safe */ _Collider__WEBPACK_IMPORTED_MODULE_0__.Collider),
/* harmony export */   PhysicsObject: () => (/* reexport safe */ _PhysicsObject__WEBPACK_IMPORTED_MODULE_1__.PhysicsObject)
/* harmony export */ });
/* harmony import */ var _Collider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collider */ "../engine/src/physics/Collider/index.ts");
/* harmony import */ var _PhysicsObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PhysicsObject */ "../engine/src/physics/PhysicsObject/index.ts");




/***/ }),

/***/ "../engine/src/utils/Stuff.ts":
/*!************************************!*\
  !*** ../engine/src/utils/Stuff.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stuff: () => (/* binding */ Stuff)
/* harmony export */ });
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");

class Stuff {
    static clamp(x, min, max) {
        return Math.min(Math.max(x, min), max);
    }
    static mod(x, div) {
        return x - Math.floor(Math.abs(x) / div) * div * Math.sign(x);
    }
    static lerp(a, b, s) {
        return wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.vec3.addScaled(a, wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.vec3.sub(b, a), s);
    }
    static rotate(vec, axis, angle) {
        return wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.vec3.transformMat4Upper3x3(vec, wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.mat4.rotation(axis, angle));
    }
    static extractEulerRotation(mat) {
        // [
        //     x1, x2, x3, x4,  // <- column 0
        //     y1, y2, y3, y4,  // <- column 1
        //     z1, z2, z3, z4,  // <- column 2
        //     w1, w2, w3, w4,  // <- column 3
        //   ]
        const rotXangle = Math.atan2(-mat[9], mat[10]);
        const cosYangle = Math.sqrt(Math.pow(mat[0], 2) + Math.pow(mat[4], 2));
        const rotYangle = Math.atan2(mat[8], cosYangle);
        const sinXangle = Math.sin(rotXangle);
        const cosXangle = Math.cos(rotXangle);
        const rotZangle = Math.atan2(cosXangle * mat[1] + sinXangle * mat[2], cosXangle * mat[5] + sinXangle * mat[6]);
        return wgpu_matrix__WEBPACK_IMPORTED_MODULE_0__.vec3.create(rotXangle, rotYangle, rotZangle);
    }
}


/***/ }),

/***/ "../engine/src/utils/WheezyGLBLoader/WheezyGLBLoader.ts":
/*!**************************************************************!*\
  !*** ../engine/src/utils/WheezyGLBLoader/WheezyGLBLoader.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WheezyGLBLoader: () => (/* binding */ WheezyGLBLoader)
/* harmony export */ });
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/core */ "../../node_modules/@loaders.gl/core/dist/lib/api/load.js");
/* harmony import */ var _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/gltf */ "../../node_modules/@loaders.gl/gltf/dist/glb-loader.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "../engine/src/utils/WheezyGLBLoader/helpers.ts");
/* harmony import */ var wgpu_matrix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wgpu-matrix */ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js");




const generateId = () => {
    return String(Math.random());
};
class WheezyGLBLoader {
    static loadImages(modelData, bufferIndexMap) {
        const imagesIndexMap = new Map();
        const imagesMap = new Map();
        modelData.json?.images?.forEach(({ bufferView, mimeType, }, index) => {
            const bufferViewData = modelData.json.bufferViews[bufferView];
            const bufferId = bufferIndexMap.get(bufferViewData.buffer);
            const bufferOffset = modelData.binChunks[bufferViewData.buffer].byteOffset ?? 0;
            bufferViewData.buffer = bufferId;
            bufferViewData.byteOffset += bufferOffset;
            const id = generateId();
            imagesIndexMap.set(index, id);
            imagesMap.set(id, { bufferView: bufferViewData, mimeType });
        });
        return { imagesIndexMap, imagesMap };
    }
    static async loadFromUrl(url) {
        const modelData = await (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_1__.load)(url, _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_2__.GLBLoader);
        console.log(modelData);
        const { bufferIndexMap, bufferMap } = this.loadBuffers(modelData);
        const { imagesIndexMap, imagesMap } = this.loadImages(modelData, bufferIndexMap);
        const { samplersIndexMap, samplersMap } = this.loadSamplers(modelData);
        const { texturesIndexMap, texturesMap } = this.loadTextures(modelData, samplersIndexMap, imagesIndexMap);
        const { materialsIndexMap, materialsMap } = this.loadMaterials(modelData, texturesIndexMap);
        const modelPreload = {
            trsMatrix: wgpu_matrix__WEBPACK_IMPORTED_MODULE_3__.mat4.identity(),
            meshes: [],
            children: [],
        };
        modelData?.json?.scenes?.forEach((scene) => {
            scene?.nodes?.forEach((nodeIndex) => {
                modelPreload.children.push(this.loadNode(nodeIndex, modelData, bufferIndexMap, materialsIndexMap));
            });
        });
        return {
            model: modelPreload,
            buffers: bufferMap,
            images: imagesMap,
            samplers: samplersMap,
            textures: texturesMap,
            materials: materialsMap,
        };
    }
    static loadNode(nodeIndex, modelData, bufferIndexMap, materialsIndexMap) {
        const nodeJsonData = modelData?.json?.nodes[nodeIndex];
        const dataStructEntry = {
            trsMatrix: nodeJsonData.matrix ?? wgpu_matrix__WEBPACK_IMPORTED_MODULE_3__.mat4.identity(),
            meshes: [],
            children: [],
        };
        if (nodeJsonData.mesh !== undefined) {
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh];
            meshJsonData.primitives.forEach((primitive) => {
                dataStructEntry.meshes.push({
                    positions: WheezyGLBLoader.parseAccessor(modelData, primitive.attributes.POSITION, GPUBufferUsage.VERTEX, bufferIndexMap),
                    indices: WheezyGLBLoader.parseAccessor(modelData, primitive.indices, GPUBufferUsage.INDEX, bufferIndexMap),
                    normals: WheezyGLBLoader.parseAccessor(modelData, primitive.attributes.NORMAL, GPUBufferUsage.VERTEX, bufferIndexMap),
                    textureCoordinates: WheezyGLBLoader.parseAccessor(modelData, primitive.attributes.TEXCOORD_0, GPUBufferUsage.VERTEX, bufferIndexMap),
                    materialId: primitive.material !== undefined
                        ? materialsIndexMap.get(primitive.material)
                        : undefined,
                    mode: primitive.mode ?? 4,
                });
            });
        }
        nodeJsonData?.children?.forEach((childIndex) => {
            dataStructEntry.children.push(this.loadNode(childIndex, modelData, bufferIndexMap, materialsIndexMap));
        });
        return dataStructEntry;
    }
}
WheezyGLBLoader.loadSamplers = (modelData) => {
    const samplersIndexMap = new Map();
    const samplersMap = new Map();
    modelData.json?.samplers?.forEach((sampler, index) => {
        const id = generateId();
        samplersIndexMap.set(index, id);
        samplersMap.set(id, sampler);
    });
    return { samplersIndexMap, samplersMap };
};
WheezyGLBLoader.loadTextures = (modelData, samplersIndexMap, imagesIndexMap) => {
    const texturesIndexMap = new Map();
    const texturesMap = new Map();
    modelData.json?.textures?.forEach((textureData, index) => {
        const id = generateId();
        const texture = {
            samplerId: samplersIndexMap.get(textureData.sampler),
            imageId: imagesIndexMap.get(textureData.source),
        };
        texturesIndexMap.set(index, id);
        texturesMap.set(id, texture);
    });
    return { texturesIndexMap, texturesMap };
};
WheezyGLBLoader.loadMaterials = (modelData, texturesIndexMap) => {
    const materialsIndexMap = new Map();
    const materialsMap = new Map();
    modelData.json?.materials?.forEach((
    //FIXME: check types
    materialData, index) => {
        const material = {
            name: materialData.name,
            baseColorFactor: materialData?.pbrMetallicRoughness?.baseColorFactor,
            emissiveFactor: materialData.emissiveFactor,
            metallicFactor: materialData?.pbrMetallicRoughness?.metallicFactor,
            roughnessFactor: materialData?.pbrMetallicRoughness?.roughnessFactor,
            baseColorTextureId: materialData?.pbrMetallicRoughness?.baseColorTexture
                ?.index !== undefined
                ? texturesIndexMap.get(materialData?.pbrMetallicRoughness
                    ?.baseColorTexture?.index)
                : undefined,
            metallicRoughnessTextureId: materialData?.pbrMetallicRoughness
                ?.metallicRoughnessTexture?.index !== undefined
                ? texturesIndexMap.get(materialData?.pbrMetallicRoughness
                    ?.metallicRoughnessTexture?.index)
                : undefined,
            normalTextureId: materialData?.normalTexture?.index !== undefined
                ? texturesIndexMap.get(materialData?.normalTexture?.index)
                : undefined,
            occlusionTextureId: materialData?.occlusionTexture?.index !== undefined
                ? texturesIndexMap.get(materialData?.occlusionTexture?.index)
                : undefined,
            emissiveTextureId: materialData?.emissiveTexture?.index !== undefined
                ? texturesIndexMap.get(materialData?.emissiveTexture?.index)
                : undefined,
        };
        const id = generateId();
        materialsIndexMap.set(index, id);
        materialsMap.set(id, material);
    });
    return { materialsIndexMap, materialsMap };
};
WheezyGLBLoader.loadBuffers = (modelData) => {
    const bufferIndexMap = new Map();
    const bufferMap = new Map();
    modelData.binChunks.forEach((chunk, index) => {
        if (chunk.arrayBuffer) {
            const id = generateId();
            bufferIndexMap.set(index, id);
            bufferMap.set(id, chunk.arrayBuffer);
        }
    });
    return { bufferIndexMap, bufferMap };
};
WheezyGLBLoader.parseAccessor = (modelData, accessorId, usage, bufferIndexMap) => {
    if (accessorId !== 0 && !accessorId) {
        return undefined;
    }
    const rawAccessor = modelData.json.accessors[accessorId];
    const rawBufferView = modelData.json.bufferViews[rawAccessor.bufferView];
    const buffer = modelData.binChunks[rawBufferView.buffer];
    const elementSize = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.getTypeSize)(rawAccessor.componentType, rawAccessor.type);
    const byteStride = Math.max(elementSize, rawBufferView.byteStride ?? 0);
    return {
        bufferId: bufferIndexMap.get(rawBufferView.buffer),
        byteStride: byteStride,
        byteLength: rawAccessor.count * (byteStride ?? 1),
        byteOffset: (rawAccessor?.byteOffset ?? 0) +
            (rawBufferView?.byteOffset ?? 0) +
            (buffer?.byteOffset ?? 0),
        count: rawAccessor.count,
        componentType: rawAccessor.componentType,
        elementType: (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.getVertexType)(rawAccessor.componentType, rawAccessor.type),
        min: rawAccessor.min,
        max: rawAccessor.max,
        usage: usage,
    };
};


/***/ }),

/***/ "../engine/src/utils/WheezyGLBLoader/helpers.ts":
/*!******************************************************!*\
  !*** ../engine/src/utils/WheezyGLBLoader/helpers.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLTFComponentType: () => (/* binding */ GLTFComponentType),
/* harmony export */   ImageUsage: () => (/* binding */ ImageUsage),
/* harmony export */   getTypeComponentsAmount: () => (/* binding */ getTypeComponentsAmount),
/* harmony export */   getTypeSize: () => (/* binding */ getTypeSize),
/* harmony export */   getVertexType: () => (/* binding */ getVertexType)
/* harmony export */ });
var GLTFComponentType;
(function (GLTFComponentType) {
    GLTFComponentType[GLTFComponentType["BYTE"] = 5120] = "BYTE";
    GLTFComponentType[GLTFComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    GLTFComponentType[GLTFComponentType["SHORT"] = 5122] = "SHORT";
    GLTFComponentType[GLTFComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    GLTFComponentType[GLTFComponentType["INT"] = 5124] = "INT";
    GLTFComponentType[GLTFComponentType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    GLTFComponentType[GLTFComponentType["FLOAT"] = 5126] = "FLOAT";
    GLTFComponentType[GLTFComponentType["DOUBLE"] = 5130] = "DOUBLE";
})(GLTFComponentType || (GLTFComponentType = {}));
const getTypeComponentsAmount = (type) => {
    switch (type) {
        case 'SCALAR':
            return 1;
        case 'VEC2':
            return 2;
        case 'VEC3':
            return 3;
        case 'VEC4':
            return 4;
        case 'MAT2':
            return 4;
        case 'MAT3':
            return 9;
        case 'MAT4':
            return 16;
        default:
            throw Error(`Invalid gltf type ${type}`);
    }
};
const getVertexType = (componentType, type) => {
    let typeStr = null;
    switch (componentType) {
        case GLTFComponentType.BYTE:
            typeStr = 'sint8';
            break;
        case GLTFComponentType.UNSIGNED_BYTE:
            typeStr = 'uint8';
            break;
        case GLTFComponentType.SHORT:
            typeStr = 'sint16';
            break;
        case GLTFComponentType.UNSIGNED_SHORT:
            typeStr = 'uint16';
            break;
        case GLTFComponentType.INT:
            typeStr = 'int32';
            break;
        case GLTFComponentType.UNSIGNED_INT:
            typeStr = 'uint32';
            break;
        case GLTFComponentType.FLOAT:
            typeStr = 'float32';
            break;
        default:
            throw Error(`Unrecognized or unsupported gltf type ${componentType}`);
    }
    switch (getTypeComponentsAmount(type)) {
        case 1:
            break;
        case 2:
            typeStr += 'x2';
            break;
        case 3:
            typeStr += 'x3';
            break;
        case 4:
            typeStr += 'x4';
            break;
        default:
            throw Error(`Invalid number of components for gltf type: ${type}`);
    }
    return typeStr;
};
const getTypeSize = (componentType, type) => {
    let componentSize = 0;
    switch (componentType) {
        case GLTFComponentType.BYTE:
            componentSize = 1;
            break;
        case GLTFComponentType.UNSIGNED_BYTE:
            componentSize = 1;
            break;
        case GLTFComponentType.SHORT:
            componentSize = 2;
            break;
        case GLTFComponentType.UNSIGNED_SHORT:
            componentSize = 2;
            break;
        case GLTFComponentType.INT:
            componentSize = 4;
            break;
        case GLTFComponentType.UNSIGNED_INT:
            componentSize = 4;
            break;
        case GLTFComponentType.FLOAT:
            componentSize = 4;
            break;
        case GLTFComponentType.DOUBLE:
            componentSize = 8;
            break;
        default:
            throw Error('Unrecognized GLTF Component Type?');
    }
    return getTypeComponentsAmount(type) * componentSize;
};
var ImageUsage;
(function (ImageUsage) {
    ImageUsage[ImageUsage["BASE_COLOR"] = 0] = "BASE_COLOR";
    ImageUsage[ImageUsage["METALLIC_ROUGHNESS"] = 1] = "METALLIC_ROUGHNESS";
    ImageUsage[ImageUsage["NORMAL"] = 2] = "NORMAL";
    ImageUsage[ImageUsage["OCCLUSION"] = 3] = "OCCLUSION";
    ImageUsage[ImageUsage["EMISSION"] = 4] = "EMISSION";
})(ImageUsage || (ImageUsage = {}));


/***/ }),

/***/ "../engine/src/utils/index.ts":
/*!************************************!*\
  !*** ../engine/src/utils/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WheezyGLBLoader: () => (/* reexport safe */ _WheezyGLBLoader_WheezyGLBLoader__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader)
/* harmony export */ });
/* harmony import */ var _WheezyGLBLoader_WheezyGLBLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WheezyGLBLoader/WheezyGLBLoader */ "../engine/src/utils/WheezyGLBLoader/WheezyGLBLoader.ts");



/***/ }),

/***/ "../engine/src/engine/shaders/testShader.wgsl":
/*!****************************************************!*\
  !*** ../engine/src/engine/shaders/testShader.wgsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "alias float4 = vec4<f32>;\nalias float3 = vec3<f32>;\nalias float2 = vec2<f32>;\n\nstruct VertexInput {\n    @location(0) position: float3,\n    @location(1) texcoords: float2,\n    @location(2) object_normal: float3\n};\n\nstruct VertexOutput {\n    @builtin(position) position: float4,\n    @location(0) world_pos: float3,\n    @location(1) texcoords: float2,\n    @location(2) object_normal: float3,\n    @location(3) camera_position: float3\n};\n\nstruct ViewParams {\n    view_proj: mat4x4<f32>,\n    camera_position: vec4f\n};\n\nstruct NodeParams {\n    transform: mat4x4<f32>,\n};\n\nstruct MaterialParams {\n    base_color_factor: float4,\n    metallic_factor: f32,\n    roughness_factor: f32,\n};\n\n@group(0) @binding(0)\nvar<uniform> view_params: ViewParams;\n\n@group(1) @binding(0)\nvar<uniform> node_params: NodeParams;\n\n@group(2) @binding(0)\nvar<uniform> material_params: MaterialParams;\n\n@group(3) @binding(1)\nvar base_color_sampler: sampler;\n\n@group(2) @binding(1)\nvar base_color_texture: texture_2d<f32>;\n\n@group(3) @binding(2)\nvar metallic_roughness_sampler: sampler;\n\n@group(2) @binding(2)\nvar metallic_roughness_texture: texture_2d<f32>;\n\n@group(3) @binding(3)\nvar tangent_normal_sampler: sampler;\n\n@group(2) @binding(3)\nvar tangent_normal_texture: texture_2d<f32>;\n\n@vertex\nfn vertex_main(vert: VertexInput) -> VertexOutput {\n    var out: VertexOutput;\n    out.position = view_params.view_proj * node_params.transform * float4(vert.position, 1.0);\n    out.world_pos = vert.position.xyz;\n    out.texcoords = vert.texcoords;\n    out.object_normal = vert.object_normal;\n    out.camera_position = view_params.camera_position.xyz;\n\n    return out;\n};\n\nfn linear_to_srgb(x: f32) -> f32 {\n    if (x <= 0.0031308) {\n        return 12.92 * x;\n    }\n    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;\n}\n\nfn decode_color(color: vec4f) -> vec4f {\n    return vec4f(linear_to_srgb(color.x), linear_to_srgb(color.y), linear_to_srgb(color.z), 1.0);\n}\n\n@fragment\nfn fragment_main(in: VertexOutput) -> @location(0) float4 {\n    let color = decode_color(\n        textureSample(base_color_texture, base_color_sampler, in.texcoords) \n            * material_params.base_color_factor\n    );\n\n    return color;\n};\n";

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js":
/*!******************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeArrayBufferIterator: () => (/* binding */ makeArrayBufferIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 256 * 1024;
function makeArrayBufferIterator(arrayBuffer) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE
    } = options;
    let byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
      const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
      const chunk = new ArrayBuffer(chunkByteLength);
      const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
      const chunkArray = new Uint8Array(chunk);
      chunkArray.set(sourceArray);
      byteOffset += chunkByteLength;
      yield chunk;
    }
  }();
}
//# sourceMappingURL=make-array-buffer-iterator.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js":
/*!**********************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeBlobIterator: () => (/* binding */ makeBlobIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 1024 * 1024;
async function* makeBlobIterator(blob, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;
  while (offset < blob.size) {
    const end = offset + chunkSize;
    const chunk = await blob.slice(offset, end).arrayBuffer();
    offset = end;
    yield chunk;
  }
}
//# sourceMappingURL=make-blob-iterator.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeIterator: () => (/* binding */ makeIterator)
/* harmony export */ });
/* harmony import */ var _make_string_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./make-string-iterator.js */ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js");
/* harmony import */ var _make_array_buffer_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./make-array-buffer-iterator.js */ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js");
/* harmony import */ var _make_blob_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./make-blob-iterator.js */ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js");
/* harmony import */ var _make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./make-stream-iterator.js */ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");





function makeIterator(data, options) {
  if (typeof data === 'string') {
    return (0,_make_string_iterator_js__WEBPACK_IMPORTED_MODULE_0__.makeStringIterator)(data, options);
  }
  if (data instanceof ArrayBuffer) {
    return (0,_make_array_buffer_iterator_js__WEBPACK_IMPORTED_MODULE_1__.makeArrayBufferIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isBlob)(data)) {
    return (0,_make_blob_iterator_js__WEBPACK_IMPORTED_MODULE_3__.makeBlobIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isReadableStream)(data)) {
    return (0,_make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__.makeStreamIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isResponse)(data)) {
    const response = data;
    return (0,_make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__.makeStreamIterator)(response.body, options);
  }
  throw new Error('makeIterator');
}
//# sourceMappingURL=make-iterator.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js":
/*!************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeStreamIterator: () => (/* binding */ makeStreamIterator)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js");

function makeStreamIterator(stream, options) {
  return _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream, options);
}
async function* makeBrowserStreamIterator(stream, options) {
  const reader = stream.getReader();
  let nextBatchPromise;
  try {
    while (true) {
      const currentBatchPromise = nextBatchPromise || reader.read();
      if (options !== null && options !== void 0 && options._streamReadAhead) {
        nextBatchPromise = reader.read();
      }
      const {
        done,
        value
      } = await currentBatchPromise;
      if (done) {
        return;
      }
      yield (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.toArrayBuffer)(value);
    }
  } catch (error) {
    reader.releaseLock();
  }
}
async function* makeNodeStreamIterator(stream, options) {
  for await (const chunk of stream) {
    yield (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.toArrayBuffer)(chunk);
  }
}
//# sourceMappingURL=make-stream-iterator.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js":
/*!************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeStringIterator: () => (/* binding */ makeStringIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 256 * 1024;
function* makeStringIterator(string, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;
  const textEncoder = new TextEncoder();
  while (offset < string.length) {
    const chunkLength = Math.min(string.length - offset, chunkSize);
    const chunk = string.slice(offset, offset + chunkLength);
    offset += chunkLength;
    yield textEncoder.encode(chunk);
  }
}
//# sourceMappingURL=make-string-iterator.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAsyncIterable: () => (/* binding */ isAsyncIterable),
/* harmony export */   isBlob: () => (/* binding */ isBlob),
/* harmony export */   isBuffer: () => (/* binding */ isBuffer),
/* harmony export */   isFile: () => (/* binding */ isFile),
/* harmony export */   isIterable: () => (/* binding */ isIterable),
/* harmony export */   isIterator: () => (/* binding */ isIterator),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   isPureObject: () => (/* binding */ isPureObject),
/* harmony export */   isReadableDOMStream: () => (/* binding */ isReadableDOMStream),
/* harmony export */   isReadableNodeStream: () => (/* binding */ isReadableNodeStream),
/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream),
/* harmony export */   isResponse: () => (/* binding */ isResponse),
/* harmony export */   isWritableDOMStream: () => (/* binding */ isWritableDOMStream),
/* harmony export */   isWritableNodeStream: () => (/* binding */ isWritableNodeStream),
/* harmony export */   isWritableStream: () => (/* binding */ isWritableStream)
/* harmony export */ });
const isBoolean = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isObject = x => x !== null && typeof x === 'object';
const isPureObject = x => isObject(x) && x.constructor === {}.constructor;
const isPromise = x => isObject(x) && isFunction(x.then);
const isIterable = x => Boolean(x) && typeof x[Symbol.iterator] === 'function';
const isAsyncIterable = x => x && typeof x[Symbol.asyncIterator] === 'function';
const isIterator = x => x && isFunction(x.next);
const isResponse = x => typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
const isFile = x => typeof File !== 'undefined' && x instanceof File;
const isBlob = x => typeof Blob !== 'undefined' && x instanceof Blob;
const isBuffer = x => x && typeof x === 'object' && x.isBuffer;
const isWritableDOMStream = x => isObject(x) && isFunction(x.abort) && isFunction(x.getWriter);
const isReadableDOMStream = x => typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
const isWritableNodeStream = x => isObject(x) && isFunction(x.end) && isFunction(x.write) && isBoolean(x.writable);
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
const isReadableStream = x => isReadableDOMStream(x) || isReadableNodeStream(x);
const isWritableStream = x => isWritableDOMStream(x) || isWritableNodeStream(x);
//# sourceMappingURL=is-type.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/api/load.js":
/*!****************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/api/load.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   load: () => (/* binding */ load)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _loader_utils_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/get-fetch-function.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parse.js */ "../../node_modules/@loaders.gl/core/dist/lib/api/parse.js");




async function load(url, loaders, options, context) {
  let resolvedLoaders;
  let resolvedOptions;
  if (!Array.isArray(loaders) && !(0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__.isLoaderObject)(loaders)) {
    resolvedLoaders = [];
    resolvedOptions = loaders;
    context = undefined;
  } else {
    resolvedLoaders = loaders;
    resolvedOptions = options;
  }
  const fetch = (0,_loader_utils_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_1__.getFetchFunction)(resolvedOptions);
  let data = url;
  if (typeof url === 'string') {
    data = await fetch(url);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isBlob)(url)) {
    data = await fetch(url);
  }
  return Array.isArray(resolvedLoaders) ? await (0,_parse_js__WEBPACK_IMPORTED_MODULE_3__.parse)(data, resolvedLoaders, resolvedOptions) : await (0,_parse_js__WEBPACK_IMPORTED_MODULE_3__.parse)(data, resolvedLoaders, resolvedOptions);
}
//# sourceMappingURL=load.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/api/parse.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/api/parse.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../loader-utils/option-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js");
/* harmony import */ var _loader_utils_get_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../loader-utils/get-data.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js");
/* harmony import */ var _loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../loader-utils/loader-context.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js");
/* harmony import */ var _utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/resource-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");
/* harmony import */ var _select_loader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./select-loader.js */ "../../node_modules/@loaders.gl/core/dist/lib/api/select-loader.js");










async function parse(data, loaders, options, context) {
  if (loaders && !Array.isArray(loaders) && !(0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__.isLoaderObject)(loaders)) {
    context = undefined;
    options = loaders;
    loaders = undefined;
  }
  data = await data;
  options = options || {};
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceUrl)(data);
  const typedLoaders = loaders;
  const candidateLoaders = (0,_loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__.getLoadersFromContext)(typedLoaders, context);
  const loader = await (0,_select_loader_js__WEBPACK_IMPORTED_MODULE_3__.selectLoader)(data, candidateLoaders, options);
  if (!loader) {
    return null;
  }
  options = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeOptions)(options, loader, candidateLoaders, url);
  context = (0,_loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__.getLoaderContext)({
    url,
    _parse: parse,
    loaders: candidateLoaders
  }, options, context || null);
  return await parseWithLoader(loader, data, options, context);
}
async function parseWithLoader(loader, data, options, context) {
  (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_5__.validateWorkerVersion)(loader);
  options = (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__.mergeLoaderOptions)(loader.options, options);
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_7__.isResponse)(data)) {
    const response = data;
    const {
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    } = response;
    const headers = Object.fromEntries(response.headers.entries());
    context.response = {
      headers,
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    };
  }
  data = await (0,_loader_utils_get_data_js__WEBPACK_IMPORTED_MODULE_8__.getArrayBufferOrStringFromData)(data, loader, options);
  const loaderWithParser = loader;
  if (loaderWithParser.parseTextSync && typeof data === 'string') {
    return loaderWithParser.parseTextSync(data, options, context);
  }
  if ((0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__.canParseWithWorker)(loader, options)) {
    return await (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__.parseWithWorker)(loader, data, options, context, parse);
  }
  if (loaderWithParser.parseText && typeof data === 'string') {
    return await loaderWithParser.parseText(data, options, context);
  }
  if (loaderWithParser.parse) {
    return await loaderWithParser.parse(data, options, context);
  }
  (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_10__.assert)(!loaderWithParser.parseSync);
  throw new Error(`${loader.id} loader - no parser found and worker is disabled`);
}
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _unregisterLoaders: () => (/* binding */ _unregisterLoaders),
/* harmony export */   getRegisteredLoaders: () => (/* binding */ getRegisteredLoaders),
/* harmony export */   registerLoaders: () => (/* binding */ registerLoaders)
/* harmony export */ });
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/option-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");


const getGlobalLoaderRegistry = () => {
  const state = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderState)();
  state.loaderRegistry = state.loaderRegistry || [];
  return state.loaderRegistry;
};
function registerLoaders(loaders) {
  const loaderRegistry = getGlobalLoaderRegistry();
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  for (const loader of loaders) {
    const normalizedLoader = (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loader);
    if (!loaderRegistry.find(registeredLoader => normalizedLoader === registeredLoader)) {
      loaderRegistry.unshift(normalizedLoader);
    }
  }
}
function getRegisteredLoaders() {
  return getGlobalLoaderRegistry();
}
function _unregisterLoaders() {
  const state = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderState)();
  state.loaderRegistry = [];
}
//# sourceMappingURL=register-loaders.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/api/select-loader.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/api/select-loader.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectLoader: () => (/* binding */ selectLoader),
/* harmony export */   selectLoaderSync: () => (/* binding */ selectLoaderSync)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/log.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/log.js");
/* harmony import */ var _utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/resource-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");
/* harmony import */ var _register_loaders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./register-loaders.js */ "../../node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _utils_url_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/url-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");







const EXT_PATTERN = /\.([^.]+)$/;
async function selectLoader(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  let loader = selectLoaderSync(data, loaders, {
    ...options,
    nothrow: true
  }, context);
  if (loader) {
    return loader;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data)) {
    data = await data.slice(0, 10).arrayBuffer();
    loader = selectLoaderSync(data, loaders, options, context);
  }
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderSync(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  if (loaders && !Array.isArray(loaders)) {
    return (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loaders);
  }
  let candidateLoaders = [];
  if (loaders) {
    candidateLoaders = candidateLoaders.concat(loaders);
  }
  if (!(options !== null && options !== void 0 && options.ignoreRegisteredLoaders)) {
    candidateLoaders.push(...(0,_register_loaders_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredLoaders)());
  }
  normalizeLoaders(candidateLoaders);
  const loader = selectLoaderInternal(data, candidateLoaders, options, context);
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderInternal(data, loaders, options, context) {
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceUrl)(data);
  const type = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceMIMEType)(data);
  const testUrl = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_4__.stripQueryString)(url) || (context === null || context === void 0 ? void 0 : context.url);
  let loader = null;
  let reason = '';
  if (options !== null && options !== void 0 && options.mimeType) {
    loader = findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.mimeType);
    reason = `match forced by supplied MIME type ${options === null || options === void 0 ? void 0 : options.mimeType}`;
  }
  loader = loader || findLoaderByUrl(loaders, testUrl);
  reason = reason || (loader ? `matched url ${testUrl}` : '');
  loader = loader || findLoaderByMIMEType(loaders, type);
  reason = reason || (loader ? `matched MIME type ${type}` : '');
  loader = loader || findLoaderByInitialBytes(loaders, data);
  reason = reason || (loader ? `matched initial data ${getFirstCharacters(data)}` : '');
  if (options !== null && options !== void 0 && options.fallbackMimeType) {
    loader = loader || findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.fallbackMimeType);
    reason = reason || (loader ? `matched fallback MIME type ${type}` : '');
  }
  if (reason) {
    var _loader;
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.log(1, `selectLoader selected ${(_loader = loader) === null || _loader === void 0 ? void 0 : _loader.name}: ${reason}.`);
  }
  return loader;
}
function validHTTPResponse(data) {
  if (data instanceof Response) {
    if (data.status === 204) {
      return false;
    }
  }
  return true;
}
function getNoValidLoaderMessage(data) {
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceUrl)(data);
  const type = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceMIMEType)(data);
  let message = 'No valid loader found (';
  message += url ? `${_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__.filename(url)}, ` : 'no url provided, ';
  message += `MIME type: ${type ? `"${type}"` : 'not provided'}, `;
  const firstCharacters = data ? getFirstCharacters(data) : '';
  message += firstCharacters ? ` first bytes: "${firstCharacters}"` : 'first bytes: not available';
  message += ')';
  return message;
}
function normalizeLoaders(loaders) {
  for (const loader of loaders) {
    (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loader);
  }
}
function findLoaderByUrl(loaders, url) {
  const match = url && EXT_PATTERN.exec(url);
  const extension = match && match[1];
  return extension ? findLoaderByExtension(loaders, extension) : null;
}
function findLoaderByExtension(loaders, extension) {
  extension = extension.toLowerCase();
  for (const loader of loaders) {
    for (const loaderExtension of loader.extensions) {
      if (loaderExtension.toLowerCase() === extension) {
        return loader;
      }
    }
  }
  return null;
}
function findLoaderByMIMEType(loaders, mimeType) {
  for (const loader of loaders) {
    if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
      return loader;
    }
    if (mimeType === `application/x.${loader.id}`) {
      return loader;
    }
  }
  return null;
}
function findLoaderByInitialBytes(loaders, data) {
  if (!data) {
    return null;
  }
  for (const loader of loaders) {
    if (typeof data === 'string') {
      if (testDataAgainstText(data, loader)) {
        return loader;
      }
    } else if (ArrayBuffer.isView(data)) {
      if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
        return loader;
      }
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      if (testDataAgainstBinary(data, byteOffset, loader)) {
        return loader;
      }
    }
  }
  return null;
}
function testDataAgainstText(data, loader) {
  if (loader.testText) {
    return loader.testText(data);
  }
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => data.startsWith(test));
}
function testDataAgainstBinary(data, byteOffset, loader) {
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => testBinary(data, byteOffset, loader, test));
}
function testBinary(data, byteOffset, loader, test) {
  if (test instanceof ArrayBuffer) {
    return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_7__.compareArrayBuffers)(test, data, test.byteLength);
  }
  switch (typeof test) {
    case 'function':
      return test(data);
    case 'string':
      const magic = getMagicString(data, byteOffset, test.length);
      return test === magic;
    default:
      return false;
  }
}
function getFirstCharacters(data) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString(data, byteOffset, length);
  }
  return '';
}
function getMagicString(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength < byteOffset + length) {
    return '';
  }
  const dataView = new DataView(arrayBuffer);
  let magic = '';
  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }
  return magic;
}
//# sourceMappingURL=select-loader.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js":
/*!************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchFile: () => (/* binding */ fetchFile),
/* harmony export */   isDataURL: () => (/* binding */ isDataURL),
/* harmony export */   isNodePath: () => (/* binding */ isNodePath),
/* harmony export */   isRequestURL: () => (/* binding */ isRequestURL)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js");
/* harmony import */ var _utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/response-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js");


function isNodePath(url) {
  return !isRequestURL(url) && !isDataURL(url);
}
function isRequestURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}
function isDataURL(url) {
  return url.startsWith('data:');
}
async function fetchFile(urlOrData, fetchOptions) {
  if (typeof urlOrData === 'string') {
    const url = (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.resolvePath)(urlOrData);
    if (isNodePath(url)) {
      var _globalThis$loaders;
      if ((_globalThis$loaders = globalThis.loaders) !== null && _globalThis$loaders !== void 0 && _globalThis$loaders.fetchNode) {
        var _globalThis$loaders2;
        return (_globalThis$loaders2 = globalThis.loaders) === null || _globalThis$loaders2 === void 0 ? void 0 : _globalThis$loaders2.fetchNode(url, fetchOptions);
      }
    }
    return await fetch(url, fetchOptions);
  }
  return await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(urlOrData);
}
//# sourceMappingURL=fetch-file.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getArrayBufferOrStringFromData: () => (/* binding */ getArrayBufferOrStringFromData),
/* harmony export */   getArrayBufferOrStringFromDataSync: () => (/* binding */ getArrayBufferOrStringFromDataSync),
/* harmony export */   getAsyncIterableFromData: () => (/* binding */ getAsyncIterableFromData),
/* harmony export */   getReadableStream: () => (/* binding */ getReadableStream)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../iterators/make-iterator/make-iterator.js */ "../../node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js");
/* harmony import */ var _utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/response-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js");




const ERR_DATA = 'Cannot convert supplied data type';
function getArrayBufferOrStringFromDataSync(data, loader, options) {
  if (loader.text && typeof data === 'string') {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBuffer)(data)) {
    data = data.buffer;
  }
  if (data instanceof ArrayBuffer) {
    const arrayBuffer = data;
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(arrayBuffer);
    }
    return arrayBuffer;
  }
  if (ArrayBuffer.isView(data)) {
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(data);
    }
    let arrayBuffer = data.buffer;
    const byteLength = data.byteLength || data.length;
    if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
      arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
    }
    return arrayBuffer;
  }
  throw new Error(ERR_DATA);
}
async function getArrayBufferOrStringFromData(data, loader, options) {
  const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);
  if (typeof data === 'string' || isArrayBuffer) {
    return getArrayBufferOrStringFromDataSync(data, loader, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data)) {
    data = await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(data);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    const response = data;
    await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkResponse)(response);
    return loader.binary ? await response.arrayBuffer() : await response.text();
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    data = (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterable)(data) || (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isAsyncIterable)(data)) {
    return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_3__.concatenateArrayBuffersAsync)(data);
  }
  throw new Error(ERR_DATA);
}
async function getAsyncIterableFromData(data, options) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterator)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    const response = data;
    await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkResponse)(response);
    const body = await response.body;
    return (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(body, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data) || (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    return (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isAsyncIterable)(data)) {
    return data;
  }
  return getIterableFromData(data);
}
async function getReadableStream(data) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    return data.body;
  }
  const response = await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(data);
  return response.body;
}
function getIterableFromData(data) {
  if (ArrayBuffer.isView(data)) {
    return function* oneChunk() {
      yield data.buffer;
    }();
  }
  if (data instanceof ArrayBuffer) {
    return function* oneChunk() {
      yield data;
    }();
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterator)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterable)(data)) {
    return data[Symbol.iterator]();
  }
  throw new Error(ERR_DATA);
}
//# sourceMappingURL=get-data.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js":
/*!***************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFetchFunction: () => (/* binding */ getFetchFunction)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch/fetch-file.js */ "../../node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js");
/* harmony import */ var _option_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./option-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");



function getFetchFunction(options, context) {
  const globalOptions = (0,_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderOptions)();
  const loaderOptions = options || globalOptions;
  if (typeof loaderOptions.fetch === 'function') {
    return loaderOptions.fetch;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(loaderOptions.fetch)) {
    return url => (0,_fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__.fetchFile)(url, loaderOptions.fetch);
  }
  if (context !== null && context !== void 0 && context.fetch) {
    return context === null || context === void 0 ? void 0 : context.fetch;
  }
  return _fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__.fetchFile;
}
//# sourceMappingURL=get-fetch-function.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js":
/*!***********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLoaderContext: () => (/* binding */ getLoaderContext),
/* harmony export */   getLoadersFromContext: () => (/* binding */ getLoadersFromContext)
/* harmony export */ });
/* harmony import */ var _get_fetch_function_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-fetch-function.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js");
/* harmony import */ var _utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/url-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js");



function getLoaderContext(context, options, parentContext) {
  if (parentContext) {
    return parentContext;
  }
  const newContext = {
    fetch: (0,_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_0__.getFetchFunction)(options, context),
    ...context
  };
  if (newContext.url) {
    const baseUrl = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.stripQueryString)(newContext.url);
    newContext.baseUrl = baseUrl;
    newContext.queryString = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.extractQueryString)(newContext.url);
    newContext.filename = _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__.filename(baseUrl);
    newContext.baseUrl = _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__.dirname(baseUrl);
  }
  if (!Array.isArray(newContext.loaders)) {
    newContext.loaders = null;
  }
  return newContext;
}
function getLoadersFromContext(loaders, context) {
  if (loaders && !Array.isArray(loaders)) {
    return loaders;
  }
  let candidateLoaders;
  if (loaders) {
    candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
  }
  if (context && context.loaders) {
    const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
    candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
  }
  return candidateLoaders && candidateLoaders.length ? candidateLoaders : undefined;
}
//# sourceMappingURL=loader-context.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConsoleLog: () => (/* binding */ ConsoleLog),
/* harmony export */   NullLog: () => (/* binding */ NullLog),
/* harmony export */   probeLog: () => (/* binding */ probeLog)
/* harmony export */ });
/* harmony import */ var _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/log */ "../../node_modules/@probe.gl/log/dist/log.js");

const probeLog = new _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__.Log({
  id: 'loaders.gl'
});
class NullLog {
  log() {
    return () => {};
  }
  info() {
    return () => {};
  }
  warn() {
    return () => {};
  }
  error() {
    return () => {};
  }
}
class ConsoleLog {
  constructor() {
    this.console = void 0;
    this.console = console;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.console.log.bind(this.console, ...args);
  }
  info() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.console.info.bind(this.console, ...args);
  }
  warn() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.console.warn.bind(this.console, ...args);
  }
  error() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.console.error.bind(this.console, ...args);
  }
}
//# sourceMappingURL=loggers.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js":
/*!*************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLoaderObject: () => (/* binding */ isLoaderObject),
/* harmony export */   normalizeLoader: () => (/* binding */ normalizeLoader)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");

function isLoaderObject(loader) {
  var _loader;
  if (!loader) {
    return false;
  }
  if (Array.isArray(loader)) {
    loader = loader[0];
  }
  const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
  return hasExtensions;
}
function normalizeLoader(loader) {
  var _loader2, _loader3;
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(loader, 'null loader');
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(isLoaderObject(loader), 'invalid loader');
  let options;
  if (Array.isArray(loader)) {
    options = loader[1];
    loader = loader[0];
    loader = {
      ...loader,
      options: {
        ...loader.options,
        ...options
      }
    };
  }
  if ((_loader2 = loader) !== null && _loader2 !== void 0 && _loader2.parseTextSync || (_loader3 = loader) !== null && _loader3 !== void 0 && _loader3.parseText) {
    loader.text = true;
  }
  if (!loader.text) {
    loader.binary = true;
  }
  return loader;
}
//# sourceMappingURL=normalize-loader.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js":
/*!************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_LOADER_OPTIONS: () => (/* binding */ DEFAULT_LOADER_OPTIONS),
/* harmony export */   REMOVED_LOADER_OPTIONS: () => (/* binding */ REMOVED_LOADER_OPTIONS)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loggers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loggers.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js");


const DEFAULT_LOADER_OPTIONS = {
  fetch: null,
  mimeType: undefined,
  nothrow: false,
  log: new _loggers_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleLog(),
  useLocalLibraries: false,
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: true,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser,
  _nodeWorkers: false,
  _workerType: '',
  limit: 0,
  _limitMB: 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  metadata: false,
  transforms: []
};
const REMOVED_LOADER_OPTIONS = {
  throws: 'nothrow',
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};
//# sourceMappingURL=option-defaults.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js":
/*!*********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobalLoaderOptions: () => (/* binding */ getGlobalLoaderOptions),
/* harmony export */   getGlobalLoaderState: () => (/* binding */ getGlobalLoaderState),
/* harmony export */   normalizeOptions: () => (/* binding */ normalizeOptions),
/* harmony export */   setGlobalOptions: () => (/* binding */ setGlobalOptions)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loggers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loggers.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js");
/* harmony import */ var _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./option-defaults.js */ "../../node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js");



function getGlobalLoaderState() {
  globalThis.loaders = globalThis.loaders || {};
  const {
    loaders
  } = globalThis;
  loaders._state = loaders._state || {};
  return loaders._state;
}
function getGlobalLoaderOptions() {
  const state = getGlobalLoaderState();
  state.globalOptions = state.globalOptions || {
    ..._option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_LOADER_OPTIONS
  };
  return state.globalOptions;
}
function setGlobalOptions(options) {
  const state = getGlobalLoaderState();
  const globalOptions = getGlobalLoaderOptions();
  state.globalOptions = normalizeOptionsInternal(globalOptions, options);
}
function normalizeOptions(options, loader, loaders, url) {
  loaders = loaders || [];
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  validateOptions(options, loaders);
  return normalizeOptionsInternal(loader, options, url);
}
function validateOptions(options, loaders) {
  validateOptionsObject(options, null, _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_LOADER_OPTIONS, _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.REMOVED_LOADER_OPTIONS, loaders);
  for (const loader of loaders) {
    const idOptions = options && options[loader.id] || {};
    const loaderOptions = loader.options && loader.options[loader.id] || {};
    const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
    validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
  }
}
function validateOptionsObject(options, id, defaultOptions, deprecatedOptions, loaders) {
  const loaderName = id || 'Top level';
  const prefix = id ? `${id}.` : '';
  for (const key in options) {
    const isSubOptions = !id && (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(options[key]);
    const isBaseUriOption = key === 'baseUri' && !id;
    const isWorkerUrlOption = key === 'workerUrl' && id;
    if (!(key in defaultOptions) && !isBaseUriOption && !isWorkerUrlOption) {
      if (key in deprecatedOptions) {
        _loggers_js__WEBPACK_IMPORTED_MODULE_2__.probeLog.warn(`${loaderName} loader option \'${prefix}${key}\' no longer supported, use \'${deprecatedOptions[key]}\'`)();
      } else if (!isSubOptions) {
        const suggestion = findSimilarOption(key, loaders);
        _loggers_js__WEBPACK_IMPORTED_MODULE_2__.probeLog.warn(`${loaderName} loader option \'${prefix}${key}\' not recognized. ${suggestion}`)();
      }
    }
  }
}
function findSimilarOption(optionKey, loaders) {
  const lowerCaseOptionKey = optionKey.toLowerCase();
  let bestSuggestion = '';
  for (const loader of loaders) {
    for (const key in loader.options) {
      if (optionKey === key) {
        return `Did you mean \'${loader.id}.${key}\'?`;
      }
      const lowerCaseKey = key.toLowerCase();
      const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);
      if (isPartialMatch) {
        bestSuggestion = bestSuggestion || `Did you mean \'${loader.id}.${key}\'?`;
      }
    }
  }
  return bestSuggestion;
}
function normalizeOptionsInternal(loader, options, url) {
  const loaderDefaultOptions = loader.options || {};
  const mergedOptions = {
    ...loaderDefaultOptions
  };
  addUrlOptions(mergedOptions, url);
  if (mergedOptions.log === null) {
    mergedOptions.log = new _loggers_js__WEBPACK_IMPORTED_MODULE_2__.NullLog();
  }
  mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
  mergeNestedFields(mergedOptions, options);
  return mergedOptions;
}
function mergeNestedFields(mergedOptions, options) {
  for (const key in options) {
    if (key in options) {
      const value = options[key];
      if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isPureObject)(value) && (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isPureObject)(mergedOptions[key])) {
        mergedOptions[key] = {
          ...mergedOptions[key],
          ...options[key]
        };
      } else {
        mergedOptions[key] = options[key];
      }
    }
  }
}
function addUrlOptions(options, url) {
  if (url && !('baseUri' in options)) {
    options.baseUri = url;
  }
}
//# sourceMappingURL=option-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/utils/log.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/utils/log.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
/* harmony import */ var _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/log */ "../../node_modules/@probe.gl/log/dist/log.js");

const log = new _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__.Log({
  id: 'loaders.gl'
});
//# sourceMappingURL=log.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseMIMEType: () => (/* binding */ parseMIMEType),
/* harmony export */   parseMIMETypeFromURL: () => (/* binding */ parseMIMETypeFromURL)
/* harmony export */ });
const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
function parseMIMEType(mimeString) {
  const matches = MIME_TYPE_PATTERN.exec(mimeString);
  if (matches) {
    return matches[1];
  }
  return mimeString;
}
function parseMIMETypeFromURL(url) {
  const matches = DATA_URL_PATTERN.exec(url);
  if (matches) {
    return matches[1];
  }
  return '';
}
//# sourceMappingURL=mime-type-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getResourceContentLength: () => (/* binding */ getResourceContentLength),
/* harmony export */   getResourceMIMEType: () => (/* binding */ getResourceMIMEType),
/* harmony export */   getResourceUrl: () => (/* binding */ getResourceUrl)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mime-type-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js");
/* harmony import */ var _url_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");



function getResourceUrl(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    return response.url;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.name || '';
  }
  if (typeof resource === 'string') {
    return resource;
  }
  return '';
}
function getResourceMIMEType(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    const contentTypeHeader = response.headers.get('content-type') || '';
    const noQueryUrl = (0,_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.stripQueryString)(response.url);
    return (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMEType)(contentTypeHeader) || (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMETypeFromURL)(noQueryUrl);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.type || '';
  }
  if (typeof resource === 'string') {
    return (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMETypeFromURL)(resource);
  }
  return '';
}
function getResourceContentLength(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    return response.headers['content-length'] || -1;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.size;
  }
  if (typeof resource === 'string') {
    return resource.length;
  }
  if (resource instanceof ArrayBuffer) {
    return resource.byteLength;
  }
  if (ArrayBuffer.isView(resource)) {
    return resource.byteLength;
  }
  return -1;
}
//# sourceMappingURL=resource-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkResponse: () => (/* binding */ checkResponse),
/* harmony export */   checkResponseSync: () => (/* binding */ checkResponseSync),
/* harmony export */   makeResponse: () => (/* binding */ makeResponse)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "../../node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _resource_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resource-utils.js */ "../../node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");


async function makeResponse(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    return resource;
  }
  const headers = {};
  const contentLength = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceContentLength)(resource);
  if (contentLength >= 0) {
    headers['content-length'] = String(contentLength);
  }
  const url = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceUrl)(resource);
  const type = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceMIMEType)(resource);
  if (type) {
    headers['content-type'] = type;
  }
  const initialDataUrl = await getInitialDataUrl(resource);
  if (initialDataUrl) {
    headers['x-first-bytes'] = initialDataUrl;
  }
  if (typeof resource === 'string') {
    resource = new TextEncoder().encode(resource);
  }
  const response = new Response(resource, {
    headers
  });
  Object.defineProperty(response, 'url', {
    value: url
  });
  return response;
}
async function checkResponse(response) {
  if (!response.ok) {
    const message = await getResponseError(response);
    throw new Error(message);
  }
}
function checkResponseSync(response) {
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
    throw new Error(message);
  }
}
async function getResponseError(response) {
  let message = `Failed to fetch resource ${response.url} (${response.status}): `;
  try {
    const contentType = response.headers.get('Content-Type');
    let text = response.statusText;
    if (contentType !== null && contentType !== void 0 && contentType.includes('application/json')) {
      text += ` ${await response.text()}`;
    }
    message += text;
    message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
  } catch (error) {}
  return message;
}
async function getInitialDataUrl(resource) {
  const INITIAL_DATA_LENGTH = 5;
  if (typeof resource === 'string') {
    return `data:,${resource.slice(0, INITIAL_DATA_LENGTH)}`;
  }
  if (resource instanceof Blob) {
    const blobSlice = resource.slice(0, 5);
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => {
        var _event$target;
        return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
      };
      reader.readAsDataURL(blobSlice);
    });
  }
  if (resource instanceof ArrayBuffer) {
    const slice = resource.slice(0, INITIAL_DATA_LENGTH);
    const base64 = arrayBufferToBase64(slice);
    return `data:base64,${base64}`;
  }
  return null;
}
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
//# sourceMappingURL=response-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractQueryString: () => (/* binding */ extractQueryString),
/* harmony export */   stripQueryString: () => (/* binding */ stripQueryString)
/* harmony export */ });
const QUERY_STRING_PATTERN = /\?.*/;
function extractQueryString(url) {
  const matches = url.match(QUERY_STRING_PATTERN);
  return matches && matches[0];
}
function stripQueryString(url) {
  return url.replace(QUERY_STRING_PATTERN, '');
}
//# sourceMappingURL=url-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/gltf/dist/glb-loader.js":
/*!**************************************************************!*\
  !*** ../../node_modules/@loaders.gl/gltf/dist/glb-loader.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLBLoader: () => (/* binding */ GLBLoader)
/* harmony export */ });
/* harmony import */ var _lib_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/utils/version.js */ "../../node_modules/@loaders.gl/gltf/dist/lib/utils/version.js");
/* harmony import */ var _lib_parsers_parse_glb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/parsers/parse-glb.js */ "../../node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js");


const GLBLoader = {
  name: 'GLB',
  id: 'glb',
  module: 'gltf',
  version: _lib_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION,
  extensions: ['glb'],
  mimeTypes: ['model/gltf-binary'],
  binary: true,
  parse,
  parseSync,
  options: {
    glb: {
      strict: false
    }
  }
};
async function parse(arrayBuffer, options) {
  return parseSync(arrayBuffer, options);
}
function parseSync(arrayBuffer, options) {
  const {
    byteOffset = 0
  } = options || {};
  const glb = {};
  (0,_lib_parsers_parse_glb_js__WEBPACK_IMPORTED_MODULE_1__.parseGLBSync)(glb, arrayBuffer, byteOffset, options === null || options === void 0 ? void 0 : options.glb);
  return glb;
}
//# sourceMappingURL=glb-loader.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isGLB: () => (/* binding */ isGLB),
/* harmony export */   parseGLBSync: () => (/* binding */ parseGLBSync)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js");

const LITTLE_ENDIAN = true;
const MAGIC_glTF = 0x676c5446;
const GLB_FILE_HEADER_SIZE = 12;
const GLB_CHUNK_HEADER_SIZE = 8;
const GLB_CHUNK_TYPE_JSON = 0x4e4f534a;
const GLB_CHUNK_TYPE_BIN = 0x004e4942;
const GLB_V1_CONTENT_FORMAT_JSON = 0x0;
const GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED = 0;
const GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED = 1;
function getMagicString(dataView) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return `\
${String.fromCharCode(dataView.getUint8(byteOffset + 0))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 1))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 2))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 3))}`;
}
function isGLB(arrayBuffer) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const dataView = new DataView(arrayBuffer);
  const {
    magic = MAGIC_glTF
  } = options;
  const magic1 = dataView.getUint32(byteOffset, false);
  return magic1 === magic || magic1 === MAGIC_glTF;
}
function parseGLBSync(glb, arrayBuffer) {
  let byteOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const dataView = new DataView(arrayBuffer);
  const type = getMagicString(dataView, byteOffset + 0);
  const version = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
  const byteLength = dataView.getUint32(byteOffset + 8, LITTLE_ENDIAN);
  Object.assign(glb, {
    header: {
      byteOffset,
      byteLength,
      hasBinChunk: false
    },
    type,
    version,
    json: {},
    binChunks: []
  });
  byteOffset += GLB_FILE_HEADER_SIZE;
  switch (glb.version) {
    case 1:
      return parseGLBV1(glb, dataView, byteOffset);
    case 2:
      return parseGLBV2(glb, dataView, byteOffset, options = {});
    default:
      throw new Error(`Invalid GLB version ${glb.version}. Only supports version 1 and 2.`);
  }
}
function parseGLBV1(glb, dataView, byteOffset) {
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  const contentLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
  const contentFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
  byteOffset += GLB_CHUNK_HEADER_SIZE;
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(contentFormat === GLB_V1_CONTENT_FORMAT_JSON);
  parseJSONChunk(glb, dataView, byteOffset, contentLength);
  byteOffset += contentLength;
  byteOffset += parseBINChunk(glb, dataView, byteOffset, glb.header.byteLength);
  return byteOffset;
}
function parseGLBV2(glb, dataView, byteOffset, options) {
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  parseGLBChunksSync(glb, dataView, byteOffset, options);
  return byteOffset + glb.header.byteLength;
}
function parseGLBChunksSync(glb, dataView, byteOffset, options) {
  while (byteOffset + 8 <= glb.header.byteLength) {
    const chunkLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
    const chunkFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
    byteOffset += GLB_CHUNK_HEADER_SIZE;
    switch (chunkFormat) {
      case GLB_CHUNK_TYPE_JSON:
        parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_BIN:
        parseBINChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
      case GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseBINChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
      default:
        break;
    }
    byteOffset += (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
  }
  return byteOffset;
}
function parseJSONChunk(glb, dataView, byteOffset, chunkLength) {
  const jsonChunk = new Uint8Array(dataView.buffer, byteOffset, chunkLength);
  const textDecoder = new TextDecoder('utf8');
  const jsonText = textDecoder.decode(jsonChunk);
  glb.json = JSON.parse(jsonText);
  return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
}
function parseBINChunk(glb, dataView, byteOffset, chunkLength) {
  glb.header.hasBinChunk = true;
  glb.binChunks.push({
    byteOffset,
    byteLength: chunkLength,
    arrayBuffer: dataView.buffer
  });
  return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
}
//# sourceMappingURL=parse-glb.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/gltf/dist/lib/utils/version.js":
/*!*********************************************************************!*\
  !*** ../../node_modules/@loaders.gl/gltf/dist/lib/utils/version.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION =  true ? "4.1.3" : 0;
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareArrayBuffers: () => (/* binding */ compareArrayBuffers),
/* harmony export */   concatenateArrayBuffers: () => (/* binding */ concatenateArrayBuffers),
/* harmony export */   concatenateArrayBuffersFromArray: () => (/* binding */ concatenateArrayBuffersFromArray),
/* harmony export */   concatenateTypedArrays: () => (/* binding */ concatenateTypedArrays),
/* harmony export */   sliceArrayBuffer: () => (/* binding */ sliceArrayBuffer)
/* harmony export */ });
function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
  byteLength = byteLength || arrayBuffer1.byteLength;
  if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
    return false;
  }
  const array1 = new Uint8Array(arrayBuffer1);
  const array2 = new Uint8Array(arrayBuffer2);
  for (let i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
function concatenateArrayBuffers() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  return concatenateArrayBuffersFromArray(sources);
}
function concatenateArrayBuffersFromArray(sources) {
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;
  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }
  return result.buffer;
}
function concatenateTypedArrays() {
  for (var _len2 = arguments.length, typedArrays = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    typedArrays[_key2] = arguments[_key2];
  }
  const arrays = typedArrays;
  const TypedArrayConstructor = arrays && arrays.length > 1 && arrays[0].constructor || null;
  if (!TypedArrayConstructor) {
    throw new Error('"concatenateTypedArrays" - incorrect quantity of arguments or arguments have incompatible data types');
  }
  const sumLength = arrays.reduce((acc, value) => acc + value.length, 0);
  const result = new TypedArrayConstructor(sumLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}
function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
  const subArray = byteLength !== undefined ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
  const arrayCopy = new Uint8Array(subArray);
  return arrayCopy.buffer;
}
//# sourceMappingURL=array-buffer-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBuffer: () => (/* binding */ isBuffer),
/* harmony export */   toArrayBuffer: () => (/* binding */ toArrayBuffer),
/* harmony export */   toBuffer: () => (/* binding */ toBuffer)
/* harmony export */ });
/* harmony import */ var _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node/buffer.js */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js");

function isBuffer(value) {
  return value && typeof value === 'object' && value.isBuffer;
}
function toBuffer(data) {
  return _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toBuffer ? _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toBuffer(data) : data;
}
function toArrayBuffer(data) {
  if (isBuffer(data)) {
    return _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toArrayBuffer(data);
  }
  if (data instanceof ArrayBuffer) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }
  if (data && typeof data === 'object' && data._toArrayBuffer) {
    return data._toArrayBuffer();
  }
  throw new Error('toArrayBuffer');
}
//# sourceMappingURL=memory-conversion-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js":
/*!**********************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyArrayBuffer: () => (/* binding */ copyArrayBuffer),
/* harmony export */   copyToArray: () => (/* binding */ copyToArray),
/* harmony export */   padToNBytes: () => (/* binding */ padToNBytes)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");

function padToNBytes(byteLength, padding) {
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(byteLength >= 0);
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(padding > 0);
  return byteLength + (padding - 1) & ~(padding - 1);
}
function copyArrayBuffer(targetBuffer, sourceBuffer, byteOffset) {
  let byteLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : sourceBuffer.byteLength;
  const targetArray = new Uint8Array(targetBuffer, byteOffset, byteLength);
  const sourceArray = new Uint8Array(sourceBuffer);
  targetArray.set(sourceArray);
  return targetBuffer;
}
function copyToArray(source, target, targetOffset) {
  let sourceArray;
  if (source instanceof ArrayBuffer) {
    sourceArray = new Uint8Array(source);
  } else {
    const srcByteOffset = source.byteOffset;
    const srcByteLength = source.byteLength;
    sourceArray = new Uint8Array(source.buffer || source.arrayBuffer, srcByteOffset, srcByteLength);
  }
  target.set(sourceArray, targetOffset);
  return targetOffset + padToNBytes(sourceArray.byteLength, 4);
}
//# sourceMappingURL=memory-copy-utils.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}
//# sourceMappingURL=assert.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js":
/*!*********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isWorker: () => (/* binding */ isWorker),
/* harmony export */   nodeVersion: () => (/* binding */ nodeVersion),
/* harmony export */   self: () => (/* binding */ self_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const self_ = globals.self || globals.window || globals.global || {};
const window_ = globals.window || globals.self || globals.global || {};
const global_ = globals.global || globals.self || globals.window || {};
const document_ = globals.document || {};

const isBrowser = Boolean(typeof process !== 'object' || String(process) !== '[object process]' || process.browser);
const isWorker = typeof importScripts === 'function';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
const nodeVersion = matches && parseFloat(matches[1]) || 0;
//# sourceMappingURL=globals.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   concatenateArrayBuffersAsync: () => (/* binding */ concatenateArrayBuffersAsync),
/* harmony export */   concatenateStringsAsync: () => (/* binding */ concatenateStringsAsync),
/* harmony export */   forEach: () => (/* binding */ forEach)
/* harmony export */ });
/* harmony import */ var _binary_utils_array_buffer_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../binary-utils/array-buffer-utils.js */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js");

async function forEach(iterator, visitor) {
  while (true) {
    const {
      done,
      value
    } = await iterator.next();
    if (done) {
      iterator.return();
      return;
    }
    const cancel = visitor(value);
    if (cancel) {
      return;
    }
  }
}
async function concatenateArrayBuffersAsync(asyncIterator) {
  const arrayBuffers = [];
  for await (const chunk of asyncIterator) {
    arrayBuffers.push(chunk);
  }
  return (0,_binary_utils_array_buffer_utils_js__WEBPACK_IMPORTED_MODULE_0__.concatenateArrayBuffers)(...arrayBuffers);
}
async function concatenateStringsAsync(asyncIterator) {
  const strings = [];
  for await (const chunk of asyncIterator) {
    strings.push(chunk);
  }
  return strings.join('');
}
//# sourceMappingURL=async-iteration.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js":
/*!***********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toArrayBuffer: () => (/* binding */ toArrayBuffer),
/* harmony export */   toBuffer: () => (/* binding */ toBuffer)
/* harmony export */ });
function toArrayBuffer(buffer) {
  return buffer;
}
function toBuffer(binaryData) {
  throw new Error('Buffer not supported in browser');
}
//# sourceMappingURL=buffer.browser.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeLoaderOptions: () => (/* binding */ mergeLoaderOptions)
/* harmony export */ });
function mergeLoaderOptions(baseOptions, newOptions) {
  return mergeOptionsRecursively(baseOptions || {}, newOptions);
}
function mergeOptionsRecursively(baseOptions, newOptions) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (level > 3) {
    return newOptions;
  }
  const options = {
    ...baseOptions
  };
  for (const [key, newValue] of Object.entries(newOptions)) {
    if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
      options[key] = mergeOptionsRecursively(options[key] || {}, newOptions[key], level + 1);
    } else {
      options[key] = newOptions[key];
    }
  }
  return options;
}
//# sourceMappingURL=merge-loader-options.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js":
/*!***************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAliases: () => (/* binding */ addAliases),
/* harmony export */   getPathPrefix: () => (/* binding */ getPathPrefix),
/* harmony export */   resolvePath: () => (/* binding */ resolvePath),
/* harmony export */   setPathPrefix: () => (/* binding */ setPathPrefix)
/* harmony export */ });
let pathPrefix = '';
const fileAliases = {};
function setPathPrefix(prefix) {
  pathPrefix = prefix;
}
function getPathPrefix() {
  return pathPrefix;
}
function addAliases(aliases) {
  Object.assign(fileAliases, aliases);
}
function resolvePath(filename) {
  for (const alias in fileAliases) {
    if (filename.startsWith(alias)) {
      const replacement = fileAliases[alias];
      filename = filename.replace(alias, replacement);
    }
  }
  if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
    filename = `${pathPrefix}${filename}`;
  }
  return filename;
}
//# sourceMappingURL=file-aliases.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js":
/*!**********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCWD: () => (/* binding */ getCWD)
/* harmony export */ });
function getCWD() {
  var _window$location;
  if (typeof process !== 'undefined' && typeof process.cwd !== 'undefined') {
    return process.cwd();
  }
  const pathname = (_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.pathname;
  return (pathname === null || pathname === void 0 ? void 0 : pathname.slice(0, pathname.lastIndexOf('/') + 1)) || '';
}
//# sourceMappingURL=get-cwd.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js":
/*!*******************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dirname: () => (/* binding */ dirname),
/* harmony export */   filename: () => (/* binding */ filename),
/* harmony export */   join: () => (/* binding */ join),
/* harmony export */   resolve: () => (/* binding */ resolve)
/* harmony export */ });
/* harmony import */ var _get_cwd_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-cwd.js */ "../../node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js");

function filename(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(slashIndex + 1) : '';
}
function dirname(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(0, slashIndex) : '';
}
function join() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  const separator = '/';
  parts = parts.map((part, index) => {
    if (index) {
      part = part.replace(new RegExp(`^${separator}`), '');
    }
    if (index !== parts.length - 1) {
      part = part.replace(new RegExp(`${separator}$`), '');
    }
    return part;
  });
  return parts.join(separator);
}
function resolve() {
  const paths = [];
  for (let _i = 0; _i < arguments.length; _i++) {
    paths[_i] = _i < 0 || arguments.length <= _i ? undefined : arguments[_i];
  }
  let resolvedPath = '';
  let resolvedAbsolute = false;
  let cwd;
  for (let i = paths.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) {
      path = paths[i];
    } else {
      if (cwd === undefined) {
        cwd = (0,_get_cwd_js__WEBPACK_IMPORTED_MODULE_0__.getCWD)();
      }
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = path.charCodeAt(0) === SLASH;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    return `/${resolvedPath}`;
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  }
  return '.';
}
const SLASH = 47;
const DOT = 46;
function normalizeStringPosix(path, allowAboveRoot) {
  let res = '';
  let lastSlash = -1;
  let dots = 0;
  let code;
  let isAboveRoot = false;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (code === SLASH) {
      break;
    } else {
      code = SLASH;
    }
    if (code === SLASH) {
      if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
          if (res.length > 2) {
            const start = res.length - 1;
            let j = start;
            for (; j >= 0; --j) {
              if (res.charCodeAt(j) === SLASH) {
                break;
              }
            }
            if (j !== start) {
              res = j === -1 ? '' : res.slice(0, j);
              lastSlash = i;
              dots = 0;
              isAboveRoot = false;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSlash = i;
            dots = 0;
            isAboveRoot = false;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += '/..';
          } else {
            res = '..';
          }
          isAboveRoot = true;
        }
      } else {
        const slice = path.slice(lastSlash + 1, i);
        if (res.length > 0) {
          res += `/${slice}`;
        } else {
          res = slice;
        }
        isAboveRoot = false;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
//# sourceMappingURL=path.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canParseWithWorker: () => (/* binding */ canParseWithWorker),
/* harmony export */   parseWithWorker: () => (/* binding */ parseWithWorker)
/* harmony export */ });
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js");


function canParseWithWorker(loader, options) {
  if (!_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported()) {
    return false;
  }
  if (!_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser && !(options !== null && options !== void 0 && options._nodeWorkers)) {
    return false;
  }
  return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
}
async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
  const name = loader.id;
  const url = (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_2__.getWorkerURL)(loader, options);
  const workerFarm = _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__["default"].getWorkerFarm(options);
  const workerPool = workerFarm.getWorkerPool({
    name,
    url
  });
  options = JSON.parse(JSON.stringify(options));
  context = JSON.parse(JSON.stringify(context || {}));
  const job = await workerPool.startJob('process-on-worker', onMessage.bind(null, parseOnMainThread));
  job.postMessage('process', {
    input: data,
    options,
    context
  });
  const result = await job.result;
  return await result.result;
}
async function onMessage(parseOnMainThread, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;
    case 'error':
      job.error(new Error(payload.error));
      break;
    case 'process':
      const {
        id,
        input,
        options
      } = payload;
      try {
        const result = await parseOnMainThread(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }
      break;
    default:
      console.warn(`parse-with-worker unknown message ${type}`);
  }
}
//# sourceMappingURL=parse-with-worker.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'loaders.gl assertion failed.');
  }
}
//# sourceMappingURL=assert.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js":
/*!*********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isMobile: () => (/* binding */ isMobile),
/* harmony export */   isWorker: () => (/* binding */ isWorker),
/* harmony export */   nodeVersion: () => (/* binding */ nodeVersion),
/* harmony export */   self: () => (/* binding */ self_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const self_ = globals.self || globals.window || globals.global || {};
const window_ = globals.window || globals.self || globals.global || {};
const global_ = globals.global || globals.self || globals.window || {};
const document_ = globals.document || {};

const isBrowser = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const isWorker = typeof importScripts === 'function';
const isMobile = typeof window !== 'undefined' && typeof window.orientation !== 'undefined';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
const nodeVersion = matches && parseFloat(matches[1]) || 0;
//# sourceMappingURL=globals.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js":
/*!*********************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NPM_TAG: () => (/* binding */ NPM_TAG),
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const NPM_TAG = 'latest';
function getVersion() {
  var _globalThis$_loadersg;
  if (!((_globalThis$_loadersg = globalThis._loadersgl_) !== null && _globalThis$_loadersg !== void 0 && _globalThis$_loadersg.version)) {
    globalThis._loadersgl_ = globalThis._loadersgl_ || {};
    if (false) {} else {
      globalThis._loadersgl_.version = "4.1.3";
    }
  }
  return globalThis._loadersgl_.version;
}
const VERSION = getVersion();
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js":
/*!*******************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeWorker: () => (/* binding */ NodeWorker),
/* harmony export */   parentPort: () => (/* binding */ parentPort)
/* harmony export */ });
class NodeWorker {
  terminate() {}
}
const parentPort = null;
//# sourceMappingURL=worker_threads-browser.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getWorkerName: () => (/* binding */ getWorkerName),
/* harmony export */   getWorkerURL: () => (/* binding */ getWorkerURL)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env-utils/globals.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/version.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js");



function getWorkerName(worker) {
  const warning = worker.version !== _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION ? ` (worker-utils@${_env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION})` : '';
  return `${worker.name}@${worker.version}${warning}`;
}
function getWorkerURL(worker) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const workerOptions = options[worker.id] || {};
  const workerFile = _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser ? `${worker.id}-worker.js` : `${worker.id}-worker-node.js`;
  let url = workerOptions.workerUrl;
  if (!url && worker.id === 'compression') {
    url = options.workerUrl;
  }
  if (options._workerType === 'test') {
    if (_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
      url = `modules/${worker.module}/dist/${workerFile}`;
    } else {
      url = `modules/${worker.module}/src/workers/${worker.id}-worker-node.ts`;
    }
  }
  if (!url) {
    let version = worker.version;
    if (version === 'latest') {
      version = _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.NPM_TAG;
    }
    const versionTag = version ? `@${version}` : '';
    url = `https://unpkg.com/@loaders.gl/${worker.module}${versionTag}/dist/${workerFile}`;
  }
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__.assert)(url);
  return url;
}
//# sourceMappingURL=get-worker-url.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js":
/*!**************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateWorkerVersion: () => (/* binding */ validateWorkerVersion)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/version.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js");


function validateWorkerVersion(worker) {
  let coreVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION;
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_1__.assert)(worker, 'no worker provided');
  const workerVersion = worker.version;
  if (!coreVersion || !workerVersion) {
    return false;
  }
  return true;
}
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0],
    minor: parts[1]
  };
}
//# sourceMappingURL=validate-worker-version.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js":
/*!***************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerFarm)
/* harmony export */ });
/* harmony import */ var _worker_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worker-pool.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js");
/* harmony import */ var _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker-thread.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js");


const DEFAULT_PROPS = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: true,
  onDebug: () => {}
};
class WorkerFarm {
  static isSupported() {
    return _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported();
  }
  static getWorkerFarm() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});
    WorkerFarm._workerFarm.setProps(props);
    return WorkerFarm._workerFarm;
  }
  constructor(props) {
    this.props = void 0;
    this.workerPools = new Map();
    this.props = {
      ...DEFAULT_PROPS
    };
    this.setProps(props);
    this.workerPools = new Map();
  }
  destroy() {
    for (const workerPool of this.workerPools.values()) {
      workerPool.destroy();
    }
    this.workerPools = new Map();
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    for (const workerPool of this.workerPools.values()) {
      workerPool.setProps(this._getWorkerPoolProps());
    }
  }
  getWorkerPool(options) {
    const {
      name,
      source,
      url
    } = options;
    let workerPool = this.workerPools.get(name);
    if (!workerPool) {
      workerPool = new _worker_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
        name,
        source,
        url
      });
      workerPool.setProps(this._getWorkerPoolProps());
      this.workerPools.set(name, workerPool);
    }
    return workerPool;
  }
  _getWorkerPoolProps() {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }
}
WorkerFarm._workerFarm = void 0;
//# sourceMappingURL=worker-farm.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js":
/*!**************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerJob)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");

class WorkerJob {
  constructor(jobName, workerThread) {
    this.name = void 0;
    this.workerThread = void 0;
    this.isRunning = true;
    this.result = void 0;
    this._resolve = () => {};
    this._reject = () => {};
    this.name = jobName;
    this.workerThread = workerThread;
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  postMessage(type, payload) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type,
      payload
    });
  }
  done(value) {
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(this.isRunning);
    this.isRunning = false;
    this._resolve(value);
  }
  error(error) {
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(this.isRunning);
    this.isRunning = false;
    this._reject(error);
  }
}
//# sourceMappingURL=worker-job.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js":
/*!***************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerPool)
/* harmony export */ });
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/globals.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker-thread.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js");
/* harmony import */ var _worker_job_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worker-job.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js");



class WorkerPool {
  static isSupported() {
    return _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported();
  }
  constructor(props) {
    this.name = 'unnamed';
    this.source = void 0;
    this.url = void 0;
    this.maxConcurrency = 1;
    this.maxMobileConcurrency = 1;
    this.onDebug = () => {};
    this.reuseWorkers = true;
    this.props = {};
    this.jobQueue = [];
    this.idleQueue = [];
    this.count = 0;
    this.isDestroyed = false;
    this.source = props.source;
    this.url = props.url;
    this.setProps(props);
  }
  destroy() {
    this.idleQueue.forEach(worker => worker.destroy());
    this.isDestroyed = true;
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    if (props.name !== undefined) {
      this.name = props.name;
    }
    if (props.maxConcurrency !== undefined) {
      this.maxConcurrency = props.maxConcurrency;
    }
    if (props.maxMobileConcurrency !== undefined) {
      this.maxMobileConcurrency = props.maxMobileConcurrency;
    }
    if (props.reuseWorkers !== undefined) {
      this.reuseWorkers = props.reuseWorkers;
    }
    if (props.onDebug !== undefined) {
      this.onDebug = props.onDebug;
    }
  }
  async startJob(name) {
    let onMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (job, type, data) => job.done(data);
    let onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (job, error) => job.error(error);
    const startPromise = new Promise(onStart => {
      this.jobQueue.push({
        name,
        onMessage,
        onError,
        onStart
      });
      return this;
    });
    this._startQueuedJob();
    return await startPromise;
  }
  async _startQueuedJob() {
    if (!this.jobQueue.length) {
      return;
    }
    const workerThread = this._getAvailableWorker();
    if (!workerThread) {
      return;
    }
    const queuedJob = this.jobQueue.shift();
    if (queuedJob) {
      this.onDebug({
        message: 'Starting job',
        name: queuedJob.name,
        workerThread,
        backlog: this.jobQueue.length
      });
      const job = new _worker_job_js__WEBPACK_IMPORTED_MODULE_1__["default"](queuedJob.name, workerThread);
      workerThread.onMessage = data => queuedJob.onMessage(job, data.type, data.payload);
      workerThread.onError = error => queuedJob.onError(job, error);
      queuedJob.onStart(job);
      try {
        await job.result;
      } catch (error) {
        console.error(`Worker exception: ${error}`);
      } finally {
        this.returnWorkerToQueue(workerThread);
      }
    }
  }
  returnWorkerToQueue(worker) {
    const shouldDestroyWorker = !_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__.isBrowser || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();
    if (shouldDestroyWorker) {
      worker.destroy();
      this.count--;
    } else {
      this.idleQueue.push(worker);
    }
    if (!this.isDestroyed) {
      this._startQueuedJob();
    }
  }
  _getAvailableWorker() {
    if (this.idleQueue.length > 0) {
      return this.idleQueue.shift() || null;
    }
    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const name = `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`;
      return new _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
        name,
        source: this.source,
        url: this.url
      });
    }
    return null;
  }
  _getMaxConcurrency() {
    return _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__.isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
  }
}
//# sourceMappingURL=worker-pool.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerThread)
/* harmony export */ });
/* harmony import */ var _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node/worker_threads.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js");
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/globals.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _worker_utils_get_loadable_worker_url_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../worker-utils/get-loadable-worker-url.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js");
/* harmony import */ var _worker_utils_get_transfer_list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../worker-utils/get-transfer-list.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js");





const NOOP = () => {};
class WorkerThread {
  static isSupported() {
    return typeof Worker !== 'undefined' && _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser || typeof _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker !== 'undefined' && !_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser;
  }
  constructor(props) {
    this.name = void 0;
    this.source = void 0;
    this.url = void 0;
    this.terminated = false;
    this.worker = void 0;
    this.onMessage = void 0;
    this.onError = void 0;
    this._loadableURL = '';
    const {
      name,
      source,
      url
    } = props;
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__.assert)(source || url);
    this.name = name;
    this.source = source;
    this.url = url;
    this.onMessage = NOOP;
    this.onError = error => console.log(error);
    this.worker = _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser ? this._createBrowserWorker() : this._createNodeWorker();
  }
  destroy() {
    this.onMessage = NOOP;
    this.onError = NOOP;
    this.worker.terminate();
    this.terminated = true;
  }
  get isRunning() {
    return Boolean(this.onMessage);
  }
  postMessage(data, transferList) {
    transferList = transferList || (0,_worker_utils_get_transfer_list_js__WEBPACK_IMPORTED_MODULE_3__.getTransferList)(data);
    this.worker.postMessage(data, transferList);
  }
  _getErrorFromErrorEvent(event) {
    let message = 'Failed to load ';
    message += `worker ${this.name} from ${this.url}. `;
    if (event.message) {
      message += `${event.message} in `;
    }
    if (event.lineno) {
      message += `:${event.lineno}:${event.colno}`;
    }
    return new Error(message);
  }
  _createBrowserWorker() {
    this._loadableURL = (0,_worker_utils_get_loadable_worker_url_js__WEBPACK_IMPORTED_MODULE_4__.getLoadableWorkerURL)({
      source: this.source,
      url: this.url
    });
    const worker = new Worker(this._loadableURL, {
      name: this.name
    });
    worker.onmessage = event => {
      if (!event.data) {
        this.onError(new Error('No data received'));
      } else {
        this.onMessage(event.data);
      }
    };
    worker.onerror = error => {
      this.onError(this._getErrorFromErrorEvent(error));
      this.terminated = true;
    };
    worker.onmessageerror = event => console.error(event);
    return worker;
  }
  _createNodeWorker() {
    let worker;
    if (this.url) {
      const absolute = this.url.includes(':/') || this.url.startsWith('/');
      const url = absolute ? this.url : `./${this.url}`;
      worker = new _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker(url, {
        eval: false
      });
    } else if (this.source) {
      worker = new _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker(this.source, {
        eval: true
      });
    } else {
      throw new Error('no worker');
    }
    worker.on('message', data => {
      this.onMessage(data);
    });
    worker.on('error', error => {
      this.onError(error);
    });
    worker.on('exit', code => {});
    return worker;
  }
}
//# sourceMappingURL=worker-thread.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLoadableWorkerURL: () => (/* binding */ getLoadableWorkerURL)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "../../node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");

const workerURLCache = new Map();
function getLoadableWorkerURL(props) {
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(props.source && !props.url || !props.source && props.url);
  let workerURL = workerURLCache.get(props.source || props.url);
  if (!workerURL) {
    if (props.url) {
      workerURL = getLoadableWorkerURLFromURL(props.url);
      workerURLCache.set(props.url, workerURL);
    }
    if (props.source) {
      workerURL = getLoadableWorkerURLFromSource(props.source);
      workerURLCache.set(props.source, workerURL);
    }
  }
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(workerURL);
  return workerURL;
}
function getLoadableWorkerURLFromURL(url) {
  if (!url.startsWith('http')) {
    return url;
  }
  const workerSource = buildScriptSource(url);
  return getLoadableWorkerURLFromSource(workerSource);
}
function getLoadableWorkerURLFromSource(workerSource) {
  const blob = new Blob([workerSource], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(blob);
}
function buildScriptSource(workerUrl) {
  return `\
try {
  importScripts('${workerUrl}');
} catch (error) {
  console.error(error);
  throw error;
}`;
}
//# sourceMappingURL=get-loadable-worker-url.js.map

/***/ }),

/***/ "../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js":
/*!**********************************************************************************************!*\
  !*** ../../node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTransferList: () => (/* binding */ getTransferList),
/* harmony export */   getTransferListForWriter: () => (/* binding */ getTransferListForWriter)
/* harmony export */ });
function getTransferList(object) {
  let recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let transfers = arguments.length > 2 ? arguments[2] : undefined;
  const transfersSet = transfers || new Set();
  if (!object) {} else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) {} else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }
  return transfers === undefined ? Array.from(transfersSet) : [];
}
function isTransferable(object) {
  if (!object) {
    return false;
  }
  if (object instanceof ArrayBuffer) {
    return true;
  }
  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }
  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }
  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }
  return false;
}
function getTransferListForWriter(object) {
  if (object === null) {
    return {};
  }
  const clone = Object.assign({}, object);
  Object.keys(clone).forEach(key => {
    if (typeof object[key] === 'object' && !ArrayBuffer.isView(object[key]) && !(object[key] instanceof Array)) {
      clone[key] = getTransferListForWriter(object[key]);
    } else if (typeof clone[key] === 'function' || clone[key] instanceof RegExp) {
      clone[key] = {};
    } else {
      clone[key] = object[key];
    }
  });
  return clone;
}
//# sourceMappingURL=get-transfer-list.js.map

/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/index.js":
/*!******************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   assert: () => (/* reexport safe */ _utils_assert_js__WEBPACK_IMPORTED_MODULE_4__.assert),
/* harmony export */   console: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.console),
/* harmony export */   document: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.document),
/* harmony export */   getBrowser: () => (/* reexport safe */ _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__.getBrowser),
/* harmony export */   global: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.global),
/* harmony export */   isBrowser: () => (/* reexport safe */ _lib_is_browser_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser),
/* harmony export */   isElectron: () => (/* reexport safe */ _lib_is_electron_js__WEBPACK_IMPORTED_MODULE_3__.isElectron),
/* harmony export */   isMobile: () => (/* reexport safe */ _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__.isMobile),
/* harmony export */   process: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.process),
/* harmony export */   self: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.self),
/* harmony export */   window: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.window)
/* harmony export */ });
/* harmony import */ var _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/globals.js */ "../../node_modules/@probe.gl/env/dist/lib/globals.js");
/* harmony import */ var _lib_is_browser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/is-browser.js */ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/get-browser.js */ "../../node_modules/@probe.gl/env/dist/lib/get-browser.js");
/* harmony import */ var _lib_is_electron_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/is-electron.js */ "../../node_modules/@probe.gl/env/dist/lib/is-electron.js");
/* harmony import */ var _utils_assert_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/assert.js */ "../../node_modules/@probe.gl/env/dist/utils/assert.js");
// Extract injected version from package.json (injected by babel plugin)
// @ts-expect-error
const VERSION =  true ? "4.0.7" : 0;
// ENVIRONMENT




// ENVIRONMENT'S ASSERT IS 5-15KB, SO WE PROVIDE OUR OWN

// TODO - wish we could just export a constant
// export const isBrowser = checkIfBrowser();


/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/lib/get-browser.js":
/*!****************************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/lib/get-browser.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBrowser: () => (/* binding */ getBrowser),
/* harmony export */   isMobile: () => (/* binding */ isMobile)
/* harmony export */ });
/* harmony import */ var _is_browser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is-browser.js */ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _is_electron_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is-electron.js */ "../../node_modules/@probe.gl/env/dist/lib/is-electron.js");
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./globals.js */ "../../node_modules/@probe.gl/env/dist/lib/globals.js");
// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// This function is needed in initialization stages,
// make sure it can be imported in isolation



function isMobile() {
    return typeof globalThis.orientation !== 'undefined';
}
// Simple browser detection
// `mockUserAgent` parameter allows user agent to be overridden for testing
/* eslint-disable complexity */
function getBrowser(mockUserAgent) {
    if (!mockUserAgent && !(0,_is_browser_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser)()) {
        return 'Node';
    }
    if ((0,_is_electron_js__WEBPACK_IMPORTED_MODULE_1__.isElectron)(mockUserAgent)) {
        return 'Electron';
    }
    const userAgent = mockUserAgent || _globals_js__WEBPACK_IMPORTED_MODULE_2__.navigator.userAgent || '';
    // NOTE: Order of tests matter, as many agents list Chrome etc.
    if (userAgent.indexOf('Edge') > -1) {
        return 'Edge';
    }
    if (globalThis.chrome) {
        return 'Chrome';
    }
    if (globalThis.safari) {
        return 'Safari';
    }
    if (globalThis.mozInnerScreenX) {
        return 'Firefox';
    }
    return 'Unknown';
}


/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/lib/globals.js":
/*!************************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/lib/globals.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   console: () => (/* binding */ console_),
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   navigator: () => (/* binding */ navigator_),
/* harmony export */   process: () => (/* binding */ process_),
/* harmony export */   self: () => (/* binding */ global_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
// Do not name these variables the same as the global objects - will break bundling
const global_ = globalThis;
const window_ = globalThis;
const document_ = globalThis.document || {};
const process_ = globalThis.process || {};
const console_ = globalThis.console;
const navigator_ = globalThis.navigator || {};



/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js":
/*!***************************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/lib/is-browser.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBrowser: () => (/* binding */ isBrowser)
/* harmony export */ });
/* harmony import */ var _is_electron_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is-electron.js */ "../../node_modules/@probe.gl/env/dist/lib/is-electron.js");
// This function is needed in initialization stages,
// make sure it can be imported in isolation

/** Check if in browser by duck-typing Node context */
function isBrowser() {
    const isNode = 
    // @ts-expect-error
    typeof process === 'object' && String(process) === '[object process]' && !process?.browser;
    return !isNode || (0,_is_electron_js__WEBPACK_IMPORTED_MODULE_0__.isElectron)();
}


/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/lib/is-electron.js":
/*!****************************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/lib/is-electron.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElectron: () => (/* binding */ isElectron)
/* harmony export */ });
// based on https://github.com/cheton/is-electron
// https://github.com/electron/electron/issues/2288
/* eslint-disable complexity */
function isElectron(mockUserAgent) {
    // Renderer process
    // @ts-expect-error
    if (typeof window !== 'undefined' && window.process?.type === 'renderer') {
        return true;
    }
    // Main process
    // eslint-disable-next-line
    if (typeof process !== 'undefined' && Boolean(process.versions?.['electron'])) {
        return true;
    }
    // Detect the user agent when the `nodeIntegration` option is set to true
    const realUserAgent = typeof navigator !== 'undefined' && navigator.userAgent;
    const userAgent = mockUserAgent || realUserAgent;
    return Boolean(userAgent && userAgent.indexOf('Electron') >= 0);
}


/***/ }),

/***/ "../../node_modules/@probe.gl/env/dist/utils/assert.js":
/*!*************************************************************!*\
  !*** ../../node_modules/@probe.gl/env/dist/utils/assert.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/log.js":
/*!****************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/log.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* binding */ Log),
/* harmony export */   normalizeArguments: () => (/* binding */ normalizeArguments)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @probe.gl/env */ "../../node_modules/@probe.gl/env/dist/index.js");
/* harmony import */ var _utils_local_storage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/local-storage.js */ "../../node_modules/@probe.gl/log/dist/utils/local-storage.js");
/* harmony import */ var _utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/formatters.js */ "../../node_modules/@probe.gl/log/dist/utils/formatters.js");
/* harmony import */ var _utils_color_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/color.js */ "../../node_modules/@probe.gl/log/dist/utils/color.js");
/* harmony import */ var _utils_autobind_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/autobind.js */ "../../node_modules/@probe.gl/log/dist/utils/autobind.js");
/* harmony import */ var _utils_assert_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/assert.js */ "../../node_modules/@probe.gl/log/dist/utils/assert.js");
/* harmony import */ var _utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/hi-res-timestamp.js */ "../../node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js");
// probe.gl, MIT license
/* eslint-disable no-console */







// Instrumentation in other packages may override console methods, so preserve them here
const originalConsole = {
    debug: (0,_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser)() ? console.debug || console.log : console.log,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};
const DEFAULT_LOG_CONFIGURATION = {
    enabled: true,
    level: 0
};
function noop() { } // eslint-disable-line @typescript-eslint/no-empty-function
const cache = {};
const ONCE = { once: true };
/** A console wrapper */
class Log {
    constructor({ id } = { id: '' }) {
        this.VERSION = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.VERSION;
        this._startTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
        this._deltaTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
        this.userData = {};
        // TODO - fix support from throttling groups
        this.LOG_THROTTLE_TIMEOUT = 0; // Time before throttled messages are logged again
        this.id = id;
        this.userData = {};
        this._storage = new _utils_local_storage_js__WEBPACK_IMPORTED_MODULE_3__.LocalStorage(`__probe-${this.id}__`, DEFAULT_LOG_CONFIGURATION);
        this.timeStamp(`${this.id} started`);
        (0,_utils_autobind_js__WEBPACK_IMPORTED_MODULE_4__.autobind)(this);
        Object.seal(this);
    }
    set level(newLevel) {
        this.setLevel(newLevel);
    }
    get level() {
        return this.getLevel();
    }
    isEnabled() {
        return this._storage.config.enabled;
    }
    getLevel() {
        return this._storage.config.level;
    }
    /** @return milliseconds, with fractions */
    getTotal() {
        return Number(((0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)() - this._startTs).toPrecision(10));
    }
    /** @return milliseconds, with fractions */
    getDelta() {
        return Number(((0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)() - this._deltaTs).toPrecision(10));
    }
    /** @deprecated use logLevel */
    set priority(newPriority) {
        this.level = newPriority;
    }
    /** @deprecated use logLevel */
    get priority() {
        return this.level;
    }
    /** @deprecated use logLevel */
    getPriority() {
        return this.level;
    }
    // Configure
    enable(enabled = true) {
        this._storage.setConfiguration({ enabled });
        return this;
    }
    setLevel(level) {
        this._storage.setConfiguration({ level });
        return this;
    }
    /** return the current status of the setting */
    get(setting) {
        return this._storage.config[setting];
    }
    // update the status of the setting
    set(setting, value) {
        this._storage.setConfiguration({ [setting]: value });
    }
    /** Logs the current settings as a table */
    settings() {
        if (console.table) {
            console.table(this._storage.config);
        }
        else {
            console.log(this._storage.config);
        }
    }
    // Unconditional logging
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }
    warn(message) {
        return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
    }
    error(message) {
        return this._getLogFunction(0, message, originalConsole.error, arguments);
    }
    /** Print a deprecation warning */
    deprecated(oldUsage, newUsage) {
        return this.warn(`\`${oldUsage}\` is deprecated and will be removed \
in a later version. Use \`${newUsage}\` instead`);
    }
    /** Print a removal warning */
    removed(oldUsage, newUsage) {
        return this.error(`\`${oldUsage}\` has been removed. Use \`${newUsage}\` instead`);
    }
    probe(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
            time: true,
            once: true
        });
    }
    log(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
    }
    info(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.info, arguments);
    }
    once(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
    }
    /** Logs an object as a table */
    table(logLevel, table, columns) {
        if (table) {
            return this._getLogFunction(logLevel, table, console.table || noop, (columns && [columns]), {
                tag: getTableHeader(table)
            });
        }
        return noop;
    }
    time(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
    }
    timeEnd(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
    }
    timeStamp(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.timeStamp || noop);
    }
    group(logLevel, message, opts = { collapsed: false }) {
        const options = normalizeArguments({ logLevel, message, opts });
        const { collapsed } = opts;
        // @ts-expect-error
        options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
        return this._getLogFunction(options);
    }
    groupCollapsed(logLevel, message, opts = {}) {
        return this.group(logLevel, message, Object.assign({}, opts, { collapsed: true }));
    }
    groupEnd(logLevel) {
        return this._getLogFunction(logLevel, '', console.groupEnd || noop);
    }
    // EXPERIMENTAL
    withGroup(logLevel, message, func) {
        this.group(logLevel, message)();
        try {
            func();
        }
        finally {
            this.groupEnd(logLevel)();
        }
    }
    trace() {
        if (console.trace) {
            console.trace();
        }
    }
    // PRIVATE METHODS
    /** Deduces log level from a variety of arguments */
    _shouldLog(logLevel) {
        return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
    }
    _getLogFunction(logLevel, message, method, args, opts) {
        if (this._shouldLog(logLevel)) {
            // normalized opts + timings
            opts = normalizeArguments({ logLevel, message, args, opts });
            method = method || opts.method;
            (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(method);
            opts.total = this.getTotal();
            opts.delta = this.getDelta();
            // reset delta timer
            this._deltaTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
            const tag = opts.tag || opts.message;
            if (opts.once && tag) {
                if (!cache[tag]) {
                    cache[tag] = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
                }
                else {
                    return noop;
                }
            }
            // TODO - Make throttling work with groups
            // if (opts.nothrottle || !throttle(tag, this.LOG_THROTTLE_TIMEOUT)) {
            //   return noop;
            // }
            message = decorateMessage(this.id, opts.message, opts);
            // Bind console function so that it can be called after being returned
            return method.bind(console, message, ...opts.args);
        }
        return noop;
    }
}
Log.VERSION = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.VERSION;
/**
 * Get logLevel from first argument:
 * - log(logLevel, message, args) => logLevel
 * - log(message, args) => 0
 * - log({logLevel, ...}, message, args) => logLevel
 * - log({logLevel, message, args}) => logLevel
 */
function normalizeLogLevel(logLevel) {
    if (!logLevel) {
        return 0;
    }
    let resolvedLevel;
    switch (typeof logLevel) {
        case 'number':
            resolvedLevel = logLevel;
            break;
        case 'object':
            // Backward compatibility
            // TODO - deprecate `priority`
            // @ts-expect-error
            resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
            break;
        default:
            return 0;
    }
    // 'log level must be a number'
    (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
    return resolvedLevel;
}
/**
 * "Normalizes" the various argument patterns into an object with known types
 * - log(logLevel, message, args) => {logLevel, message, args}
 * - log(message, args) => {logLevel: 0, message, args}
 * - log({logLevel, ...}, message, args) => {logLevel, message, args}
 * - log({logLevel, message, args}) => {logLevel, message, args}
 */
function normalizeArguments(opts) {
    const { logLevel, message } = opts;
    opts.logLevel = normalizeLogLevel(logLevel);
    // We use `arguments` instead of rest parameters (...args) because IE
    // does not support the syntax. Rest parameters is transpiled to code with
    // perf impact. Doing it here instead avoids constructing args when logging is
    // disabled.
    // TODO - remove when/if IE support is dropped
    const args = opts.args ? Array.from(opts.args) : [];
    // args should only contain arguments that appear after `message`
    // eslint-disable-next-line no-empty
    while (args.length && args.shift() !== message) { }
    switch (typeof logLevel) {
        case 'string':
        case 'function':
            if (message !== undefined) {
                args.unshift(message);
            }
            opts.message = logLevel;
            break;
        case 'object':
            Object.assign(opts, logLevel);
            break;
        default:
    }
    // Resolve functions into strings by calling them
    if (typeof opts.message === 'function') {
        opts.message = opts.message();
    }
    const messageType = typeof opts.message;
    // 'log message must be a string' or object
    (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(messageType === 'string' || messageType === 'object');
    // original opts + normalized opts + opts arg + fixed up message
    return Object.assign(opts, { args }, opts.opts);
}
function decorateMessage(id, message, opts) {
    if (typeof message === 'string') {
        const time = opts.time ? (0,_utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__.leftPad)((0,_utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__.formatTime)(opts.total)) : '';
        message = opts.time ? `${id}: ${time}  ${message}` : `${id}: ${message}`;
        message = (0,_utils_color_js__WEBPACK_IMPORTED_MODULE_7__.addColor)(message, opts.color, opts.background);
    }
    return message;
}
function getTableHeader(table) {
    for (const key in table) {
        for (const title in table[key]) {
            return title || 'untitled';
        }
    }
    return 'empty';
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/assert.js":
/*!*************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/assert.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/autobind.js":
/*!***************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/autobind.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autobind: () => (/* binding */ autobind)
/* harmony export */ });
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Binds the "this" argument of all functions on a class instance to the instance
 * @param obj - class instance (typically a react component)
 */
function autobind(obj, predefined = ['constructor']) {
    const proto = Object.getPrototypeOf(obj);
    const propNames = Object.getOwnPropertyNames(proto);
    const object = obj;
    for (const key of propNames) {
        const value = object[key];
        if (typeof value === 'function') {
            if (!predefined.find(name => key === name)) {
                object[key] = value.bind(obj);
            }
        }
    }
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/color.js":
/*!************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/color.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLOR: () => (/* binding */ COLOR),
/* harmony export */   addColor: () => (/* binding */ addColor)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js");

var COLOR;
(function (COLOR) {
    COLOR[COLOR["BLACK"] = 30] = "BLACK";
    COLOR[COLOR["RED"] = 31] = "RED";
    COLOR[COLOR["GREEN"] = 32] = "GREEN";
    COLOR[COLOR["YELLOW"] = 33] = "YELLOW";
    COLOR[COLOR["BLUE"] = 34] = "BLUE";
    COLOR[COLOR["MAGENTA"] = 35] = "MAGENTA";
    COLOR[COLOR["CYAN"] = 36] = "CYAN";
    COLOR[COLOR["WHITE"] = 37] = "WHITE";
    COLOR[COLOR["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
    COLOR[COLOR["BRIGHT_RED"] = 91] = "BRIGHT_RED";
    COLOR[COLOR["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
    COLOR[COLOR["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
    COLOR[COLOR["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
    COLOR[COLOR["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
    COLOR[COLOR["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
    COLOR[COLOR["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
})(COLOR || (COLOR = {}));
const BACKGROUND_INCREMENT = 10;
function getColor(color) {
    if (typeof color !== 'string') {
        return color;
    }
    color = color.toUpperCase();
    return COLOR[color] || COLOR.WHITE;
}
function addColor(string, color, background) {
    if (!_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser && typeof string === 'string') {
        if (color) {
            const colorCode = getColor(color);
            string = `\u001b[${colorCode}m${string}\u001b[39m`;
        }
        if (background) {
            // background colors values are +10
            const colorCode = getColor(background);
            string = `\u001b[${colorCode + BACKGROUND_INCREMENT}m${string}\u001b[49m`;
        }
    }
    return string;
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/formatters.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/formatters.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   formatValue: () => (/* binding */ formatValue),
/* harmony export */   leftPad: () => (/* binding */ leftPad),
/* harmony export */   rightPad: () => (/* binding */ rightPad)
/* harmony export */ });
// probe.gl, MIT license
/**
 * Format time
 */
function formatTime(ms) {
    let formatted;
    if (ms < 10) {
        formatted = `${ms.toFixed(2)}ms`;
    }
    else if (ms < 100) {
        formatted = `${ms.toFixed(1)}ms`;
    }
    else if (ms < 1000) {
        formatted = `${ms.toFixed(0)}ms`;
    }
    else {
        formatted = `${(ms / 1000).toFixed(2)}s`;
    }
    return formatted;
}
function leftPad(string, length = 8) {
    const padLength = Math.max(length - string.length, 0);
    return `${' '.repeat(padLength)}${string}`;
}
function rightPad(string, length = 8) {
    const padLength = Math.max(length - string.length, 0);
    return `${string}${' '.repeat(padLength)}`;
}
function formatValue(v, options = {}) {
    const EPSILON = 1e-16;
    const { isInteger = false } = options;
    if (Array.isArray(v) || ArrayBuffer.isView(v)) {
        return formatArrayValue(v, options);
    }
    if (!Number.isFinite(v)) {
        return String(v);
    }
    // @ts-expect-error
    if (Math.abs(v) < EPSILON) {
        return isInteger ? '0' : '0.';
    }
    if (isInteger) {
        // @ts-expect-error
        return v.toFixed(0);
    }
    // @ts-expect-error
    if (Math.abs(v) > 100 && Math.abs(v) < 10000) {
        // @ts-expect-error
        return v.toFixed(0);
    }
    // @ts-expect-error
    const string = v.toPrecision(2);
    const decimal = string.indexOf('.0');
    return decimal === string.length - 2 ? string.slice(0, -1) : string;
}
/** Helper to formatValue */
function formatArrayValue(v, options) {
    const { maxElts = 16, size = 1 } = options;
    let string = '[';
    for (let i = 0; i < v.length && i < maxElts; ++i) {
        if (i > 0) {
            string += `,${i % size === 0 ? ' ' : ''}`;
        }
        string += formatValue(v[i], options);
    }
    const terminator = v.length > maxElts ? '...' : ']';
    return `${string}${terminator}`;
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHiResTimestamp: () => (/* binding */ getHiResTimestamp)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "../../node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @probe.gl/env */ "../../node_modules/@probe.gl/env/dist/lib/globals.js");
// probe.gl, MIT license

/** Get best timer available. */
function getHiResTimestamp() {
    let timestamp;
    if ((0,_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser)() && _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.window.performance) {
        timestamp = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.window?.performance?.now?.();
    }
    else if ("hrtime" in _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.process) {
        // @ts-ignore
        const timeParts = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.process?.hrtime?.();
        timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
    }
    else {
        timestamp = Date.now();
    }
    return timestamp;
}


/***/ }),

/***/ "../../node_modules/@probe.gl/log/dist/utils/local-storage.js":
/*!********************************************************************!*\
  !*** ../../node_modules/@probe.gl/log/dist/utils/local-storage.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalStorage: () => (/* binding */ LocalStorage)
/* harmony export */ });
// probe.gl, MIT license
function getStorage(type) {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage;
    }
    catch (e) {
        return null;
    }
}
// Store keys in local storage via simple interface
class LocalStorage {
    constructor(id, defaultConfig, type = 'sessionStorage') {
        this.storage = getStorage(type);
        this.id = id;
        this.config = defaultConfig;
        this._loadConfiguration();
    }
    getConfiguration() {
        return this.config;
    }
    setConfiguration(configuration) {
        Object.assign(this.config, configuration);
        if (this.storage) {
            const serialized = JSON.stringify(this.config);
            this.storage.setItem(this.id, serialized);
        }
    }
    // Get config from persistent store, if available
    _loadConfiguration() {
        let configuration = {};
        if (this.storage) {
            const serializedConfiguration = this.storage.getItem(this.id);
            configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
        }
        Object.assign(this.config, configuration);
        return this;
    }
}


/***/ }),

/***/ "../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js":
/*!*********************************************************************!*\
  !*** ../../node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mat3: () => (/* binding */ mat3),
/* harmony export */   mat3d: () => (/* binding */ mat3d),
/* harmony export */   mat3n: () => (/* binding */ mat3n),
/* harmony export */   mat4: () => (/* binding */ mat4),
/* harmony export */   mat4d: () => (/* binding */ mat4d),
/* harmony export */   mat4n: () => (/* binding */ mat4n),
/* harmony export */   quat: () => (/* binding */ quat),
/* harmony export */   quatd: () => (/* binding */ quatd),
/* harmony export */   quatn: () => (/* binding */ quatn),
/* harmony export */   utils: () => (/* binding */ utils),
/* harmony export */   vec2: () => (/* binding */ vec2),
/* harmony export */   vec2d: () => (/* binding */ vec2d),
/* harmony export */   vec2n: () => (/* binding */ vec2n),
/* harmony export */   vec3: () => (/* binding */ vec3),
/* harmony export */   vec3d: () => (/* binding */ vec3d),
/* harmony export */   vec3n: () => (/* binding */ vec3n),
/* harmony export */   vec4: () => (/* binding */ vec4),
/* harmony export */   vec4d: () => (/* binding */ vec4d),
/* harmony export */   vec4n: () => (/* binding */ vec4n)
/* harmony export */ });
/* wgpu-matrix@3.0.1, license MIT */
function wrapConstructor(OriginalConstructor, modifier) {
    return class extends OriginalConstructor {
        constructor(...args) {
            super(...args);
            modifier(this);
        }
    }; // Type assertion is necessary here
}
const ZeroArray = wrapConstructor((Array), a => a.fill(0));

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
let EPSILON = 0.000001;
/**
 * Set the value for EPSILON for various checks
 * @param v - Value to use for EPSILON.
 * @returns previous value of EPSILON;
 */
function setEpsilon(v) {
    const old = EPSILON;
    EPSILON = v;
    return old;
}
/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns angle converted to radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
/**
 * Convert radians to degrees
 * @param radians - Angle in radians
 * @returns angle converted to degrees
 */
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
/**
 * Lerps between a and b via t
 * @param a - starting value
 * @param b - ending value
 * @param t - value where 0 = a and 1 = b
 * @returns a + (b - a) * t
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}
/**
 * Compute the opposite of lerp. Given a and b and a value between
 * a and b returns a value between 0 and 1. 0 if a, 1 if b.
 * Note: no clamping is done.
 * @param a - start value
 * @param b - end value
 * @param v - value between a and b
 * @returns (v - a) / (b - a)
 */
function inverseLerp(a, b, v) {
    const d = b - a;
    return (Math.abs(b - a) < EPSILON)
        ? a
        : (v - a) / d;
}
/**
 * Compute the euclidean modulo
 *
 * ```
 * // table for n / 3
 * -5, -4, -3, -2, -1,  0,  1,  2,  3,  4,  5   <- n
 * ------------------------------------
 * -2  -1  -0  -2  -1   0,  1,  2,  0,  1,  2   <- n % 3
 *  1   2   0   1   2   0,  1,  2,  0,  1,  2   <- euclideanModule(n, 3)
 * ```
 *
 * @param n - dividend
 * @param m - divisor
 * @returns the euclidean modulo of n / m
 */
function euclideanModulo(n, m) {
    return ((n % m) + m) % m;
}

var utils = {
    __proto__: null,
    get EPSILON () { return EPSILON; },
    degToRad: degToRad,
    euclideanModulo: euclideanModulo,
    inverseLerp: inverseLerp,
    lerp: lerp,
    radToDeg: radToDeg,
    setEpsilon: setEpsilon
};

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec3
 */
function getAPIImpl$5(Ctor) {
    /**
     * Creates a Vec2; may be called with x, y, z to set initial values.
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Vec2's specified type
     * it would be faster to use
     *
     * ```
     * const v = vec2.clone(someJSArray);
     * ```
     *
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @returns the created vector
     */
    function create(x = 0, y = 0) {
        const newDst = new Ctor(2);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
            }
        }
        return newDst;
    }
    /**
     * Creates a Vec2; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec2
     * Also see {@link vec2.create} and {@link vec2.copy}
     *
     * @param x first value
     * @param y second value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = x;
        newDst[1] = y;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        return newDst;
    }
    /**
     * Returns the angle in radians between two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns The angle in radians between the 2 vectors.
     */
    function angle(a, b) {
        const ax = a[0];
        const ay = a[1];
        const bx = b[0];
        const by = b[1];
        const mag1 = Math.sqrt(ax * ax + ay * ay);
        const mag2 = Math.sqrt(bx * bx + by * by);
        const mag = mag1 * mag2;
        const cosine = mag && dot(a, b) / mag;
        return Math.acos(cosine);
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the cross product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of a cross b.
     */
    function cross(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        const z = a[0] * b[1] - a[1] * b[0];
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = z;
        return newDst;
    }
    /**
     * Computes the dot product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        return Math.sqrt(v0 * v0 + v1 * v1);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        return v0 * v0 + v1 * v1;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        const v0 = v[0];
        const v1 = v[1];
        const len = Math.sqrt(v0 * v0 + v1 * v1);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec2.clone})
     * Also see {@link vec2.create} and {@link vec2.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = v[0];
        newDst[1] = v[1];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec2.copy})
     * Also see {@link vec2.create} and {@link vec2.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Creates a random unit vector * scale
     * @param scale - Default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The random vector.
     */
    function random(scale = 1, dst) {
        const newDst = (dst ?? new Ctor(2));
        const angle = Math.random() * 2 * Math.PI;
        newDst[0] = Math.cos(angle) * scale;
        newDst[1] = Math.sin(angle) * scale;
        return newDst;
    }
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(2));
        newDst[0] = 0;
        newDst[1] = 0;
        return newDst;
    }
    /**
     * transform Vec2 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional Vec2 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(2));
        const x = v[0];
        const y = v[1];
        newDst[0] = x * m[0] + y * m[4] + m[12];
        newDst[1] = x * m[1] + y * m[5] + m[13];
        return newDst;
    }
    /**
     * Transforms vec4 by 3x3 matrix
     *
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional Vec2 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat3(v, m, dst) {
        const newDst = (dst ?? new Ctor(2));
        const x = v[0];
        const y = v[1];
        newDst[0] = m[0] * x + m[4] * y + m[8];
        newDst[1] = m[1] * x + m[5] * y + m[9];
        return newDst;
    }
    /**
     * Rotate a 2D vector
     *
     * @param a The vec2 point to rotate
     * @param b The origin of the rotation
     * @param rad The angle of rotation in radians
     * @returns the rotated vector
     */
    function rotate(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(2));
        // Translate point to the origin
        const p0 = a[0] - b[0];
        const p1 = a[1] - b[1];
        const sinC = Math.sin(rad);
        const cosC = Math.cos(rad);
        //perform rotation and translate to correct position
        newDst[0] = p0 * cosC - p1 * sinC + b[0];
        newDst[1] = p0 * sinC + p1 * cosC + b[1];
        return newDst;
    }
    /**
     * Treat a 2D vector as a direction and set it's length
     *
     * @param a The vec2 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(2));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec2 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(2));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(2));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        angle,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        cross,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        random,
        zero,
        transformMat4,
        transformMat3,
        rotate,
        setLength,
        truncate,
        midpoint,
    };
}
const cache$5 = new Map();
function getAPI$5(Ctor) {
    let api = cache$5.get(Ctor);
    if (!api) {
        api = getAPIImpl$5(Ctor);
        cache$5.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates a typed API for Mat3
 * */
function getAPIImpl$4(Ctor) {
    const vec2 = getAPI$5(Ctor);
    /**
     * Create a Mat3 from values
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Mat3's specified type
     * it would be faster to use
     *
     * ```
     * const m = mat3.clone(someJSArray);
     * ```
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @returns matrix created from values.
     */
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8) {
        const newDst = new Ctor(12);
        // to make the array homogenous
        newDst[3] = 0;
        newDst[7] = 0;
        newDst[11] = 0;
        if (v0 !== undefined) {
            newDst[0] = v0;
            if (v1 !== undefined) {
                newDst[1] = v1;
                if (v2 !== undefined) {
                    newDst[2] = v2;
                    if (v3 !== undefined) {
                        newDst[4] = v3;
                        if (v4 !== undefined) {
                            newDst[5] = v4;
                            if (v5 !== undefined) {
                                newDst[6] = v5;
                                if (v6 !== undefined) {
                                    newDst[8] = v6;
                                    if (v7 !== undefined) {
                                        newDst[9] = v7;
                                        if (v8 !== undefined) {
                                            newDst[10] = v8;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Sets the values of a Mat3
     * Also see {@link mat3.create} and {@link mat3.copy}
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 set from values.
     */
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = v0;
        newDst[1] = v1;
        newDst[2] = v2;
        newDst[3] = 0;
        newDst[4] = v3;
        newDst[5] = v4;
        newDst[6] = v5;
        newDst[7] = 0;
        newDst[8] = v6;
        newDst[9] = v7;
        newDst[10] = v8;
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Creates a Mat3 from the upper left 3x3 part of a Mat4
     * @param m4 - source matrix
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 made from m4
     */
    function fromMat4(m4, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = m4[0];
        newDst[1] = m4[1];
        newDst[2] = m4[2];
        newDst[3] = 0;
        newDst[4] = m4[4];
        newDst[5] = m4[5];
        newDst[6] = m4[6];
        newDst[7] = 0;
        newDst[8] = m4[8];
        newDst[9] = m4[9];
        newDst[10] = m4[10];
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Creates a Mat3 rotation matrix from a quaternion
     * @param q - quaternion to create matrix from
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat3 made from q
     */
    function fromQuat(q, dst) {
        const newDst = (dst ?? new Ctor(12));
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        newDst[0] = 1 - yy - zz;
        newDst[1] = yx + wz;
        newDst[2] = zx - wy;
        newDst[3] = 0;
        newDst[4] = yx - wz;
        newDst[5] = 1 - xx - zz;
        newDst[6] = zy + wx;
        newDst[7] = 0;
        newDst[8] = zx + wy;
        newDst[9] = zy - wx;
        newDst[10] = 1 - xx - yy;
        newDst[11] = 0;
        return newDst;
    }
    /**
     * Negates a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns -m.
     */
    function negate(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = -m[0];
        newDst[1] = -m[1];
        newDst[2] = -m[2];
        newDst[4] = -m[4];
        newDst[5] = -m[5];
        newDst[6] = -m[6];
        newDst[8] = -m[8];
        newDst[9] = -m[9];
        newDst[10] = -m[10];
        return newDst;
    }
    /**
     * Copies a matrix. (same as {@link mat3.clone})
     * Also see {@link mat3.create} and {@link mat3.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    function copy(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
        return newDst;
    }
    /**
     * Copies a matrix (same as {@link mat3.copy})
     * Also see {@link mat3.create} and {@link mat3.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    const clone = copy;
    /**
     * Check if 2 matrices are approximately equal
     * @param a Operand matrix.
     * @param b Operand matrix.
     * @returns true if matrices are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[4] - b[4]) < EPSILON &&
            Math.abs(a[5] - b[5]) < EPSILON &&
            Math.abs(a[6] - b[6]) < EPSILON &&
            Math.abs(a[8] - b[8]) < EPSILON &&
            Math.abs(a[9] - b[9]) < EPSILON &&
            Math.abs(a[10] - b[10]) < EPSILON;
    }
    /**
     * Check if 2 matrices are exactly equal
     * @param a Operand matrix.
     * @param b Operand matrix.
     * @returns true if matrices are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] &&
            a[1] === b[1] &&
            a[2] === b[2] &&
            a[4] === b[4] &&
            a[5] === b[5] &&
            a[6] === b[6] &&
            a[8] === b[8] &&
            a[9] === b[9] &&
            a[10] === b[10];
    }
    /**
     * Creates a 3-by-3 identity matrix.
     *
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A 3-by-3 identity matrix.
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Takes the transpose of a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The transpose of m.
     */
    function transpose(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        if (newDst === m) {
            let t;
            // 0 1 2
            // 4 5 6
            // 8 9 10
            t = m[1];
            m[1] = m[4];
            m[4] = t;
            t = m[2];
            m[2] = m[8];
            m[8] = t;
            t = m[6];
            m[6] = m[9];
            m[9] = t;
            return newDst;
        }
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        newDst[0] = m00;
        newDst[1] = m10;
        newDst[2] = m20;
        newDst[4] = m01;
        newDst[5] = m11;
        newDst[6] = m21;
        newDst[8] = m02;
        newDst[9] = m12;
        newDst[10] = m22;
        return newDst;
    }
    /**
     * Computes the inverse of a 3-by-3 matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    function inverse(m, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const b01 = m22 * m11 - m12 * m21;
        const b11 = -m22 * m10 + m12 * m20;
        const b21 = m21 * m10 - m11 * m20;
        const invDet = 1 / (m00 * b01 + m01 * b11 + m02 * b21);
        newDst[0] = b01 * invDet;
        newDst[1] = (-m22 * m01 + m02 * m21) * invDet;
        newDst[2] = (m12 * m01 - m02 * m11) * invDet;
        newDst[4] = b11 * invDet;
        newDst[5] = (m22 * m00 - m02 * m20) * invDet;
        newDst[6] = (-m12 * m00 + m02 * m10) * invDet;
        newDst[8] = b21 * invDet;
        newDst[9] = (-m21 * m00 + m01 * m20) * invDet;
        newDst[10] = (m11 * m00 - m01 * m10) * invDet;
        return newDst;
    }
    /**
     * Compute the determinant of a matrix
     * @param m - the matrix
     * @returns the determinant
     */
    function determinant(m) {
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        return m00 * (m11 * m22 - m21 * m12) -
            m10 * (m01 * m22 - m21 * m02) +
            m20 * (m01 * m12 - m11 * m02);
    }
    /**
     * Computes the inverse of a 3-by-3 matrix. (same as inverse)
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    const invert = inverse;
    /**
     * Multiplies two 3-by-3 matrices with a on the left and b on the right
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(12));
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a10 = a[4 + 0];
        const a11 = a[4 + 1];
        const a12 = a[4 + 2];
        const a20 = a[8 + 0];
        const a21 = a[8 + 1];
        const a22 = a[8 + 2];
        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b10 = b[4 + 0];
        const b11 = b[4 + 1];
        const b12 = b[4 + 2];
        const b20 = b[8 + 0];
        const b21 = b[8 + 1];
        const b22 = b[8 + 2];
        newDst[0] = a00 * b00 + a10 * b01 + a20 * b02;
        newDst[1] = a01 * b00 + a11 * b01 + a21 * b02;
        newDst[2] = a02 * b00 + a12 * b01 + a22 * b02;
        newDst[4] = a00 * b10 + a10 * b11 + a20 * b12;
        newDst[5] = a01 * b10 + a11 * b11 + a21 * b12;
        newDst[6] = a02 * b10 + a12 * b11 + a22 * b12;
        newDst[8] = a00 * b20 + a10 * b21 + a20 * b22;
        newDst[9] = a01 * b20 + a11 * b21 + a21 * b22;
        newDst[10] = a02 * b20 + a12 * b21 + a22 * b22;
        return newDst;
    }
    /**
     * Multiplies two 3-by-3 matrices with a on the left and b on the right (same as multiply)
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    const mul = multiply;
    /**
     * Sets the translation component of a 3-by-3 matrix to the given
     * vector.
     * @param a - The matrix.
     * @param v - The vector.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix with translation set.
     */
    function setTranslation(a, v, dst) {
        const newDst = (dst ?? identity());
        if (a !== newDst) {
            newDst[0] = a[0];
            newDst[1] = a[1];
            newDst[2] = a[2];
            newDst[4] = a[4];
            newDst[5] = a[5];
            newDst[6] = a[6];
        }
        newDst[8] = v[0];
        newDst[9] = v[1];
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Returns the translation component of a 3-by-3 matrix as a vector with 3
     * entries.
     * @param m - The matrix.
     * @param dst - vector to hold result. If not passed a new one is created.
     * @returns The translation component of m.
     */
    function getTranslation(m, dst) {
        const newDst = (dst ?? vec2.create());
        newDst[0] = m[8];
        newDst[1] = m[9];
        return newDst;
    }
    /**
     * Returns an axis of a 3x3 matrix as a vector with 2 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y,
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? vec2.create());
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        return newDst;
    }
    /**
     * Sets an axis of a 3x3 matrix as a vector with 2 entries
     * @param m - The matrix.
     * @param v - the axis vector
     * @param axis - The axis  0 = x, 1 = y;
     * @param dst - The matrix to set. If not passed a new one is created.
     * @returns The matrix with axis set.
     */
    function setAxis(m, v, axis, dst) {
        const newDst = (dst === m ? m : copy(m, dst));
        const off = axis * 4;
        newDst[off + 0] = v[0];
        newDst[off + 1] = v[1];
        return newDst;
    }
    ///**
    // * Returns the scaling component of the matrix
    // * @param m - The Matrix
    // * @param dst - The vector to set. If not passed a new one is created.
    // */
    function getScaling(m, dst) {
        const newDst = (dst ?? vec2.create());
        const xx = m[0];
        const xy = m[1];
        const yx = m[4];
        const yy = m[5];
        newDst[0] = Math.sqrt(xx * xx + xy * xy);
        newDst[1] = Math.sqrt(yx * yx + yy * yy);
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which translates by the given vector v.
     * @param v - The vector by which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translation matrix.
     */
    function translation(v, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[8] = v[0];
        newDst[9] = v[1];
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Translates the given 3-by-3 matrix by the given vector v.
     * @param m - The matrix.
     * @param v - The vector by which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translated matrix.
     */
    function translate(m, v, dst) {
        const newDst = (dst ?? new Ctor(12));
        const v0 = v[0];
        const v1 = v[1];
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        if (m !== newDst) {
            newDst[0] = m00;
            newDst[1] = m01;
            newDst[2] = m02;
            newDst[4] = m10;
            newDst[5] = m11;
            newDst[6] = m12;
        }
        newDst[8] = m00 * v0 + m10 * v1 + m20;
        newDst[9] = m01 * v0 + m11 * v1 + m21;
        newDst[10] = m02 * v0 + m12 * v1 + m22;
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which rotates  by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotation(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = s;
        newDst[2] = 0;
        newDst[4] = -s;
        newDst[5] = c;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Rotates the given 3-by-3 matrix  by the given angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotate(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(12));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 + s * m10;
        newDst[1] = c * m01 + s * m11;
        newDst[2] = c * m02 + s * m12;
        newDst[4] = c * m10 - s * m00;
        newDst[5] = c * m11 - s * m01;
        newDst[6] = c * m12 - s * m02;
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which scales in each dimension by an amount given by
     * the corresponding entry in the given vector; assumes the vector has three
     * entries.
     * @param v - A vector of
     *     2 entries specifying the factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function scaling(v, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = v[0];
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = v[1];
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in each dimension by an amount
     * given by the corresponding entry in the given vector; assumes the vector has
     * three entries.
     * @param m - The matrix to be modified.
     * @param v - A vector of 2 entries specifying the
     *     factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function scale(m, v, dst) {
        const newDst = (dst ?? new Ctor(12));
        const v0 = v[0];
        const v1 = v[1];
        newDst[0] = v0 * m[0 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2];
        newDst[4] = v1 * m[1 * 4 + 0];
        newDst[5] = v1 * m[1 * 4 + 1];
        newDst[6] = v1 * m[1 * 4 + 2];
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    /**
     * Creates a 3-by-3 matrix which scales uniformly in each dimension
     * @param s - Amount to scale
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function uniformScaling(s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[4] = 0;
        newDst[5] = s;
        newDst[6] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        return newDst;
    }
    /**
     * Scales the given 3-by-3 matrix in each dimension by an amount
     * given.
     * @param m - The matrix to be modified.
     * @param s - Amount to scale.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function uniformScale(m, s, dst) {
        const newDst = (dst ?? new Ctor(12));
        newDst[0] = s * m[0 * 4 + 0];
        newDst[1] = s * m[0 * 4 + 1];
        newDst[2] = s * m[0 * 4 + 2];
        newDst[4] = s * m[1 * 4 + 0];
        newDst[5] = s * m[1 * 4 + 1];
        newDst[6] = s * m[1 * 4 + 2];
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
        }
        return newDst;
    }
    return {
        clone,
        create,
        set,
        fromMat4,
        fromQuat,
        negate,
        copy,
        equalsApproximately,
        equals,
        identity,
        transpose,
        inverse,
        invert,
        determinant,
        mul,
        multiply,
        setTranslation,
        getTranslation,
        getAxis,
        setAxis,
        getScaling,
        translation,
        translate,
        rotation,
        rotate,
        scaling,
        scale,
        uniformScaling,
        uniformScale,
    };
}
const cache$4 = new Map();
function getAPI$4(Ctor) {
    let api = cache$4.get(Ctor);
    if (!api) {
        api = getAPIImpl$4(Ctor);
        cache$4.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec3
 * */
function getAPIImpl$3(Ctor) {
    /**
     * Creates a vec3; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @returns the created vector
     */
    function create(x, y, z) {
        const newDst = new Ctor(3);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a vec3; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec3
     * Also see {@link vec3.create} and {@link vec3.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        newDst[2] = Math.ceil(v[2]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        newDst[2] = Math.floor(v[2]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        newDst[2] = Math.round(v[2]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        newDst[2] = Math.min(max, Math.max(min, v[2]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        newDst[2] = a[2] + b[2] * scale;
        return newDst;
    }
    /**
     * Returns the angle in radians between two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns The angle in radians between the 2 vectors.
     */
    function angle(a, b) {
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const bx = b[0];
        const by = b[1];
        const bz = b[2];
        const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
        const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
        const mag = mag1 * mag2;
        const cosine = mag && dot(a, b) / mag;
        return Math.acos(cosine);
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        newDst[2] = a[2] + t[2] * (b[2] - a[2]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        newDst[2] = Math.max(a[2], b[2]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        newDst[2] = Math.min(a[2], b[2]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        newDst[2] = 1 / v[2];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the cross product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of a cross b.
     */
    function cross(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        const t1 = a[2] * b[0] - a[0] * b[2];
        const t2 = a[0] * b[1] - a[1] * b[0];
        newDst[0] = a[1] * b[2] - a[2] * b[1];
        newDst[1] = t1;
        newDst[2] = t2;
        return newDst;
    }
    /**
     * Computes the dot product of two vectors; assumes both vectors have
     * three entries.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        return v0 * v0 + v1 * v1 + v2 * v2;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        newDst[2] = -v[2];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec3.clone})
     * Also see {@link vec3.create} and {@link vec3.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = v[0];
        newDst[1] = v[1];
        newDst[2] = v[2];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec3.copy})
     * Also see {@link vec3.create} and {@link vec3.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        newDst[2] = a[2] * b[2];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        newDst[2] = a[2] / b[2];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Creates a random vector
     * @param scale - Default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The random vector.
     */
    function random(scale = 1, dst) {
        const newDst = (dst ?? new Ctor(3));
        const angle = Math.random() * 2 * Math.PI;
        const z = Math.random() * 2 - 1;
        const zScale = Math.sqrt(1 - z * z) * scale;
        newDst[0] = Math.cos(angle) * zScale;
        newDst[1] = Math.sin(angle) * zScale;
        newDst[2] = z * scale;
        return newDst;
    }
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        return newDst;
    }
    /**
     * transform vec3 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1;
        newDst[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        newDst[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        newDst[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return newDst;
    }
    /**
     * Transform vec3 by upper 3x3 matrix inside 4x4 matrix.
     * @param v - The direction.
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns The transformed vector.
     */
    function transformMat4Upper3x3(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        newDst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
        return newDst;
    }
    /**
     * Transforms vec3 by 3x3 matrix
     *
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat3(v, m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        newDst[0] = x * m[0] + y * m[4] + z * m[8];
        newDst[1] = x * m[1] + y * m[5] + z * m[9];
        newDst[2] = x * m[2] + y * m[6] + z * m[10];
        return newDst;
    }
    /**
     * Transforms vec3 by Quaternion
     * @param v - the vector to transform
     * @param q - the quaternion to transform by
     * @param dst - optional vec3 to store result. If not passed a new one is created.
     * @returns the transformed
     */
    function transformQuat(v, q, dst) {
        const newDst = (dst ?? new Ctor(3));
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const w2 = q[3] * 2;
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const uvX = qy * z - qz * y;
        const uvY = qz * x - qx * z;
        const uvZ = qx * y - qy * x;
        newDst[0] = x + uvX * w2 + (qy * uvZ - qz * uvY) * 2;
        newDst[1] = y + uvY * w2 + (qz * uvX - qx * uvZ) * 2;
        newDst[2] = z + uvZ * w2 + (qx * uvY - qy * uvX) * 2;
        return newDst;
    }
    /**
     * Returns the translation component of a 4-by-4 matrix as a vector with 3
     * entries.
     * @param m - The matrix.
     * @param dst - vector to hold result. If not passed a new one is created.
     * @returns The translation component of m.
     */
    function getTranslation(m, dst) {
        const newDst = (dst ?? new Ctor(3));
        newDst[0] = m[12];
        newDst[1] = m[13];
        newDst[2] = m[14];
        return newDst;
    }
    /**
     * Returns an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y, 2 = z;
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? new Ctor(3));
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        newDst[2] = m[off + 2];
        return newDst;
    }
    /**
     * Returns the scaling component of the matrix
     * @param m - The Matrix
     * @param dst - The vector to set. If not passed a new one is created.
     */
    function getScaling(m, dst) {
        const newDst = (dst ?? new Ctor(3));
        const xx = m[0];
        const xy = m[1];
        const xz = m[2];
        const yx = m[4];
        const yy = m[5];
        const yz = m[6];
        const zx = m[8];
        const zy = m[9];
        const zz = m[10];
        newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
        newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
        newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
        return newDst;
    }
    /**
     * Rotate a 3D vector around the x-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns the rotated vector
     */
    function rotateX(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        //translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Rotate a 3D vector around the y-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns the rotated vector
     */
    function rotateY(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        // translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        // perform rotation
        r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
        r[1] = p[1];
        r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
        // translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Rotate a 3D vector around the z-axis
     *
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @param dst - The vector to set. If not passed a new one is created.
     * @returns {vec3} out
     */
    function rotateZ(a, b, rad, dst) {
        const newDst = (dst ?? new Ctor(3));
        const p = [];
        const r = [];
        // translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        // perform rotation
        r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
        r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
        r[2] = p[2];
        // translate to correct position
        newDst[0] = r[0] + b[0];
        newDst[1] = r[1] + b[1];
        newDst[2] = r[2] + b[2];
        return newDst;
    }
    /**
     * Treat a 3D vector as a direction and set it's length
     *
     * @param a The vec3 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(3));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec3 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(3));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(3));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        angle,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        cross,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        random,
        zero,
        transformMat4,
        transformMat4Upper3x3,
        transformMat3,
        transformQuat,
        getTranslation,
        getAxis,
        getScaling,
        rotateX,
        rotateY,
        rotateZ,
        setLength,
        truncate,
        midpoint,
    };
}
const cache$3 = new Map();
function getAPI$3(Ctor) {
    let api = cache$3.get(Ctor);
    if (!api) {
        api = getAPIImpl$3(Ctor);
        cache$3.set(Ctor, api);
    }
    return api;
}

/**
 * Generates a typed API for Mat4
 * */
function getAPIImpl$2(Ctor) {
    const vec3 = getAPI$3(Ctor);
    /**
     * 4x4 Matrix math math functions.
     *
     * Almost all functions take an optional `newDst` argument. If it is not passed in the
     * functions will create a new matrix. In other words you can do this
     *
     *     const mat = mat4.translation([1, 2, 3]);  // Creates a new translation matrix
     *
     * or
     *
     *     const mat = mat4.create();
     *     mat4.translation([1, 2, 3], mat);  // Puts translation matrix in mat.
     *
     * The first style is often easier but depending on where it's used it generates garbage where
     * as there is almost never allocation with the second style.
     *
     * It is always save to pass any matrix as the destination. So for example
     *
     *     const mat = mat4.identity();
     *     const trans = mat4.translation([1, 2, 3]);
     *     mat4.multiply(mat, trans, mat);  // Multiplies mat * trans and puts result in mat.
     *
     */
    /**
     * Create a Mat4 from values
     *
     * Note: Since passing in a raw JavaScript array
     * is valid in all circumstances, if you want to
     * force a JavaScript array into a Mat4's specified type
     * it would be faster to use
     *
     * ```
     * const m = mat4.clone(someJSArray);
     * ```
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param v9 - value for element 9
     * @param v10 - value for element 10
     * @param v11 - value for element 11
     * @param v12 - value for element 12
     * @param v13 - value for element 13
     * @param v14 - value for element 14
     * @param v15 - value for element 15
     * @returns created from values.
     */
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15) {
        const newDst = new Ctor(16);
        if (v0 !== undefined) {
            newDst[0] = v0;
            if (v1 !== undefined) {
                newDst[1] = v1;
                if (v2 !== undefined) {
                    newDst[2] = v2;
                    if (v3 !== undefined) {
                        newDst[3] = v3;
                        if (v4 !== undefined) {
                            newDst[4] = v4;
                            if (v5 !== undefined) {
                                newDst[5] = v5;
                                if (v6 !== undefined) {
                                    newDst[6] = v6;
                                    if (v7 !== undefined) {
                                        newDst[7] = v7;
                                        if (v8 !== undefined) {
                                            newDst[8] = v8;
                                            if (v9 !== undefined) {
                                                newDst[9] = v9;
                                                if (v10 !== undefined) {
                                                    newDst[10] = v10;
                                                    if (v11 !== undefined) {
                                                        newDst[11] = v11;
                                                        if (v12 !== undefined) {
                                                            newDst[12] = v12;
                                                            if (v13 !== undefined) {
                                                                newDst[13] = v13;
                                                                if (v14 !== undefined) {
                                                                    newDst[14] = v14;
                                                                    if (v15 !== undefined) {
                                                                        newDst[15] = v15;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Sets the values of a Mat4
     * Also see {@link mat4.create} and {@link mat4.copy}
     *
     * @param v0 - value for element 0
     * @param v1 - value for element 1
     * @param v2 - value for element 2
     * @param v3 - value for element 3
     * @param v4 - value for element 4
     * @param v5 - value for element 5
     * @param v6 - value for element 6
     * @param v7 - value for element 7
     * @param v8 - value for element 8
     * @param v9 - value for element 9
     * @param v10 - value for element 10
     * @param v11 - value for element 11
     * @param v12 - value for element 12
     * @param v13 - value for element 13
     * @param v14 - value for element 14
     * @param v15 - value for element 15
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 created from values.
     */
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = v0;
        newDst[1] = v1;
        newDst[2] = v2;
        newDst[3] = v3;
        newDst[4] = v4;
        newDst[5] = v5;
        newDst[6] = v6;
        newDst[7] = v7;
        newDst[8] = v8;
        newDst[9] = v9;
        newDst[10] = v10;
        newDst[11] = v11;
        newDst[12] = v12;
        newDst[13] = v13;
        newDst[14] = v14;
        newDst[15] = v15;
        return newDst;
    }
    /**
     * Creates a Mat4 from a Mat3
     * @param m3 - source matrix
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 made from m3
     */
    function fromMat3(m3, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = m3[0];
        newDst[1] = m3[1];
        newDst[2] = m3[2];
        newDst[3] = 0;
        newDst[4] = m3[4];
        newDst[5] = m3[5];
        newDst[6] = m3[6];
        newDst[7] = 0;
        newDst[8] = m3[8];
        newDst[9] = m3[9];
        newDst[10] = m3[10];
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a Mat4 rotation matrix from a quaternion
     * @param q - quaternion to create matrix from
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns Mat4 made from q
     */
    function fromQuat(q, dst) {
        const newDst = (dst ?? new Ctor(16));
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        newDst[0] = 1 - yy - zz;
        newDst[1] = yx + wz;
        newDst[2] = zx - wy;
        newDst[3] = 0;
        newDst[4] = yx - wz;
        newDst[5] = 1 - xx - zz;
        newDst[6] = zy + wx;
        newDst[7] = 0;
        newDst[8] = zx + wy;
        newDst[9] = zy - wx;
        newDst[10] = 1 - xx - yy;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Negates a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns -m.
     */
    function negate(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = -m[0];
        newDst[1] = -m[1];
        newDst[2] = -m[2];
        newDst[3] = -m[3];
        newDst[4] = -m[4];
        newDst[5] = -m[5];
        newDst[6] = -m[6];
        newDst[7] = -m[7];
        newDst[8] = -m[8];
        newDst[9] = -m[9];
        newDst[10] = -m[10];
        newDst[11] = -m[11];
        newDst[12] = -m[12];
        newDst[13] = -m[13];
        newDst[14] = -m[14];
        newDst[15] = -m[15];
        return newDst;
    }
    /**
     * Copies a matrix. (same as {@link mat4.clone})
     * Also see {@link mat4.create} and {@link mat4.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    function copy(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
        newDst[3] = m[3];
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
        newDst[7] = m[7];
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
        newDst[11] = m[11];
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
        return newDst;
    }
    /**
     * Copies a matrix (same as {@link mat4.copy})
     * Also see {@link mat4.create} and {@link mat4.set}
     * @param m - The matrix.
     * @param dst - The matrix. If not passed a new one is created.
     * @returns A copy of m.
     */
    const clone = copy;
    /**
     * Check if 2 matrices are approximately equal
     * @param a - Operand matrix.
     * @param b - Operand matrix.
     * @returns true if matrices are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON &&
            Math.abs(a[4] - b[4]) < EPSILON &&
            Math.abs(a[5] - b[5]) < EPSILON &&
            Math.abs(a[6] - b[6]) < EPSILON &&
            Math.abs(a[7] - b[7]) < EPSILON &&
            Math.abs(a[8] - b[8]) < EPSILON &&
            Math.abs(a[9] - b[9]) < EPSILON &&
            Math.abs(a[10] - b[10]) < EPSILON &&
            Math.abs(a[11] - b[11]) < EPSILON &&
            Math.abs(a[12] - b[12]) < EPSILON &&
            Math.abs(a[13] - b[13]) < EPSILON &&
            Math.abs(a[14] - b[14]) < EPSILON &&
            Math.abs(a[15] - b[15]) < EPSILON;
    }
    /**
     * Check if 2 matrices are exactly equal
     * @param a - Operand matrix.
     * @param b - Operand matrix.
     * @returns true if matrices are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] &&
            a[1] === b[1] &&
            a[2] === b[2] &&
            a[3] === b[3] &&
            a[4] === b[4] &&
            a[5] === b[5] &&
            a[6] === b[6] &&
            a[7] === b[7] &&
            a[8] === b[8] &&
            a[9] === b[9] &&
            a[10] === b[10] &&
            a[11] === b[11] &&
            a[12] === b[12] &&
            a[13] === b[13] &&
            a[14] === b[14] &&
            a[15] === b[15];
    }
    /**
     * Creates a 4-by-4 identity matrix.
     *
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A 4-by-4 identity matrix.
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Takes the transpose of a matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The transpose of m.
     */
    function transpose(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        if (newDst === m) {
            let t;
            t = m[1];
            m[1] = m[4];
            m[4] = t;
            t = m[2];
            m[2] = m[8];
            m[8] = t;
            t = m[3];
            m[3] = m[12];
            m[12] = t;
            t = m[6];
            m[6] = m[9];
            m[9] = t;
            t = m[7];
            m[7] = m[13];
            m[13] = t;
            t = m[11];
            m[11] = m[14];
            m[14] = t;
            return newDst;
        }
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        newDst[0] = m00;
        newDst[1] = m10;
        newDst[2] = m20;
        newDst[3] = m30;
        newDst[4] = m01;
        newDst[5] = m11;
        newDst[6] = m21;
        newDst[7] = m31;
        newDst[8] = m02;
        newDst[9] = m12;
        newDst[10] = m22;
        newDst[11] = m32;
        newDst[12] = m03;
        newDst[13] = m13;
        newDst[14] = m23;
        newDst[15] = m33;
        return newDst;
    }
    /**
     * Computes the inverse of a 4-by-4 matrix.
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    function inverse(m, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp0 = m22 * m33;
        const tmp1 = m32 * m23;
        const tmp2 = m12 * m33;
        const tmp3 = m32 * m13;
        const tmp4 = m12 * m23;
        const tmp5 = m22 * m13;
        const tmp6 = m02 * m33;
        const tmp7 = m32 * m03;
        const tmp8 = m02 * m23;
        const tmp9 = m22 * m03;
        const tmp10 = m02 * m13;
        const tmp11 = m12 * m03;
        const tmp12 = m20 * m31;
        const tmp13 = m30 * m21;
        const tmp14 = m10 * m31;
        const tmp15 = m30 * m11;
        const tmp16 = m10 * m21;
        const tmp17 = m20 * m11;
        const tmp18 = m00 * m31;
        const tmp19 = m30 * m01;
        const tmp20 = m00 * m21;
        const tmp21 = m20 * m01;
        const tmp22 = m00 * m11;
        const tmp23 = m10 * m01;
        const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
            (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
        const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
            (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
        const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
            (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
        const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
            (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
        const d = 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        newDst[0] = d * t0;
        newDst[1] = d * t1;
        newDst[2] = d * t2;
        newDst[3] = d * t3;
        newDst[4] = d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) -
            (tmp0 * m10 + tmp3 * m20 + tmp4 * m30));
        newDst[5] = d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) -
            (tmp1 * m00 + tmp6 * m20 + tmp9 * m30));
        newDst[6] = d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) -
            (tmp2 * m00 + tmp7 * m10 + tmp10 * m30));
        newDst[7] = d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) -
            (tmp5 * m00 + tmp8 * m10 + tmp11 * m20));
        newDst[8] = d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) -
            (tmp13 * m13 + tmp14 * m23 + tmp17 * m33));
        newDst[9] = d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) -
            (tmp12 * m03 + tmp19 * m23 + tmp20 * m33));
        newDst[10] = d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) -
            (tmp15 * m03 + tmp18 * m13 + tmp23 * m33));
        newDst[11] = d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) -
            (tmp16 * m03 + tmp21 * m13 + tmp22 * m23));
        newDst[12] = d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) -
            (tmp16 * m32 + tmp12 * m12 + tmp15 * m22));
        newDst[13] = d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) -
            (tmp18 * m22 + tmp21 * m32 + tmp13 * m02));
        newDst[14] = d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) -
            (tmp22 * m32 + tmp14 * m02 + tmp19 * m12));
        newDst[15] = d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) -
            (tmp20 * m12 + tmp23 * m22 + tmp17 * m02));
        return newDst;
    }
    /**
     * Compute the determinant of a matrix
     * @param m - the matrix
     * @returns the determinant
     */
    function determinant(m) {
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp0 = m22 * m33;
        const tmp1 = m32 * m23;
        const tmp2 = m12 * m33;
        const tmp3 = m32 * m13;
        const tmp4 = m12 * m23;
        const tmp5 = m22 * m13;
        const tmp6 = m02 * m33;
        const tmp7 = m32 * m03;
        const tmp8 = m02 * m23;
        const tmp9 = m22 * m03;
        const tmp10 = m02 * m13;
        const tmp11 = m12 * m03;
        const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
            (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
        const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
            (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
        const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
            (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
        const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
            (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
        return m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3;
    }
    /**
     * Computes the inverse of a 4-by-4 matrix. (same as inverse)
     * @param m - The matrix.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The inverse of m.
     */
    const invert = inverse;
    /**
     * Multiplies two 4-by-4 matrices with a on the left and b on the right
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(16));
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4 + 0];
        const a11 = a[4 + 1];
        const a12 = a[4 + 2];
        const a13 = a[4 + 3];
        const a20 = a[8 + 0];
        const a21 = a[8 + 1];
        const a22 = a[8 + 2];
        const a23 = a[8 + 3];
        const a30 = a[12 + 0];
        const a31 = a[12 + 1];
        const a32 = a[12 + 2];
        const a33 = a[12 + 3];
        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b03 = b[3];
        const b10 = b[4 + 0];
        const b11 = b[4 + 1];
        const b12 = b[4 + 2];
        const b13 = b[4 + 3];
        const b20 = b[8 + 0];
        const b21 = b[8 + 1];
        const b22 = b[8 + 2];
        const b23 = b[8 + 3];
        const b30 = b[12 + 0];
        const b31 = b[12 + 1];
        const b32 = b[12 + 2];
        const b33 = b[12 + 3];
        newDst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
        newDst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
        newDst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
        newDst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
        newDst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
        newDst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
        newDst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
        newDst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
        newDst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
        newDst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
        newDst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
        newDst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
        newDst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
        newDst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
        newDst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
        newDst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
        return newDst;
    }
    /**
     * Multiplies two 4-by-4 matrices with a on the left and b on the right (same as multiply)
     * @param a - The matrix on the left.
     * @param b - The matrix on the right.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix product of a and b.
     */
    const mul = multiply;
    /**
     * Sets the translation component of a 4-by-4 matrix to the given
     * vector.
     * @param a - The matrix.
     * @param v - The vector.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The matrix with translation set.
     */
    function setTranslation(a, v, dst) {
        const newDst = (dst ?? identity());
        if (a !== newDst) {
            newDst[0] = a[0];
            newDst[1] = a[1];
            newDst[2] = a[2];
            newDst[3] = a[3];
            newDst[4] = a[4];
            newDst[5] = a[5];
            newDst[6] = a[6];
            newDst[7] = a[7];
            newDst[8] = a[8];
            newDst[9] = a[9];
            newDst[10] = a[10];
            newDst[11] = a[11];
        }
        newDst[12] = v[0];
        newDst[13] = v[1];
        newDst[14] = v[2];
        newDst[15] = 1;
        return newDst;
    }
    ///**
    // * Returns the translation component of a 4-by-4 matrix as a vector with 3
    // * entries.
    // * @param m - The matrix.
    // * @param dst - vector to hold result. If not passed a new one is created.
    // * @returns The translation component of m.
    // */
    function getTranslation(m, dst) {
        const newDst = (dst ?? vec3.create());
        newDst[0] = m[12];
        newDst[1] = m[13];
        newDst[2] = m[14];
        return newDst;
    }
    /**
     * Returns an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param axis - The axis 0 = x, 1 = y, 2 = z;
     * @returns The axis component of m.
     */
    function getAxis(m, axis, dst) {
        const newDst = (dst ?? vec3.create());
        const off = axis * 4;
        newDst[0] = m[off + 0];
        newDst[1] = m[off + 1];
        newDst[2] = m[off + 2];
        return newDst;
    }
    /**
     * Sets an axis of a 4x4 matrix as a vector with 3 entries
     * @param m - The matrix.
     * @param v - the axis vector
     * @param axis - The axis  0 = x, 1 = y, 2 = z;
     * @param dst - The matrix to set. If not passed a new one is created.
     * @returns The matrix with axis set.
     */
    function setAxis(m, v, axis, dst) {
        const newDst = (dst === m) ? dst : copy(m, dst);
        const off = axis * 4;
        newDst[off + 0] = v[0];
        newDst[off + 1] = v[1];
        newDst[off + 2] = v[2];
        return newDst;
    }
    ///**
    // * Returns the scaling component of the matrix
    // * @param m - The Matrix
    // * @param dst - The vector to set. If not passed a new one is created.
    // */
    function getScaling(m, dst) {
        const newDst = (dst ?? vec3.create());
        const xx = m[0];
        const xy = m[1];
        const xz = m[2];
        const yx = m[4];
        const yy = m[5];
        const yz = m[6];
        const zx = m[8];
        const zy = m[9];
        const zz = m[10];
        newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
        newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
        newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
        return newDst;
    }
    /**
     * Computes a 4-by-4 perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from 0 to 1 in the z dimension.
     *
     * Note: If you pass `Infinity` for zFar then it will produce a projection matrix
     * returns -Infinity for Z when transforming coordinates with Z <= 0 and +Infinity for Z
     * otherwise.
     *
     * @param fieldOfViewYInRadians - The camera angle from top to bottom (in radians).
     * @param aspect - The aspect ratio width / height.
     * @param zNear - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param zFar - The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The perspective matrix.
     */
    function perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
        const newDst = (dst ?? new Ctor(16));
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
        newDst[0] = f / aspect;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = f;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (Number.isFinite(zFar)) {
            const rangeInv = 1 / (zNear - zFar);
            newDst[10] = zFar * rangeInv;
            newDst[14] = zFar * zNear * rangeInv;
        }
        else {
            newDst[10] = -1;
            newDst[14] = -zNear;
        }
        return newDst;
    }
    /**
     * Computes a 4-by-4 reverse-z perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from 1 (at -zNear) to 0 (at -zFar) in the z dimension.
     *
     * @param fieldOfViewYInRadians - The camera angle from top to bottom (in radians).
     * @param aspect - The aspect ratio width / height.
     * @param zNear - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param zFar - The depth (negative z coordinate)
     *     of the far clipping plane. (default = Infinity)
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The perspective matrix.
     */ function perspectiveReverseZ(fieldOfViewYInRadians, aspect, zNear, zFar = Infinity, dst) {
        const newDst = (dst ?? new Ctor(16));
        const f = 1 / Math.tan(fieldOfViewYInRadians * 0.5);
        newDst[0] = f / aspect;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = f;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (zFar === Infinity) {
            newDst[10] = 0;
            newDst[14] = zNear;
        }
        else {
            const rangeInv = 1 / (zFar - zNear);
            newDst[10] = zNear * rangeInv;
            newDst[14] = zFar * zNear * rangeInv;
        }
        return newDst;
    }
    /**
     * Computes a 4-by-4 orthogonal transformation matrix that transforms from
     * the given the left, right, bottom, and top dimensions to -1 +1 in x, and y
     * and 0 to +1 in z.
     * @param left - Left side of the near clipping plane viewport.
     * @param right - Right side of the near clipping plane viewport.
     * @param bottom - Bottom of the near clipping plane viewport.
     * @param top - Top of the near clipping plane viewport.
     * @param near - The depth (negative z coordinate)
     *     of the near clipping plane.
     * @param far - The depth (negative z coordinate)
     *     of the far clipping plane.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The orthographic projection matrix.
     */
    function ortho(left, right, bottom, top, near, far, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 2 / (right - left);
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 / (top - bottom);
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1 / (near - far);
        newDst[11] = 0;
        newDst[12] = (right + left) / (left - right);
        newDst[13] = (top + bottom) / (bottom - top);
        newDst[14] = near / (near - far);
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
     * dimension.
     * @param left - The x coordinate of the left plane of the box.
     * @param right - The x coordinate of the right plane of the box.
     * @param bottom - The y coordinate of the bottom plane of the box.
     * @param top - The y coordinate of the right plane of the box.
     * @param near - The negative z coordinate of the near plane of the box.
     * @param far - The negative z coordinate of the far plane of the box.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The perspective projection matrix.
     */
    function frustum(left, right, bottom, top, near, far, dst) {
        const newDst = (dst ?? new Ctor(16));
        const dx = (right - left);
        const dy = (top - bottom);
        const dz = (near - far);
        newDst[0] = 2 * near / dx;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 * near / dy;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = (left + right) / dx;
        newDst[9] = (top + bottom) / dy;
        newDst[10] = far / dz;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = near * far / dz;
        newDst[15] = 0;
        return newDst;
    }
    /**
     * Computes a 4-by-4 reverse-z perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from 1 (-near) to 0 (-far) in the z
     * dimension.
     * @param left - The x coordinate of the left plane of the box.
     * @param right - The x coordinate of the right plane of the box.
     * @param bottom - The y coordinate of the bottom plane of the box.
     * @param top - The y coordinate of the right plane of the box.
     * @param near - The negative z coordinate of the near plane of the box.
     * @param far - The negative z coordinate of the far plane of the box.
     * @param dst - Output matrix. If not passed a new one is created.
     * @returns The perspective projection matrix.
     */
    function frustumReverseZ(left, right, bottom, top, near, far = Infinity, dst) {
        const newDst = (dst ?? new Ctor(16));
        const dx = (right - left);
        const dy = (top - bottom);
        newDst[0] = 2 * near / dx;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 2 * near / dy;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = (left + right) / dx;
        newDst[9] = (top + bottom) / dy;
        newDst[11] = -1;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[15] = 0;
        if (far === Infinity) {
            newDst[10] = 0;
            newDst[14] = near;
        }
        else {
            const rangeInv = 1 / (far - near);
            newDst[10] = near * rangeInv;
            newDst[14] = far * near * rangeInv;
        }
        return newDst;
    }
    const xAxis = vec3.create();
    const yAxis = vec3.create();
    const zAxis = vec3.create();
    /**
     * Computes a 4-by-4 aim transformation.
     *
     * This is a matrix which positions an object aiming down positive Z.
     * toward the target.
     *
     * Note: this is **NOT** the inverse of lookAt as lookAt looks at negative Z.
     *
     * @param position - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The aim matrix.
     */
    function aim(position, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(target, position, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = xAxis[1];
        newDst[2] = xAxis[2];
        newDst[3] = 0;
        newDst[4] = yAxis[0];
        newDst[5] = yAxis[1];
        newDst[6] = yAxis[2];
        newDst[7] = 0;
        newDst[8] = zAxis[0];
        newDst[9] = zAxis[1];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = position[0];
        newDst[13] = position[1];
        newDst[14] = position[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 camera aim transformation.
     *
     * This is a matrix which positions an object aiming down negative Z.
     * toward the target.
     *
     * Note: this is the inverse of `lookAt`
     *
     * @param eye - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The aim matrix.
     */
    function cameraAim(eye, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(eye, target, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = xAxis[1];
        newDst[2] = xAxis[2];
        newDst[3] = 0;
        newDst[4] = yAxis[0];
        newDst[5] = yAxis[1];
        newDst[6] = yAxis[2];
        newDst[7] = 0;
        newDst[8] = zAxis[0];
        newDst[9] = zAxis[1];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = eye[0];
        newDst[13] = eye[1];
        newDst[14] = eye[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Computes a 4-by-4 view transformation.
     *
     * This is a view matrix which transforms all other objects
     * to be in the space of the view defined by the parameters.
     *
     * @param eye - The position of the object.
     * @param target - The position meant to be aimed at.
     * @param up - A vector pointing up.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The look-at matrix.
     */
    function lookAt(eye, target, up, dst) {
        const newDst = (dst ?? new Ctor(16));
        vec3.normalize(vec3.subtract(eye, target, zAxis), zAxis);
        vec3.normalize(vec3.cross(up, zAxis, xAxis), xAxis);
        vec3.normalize(vec3.cross(zAxis, xAxis, yAxis), yAxis);
        newDst[0] = xAxis[0];
        newDst[1] = yAxis[0];
        newDst[2] = zAxis[0];
        newDst[3] = 0;
        newDst[4] = xAxis[1];
        newDst[5] = yAxis[1];
        newDst[6] = zAxis[1];
        newDst[7] = 0;
        newDst[8] = xAxis[2];
        newDst[9] = yAxis[2];
        newDst[10] = zAxis[2];
        newDst[11] = 0;
        newDst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
        newDst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
        newDst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which translates by the given vector v.
     * @param v - The vector by
     *     which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translation matrix.
     */
    function translation(v, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = v[0];
        newDst[13] = v[1];
        newDst[14] = v[2];
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Translates the given 4-by-4 matrix by the given vector v.
     * @param m - The matrix.
     * @param v - The vector by
     *     which to translate.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The translated matrix.
     */
    function translate(m, v, dst) {
        const newDst = (dst ?? new Ctor(16));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        if (m !== newDst) {
            newDst[0] = m00;
            newDst[1] = m01;
            newDst[2] = m02;
            newDst[3] = m03;
            newDst[4] = m10;
            newDst[5] = m11;
            newDst[6] = m12;
            newDst[7] = m13;
            newDst[8] = m20;
            newDst[9] = m21;
            newDst[10] = m22;
            newDst[11] = m23;
        }
        newDst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
        newDst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
        newDst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
        newDst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationX(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = c;
        newDst[6] = s;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = -s;
        newDst[10] = c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the x-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateX(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[4] = c * m10 + s * m20;
        newDst[5] = c * m11 + s * m21;
        newDst[6] = c * m12 + s * m22;
        newDst[7] = c * m13 + s * m23;
        newDst[8] = c * m20 - s * m10;
        newDst[9] = c * m21 - s * m11;
        newDst[10] = c * m22 - s * m12;
        newDst[11] = c * m23 - s * m13;
        if (m !== newDst) {
            newDst[0] = m[0];
            newDst[1] = m[1];
            newDst[2] = m[2];
            newDst[3] = m[3];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationY(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = 0;
        newDst[2] = -s;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = 1;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = s;
        newDst[9] = 0;
        newDst[10] = c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the y-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateY(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 - s * m20;
        newDst[1] = c * m01 - s * m21;
        newDst[2] = c * m02 - s * m22;
        newDst[3] = c * m03 - s * m23;
        newDst[8] = c * m20 + s * m00;
        newDst[9] = c * m21 + s * m01;
        newDst[10] = c * m22 + s * m02;
        newDst[11] = c * m23 + s * m03;
        if (m !== newDst) {
            newDst[4] = m[4];
            newDst[5] = m[5];
            newDst[6] = m[6];
            newDst[7] = m[7];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotation matrix.
     */
    function rotationZ(angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c;
        newDst[1] = s;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = -s;
        newDst[5] = c;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = 1;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the z-axis by the given
     * angle.
     * @param m - The matrix.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function rotateZ(m, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        newDst[0] = c * m00 + s * m10;
        newDst[1] = c * m01 + s * m11;
        newDst[2] = c * m02 + s * m12;
        newDst[3] = c * m03 + s * m13;
        newDst[4] = c * m10 - s * m00;
        newDst[5] = c * m11 - s * m01;
        newDst[6] = c * m12 - s * m02;
        newDst[7] = c * m13 - s * m03;
        if (m !== newDst) {
            newDst[8] = m[8];
            newDst[9] = m[9];
            newDst[10] = m[10];
            newDst[11] = m[11];
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the given axis by the given
     * angle.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A matrix which rotates angle radians
     *     around the axis.
     */
    function axisRotation(axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;
        newDst[0] = xx + (1 - xx) * c;
        newDst[1] = x * y * oneMinusCosine + z * s;
        newDst[2] = x * z * oneMinusCosine - y * s;
        newDst[3] = 0;
        newDst[4] = x * y * oneMinusCosine - z * s;
        newDst[5] = yy + (1 - yy) * c;
        newDst[6] = y * z * oneMinusCosine + x * s;
        newDst[7] = 0;
        newDst[8] = x * z * oneMinusCosine + y * s;
        newDst[9] = y * z * oneMinusCosine - x * s;
        newDst[10] = zz + (1 - zz) * c;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which rotates around the given axis by the given
     * angle. (same as axisRotation)
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns A matrix which rotates angle radians
     *     around the axis.
     */
    const rotation = axisRotation;
    /**
     * Rotates the given 4-by-4 matrix around the given axis by the
     * given angle.
     * @param m - The matrix.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    function axisRotate(m, axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(16));
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;
        const r00 = xx + (1 - xx) * c;
        const r01 = x * y * oneMinusCosine + z * s;
        const r02 = x * z * oneMinusCosine - y * s;
        const r10 = x * y * oneMinusCosine - z * s;
        const r11 = yy + (1 - yy) * c;
        const r12 = y * z * oneMinusCosine + x * s;
        const r20 = x * z * oneMinusCosine + y * s;
        const r21 = y * z * oneMinusCosine - x * s;
        const r22 = zz + (1 - zz) * c;
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];
        newDst[0] = r00 * m00 + r01 * m10 + r02 * m20;
        newDst[1] = r00 * m01 + r01 * m11 + r02 * m21;
        newDst[2] = r00 * m02 + r01 * m12 + r02 * m22;
        newDst[3] = r00 * m03 + r01 * m13 + r02 * m23;
        newDst[4] = r10 * m00 + r11 * m10 + r12 * m20;
        newDst[5] = r10 * m01 + r11 * m11 + r12 * m21;
        newDst[6] = r10 * m02 + r11 * m12 + r12 * m22;
        newDst[7] = r10 * m03 + r11 * m13 + r12 * m23;
        newDst[8] = r20 * m00 + r21 * m10 + r22 * m20;
        newDst[9] = r20 * m01 + r21 * m11 + r22 * m21;
        newDst[10] = r20 * m02 + r21 * m12 + r22 * m22;
        newDst[11] = r20 * m03 + r21 * m13 + r22 * m23;
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Rotates the given 4-by-4 matrix around the given axis by the
     * given angle. (same as rotate)
     * @param m - The matrix.
     * @param axis - The axis
     *     about which to rotate.
     * @param angleInRadians - The angle by which to rotate (in radians).
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The rotated matrix.
     */
    const rotate = axisRotate;
    /**
     * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
     * the corresponding entry in the given vector; assumes the vector has three
     * entries.
     * @param v - A vector of
     *     three entries specifying the factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function scaling(v, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = v[0];
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = v[1];
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = v[2];
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Scales the given 4-by-4 matrix in each dimension by an amount
     * given by the corresponding entry in the given vector; assumes the vector has
     * three entries.
     * @param m - The matrix to be modified.
     * @param v - A vector of three entries specifying the
     *     factor by which to scale in each dimension.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function scale(m, v, dst) {
        const newDst = (dst ?? new Ctor(16));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        newDst[0] = v0 * m[0 * 4 + 0];
        newDst[1] = v0 * m[0 * 4 + 1];
        newDst[2] = v0 * m[0 * 4 + 2];
        newDst[3] = v0 * m[0 * 4 + 3];
        newDst[4] = v1 * m[1 * 4 + 0];
        newDst[5] = v1 * m[1 * 4 + 1];
        newDst[6] = v1 * m[1 * 4 + 2];
        newDst[7] = v1 * m[1 * 4 + 3];
        newDst[8] = v2 * m[2 * 4 + 0];
        newDst[9] = v2 * m[2 * 4 + 1];
        newDst[10] = v2 * m[2 * 4 + 2];
        newDst[11] = v2 * m[2 * 4 + 3];
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    /**
     * Creates a 4-by-4 matrix which scales a uniform amount in each dimension.
     * @param s - the amount to scale
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaling matrix.
     */
    function uniformScaling(s, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = s;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        newDst[4] = 0;
        newDst[5] = s;
        newDst[6] = 0;
        newDst[7] = 0;
        newDst[8] = 0;
        newDst[9] = 0;
        newDst[10] = s;
        newDst[11] = 0;
        newDst[12] = 0;
        newDst[13] = 0;
        newDst[14] = 0;
        newDst[15] = 1;
        return newDst;
    }
    /**
     * Scales the given 4-by-4 matrix in each dimension by a uniform scale.
     * @param m - The matrix to be modified.
     * @param s - The amount to scale.
     * @param dst - matrix to hold result. If not passed a new one is created.
     * @returns The scaled matrix.
     */
    function uniformScale(m, s, dst) {
        const newDst = (dst ?? new Ctor(16));
        newDst[0] = s * m[0 * 4 + 0];
        newDst[1] = s * m[0 * 4 + 1];
        newDst[2] = s * m[0 * 4 + 2];
        newDst[3] = s * m[0 * 4 + 3];
        newDst[4] = s * m[1 * 4 + 0];
        newDst[5] = s * m[1 * 4 + 1];
        newDst[6] = s * m[1 * 4 + 2];
        newDst[7] = s * m[1 * 4 + 3];
        newDst[8] = s * m[2 * 4 + 0];
        newDst[9] = s * m[2 * 4 + 1];
        newDst[10] = s * m[2 * 4 + 2];
        newDst[11] = s * m[2 * 4 + 3];
        if (m !== newDst) {
            newDst[12] = m[12];
            newDst[13] = m[13];
            newDst[14] = m[14];
            newDst[15] = m[15];
        }
        return newDst;
    }
    return {
        create,
        set,
        fromMat3,
        fromQuat,
        negate,
        copy,
        clone,
        equalsApproximately,
        equals,
        identity,
        transpose,
        inverse,
        determinant,
        invert,
        multiply,
        mul,
        setTranslation,
        getTranslation,
        getAxis,
        setAxis,
        getScaling,
        perspective,
        perspectiveReverseZ,
        ortho,
        frustum,
        frustumReverseZ,
        aim,
        cameraAim,
        lookAt,
        translation,
        translate,
        rotationX,
        rotateX,
        rotationY,
        rotateY,
        rotationZ,
        rotateZ,
        axisRotation,
        rotation,
        axisRotate,
        rotate,
        scaling,
        scale,
        uniformScaling,
        uniformScale,
    };
}
const cache$2 = new Map();
function getAPI$2(Ctor) {
    let api = cache$2.get(Ctor);
    if (!api) {
        api = getAPIImpl$2(Ctor);
        cache$2.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Qud
 * */
function getAPIImpl$1(Ctor) {
    const vec3 = getAPI$3(Ctor);
    /**
     * Creates a quat4; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param w - Initial w value.
     * @returns the created vector
     */
    function create(x, y, z, w) {
        const newDst = new Ctor(4);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                    if (w !== undefined) {
                        newDst[3] = w;
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a Quat; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param z - Initial w value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Quat
     * Also see {@link quat.create} and {@link quat.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param w fourth value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, w, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        newDst[3] = w;
        return newDst;
    }
    /**
     * Sets a quaternion from the given angle and  axis,
     * then returns it.
     *
     * @param axis - the axis to rotate around
     * @param angleInRadians - the angle
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The quaternion that represents the given axis and angle
     **/
    function fromAxisAngle(axis, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const s = Math.sin(halfAngle);
        newDst[0] = s * axis[0];
        newDst[1] = s * axis[1];
        newDst[2] = s * axis[2];
        newDst[3] = Math.cos(halfAngle);
        return newDst;
    }
    /**
     * Gets the rotation axis and angle
     * @param q - quaternion to compute from
     * @param dst - Vec3 to hold result. If not passed in a new one is created.
     * @return angle and axis
     */
    function toAxisAngle(q, dst) {
        const newDst = (dst ?? vec3.create(3));
        const angle = Math.acos(q[3]) * 2;
        const s = Math.sin(angle * 0.5);
        if (s > EPSILON) {
            newDst[0] = q[0] / s;
            newDst[1] = q[1] / s;
            newDst[2] = q[2] / s;
        }
        else {
            newDst[0] = 1;
            newDst[1] = 0;
            newDst[2] = 0;
        }
        return { angle, axis: newDst };
    }
    /**
     * Returns the angle in degrees between two rotations a and b.
     * @param a - quaternion a
     * @param b - quaternion b
     * @return angle in radians between the two quaternions
     */
    function angle(a, b) {
        const d = dot(a, b);
        return Math.acos(2 * d * d - 1);
    }
    /**
     * Multiplies two quaternions
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const aw = a[3];
        const bx = b[0];
        const by = b[1];
        const bz = b[2];
        const bw = b[3];
        newDst[0] = ax * bw + aw * bx + ay * bz - az * by;
        newDst[1] = ay * bw + aw * by + az * bx - ax * bz;
        newDst[2] = az * bw + aw * bz + ax * by - ay * bx;
        newDst[3] = aw * bw - ax * bx - ay * by - az * bz;
        return newDst;
    }
    /**
     * Multiplies two quaternions
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    const mul = multiply;
    /**
     * Rotates the given quaternion around the X axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateX(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const bx = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw + qw * bx;
        newDst[1] = qy * bw + qz * bx;
        newDst[2] = qz * bw - qy * bx;
        newDst[3] = qw * bw - qx * bx;
        return newDst;
    }
    /**
     * Rotates the given quaternion around the Y axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateY(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const by = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw - qz * by;
        newDst[1] = qy * bw + qw * by;
        newDst[2] = qz * bw + qx * by;
        newDst[3] = qw * bw - qy * by;
        return newDst;
    }
    /**
     * Rotates the given quaternion around the Z axis by the given angle.
     * @param q - quaternion to rotate
     * @param angleInRadians - The angle by which to rotate
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function rotateZ(q, angleInRadians, dst) {
        const newDst = (dst ?? new Ctor(4));
        const halfAngle = angleInRadians * 0.5;
        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];
        const bz = Math.sin(halfAngle);
        const bw = Math.cos(halfAngle);
        newDst[0] = qx * bw + qy * bz;
        newDst[1] = qy * bw - qx * bz;
        newDst[2] = qz * bw + qw * bz;
        newDst[3] = qw * bw - qz * bz;
        return newDst;
    }
    /**
     * Spherically linear interpolate between two quaternions
     *
     * @param a - starting value
     * @param b - ending value
     * @param t - value where 0 = a and 1 = b
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the result of a * b
     */
    function slerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const aw = a[3];
        let bx = b[0];
        let by = b[1];
        let bz = b[2];
        let bw = b[3];
        let cosOmega = ax * bx + ay * by + az * bz + aw * bw;
        if (cosOmega < 0) {
            cosOmega = -cosOmega;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        let scale0;
        let scale1;
        if (1.0 - cosOmega > EPSILON) {
            const omega = Math.acos(cosOmega);
            const sinOmega = Math.sin(omega);
            scale0 = Math.sin((1 - t) * omega) / sinOmega;
            scale1 = Math.sin(t * omega) / sinOmega;
        }
        else {
            scale0 = 1.0 - t;
            scale1 = t;
        }
        newDst[0] = scale0 * ax + scale1 * bx;
        newDst[1] = scale0 * ay + scale1 * by;
        newDst[2] = scale0 * az + scale1 * bz;
        newDst[3] = scale0 * aw + scale1 * bw;
        return newDst;
    }
    /**
     * Compute the inverse of a quaternion
     *
     * @param q - quaternion to compute the inverse of
     * @returns A quaternion that is the result of a * b
     */
    function inverse(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        const a0 = q[0];
        const a1 = q[1];
        const a2 = q[2];
        const a3 = q[3];
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1 / dot : 0;
        newDst[0] = -a0 * invDot;
        newDst[1] = -a1 * invDot;
        newDst[2] = -a2 * invDot;
        newDst[3] = a3 * invDot;
        return newDst;
    }
    /**
     * Compute the conjugate of a quaternion
     * For quaternions with a magnitude of 1 (a unit quaternion)
     * this returns the same as the inverse but is faster to calculate.
     *
     * @param q - quaternion to compute the conjugate of.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The conjugate of q
     */
    function conjugate(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = -q[0];
        newDst[1] = -q[1];
        newDst[2] = -q[2];
        newDst[3] = q[3];
        return newDst;
    }
    /**
     * Creates a quaternion from the given rotation matrix.
     *
     * The created quaternion is not normalized.
     *
     * @param m - rotation matrix
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns the result
     */
    function fromMat(m, dst) {
        const newDst = (dst ?? new Ctor(4));
        /*
        0 1 2
        3 4 5
        6 7 8
      
        0 1 2
        4 5 6
        8 9 10
         */
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        const trace = m[0] + m[5] + m[10];
        if (trace > 0.0) {
            // |w| > 1/2, may as well choose w > 1/2
            const root = Math.sqrt(trace + 1); // 2w
            newDst[3] = 0.5 * root;
            const invRoot = 0.5 / root; // 1/(4w)
            newDst[0] = (m[6] - m[9]) * invRoot;
            newDst[1] = (m[8] - m[2]) * invRoot;
            newDst[2] = (m[1] - m[4]) * invRoot;
        }
        else {
            // |w| <= 1/2
            let i = 0;
            if (m[5] > m[0]) {
                i = 1;
            }
            if (m[10] > m[i * 4 + i]) {
                i = 2;
            }
            const j = (i + 1) % 3;
            const k = (i + 2) % 3;
            const root = Math.sqrt(m[i * 4 + i] - m[j * 4 + j] - m[k * 4 + k] + 1.0);
            newDst[i] = 0.5 * root;
            const invRoot = 0.5 / root;
            newDst[3] = (m[j * 4 + k] - m[k * 4 + j]) * invRoot;
            newDst[j] = (m[j * 4 + i] + m[i * 4 + j]) * invRoot;
            newDst[k] = (m[k * 4 + i] + m[i * 4 + k]) * invRoot;
        }
        return newDst;
    }
    /**
     * Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.
     *
     * @param xAngleInRadians - angle to rotate around X axis in radians.
     * @param yAngleInRadians - angle to rotate around Y axis in radians.
     * @param zAngleInRadians - angle to rotate around Z axis in radians.
     * @param order - order to apply euler angles
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion representing the same rotation as the euler angles applied in the given order
     */
    function fromEuler(xAngleInRadians, yAngleInRadians, zAngleInRadians, order, dst) {
        const newDst = (dst ?? new Ctor(4));
        const xHalfAngle = xAngleInRadians * 0.5;
        const yHalfAngle = yAngleInRadians * 0.5;
        const zHalfAngle = zAngleInRadians * 0.5;
        const sx = Math.sin(xHalfAngle);
        const cx = Math.cos(xHalfAngle);
        const sy = Math.sin(yHalfAngle);
        const cy = Math.cos(yHalfAngle);
        const sz = Math.sin(zHalfAngle);
        const cz = Math.cos(zHalfAngle);
        switch (order) {
            case 'xyz':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'xzy':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            case 'yxz':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz - sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            case 'yzx':
                newDst[0] = sx * cy * cz + cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'zxy':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz + sx * sy * cz;
                newDst[3] = cx * cy * cz - sx * sy * sz;
                break;
            case 'zyx':
                newDst[0] = sx * cy * cz - cx * sy * sz;
                newDst[1] = cx * sy * cz + sx * cy * sz;
                newDst[2] = cx * cy * sz - sx * sy * cz;
                newDst[3] = cx * cy * cz + sx * sy * sz;
                break;
            default:
                throw new Error(`Unknown rotation order: ${order}`);
        }
        return newDst;
    }
    /**
     * Copies a quaternion. (same as {@link quat.clone})
     * Also see {@link quat.create} and {@link quat.set}
     * @param q - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is a copy of q
     */
    function copy(q, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = q[0];
        newDst[1] = q[1];
        newDst[2] = q[2];
        newDst[3] = q[3];
        return newDst;
    }
    /**
     * Clones a quaternion. (same as {@link quat.copy})
     * Also see {@link quat.create} and {@link quat.set}
     * @param q - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A copy of q.
     */
    const clone = copy;
    /**
     * Adds two quaternions; assumes a and b have the same dimension.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        newDst[3] = a[3] + b[3];
        return newDst;
    }
    /**
     * Subtracts two quaternions.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        newDst[3] = a[3] - b[3];
        return newDst;
    }
    /**
     * Subtracts two quaternions.
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns A quaternion that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Multiplies a quaternion by a scalar.
     * @param v - The quaternion.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        newDst[3] = v[3] * k;
        return newDst;
    }
    /**
     * Multiplies a quaternion by a scalar. (same as mulScalar)
     * @param v - The quaternion.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The scaled quaternion.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        newDst[3] = v[3] / k;
        return newDst;
    }
    /**
     * Computes the dot product of two quaternions
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
    }
    /**
     * Performs linear interpolation on two quaternions.
     * Given quaternions a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @param t - Interpolation coefficient.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        newDst[3] = a[3] + t * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Computes the length of quaternion
     * @param v - quaternion.
     * @returns length of quaternion.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    /**
     * Computes the length of quaternion (same as length)
     * @param v - quaternion.
     * @returns length of quaternion.
     */
    const len = length;
    /**
     * Computes the square of the length of quaternion
     * @param v - quaternion.
     * @returns square of the length of quaternion.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    /**
     * Computes the square of the length of quaternion (same as lengthSq)
     * @param v - quaternion.
     * @returns square of the length of quaternion.
     */
    const lenSq = lengthSq;
    /**
     * Divides a quaternion by its Euclidean length and returns the quotient.
     * @param v - The quaternion.
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns The normalized quaternion.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
            newDst[3] = v3 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 0;
        }
        return newDst;
    }
    /**
     * Check if 2 quaternions are approximately equal
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns true if quaternions are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON;
    }
    /**
     * Check if 2 quaternions are exactly equal
     * @param a - Operand quaternion.
     * @param b - Operand quaternion.
     * @returns true if quaternions are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Creates an identity quaternion
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns an identity quaternion
     */
    function identity(dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 1;
        return newDst;
    }
    const tempVec3 = vec3.create();
    const xUnitVec3 = vec3.create();
    const yUnitVec3 = vec3.create();
    /**
     * Computes a quaternion to represent the shortest rotation from one vector to another.
     *
     * @param aUnit - the start vector
     * @param bUnit - the end vector
     * @param dst - quaternion to hold result. If not passed in a new one is created.
     * @returns the result
     */
    function rotationTo(aUnit, bUnit, dst) {
        const newDst = (dst ?? new Ctor(4));
        const dot = vec3.dot(aUnit, bUnit);
        if (dot < -0.999999) {
            vec3.cross(xUnitVec3, aUnit, tempVec3);
            if (vec3.len(tempVec3) < 0.000001) {
                vec3.cross(yUnitVec3, aUnit, tempVec3);
            }
            vec3.normalize(tempVec3, tempVec3);
            fromAxisAngle(tempVec3, Math.PI, newDst);
            return newDst;
        }
        else if (dot > 0.999999) {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 1;
            return newDst;
        }
        else {
            vec3.cross(aUnit, bUnit, tempVec3);
            newDst[0] = tempVec3[0];
            newDst[1] = tempVec3[1];
            newDst[2] = tempVec3[2];
            newDst[3] = 1 + dot;
            return normalize(newDst, newDst);
        }
    }
    const tempQuat1 = new Ctor(4);
    const tempQuat2 = new Ctor(4);
    /**
     * Performs a spherical linear interpolation with two control points
     *
     * @param a - the first quaternion
     * @param b - the second quaternion
     * @param c - the third quaternion
     * @param d - the fourth quaternion
     * @param t - Interpolation coefficient 0 to 1
     * @returns result
     */
    function sqlerp(a, b, c, d, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        slerp(a, d, t, tempQuat1);
        slerp(b, c, t, tempQuat2);
        slerp(tempQuat1, tempQuat2, 2 * t * (1 - t), newDst);
        return newDst;
    }
    return {
        create,
        fromValues,
        set,
        fromAxisAngle,
        toAxisAngle,
        angle,
        multiply,
        mul,
        rotateX,
        rotateY,
        rotateZ,
        slerp,
        inverse,
        conjugate,
        fromMat,
        fromEuler,
        copy,
        clone,
        add,
        subtract,
        sub,
        mulScalar,
        scale,
        divScalar,
        dot,
        lerp,
        length,
        len,
        lengthSq,
        lenSq,
        normalize,
        equalsApproximately,
        equals,
        identity,
        rotationTo,
        sqlerp,
    };
}
const cache$1 = new Map();
/**
 *
 * Quat4 math functions.
 *
 * Almost all functions take an optional `newDst` argument. If it is not passed in the
 * functions will create a new `Quat4`. In other words you can do this
 *
 *     const v = quat4.cross(v1, v2);  // Creates a new Quat4 with the cross product of v1 x v2.
 *
 * or
 *
 *     const v = quat4.create();
 *     quat4.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always safe to pass any vector as the destination. So for example
 *
 *     quat4.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 */
function getAPI$1(Ctor) {
    let api = cache$1.get(Ctor);
    if (!api) {
        api = getAPIImpl$1(Ctor);
        cache$1.set(Ctor, api);
    }
    return api;
}

/*
 * Copyright 2022 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Generates am typed API for Vec4
 * */
function getAPIImpl(Ctor) {
    /**
     * Creates a vec4; may be called with x, y, z to set initial values.
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param w - Initial w value.
     * @returns the created vector
     */
    function create(x, y, z, w) {
        const newDst = new Ctor(4);
        if (x !== undefined) {
            newDst[0] = x;
            if (y !== undefined) {
                newDst[1] = y;
                if (z !== undefined) {
                    newDst[2] = z;
                    if (w !== undefined) {
                        newDst[3] = w;
                    }
                }
            }
        }
        return newDst;
    }
    /**
     * Creates a vec4; may be called with x, y, z to set initial values. (same as create)
     * @param x - Initial x value.
     * @param y - Initial y value.
     * @param z - Initial z value.
     * @param z - Initial w value.
     * @returns the created vector
     */
    const fromValues = create;
    /**
     * Sets the values of a Vec4
     * Also see {@link vec4.create} and {@link vec4.copy}
     *
     * @param x first value
     * @param y second value
     * @param z third value
     * @param w fourth value
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector with its elements set.
     */
    function set(x, y, z, w, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = x;
        newDst[1] = y;
        newDst[2] = z;
        newDst[3] = w;
        return newDst;
    }
    /**
     * Applies Math.ceil to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the ceil of each element of v.
     */
    function ceil(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.ceil(v[0]);
        newDst[1] = Math.ceil(v[1]);
        newDst[2] = Math.ceil(v[2]);
        newDst[3] = Math.ceil(v[3]);
        return newDst;
    }
    /**
     * Applies Math.floor to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the floor of each element of v.
     */
    function floor(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.floor(v[0]);
        newDst[1] = Math.floor(v[1]);
        newDst[2] = Math.floor(v[2]);
        newDst[3] = Math.floor(v[3]);
        return newDst;
    }
    /**
     * Applies Math.round to each element of vector
     * @param v - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the round of each element of v.
     */
    function round(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.round(v[0]);
        newDst[1] = Math.round(v[1]);
        newDst[2] = Math.round(v[2]);
        newDst[3] = Math.round(v[3]);
        return newDst;
    }
    /**
     * Clamp each element of vector between min and max
     * @param v - Operand vector.
     * @param max - Min value, default 0
     * @param min - Max value, default 1
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that the clamped value of each element of v.
     */
    function clamp(v, min = 0, max = 1, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.min(max, Math.max(min, v[0]));
        newDst[1] = Math.min(max, Math.max(min, v[1]));
        newDst[2] = Math.min(max, Math.max(min, v[2]));
        newDst[3] = Math.min(max, Math.max(min, v[3]));
        return newDst;
    }
    /**
     * Adds two vectors; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a and b.
     */
    function add(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0];
        newDst[1] = a[1] + b[1];
        newDst[2] = a[2] + b[2];
        newDst[3] = a[3] + b[3];
        return newDst;
    }
    /**
     * Adds two vectors, scaling the 2nd; assumes a and b have the same dimension.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param scale - Amount to scale b
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the sum of a + b * scale.
     */
    function addScaled(a, b, scale, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + b[0] * scale;
        newDst[1] = a[1] + b[1] * scale;
        newDst[2] = a[2] + b[2] * scale;
        newDst[3] = a[3] + b[3] * scale;
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    function subtract(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] - b[0];
        newDst[1] = a[1] - b[1];
        newDst[2] = a[2] - b[2];
        newDst[3] = a[3] - b[3];
        return newDst;
    }
    /**
     * Subtracts two vectors.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A vector that is the difference of a and b.
     */
    const sub = subtract;
    /**
     * Check if 2 vectors are approximately equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are approximately equal
     */
    function equalsApproximately(a, b) {
        return Math.abs(a[0] - b[0]) < EPSILON &&
            Math.abs(a[1] - b[1]) < EPSILON &&
            Math.abs(a[2] - b[2]) < EPSILON &&
            Math.abs(a[3] - b[3]) < EPSILON;
    }
    /**
     * Check if 2 vectors are exactly equal
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns true if vectors are exactly equal
     */
    function equals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficient.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The linear interpolated result.
     */
    function lerp(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t * (b[0] - a[0]);
        newDst[1] = a[1] + t * (b[1] - a[1]);
        newDst[2] = a[2] + t * (b[2] - a[2]);
        newDst[3] = a[3] + t * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Performs linear interpolation on two vectors.
     * Given vectors a and b and interpolation coefficient vector t, returns
     * a + t * (b - a).
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param t - Interpolation coefficients vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns the linear interpolated result.
     */
    function lerpV(a, b, t, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] + t[0] * (b[0] - a[0]);
        newDst[1] = a[1] + t[1] * (b[1] - a[1]);
        newDst[2] = a[2] + t[2] * (b[2] - a[2]);
        newDst[3] = a[3] + t[3] * (b[3] - a[3]);
        return newDst;
    }
    /**
     * Return max values of two vectors.
     * Given vectors a and b returns
     * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The max components vector.
     */
    function max(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.max(a[0], b[0]);
        newDst[1] = Math.max(a[1], b[1]);
        newDst[2] = Math.max(a[2], b[2]);
        newDst[3] = Math.max(a[3], b[3]);
        return newDst;
    }
    /**
     * Return min values of two vectors.
     * Given vectors a and b returns
     * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The min components vector.
     */
    function min(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = Math.min(a[0], b[0]);
        newDst[1] = Math.min(a[1], b[1]);
        newDst[2] = Math.min(a[2], b[2]);
        newDst[3] = Math.min(a[3], b[3]);
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function mulScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] * k;
        newDst[1] = v[1] * k;
        newDst[2] = v[2] * k;
        newDst[3] = v[3] * k;
        return newDst;
    }
    /**
     * Multiplies a vector by a scalar. (same as mulScalar)
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    const scale = mulScalar;
    /**
     * Divides a vector by a scalar.
     * @param v - The vector.
     * @param k - The scalar.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The scaled vector.
     */
    function divScalar(v, k, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0] / k;
        newDst[1] = v[1] / k;
        newDst[2] = v[2] / k;
        newDst[3] = v[3] / k;
        return newDst;
    }
    /**
     * Inverse a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    function inverse(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 1 / v[0];
        newDst[1] = 1 / v[1];
        newDst[2] = 1 / v[2];
        newDst[3] = 1 / v[3];
        return newDst;
    }
    /**
     * Invert a vector. (same as inverse)
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The inverted vector.
     */
    const invert = inverse;
    /**
     * Computes the dot product of two vectors
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @returns dot product
     */
    function dot(a, b) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
    }
    /**
     * Computes the length of vector
     * @param v - vector.
     * @returns length of vector.
     */
    function length(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    /**
     * Computes the length of vector (same as length)
     * @param v - vector.
     * @returns length of vector.
     */
    const len = length;
    /**
     * Computes the square of the length of vector
     * @param v - vector.
     * @returns square of the length of vector.
     */
    function lengthSq(v) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    /**
     * Computes the square of the length of vector (same as lengthSq)
     * @param v - vector.
     * @returns square of the length of vector.
     */
    const lenSq = lengthSq;
    /**
     * Computes the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }
    /**
     * Computes the distance between 2 points (same as distance)
     * @param a - vector.
     * @param b - vector.
     * @returns distance between a and b
     */
    const dist = distance;
    /**
     * Computes the square of the distance between 2 points
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    function distanceSq(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }
    /**
     * Computes the square of the distance between 2 points (same as distanceSq)
     * @param a - vector.
     * @param b - vector.
     * @returns square of the distance between a and b
     */
    const distSq = distanceSq;
    /**
     * Divides a vector by its Euclidean length and returns the quotient.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The normalized vector.
     */
    function normalize(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
        if (len > 0.00001) {
            newDst[0] = v0 / len;
            newDst[1] = v1 / len;
            newDst[2] = v2 / len;
            newDst[3] = v3 / len;
        }
        else {
            newDst[0] = 0;
            newDst[1] = 0;
            newDst[2] = 0;
            newDst[3] = 0;
        }
        return newDst;
    }
    /**
     * Negates a vector.
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns -v.
     */
    function negate(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = -v[0];
        newDst[1] = -v[1];
        newDst[2] = -v[2];
        newDst[3] = -v[3];
        return newDst;
    }
    /**
     * Copies a vector. (same as {@link vec4.clone})
     * Also see {@link vec4.create} and {@link vec4.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    function copy(v, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = v[0];
        newDst[1] = v[1];
        newDst[2] = v[2];
        newDst[3] = v[3];
        return newDst;
    }
    /**
     * Clones a vector. (same as {@link vec4.copy})
     * Also see {@link vec4.create} and {@link vec4.set}
     * @param v - The vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns A copy of v.
     */
    const clone = copy;
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    function multiply(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] * b[0];
        newDst[1] = a[1] * b[1];
        newDst[2] = a[2] * b[2];
        newDst[3] = a[3] * b[3];
        return newDst;
    }
    /**
     * Multiplies a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as mul)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of products of entries of a and b.
     */
    const mul = multiply;
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length.
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    function divide(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = a[0] / b[0];
        newDst[1] = a[1] / b[1];
        newDst[2] = a[2] / b[2];
        newDst[3] = a[3] / b[3];
        return newDst;
    }
    /**
     * Divides a vector by another vector (component-wise); assumes a and
     * b have the same length. (same as divide)
     * @param a - Operand vector.
     * @param b - Operand vector.
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The vector of quotients of entries of a and b.
     */
    const div = divide;
    /**
     * Zero's a vector
     * @param dst - vector to hold result. If not passed in a new one is created.
     * @returns The zeroed vector.
     */
    function zero(dst) {
        const newDst = (dst ?? new Ctor(4));
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
        return newDst;
    }
    /**
     * transform vec4 by 4x4 matrix
     * @param v - the vector
     * @param m - The matrix.
     * @param dst - optional vec4 to store result. If not passed a new one is created.
     * @returns the transformed vector
     */
    function transformMat4(v, m, dst) {
        const newDst = (dst ?? new Ctor(4));
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const w = v[3];
        newDst[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        newDst[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        newDst[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        newDst[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return newDst;
    }
    /**
     * Treat a 4D vector as a direction and set it's length
     *
     * @param a The vec4 to lengthen
     * @param len The length of the resulting vector
     * @returns The lengthened vector
     */
    function setLength(a, len, dst) {
        const newDst = (dst ?? new Ctor(4));
        normalize(a, newDst);
        return mulScalar(newDst, len, newDst);
    }
    /**
     * Ensure a vector is not longer than a max length
     *
     * @param a The vec4 to limit
     * @param maxLen The longest length of the resulting vector
     * @returns The vector, shortened to maxLen if it's too long
     */
    function truncate(a, maxLen, dst) {
        const newDst = (dst ?? new Ctor(4));
        if (length(a) > maxLen) {
            return setLength(a, maxLen, newDst);
        }
        return copy(a, newDst);
    }
    /**
     * Return the vector exactly between 2 endpoint vectors
     *
     * @param a Endpoint 1
     * @param b Endpoint 2
     * @returns The vector exactly residing between endpoints 1 and 2
     */
    function midpoint(a, b, dst) {
        const newDst = (dst ?? new Ctor(4));
        return lerp(a, b, 0.5, newDst);
    }
    return {
        create,
        fromValues,
        set,
        ceil,
        floor,
        round,
        clamp,
        add,
        addScaled,
        subtract,
        sub,
        equalsApproximately,
        equals,
        lerp,
        lerpV,
        max,
        min,
        mulScalar,
        scale,
        divScalar,
        inverse,
        invert,
        dot,
        length,
        len,
        lengthSq,
        lenSq,
        distance,
        dist,
        distanceSq,
        distSq,
        normalize,
        negate,
        copy,
        clone,
        multiply,
        mul,
        divide,
        div,
        zero,
        transformMat4,
        setLength,
        truncate,
        midpoint,
    };
}
const cache = new Map();
/**
 *
 * Vec4 math functions.
 *
 * Almost all functions take an optional `newDst` argument. If it is not passed in the
 * functions will create a new `Vec4`. In other words you can do this
 *
 *     const v = vec4.cross(v1, v2);  // Creates a new Vec4 with the cross product of v1 x v2.
 *
 * or
 *
 *     const v = vec4.create();
 *     vec4.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always safe to pass any vector as the destination. So for example
 *
 *     vec4.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 */
function getAPI(Ctor) {
    let api = cache.get(Ctor);
    if (!api) {
        api = getAPIImpl(Ctor);
        cache.set(Ctor, api);
    }
    return api;
}

/**
 * Generate wgpu-matrix API for type
 */
function wgpuMatrixAPI(Mat3Ctor, Mat4Ctor, QuatCtor, Vec2Ctor, Vec3Ctor, Vec4Ctor) {
    return {
        /** @namespace mat4 */
        mat4: getAPI$2(Mat3Ctor),
        /** @namespace mat3 */
        mat3: getAPI$4(Mat4Ctor),
        /** @namespace quat */
        quat: getAPI$1(QuatCtor),
        /** @namespace vec2 */
        vec2: getAPI$5(Vec2Ctor),
        /** @namespace vec3 */
        vec3: getAPI$3(Vec3Ctor),
        /** @namespace vec4 */
        vec4: getAPI(Vec4Ctor),
    };
}
const { 
/** @namespace */
mat4, 
/** @namespace */
mat3, 
/** @namespace */
quat, 
/** @namespace */
vec2, 
/** @namespace */
vec3, 
/** @namespace */
vec4, } = wgpuMatrixAPI(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
const { 
/** @namespace */
mat4: mat4d, 
/** @namespace */
mat3: mat3d, 
/** @namespace */
quat: quatd, 
/** @namespace */
vec2: vec2d, 
/** @namespace */
vec3: vec3d, 
/** @namespace */
vec4: vec4d, } = wgpuMatrixAPI(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
const { 
/** @namespace */
mat4: mat4n, 
/** @namespace */
mat3: mat3n, 
/** @namespace */
quat: quatn, 
/** @namespace */
vec2: vec2n, 
/** @namespace */
vec3: vec3n, 
/** @namespace */
vec4: vec4n, } = wgpuMatrixAPI(ZeroArray, Array, Array, Array, Array, Array);


//# sourceMappingURL=wgpu-matrix.module.js.map


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./index.ts"));
/******/ }
]);