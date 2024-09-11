
// import ForceGraph3D from '3d-force-graph';
// import * as THREE from 'three';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// class FamilyTree3D {
//   constructor() {
//     this.graph = ForceGraph3D()
//       ({ rendererConfig: { antialias: true, alpha: true } });
//     this.familyData = [
//       { id: '1', name: '祖父', generation: 0, spouse: '2', children: ['3', '4'] },
//       { id: '2', name: '祖母', generation: 0, spouse: '1', children: ['3', '4'] },
//       { id: '3', name: '父', generation: 1, parents: ['1', '2'], spouse: '4', children: ['5', '6', '7'] },
//       { id: '4', name: '母', generation: 1, parents: ['1', '2'], spouse: '3', children: ['5', '6', '7'] },
//       { id: '5', name: '子A', generation: 2, parents: ['3', '4'], children: ['8', '9'] },
//       { id: '6', name: '子B', generation: 2, parents: ['3', '4'], children: ['10'] },
//       { id: '7', name: '子C', generation: 2, parents: ['3', '4'], children: ['11', '12'] },
//       { id: '8', name: '孫A1', generation: 3, parents: ['5'] },
//       { id: '9', name: '孫A2', generation: 3, parents: ['5'] },
//       { id: '10', name: '孫B1', generation: 3, parents: ['6'] },
//       { id: '11', name: '孫C1', generation: 3, parents: ['7'] },
//       { id: '12', name: '孫C2', generation: 3, parents: ['7'] },
//     ];
//     this.links = [];
//     this.labelRenderer = new CSS2DRenderer();
//     this.init();
//   }

//   init() {
//     // グラフデータの準備
//     this.prepareGraphData();

//     // グラフの設定
//     this.graph
//       .nodeAutoColorBy('generation')
//       .nodeLabel('name')
//       .nodeVal('val')
//       .nodeThreeObject(node => this.createNodeObject(node))
//       .linkWidth(1)
//       .linkColor(() => 'rgba(255,255,255,0.2)')
//       .onNodeClick(node => this.showNodeInfo(node))
//       .backgroundColor('#101020')  // バックグラウンドカラーを設定
//       .graphData(this.graphData);

//     // レンダラーの設定
//     this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
//     this.labelRenderer.domElement.style.position = 'absolute';
//     this.labelRenderer.domElement.style.top = '0px';
//     this.labelRenderer.domElement.style.pointerEvents = 'none';
//     document.body.appendChild(this.labelRenderer.domElement);

//     // ウィンドウリサイズ対応
//     window.addEventListener('resize', () => this.onWindowResize());

//     // グラフの描画
//     const domElement = document.getElementById('graph-3d');
//     if (domElement) {
//       this.graph(domElement);
//     } else {
//       console.error("Element with id 'graph-3d' not found");
//     }

//     // 強制的にフレームを更新
//     this.graph.tickFrame();
//   }

//   prepareGraphData() {
//     this.familyData.forEach(member => {
//       if (member.spouse) {
//         this.links.push({ source: member.id, target: member.spouse, type: 'spouse' });
//       }
//       if (member.children) {
//         member.children.forEach(childId => {
//           this.links.push({ source: member.id, target: childId, type: 'parent' });
//         });
//       }
//     });

//     this.graphData = {
//       nodes: this.familyData,
//       links: this.links
//     };
//   }

//   createNodeObject(node) {
//     const group = new THREE.Group();

//     // ノードの3Dオブジェクト
//     const geometry = new THREE.BoxGeometry(1.5, 0.5, 0.2);
//     const material = new THREE.MeshPhongMaterial({ color: node.color });
//     const mesh = new THREE.Mesh(geometry, material);
//     group.add(mesh);

//     // ラベルの作成
//     const labelDiv = document.createElement('div');
//     labelDiv.textContent = node.name;
//     labelDiv.style.color = 'white';
//     labelDiv.style.fontSize = '12px';
//     const label = new CSS2DObject(labelDiv);
//     label.position.set(0, 0.4, 0);
//     group.add(label);

//     return group;
//   }

//   showNodeInfo(node) {
//     console.log(node); // ここで情報パネルを表示する代わりに、コンソールに出力
//   }

//   onWindowResize() {
//     this.graph.width(window.innerWidth);
//     this.graph.height(window.innerHeight);
//     this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
//   }
// }

// // DOMContentLoadedイベントを使用して初期化
// document.addEventListener('DOMContentLoaded', () => {
//   const familyTree = new FamilyTree3D();
// });