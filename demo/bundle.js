/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst render_1 = __importDefault(__webpack_require__(/*! ./render */ \"./src/render/index.ts\"));\r\nclass Editor {\r\n    constructor(root) {\r\n        if (!root)\r\n            throw new Error('root element is required');\r\n        this.root = root;\r\n        this.root.style.position = 'relative';\r\n        this.root.style.overflow = 'hidden';\r\n        this.image = new Image();\r\n        this.render = new render_1.default(this.root);\r\n    }\r\n    loadImage(url) {\r\n        this.image.onload = () => {\r\n            this.render.init(this.image);\r\n        };\r\n        this.image.src = url;\r\n    }\r\n}\r\n// @ts-ignore\r\nwindow.Editor = Editor;\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/input/keyboard.ts":
/*!*******************************!*\
  !*** ./src/input/keyboard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Keyboard {\r\n    constructor() {\r\n        this.keyState = {};\r\n        console.log('[Keyboard] initzalizing...');\r\n        document.addEventListener('keydown', event => {\r\n            this.keyState[event.key] = true;\r\n        });\r\n        document.addEventListener('keyup', event => {\r\n            delete this.keyState[event.key];\r\n        });\r\n        console.log('[Keyboard] initialized');\r\n    }\r\n    getState(key) {\r\n        return !!this.keyState[key];\r\n    }\r\n}\r\nexports[\"default\"] = Keyboard;\r\n\n\n//# sourceURL=webpack:///./src/input/keyboard.ts?");

/***/ }),

/***/ "./src/input/mouse.ts":
/*!****************************!*\
  !*** ./src/input/mouse.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Mouse {\r\n    constructor(e) {\r\n        this.keyState = {};\r\n        this.root = e;\r\n        console.log('[Mouse] initzalizing...');\r\n        this.root.addEventListener('mousedown', event => {\r\n            const x = event.offsetX;\r\n            const y = event.offsetY;\r\n            this.keyState[event.button] = { x, y };\r\n        });\r\n        this.root.addEventListener('mouseup', event => {\r\n            delete this.keyState[event.button];\r\n        });\r\n        console.log('[Mouse] initialized');\r\n    }\r\n    getState(key) {\r\n        return this.keyState[key];\r\n    }\r\n}\r\nexports[\"default\"] = Mouse;\r\n\n\n//# sourceURL=webpack:///./src/input/mouse.ts?");

/***/ }),

/***/ "./src/math/index.ts":
/*!***************************!*\
  !*** ./src/math/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports[\"default\"] = {\r\n    // 计算两点之间的距离\r\n    distance(x1, y1, x2, y2) {\r\n        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));\r\n    },\r\n    // 坐标是否在矩形内\r\n    inArea(x, y, x1, y1, x2, y2) {\r\n        const formatedX1 = Math.min(x1, x2);\r\n        const formatedX2 = Math.max(x1, x2);\r\n        const formatedY1 = Math.min(y1, y2);\r\n        const formatedY2 = Math.max(y1, y2);\r\n        return x >= formatedX1 && x <= formatedX2 && y >= formatedY1 && y <= formatedY2;\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./src/math/index.ts?");

/***/ }),

/***/ "./src/render/cache.ts":
/*!*****************************!*\
  !*** ./src/render/cache.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Cache {\r\n    constructor(len) {\r\n        this.history = [];\r\n        this.length = len;\r\n    }\r\n    append(id, data) {\r\n        this.history.push(data);\r\n        if (this.history.length > this.length) {\r\n            this.history.shift();\r\n        }\r\n    }\r\n    get(id) {\r\n        return this.history.find((item) => item.id === id);\r\n    }\r\n    delete(id) {\r\n        this.history = this.history.filter((item) => item.id !== id);\r\n    }\r\n}\r\nexports[\"default\"] = Cache;\r\n\n\n//# sourceURL=webpack:///./src/render/cache.ts?");

/***/ }),

/***/ "./src/render/canvas.ts":
/*!******************************!*\
  !*** ./src/render/canvas.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports[\"default\"] = (zIndex) => {\r\n    const canvas = document.createElement('canvas');\r\n    canvas.style.position = 'absolute';\r\n    canvas.style.zIndex = zIndex.toString();\r\n    canvas.style.top = '0';\r\n    canvas.style.left = '0';\r\n    canvas.style.width = '100%';\r\n    canvas.style.height = '100%';\r\n    const ctx = canvas.getContext('2d');\r\n    return {\r\n        canvas,\r\n        ctx\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/render/canvas.ts?");

/***/ }),

/***/ "./src/render/index.ts":
/*!*****************************!*\
  !*** ./src/render/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst cache_1 = __importDefault(__webpack_require__(/*! ./cache */ \"./src/render/cache.ts\"));\r\nconst selection_1 = __importDefault(__webpack_require__(/*! ./layers/selection */ \"./src/render/layers/selection.ts\"));\r\nconst image_1 = __importDefault(__webpack_require__(/*! ./layers/image */ \"./src/render/layers/image.ts\"));\r\nconst background_1 = __importDefault(__webpack_require__(/*! ./layers/background */ \"./src/render/layers/background.ts\"));\r\nclass Render {\r\n    constructor(root) {\r\n        this.history = [];\r\n        this.cache = new cache_1.default(10);\r\n        this.layers = {\r\n            image: new image_1.default(),\r\n            selection: new selection_1.default(),\r\n            background: new background_1.default()\r\n        };\r\n        this.layers.background.setRoot(root);\r\n        this.layers.image.setRoot(root);\r\n        this.layers.selection.setRoot(root);\r\n        this.layers.background.setRender(this);\r\n        this.layers.image.setRender(this);\r\n        this.layers.selection.setRender(this);\r\n        this.layers.background.init();\r\n        this.layers.image.init();\r\n        this.layers.selection.init();\r\n    }\r\n    init(image) {\r\n        this.layers.image.render(image);\r\n    }\r\n    update() {\r\n        // 渲染\r\n    }\r\n}\r\nexports[\"default\"] = Render;\r\n\n\n//# sourceURL=webpack:///./src/render/index.ts?");

/***/ }),

/***/ "./src/render/layers/background.ts":
/*!*****************************************!*\
  !*** ./src/render/layers/background.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst root_1 = __importDefault(__webpack_require__(/*! ../../root */ \"./src/root.ts\"));\r\nconst canvas_1 = __importDefault(__webpack_require__(/*! ../canvas */ \"./src/render/canvas.ts\"));\r\nclass Background extends root_1.default {\r\n    init() {\r\n        if (!this.root)\r\n            throw new Error('root element is required');\r\n        const c = (0, canvas_1.default)(1);\r\n        this.canvas = c.canvas;\r\n        const width = this.root.clientWidth;\r\n        const height = this.root.clientHeight;\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.ctx = c.ctx;\r\n        this.root.appendChild(this.canvas);\r\n        this.render();\r\n    }\r\n    render() {\r\n        // 渲染灰白相间的透明背景\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n        for (let i = 0; i < this.canvas.width; i += 10) {\r\n            for (let j = 0; j < this.canvas.height; j += 10) {\r\n                this.ctx.fillStyle = (i + j) % 20 === 0 ? '#ccc' : '#fff';\r\n                this.ctx.fillRect(i, j, 10, 10);\r\n            }\r\n        }\r\n    }\r\n}\r\nexports[\"default\"] = Background;\r\n\n\n//# sourceURL=webpack:///./src/render/layers/background.ts?");

/***/ }),

/***/ "./src/render/layers/image.ts":
/*!************************************!*\
  !*** ./src/render/layers/image.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst root_1 = __importDefault(__webpack_require__(/*! ../../root */ \"./src/root.ts\"));\r\nconst canvas_1 = __importDefault(__webpack_require__(/*! ../canvas */ \"./src/render/canvas.ts\"));\r\nconst math_1 = __importDefault(__webpack_require__(/*! ../../math */ \"./src/math/index.ts\"));\r\nclass Selection extends root_1.default {\r\n    constructor() {\r\n        super(...arguments);\r\n        // 图片距离画布左上角的坐标\r\n        this.position = { x: 0, y: 0 };\r\n        // 图片距离中心点的距离\r\n        this.offset = { x: 0, y: 0 };\r\n        // 图片所在的矩形区域\r\n        this.area = { x1: 0, y1: 0, x2: 0, y2: 0 };\r\n        // 缩放倍率\r\n        this.scale = 1;\r\n        // 上一个鼠标坐标\r\n        this.prevPosition = { x: -1, y: -1 };\r\n    }\r\n    init() {\r\n        const c = (0, canvas_1.default)(1);\r\n        this.canvas = c.canvas;\r\n        const width = this.root.clientWidth;\r\n        const height = this.root.clientHeight;\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.ctx = c.ctx;\r\n        this.root.appendChild(this.canvas);\r\n        // 缩放\r\n        this.root.addEventListener('wheel', event => {\r\n            event.preventDefault();\r\n            event.stopPropagation();\r\n            const zoom = event.ctrlKey ? 0.1 : 0.01;\r\n            const delta = event.deltaY;\r\n            if (delta > 0) {\r\n                this.scale -= zoom;\r\n            }\r\n            else {\r\n                this.scale += zoom;\r\n            }\r\n            if (this.scale < 0.01) {\r\n                this.scale = 0.01;\r\n            }\r\n            this.update();\r\n        });\r\n        // 拖拽\r\n        this.root.addEventListener('mousemove', event => {\r\n            if (!this.mouse.getState(0))\r\n                return;\r\n            if (!this.keyboard.getState(' '))\r\n                return;\r\n            const x = event.offsetX;\r\n            const y = event.offsetY;\r\n            if (this.prevPosition.x === -1 && this.prevPosition.y === -1) {\r\n                const start = this.mouse.getState(0);\r\n                this.prevPosition.x = start.x;\r\n                this.prevPosition.y = start.y;\r\n            }\r\n            this.offset.x += x - this.prevPosition.x;\r\n            this.offset.y += y - this.prevPosition.y;\r\n            this.prevPosition.x = x;\r\n            this.prevPosition.y = y;\r\n            this.update();\r\n        });\r\n        // 拖拽结束\r\n        this.root.addEventListener('mouseup', event => {\r\n            this.prevPosition.x = -1;\r\n            this.prevPosition.y = -1;\r\n        });\r\n        // 双击\r\n        this.root.addEventListener('dblclick', event => {\r\n            const x = event.offsetX;\r\n            const y = event.offsetY;\r\n            if (math_1.default.inArea(x, y, this.area.x1, this.area.y1, this.area.x2, this.area.y2)) {\r\n                this.Render.layers.selection.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2);\r\n            }\r\n        });\r\n    }\r\n    render(image) {\r\n        this.setImage(image);\r\n        this.update(true);\r\n    }\r\n    setImage(image) {\r\n        this.image = image;\r\n    }\r\n    update(isInit = false) {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n        const imageWidth = this.image.width;\r\n        const imageHeight = this.image.height;\r\n        const canvasWidth = this.canvas.width;\r\n        const canvasHeight = this.canvas.height;\r\n        if (!isInit) {\r\n            this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2 * this.scale;\r\n            this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2 * this.scale;\r\n            this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale);\r\n            this.area.x1 = this.position.x;\r\n            this.area.y1 = this.position.y;\r\n            this.area.x2 = this.position.x + this.image.width * this.scale;\r\n            this.area.y2 = this.position.y + this.image.height * this.scale;\r\n            return;\r\n        }\r\n        // 初始化时，图片居中显示\r\n        if (imageWidth > canvasWidth || imageHeight > canvasHeight) {\r\n            const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);\r\n            this.scale = scale;\r\n            this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2 * this.scale;\r\n            this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2 * this.scale;\r\n        }\r\n        else {\r\n            this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2;\r\n            this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2;\r\n        }\r\n        this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale);\r\n        this.area.x1 = this.position.x;\r\n        this.area.y1 = this.position.y;\r\n        this.area.x2 = this.position.x + this.image.width * this.scale;\r\n        this.area.y2 = this.position.y + this.image.height * this.scale;\r\n    }\r\n    // 转换canvas坐标到图片坐标\r\n    transformCanvasToImage(x, y) {\r\n        return {\r\n            x: (x - this.position.x) / this.scale,\r\n            y: (y - this.position.y) / this.scale\r\n        };\r\n    }\r\n    // 转换图片坐标到canvas坐标\r\n    transformImageToCanvas(x, y) {\r\n        return {\r\n            x: x * this.scale + this.position.x,\r\n            y: y * this.scale + this.position.y\r\n        };\r\n    }\r\n}\r\nexports[\"default\"] = Selection;\r\n\n\n//# sourceURL=webpack:///./src/render/layers/image.ts?");

/***/ }),

/***/ "./src/render/layers/selection.ts":
/*!****************************************!*\
  !*** ./src/render/layers/selection.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst root_1 = __importDefault(__webpack_require__(/*! ../../root */ \"./src/root.ts\"));\r\nconst selection_1 = __importDefault(__webpack_require__(/*! ../utils/selection */ \"./src/render/utils/selection.ts\"));\r\nconst math_1 = __importDefault(__webpack_require__(/*! ../../math */ \"./src/math/index.ts\"));\r\nconst canvas_1 = __importDefault(__webpack_require__(/*! ../canvas */ \"./src/render/canvas.ts\"));\r\nclass Selection extends root_1.default {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.state = false;\r\n        this.position = { x: 0, y: 0 };\r\n        this.area = { x1: 0, y1: 0, x2: 0, y2: 0 };\r\n        this.prevPosition = { x: 0, y: 0 };\r\n        this.state_isMove = false;\r\n        this.state_isResize = -1;\r\n        this.cursorMap = {\r\n            0: 'nw-resize',\r\n            1: 'sw-resize',\r\n            2: 'ne-resize',\r\n            3: 'se-resize'\r\n        };\r\n    }\r\n    init() {\r\n        const c = (0, canvas_1.default)(2);\r\n        this.canvas = c.canvas;\r\n        const width = this.root.clientWidth;\r\n        const height = this.root.clientHeight;\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.ctx = c.ctx;\r\n        this.root.appendChild(this.canvas);\r\n        this.root.addEventListener('mousedown', event => {\r\n            if (this.keyboard.getState(' '))\r\n                return;\r\n            const x = event.offsetX;\r\n            const y = event.offsetY;\r\n            const pos1 = { x: this.area.x1, y: this.area.y1 }; // 左上角\r\n            const pos2 = { x: this.area.x1, y: this.area.y2 }; // 左下角\r\n            const pos3 = { x: this.area.x2, y: this.area.y1 }; // 右上角\r\n            const pos4 = { x: this.area.x2, y: this.area.y2 }; // 右下角\r\n            const distances = [\r\n                math_1.default.distance(x, y, pos1.x, pos1.y),\r\n                math_1.default.distance(x, y, pos2.x, pos2.y),\r\n                math_1.default.distance(x, y, pos3.x, pos3.y),\r\n                math_1.default.distance(x, y, pos4.x, pos4.y)\r\n            ];\r\n            const minDistance = Math.min(...distances);\r\n            console.log(`[Selection] minDistance: ${minDistance}`);\r\n            if (minDistance < 8) {\r\n                this.state = true;\r\n                this.prevPosition = { x, y };\r\n                const index = distances.indexOf(minDistance);\r\n                const cursor = this.cursorMap[index];\r\n                this.state_isResize = index;\r\n                this.root.style.cursor = cursor;\r\n                return;\r\n            }\r\n            if (math_1.default.inArea(x, y, this.area.x1, this.area.y1, this.area.x2, this.area.y2)) {\r\n                this.state = true;\r\n                this.prevPosition = { x, y };\r\n                this.state_isMove = true;\r\n                this.root.style.cursor = 'move';\r\n                return;\r\n            }\r\n            this.state = true;\r\n            this.position = { x, y };\r\n        });\r\n        this.root.addEventListener('mousemove', event => {\r\n            if (!this.state)\r\n                return;\r\n            if (this.keyboard.getState(' ')) {\r\n                this.state = false;\r\n                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n                return;\r\n            }\r\n            const x = event.offsetX;\r\n            const y = event.offsetY;\r\n            if (this.state_isResize !== -1) {\r\n                const index = this.state_isResize;\r\n                if (index === 0) {\r\n                    // 左上角\r\n                    this.area.x1 = x;\r\n                    this.area.y1 = y;\r\n                }\r\n                else if (index === 1) {\r\n                    // 左下角\r\n                    this.area.x1 = x;\r\n                    this.area.y2 = y;\r\n                }\r\n                else if (index === 2) {\r\n                    // 右上角\r\n                    this.area.x2 = x;\r\n                    this.area.y1 = y;\r\n                }\r\n                else if (index === 3) {\r\n                    // 右下角\r\n                    this.area.x2 = x;\r\n                    this.area.y2 = y;\r\n                }\r\n                this.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2);\r\n                return;\r\n            }\r\n            if (this.state_isMove) {\r\n                this.area.x1 += x - this.prevPosition.x;\r\n                this.area.y1 += y - this.prevPosition.y;\r\n                this.area.x2 += x - this.prevPosition.x;\r\n                this.area.y2 += y - this.prevPosition.y;\r\n                this.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2);\r\n                this.prevPosition = { x, y };\r\n                return;\r\n            }\r\n            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n            (0, selection_1.default)(this.ctx, this.position.x, this.position.y, x, y);\r\n            this.area = {\r\n                x1: this.position.x,\r\n                y1: this.position.y,\r\n                x2: x,\r\n                y2: y\r\n            };\r\n        });\r\n        this.root.addEventListener('mouseup', event => {\r\n            this.state = false;\r\n            this.state_isMove = false;\r\n            this.state_isResize = -1;\r\n            this.root.style.cursor = 'default';\r\n            const distance = math_1.default.distance(this.position.x, this.position.y, event.offsetX, event.offsetY);\r\n            if (distance < 5) {\r\n                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n                this.area = { x1: 0, y1: 0, x2: 0, y2: 0 };\r\n            }\r\n        });\r\n    }\r\n    getCurrentArea() {\r\n        return this.area;\r\n    }\r\n    isEmptyArea() {\r\n        return this.area.x1 === 0 && this.area.y1 === 0 && this.area.x2 === 0 && this.area.y2 === 0;\r\n    }\r\n    createSelection(x1, y1, x2, y2) {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n        this.area = { x1, y1, x2, y2 };\r\n        (0, selection_1.default)(this.ctx, x1, y1, x2, y2);\r\n    }\r\n}\r\nexports[\"default\"] = Selection;\r\n\n\n//# sourceURL=webpack:///./src/render/layers/selection.ts?");

/***/ }),

/***/ "./src/render/utils/dot.ts":
/*!*********************************!*\
  !*** ./src/render/utils/dot.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports[\"default\"] = (ctx, color, x, y, r) => {\r\n    ctx.fillStyle = color;\r\n    ctx.beginPath();\r\n    ctx.arc(x, y, r, 0, Math.PI * 2);\r\n    ctx.fill();\r\n};\r\n\n\n//# sourceURL=webpack:///./src/render/utils/dot.ts?");

/***/ }),

/***/ "./src/render/utils/selection.ts":
/*!***************************************!*\
  !*** ./src/render/utils/selection.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst dot_1 = __importDefault(__webpack_require__(/*! ./dot */ \"./src/render/utils/dot.ts\"));\r\nexports[\"default\"] = (ctx, x1, y1, x2, y2, line = 'rgba(0, 0, 0, 0.6)', fill = 'rgba(0, 0, 0, 0.1)') => {\r\n    ctx.beginPath();\r\n    ctx.strokeStyle = line;\r\n    ctx.moveTo(x1, y1);\r\n    ctx.lineTo(x1, y2);\r\n    ctx.lineTo(x2, y2);\r\n    ctx.lineTo(x2, y1);\r\n    ctx.closePath();\r\n    ctx.stroke();\r\n    // 绘制半透明的矩形\r\n    ctx.fillStyle = fill;\r\n    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);\r\n    (0, dot_1.default)(ctx, line, x1, y1, 4);\r\n    (0, dot_1.default)(ctx, line, x1, y2, 4);\r\n    (0, dot_1.default)(ctx, line, x2, y1, 4);\r\n    (0, dot_1.default)(ctx, line, x2, y2, 4);\r\n};\r\n\n\n//# sourceURL=webpack:///./src/render/utils/selection.ts?");

/***/ }),

/***/ "./src/root.ts":
/*!*********************!*\
  !*** ./src/root.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst keyboard_1 = __importDefault(__webpack_require__(/*! ./input/keyboard */ \"./src/input/keyboard.ts\"));\r\nconst mouse_1 = __importDefault(__webpack_require__(/*! ./input/mouse */ \"./src/input/mouse.ts\"));\r\nclass Root {\r\n    setRoot(root) {\r\n        this.root = root;\r\n        this.keyboard = new keyboard_1.default();\r\n        this.mouse = new mouse_1.default(root);\r\n    }\r\n    setRender(render) {\r\n        this.Render = render;\r\n    }\r\n}\r\nexports[\"default\"] = Root;\r\n\n\n//# sourceURL=webpack:///./src/root.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;