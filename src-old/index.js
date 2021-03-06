/*
 * @Author: uncoder
 * @Date: 2018-01-17 15:38:47
 * @Last Modified by: xiaoqiang.shi
 * @Last Modified time: 2019-12-01 14:36:22
 */

import * as THREE from 'three';
import { TweenLite } from 'gsap/TweenMax';
import { setAxis } from './src/axis';
import { createWish2 } from './src/wish';
import { createRocket } from './src/rocket';
import { createFirework } from './src/firework';
import { createSnow2 } from './src/snow';
import { createPlane } from './src/plane';
import { createLight } from './src/light';
import json from './src/fonts/font.json';

const OrbitControls = require('three-orbit-controls')(THREE);

// 获取浏览器窗口的宽高，后续会用
const width = window.innerWidth;
const height = window.innerHeight;

window.onload = function() {
    // 字体需要异步加载后使用，因此我这里就先加载了字体。
    // 再来初始化，可能造成等待时间过长，
    // 因此需要我们对加载的字体进行删减优化
    const loader = new THREE.FontLoader();
    const font = loader.parse(json);
    let step = 0;

    // 创建一个渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染器的清除颜色（即背景色）,尺寸,清晰度
    // renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // 将渲染器的输出（此处是canvas元素）插入到 body
    document.body.appendChild(renderer.domElement);

    // 创建一个场景
    const scene = new THREE.Scene();
    // 创建一个具有透视效果的摄像机
    // 垂直视角，度数
    const fav = 75;
    // 纵横比
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(fav, aspect, 0.1, 1500);
    camera.position.set(333, 666, 333);
    // camera.lookAt(new THREE.Vector3(0, 333, 0));

    // 坐标轴
    const axis = setAxis();
    // 灯光
    const lg = createLight();
    // 地面
    const plane = createPlane();
    // 雪花
    const snowPoints = createSnow2();
    // 火箭队
    const rockets = createRocket();
    // 火箭队动画
    for (let i = 0, l = rockets.length; i < l; i++) {
        const rocket = rockets[i];
        const { x, y, z } = rocket.toPosition;
        TweenLite.to(rocket.position, 2.5, {
            x,
            y,
            z,
            delay: 0,
            defaultEase: Power2.easeInOut,
            onComplete: () => {
                scene.remove(rocket);
                // 注意，TweenLite设置动画之后，就会立即执行，
                // 所以，我们放入场景的时候在给其设置动画。
                // 祝福语，这里我们按照索引动态创建
                // 性能会慢一点（可能），不过考虑动画的原因（预生成粒子散开动画消失）
                var wish = createWish2(font, i);
                scene.add(wish);
            }
        });
        scene.add(rocket);
    }
    // 烟花
    // var firework = createFirework();
    scene.add(axis);
    scene.add(lg);
    scene.add(plane);
    scene.add(snowPoints);
    // scene.add(firework);
    // 雪花动画
    function renderSnow() {
        // 动画补偿
        for (let i = 0, l = snowPoints.children.length; i < l; i++) {
            const sprite = snowPoints.children[i];
            let delayCount = sprite.delayCount;
            const delayMoveTime = sprite.delayMoveTime;
            const position = sprite.position;
            // 自转圈圈
            // sprite.material.rotation += 0.01 * (i / l);
            if (delayCount < delayMoveTime) {
                delayCount++;
                sprite.delayCount = delayCount;
                continue;
            }
            if (position.y > 0) {
                sprite.position.y -= 1.5;
                sprite.position.x -= Math.sin((step / 360) * 2 * Math.PI) * 1;
            } else {
                sprite.position.y = Math.random() * height + 500;
            }
            // 放大效果
            const scale = Math.sin(step) * 0.35 + 15;
            sprite.scale.set(scale, scale, 1.0);
        }
    }
    // 动画
    function animate() {
        step += 1;
        // controls.update();
        requestAnimationFrame(animate);
        // 雪花
        renderSnow();
        // 渲染，即摄像机拍下此刻的场景
        renderer.clear();
        renderer.render(scene, camera);
    }
    animate();

    // 拖拽交互
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.maxPolarAngle = (90 * Math.PI) / 180;
    controls.minPolarAngle = (45 * Math.PI) / 180;
};
