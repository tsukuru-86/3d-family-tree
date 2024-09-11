//簡単verのstockファイル

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

class FamilyTree3D {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.orbitControls = null;
    this.dragControls = null;
    this.familyMembers = [];
    this.lines = [];

    this.init();
  }

  init() {
    // レンダラーの設定
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // カメラの位置設定
    this.camera.position.set(0, 0, 10);

    // 光源の追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    // 家族メンバーの作成
    this.createFamilyMembers();

    // 線の作成
    this.createLines();

    // OrbitControlsの設定
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.25;

    // DragControlsの設定
    this.dragControls = new DragControls(this.familyMembers, this.camera, this.renderer.domElement);
    this.dragControls.addEventListener('dragstart', () => {
      this.orbitControls.enabled = false;
    });
    this.dragControls.addEventListener('dragend', () => {
      this.orbitControls.enabled = true;
      this.updateLines();
    });
    this.dragControls.addEventListener('drag', () => {
      this.updateLines();
    });

    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // アニメーションループの開始
    this.animate();
  }

  createFamilyMembers() {
    const geometry = new THREE.BoxGeometry(1, 0.5, 0.2);
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x4e79a7 }), // 父
      new THREE.MeshPhongMaterial({ color: 0xf28e2c }), // 母
      new THREE.MeshPhongMaterial({ color: 0xe15759 }), // 子1
      new THREE.MeshPhongMaterial({ color: 0x76b7b2 }), // 子2
      new THREE.MeshPhongMaterial({ color: 0x59a14f })  // 子3
    ];

    const positions = [
      new THREE.Vector3(-1, 1, 0),   // 父
      new THREE.Vector3(1, 1, 0),    // 母
      new THREE.Vector3(-2, -1, 0),  // 子1
      new THREE.Vector3(0, -1, 0),   // 子2
      new THREE.Vector3(2, -1, 0)    // 子3
    ];

    for (let i = 0; i < 5; i++) {
      const member = new THREE.Mesh(geometry, materials[i]);
      member.position.copy(positions[i]);
      this.scene.add(member);
      this.familyMembers.push(member);
    }
  }

  createLines() {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // 両親を結ぶ線
    const parentLineGeometry = new THREE.BufferGeometry().setFromPoints([
      this.familyMembers[0].position,
      this.familyMembers[1].position
    ]);
    const parentLine = new THREE.Line(parentLineGeometry, material);
    this.scene.add(parentLine);
    this.lines.push(parentLine);

    // 親と子を結ぶ線
    const centerPoint = new THREE.Vector3().addVectors(
      this.familyMembers[0].position,
      this.familyMembers[1].position
    ).multiplyScalar(0.5);

    for (let i = 2; i < 5; i++) {
      const childLineGeometry = new THREE.BufferGeometry().setFromPoints([
        centerPoint,
        this.familyMembers[i].position
      ]);
      const childLine = new THREE.Line(childLineGeometry, material);
      this.scene.add(childLine);
      this.lines.push(childLine);
    }
  }

  updateLines() {
    // 両親を結ぶ線の更新
    this.lines[0].geometry.setFromPoints([
      this.familyMembers[0].position,
      this.familyMembers[1].position
    ]);

    // 中心点の再計算
    const centerPoint = new THREE.Vector3().addVectors(
      this.familyMembers[0].position,
      this.familyMembers[1].position
    ).multiplyScalar(0.5);

    // 親と子を結ぶ線の更新
    for (let i = 1; i < 4; i++) {
      this.lines[i].geometry.setFromPoints([
        centerPoint,
        this.familyMembers[i + 1].position
      ]);
    }

    // ジオメトリの更新フラグを設定
    this.lines.forEach(line => {
      line.geometry.attributes.position.needsUpdate = true;
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// 家系図の初期化
const familyTree = new FamilyTree3D();