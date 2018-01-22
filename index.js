/*
 * @Author: uncoder 
 * @Date: 2018-01-17 15:38:47 
 * @Last Modified by: uncoder
 * @Last Modified time: 2018-01-22 21:00:36
 */
// 获取浏览器窗口的宽高，后续会用
var width = window.innerWidth;
var height = window.innerHeight;
// 初始化 stats
function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
}
// 坐标轴
function setAxis() {
    // 坐标轴
    var axisHelper = new THREE.AxesHelper(600);
    return axisHelper;
}
// 地面
function createPlane() {
    var x = 0, y = 0;

    var heartShape = new THREE.Shape();

    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    var geometry = new THREE.ShapeBufferGeometry(heartShape);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff2200
    });
    var plane = new THREE.Mesh(geometry, material);
    // 以自身中心为旋转轴，绕 x 轴顺时针旋转 45 度
    plane.rotation.x = -0.5 * Math.PI;
    plane.rotation.z = -0.75 * Math.PI;
    plane.scale.set(15, 16, 15);
    plane.position.set(-50, 0, 210);
    return plane;
}
// 雪花
function createSnow() {
    var snow = [];
    var materials = [];
    // 几何形状
    var geometry = new THREE.Geometry();
    for (i = 0; i < 1000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;
        geometry.vertices.push(vertex);
    }
    // 参数
    var parameters = [6.5, 5.5, 4.5, 3.5, 2.5];
    // 雪花
    var textureLoader = new THREE.TextureLoader();
    var sprite = textureLoader.load("textures/snow-1.png");
    for (i = 0; i < parameters.length; i++) {
        var size = parameters[i] * 5;
        materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, depthTest: false, transparent: true });
        var particles = new THREE.Points(geometry, materials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;
        console.log("particles", particles)
        snow.push(particles)
    }
    return snow;
}
// 雪花2
function createSnow2() {
    var group = new THREE.Group();
    // 参数
    var parameters = [];
    var textureLoader = new THREE.TextureLoader();
    var mapA = textureLoader.load("textures/snow-1.png");
    var mapB = textureLoader.load("textures/snow-2.png");
    parameters.push()
    for (i = 0; i < 1000; i++) {
        // 材质
        var spriteMaterial = new THREE.SpriteMaterial({ map: Math.floor(Math.random() * 10) > 5 ? mapA : mapB, color: 0xffffff });
        // 雪花
        var sprite = new THREE.Sprite(spriteMaterial);
        var x = Math.random() * 2000 - 1000;
        var y = Math.random() * 2000 - 1000;
        var z = Math.random() * 2000 - 1000;
        // 初始位置坐标
        sprite.position.set(x, y, z);
        // 存储延迟移动时间
        sprite.delayMoveTime = Math.round(Math.random() * height);
        // 存储计算值，方便动画时候计算
        sprite.delayCount = 0;
        // 存储原始坐标
        sprite.originPosition = { x: x, y: y, z: z };
        // 精灵大小
        // sprite.scale.set(50, 50, 5);
        group.add(sprite);
    }
    return group;
}
// 祝福语
function wish(font, x, y, z, delay) {
    var group = new THREE.Group();
    var textGeo = new THREE.TextGeometry('小傻师哥', {
        font: font,
        size: 45,
        height: 6
    });
    var vl = textGeo.vertices.length;
    for (var i = 0; i < vl; i++) {
        if (i % 3 == 0) {
            //为每个点附上材质
            var material = new THREE.SpriteMaterial({
                color: 0xFF0000
            });
            var particle = new THREE.Sprite(material);
            particle.position.x = 80;
            particle.position.y = 80;
            particle.position.z = z;
            particle.scale.set(2, 2);
            //为每个点加动画
            var timerandom = 1 * Math.random();
            TweenLite.to(
                particle.position,
                timerandom,
                {
                    x: textGeo.vertices[i].x,
                    y: textGeo.vertices[i].y,
                    z: textGeo.vertices[i].z,
                    delay: delay
                }
            );
            group.add(particle);
        }
    }
    return group;
}
function createWish(font) {
    var group = new THREE.Group();
    var textGeo = new THREE.TextGeometry('小傻师哥', {
        font: font,
        size: 45,
        height: 10
    });
    var materials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ];
    var textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.position.set(0, 600, 0);
    textMesh1.rotation.y = 0.1 * Math.PI;
    textMesh1.position.x = -250;
    group.add(textMesh1);
    return group;
}
function createWish2(font) {
    var group = new THREE.Group();
    var one = wish(font, -width/2, 600, 0, 1);
    one.position.set(-width/2, 600, 0);
    group.add(one);
    return group;
}
// 灯光
function createLight() {
    var group = new THREE.Group();
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, 0, 1).normalize();
    group.add(dirLight);

    var pointLight = new THREE.PointLight(0xff0000, 1.5);
    pointLight.position.set(999, 999, 999);
    group.add(pointLight);
    return group;
}
// 小火箭
function rocket(x, y, z) {
    var group = new THREE.Group();
    // 火箭帽🚀
    var geometry = new THREE.ConeGeometry(7, 5, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var head = new THREE.Mesh(geometry, material);
    head.position.set(x, 10 + y, z);
    group.add(head);
    // 火箭体
    var geometry = new THREE.CylinderGeometry(5, 1, 8, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var body = new THREE.Mesh(geometry, material);
    body.position.set(x, 4 + y, z);
    group.add(body);
    // 火箭尾巴
    return group;
}
function createRocket() {
    var group = new THREE.Group();
    var one = rocket(0, 0, 0);
    one.originPosition = {
        x: 0, y: 0, z: 0
    }
    group.add(one);
    return group;
}
// 烟花
function firework(x, y, z, delay) {
    var group = new THREE.Group();
    var geometry = new THREE.SphereGeometry(35, 32, 32);
    var vl = geometry.vertices.length;
    for (var i = 0; i < vl; i++) {
        if (i % 8 == 0) {
            //为每个点附上材质
            var material = new THREE.SpriteMaterial({
                color: 0xFF0000
            });
            var particle = new THREE.Sprite(material);
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
            var size = Math.random() * 5 + 1;
            particle.scale.set(size, size);
            var timerandom = 1 * Math.random();
            //为每个点加动画
            TweenLite.to(
                particle.position,
                timerandom,
                {
                    x: geometry.vertices[i].x + (0.5 - Math.random()) * 88 + x,
                    y: geometry.vertices[i].y + y,
                    z: geometry.vertices[i].z + (0.5 - Math.random()) * 88 + z,
                    delay: delay
                }
            );
            group.add(particle);
        }
    }
    return group;
}
function createFirework() {
    var group = new THREE.Group();
    var one = firework(200, 555, 0, 1);
    group.add(one);
    return group;
}
window.onload = function () {
    // 初始化 stats
    var stats = initStats();
    // 字体需要异步加载后使用，因此我这里就先加载了字体。
    // 再来初始化，可能造成等待时间过长，
    // 因此需要我们对加载的字体进行删减优化
    var loader = new THREE.FontLoader();
    loader.load('fonts/font.json', function (font) {
        var controls, camera, scene, renderer, snowPoints, firework, rocket;
        var step = 0;

        init(font);
        animate();
        // 初始化
        function init(font) {
            // 创建一个渲染器
            renderer = new THREE.WebGLRenderer();
            // 设置渲染器的清除颜色（即背景色）,尺寸,清晰度
            // renderer.setClearColor(0xffffff);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            // 将渲染器的输出（此处是canvas元素）插入到 body
            document.body.appendChild(renderer.domElement);

            // 创建一个场景
            scene = new THREE.Scene();

            // 创建一个具有透视效果的摄像机
            // 垂直视角，度数
            var fav = 75;
            // 纵横比
            var aspect = width / height;
            camera = new THREE.PerspectiveCamera(fav, aspect, 0.1, 2500);
            camera.position.set(333, 200, 666);
            camera.lookAt(new THREE.Vector3(0, 200, 0));

            // 坐标轴
            var axis = setAxis();
            scene.add(axis);
            // 灯光
            var lg = createLight();
            scene.add(lg);
            // 地面
            var plane = createPlane();
            scene.add(plane);
            // 雪花
            snowPoints = createSnow2();
            scene.add(snowPoints);
            // 祝福语
            var wish = createWish2(font);
            scene.add(wish);
            // 小火煎
            rocket = createRocket();
            scene.add(rocket);
            // 小火煎动画
            renderRocket();
            // 烟花
            // firework = createFirework();
            // scene.add(firework);
            // 拖拽交互
            // controls = new THREE.OrbitControls(camera, renderer.domElement);
            // controls.target.set(0, 0, 0);
            // controls.autoRotate = true;
            // controls.autoRotateSpeed = 0.5;
            // controls.maxPolarAngle = 90 * Math.PI / 180;
            // controls.minPolarAngle = 45 * Math.PI / 180;
        }
        // 动画
        function animate() {
            step += 1;
            stats.update();
            // controls.update();
            requestAnimationFrame(animate);
            // 雪花
            renderSnow();
            // 渲染，即摄像机拍下此刻的场景
            renderer.clear();
            renderer.render(scene, camera);
        }
        // 雪花动画
        function renderSnow() {
            var time = Date.now() * 0.00005;
            // 动画补偿
            for (var i = 0, l = snowPoints.children.length; i < l; i++) {
                var sprite = snowPoints.children[i];
                var delayCount = sprite.delayCount;
                var delayMoveTime = sprite.delayMoveTime;
                var position = sprite.position;
                var material = sprite.material;
                // 自转圈圈
                material.rotation += 0.01 * (i / l);
                if (delayCount < delayMoveTime) {
                    delayCount++;
                    sprite.delayCount = delayCount;
                    continue;
                }
                if (position.y > 0) {
                    sprite.position.y -= 1.5;
                    sprite.position.x -= Math.sin(step / 360 * 2 * Math.PI) * 1;
                } else {
                    sprite.position.y = Math.random() * height + 500;
                }
                var scale = Math.sin(step) * 0.35 + 15;
                sprite.scale.set(scale, scale, 1.0);
            }
        }
        // 火箭上升动画
        function renderRocket() {
            for (var i = 0, l = rocket.children.length; i < l; i++) {
                var rocekt = rocket.children[i];
                TweenLite.to(rocekt.position, 3.5, {
                    y: 666,
                    delay: 1,
                    defaultEase: Power2.easeInOut
                })
            }
        }
    })
}