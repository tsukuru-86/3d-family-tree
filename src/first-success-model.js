import ForceGraph3D from '3d-force-graph';
import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Group,
  AmbientLight,
  DirectionalLight
} from 'three';
import SpriteText from 'three-spritetext';

class FamilyTree3D {
  constructor() {
    this.graph = ForceGraph3D();
    this.familyData = [
      // 第0世代
      { id: 'A1', name: '父方祖父', generation: 0, x: -100, y: 400, z: 0, isCouple: false },
      { id: 'A2', name: '父方祖母', generation: 0, x: 100, y: 400, z: 0, isCouple: false },
      { id: 'B1', name: '母方祖父', generation: 0, x: -500, y: 400, z: 0, isCouple: false },
      { id: 'B2', name: '母方祖母', generation: 0, x: -300, y: 400, z: 0, isCouple: false },
      // 第1世代
      { id: 'C1', name: '父の兄', generation: 1, x: 0, y: 200, z: 0, isCouple: false },
      { id: 'C2', name: '父', generation: 1, x: -150, y: 200, z: 0, isCouple: false },
      { id: 'C3', name: '父の妹', generation: 1, x: 200, y: 200, z: 0, isCouple: false },
      { id: 'D1', name: '母の兄', generation: 1, x: -620, y: 200, z: 0, isCouple: false },
      { id: 'D2', name: '母', generation: 1, x: -250, y: 200, z: 0, isCouple: false },
      { id: 'D3', name: '母の妹', generation: 1, x: -520, y: 200, z: 0, isCouple: false },
      { id: 'C1S', name: '父の兄の配偶者', generation: 1, x: 40, y: 200, z: 0, isCouple: false },
      { id: 'C3S', name: '父の妹の配偶者', generation: 1, x: 220, y: 200, z: 0, isCouple: false },
      { id: 'D1S', name: '母の兄の配偶者', generation: 1, x: -580, y: 200, z: 0, isCouple: false },
      { id: 'D3S', name: '母の妹の配偶者', generation: 1, x: -480, y: 200, z: 0, isCouple: false },
      // 第2世代
      { id: 'E1', name: '息子', generation: 2, x: -240, y: 0, z: 0, isCouple: false },
      { id: 'E2', name: '娘1', generation: 2, x:-200, y: 0, z: 0, isCouple: false },
      { id: 'E3', name: '娘2', generation: 2, x:-160, y: 0, z: 0, isCouple: false },
      { id: 'F1', name: '父の兄の子1', generation: 2, x: 0, y: 0, z: 0, isCouple: false },
      { id: 'F2', name: '父の兄の子2', generation: 2, x: 40, y: 0, z: 0, isCouple: false },
      { id: 'G1', name: '父の妹の子1', generation: 2, x: 200, y: 0, z: 0, isCouple: false },
      { id: 'G2', name: '父の妹の子2', generation: 2, x: 250, y: 0, z: 0, isCouple: false },
      { id: 'H1', name: '母の兄の子1', generation: 2, x: -650, y: 0, z: 0, isCouple: false },
      { id: 'H2', name: '母の兄の子2', generation: 2, x: -600, y: 0, z: 0, isCouple: false },
      { id: 'I1', name: '母の妹の子1', generation: 2, x: -480, y: 0, z: 0, isCouple: false },
      { id: 'I2', name: '母の妹の子2', generation: 2, x: -520, y: 0, z: 0, isCouple: false },
      // カップルノード
      { id: 'A1-A2', name: '', generation: 0, x: 0, y: 400, z: 0, isCouple: true },
      { id: 'B1-B2', name: '', generation: 0, x: -400, y: 400, z: 0, isCouple: true },
      { id: 'C1-C1S', name: '', generation: 1, x: 20, y: 200, z: 0, isCouple: true },
      { id: 'C2-D2', name: '', generation: 1, x: -200, y: 200, z: 0, isCouple: true },
      { id: 'C3-C3S', name: '', generation: 1, x: 210, y: 200, z: 0, isCouple: true },
      { id: 'D1-D1S', name: '', generation: 1, x: -600, y: 200, z: 0, isCouple: true },
      { id: 'D3-D3S', name: '', generation: 1, x: -500, y: 200, z: 0, isCouple: true },
    ];
    this.links = [
      // 夫婦と夫婦ノードの接続
      { source: 'A1', target: 'A1-A2' },
      { source: 'A2', target: 'A1-A2' },
      { source: 'B1', target: 'B1-B2' },
      { source: 'B2', target: 'B1-B2' },
      { source: 'C1', target: 'C1-C1S' },
      { source: 'C1S', target: 'C1-C1S' },
      { source: 'C2', target: 'C2-D2' },
      { source: 'D2', target: 'C2-D2' },
      { source: 'C3', target: 'C3-C3S' },
      { source: 'C3S', target: 'C3-C3S' },
      { source: 'D1', target: 'D1-D1S' },
      { source: 'D1S', target: 'D1-D1S' },
      { source: 'D3', target: 'D3-D3S' },
      { source: 'D3S', target: 'D3-D3S' },
      // 夫婦ノードから子供への接続
      { source: 'A1-A2', target: 'C1' },
      { source: 'A1-A2', target: 'C2' },
      { source: 'A1-A2', target: 'C3' },
      { source: 'B1-B2', target: 'D1' },
      { source: 'B1-B2', target: 'D2' },
      { source: 'B1-B2', target: 'D3' },
      { source: 'C1-C1S', target: 'F1' },
      { source: 'C1-C1S', target: 'F2' },
      { source: 'C2-D2', target: 'E1' },
      { source: 'C2-D2', target: 'E2' },
      { source: 'C2-D2', target: 'E3' },
      { source: 'C3-C3S', target: 'G1' },
      { source: 'C3-C3S', target: 'G2' },
      { source: 'D1-D1S', target: 'H1' },
      { source: 'D1-D1S', target: 'H2' },
      { source: 'D3-D3S', target: 'I1' },
      { source: 'D3-D3S', target: 'I2' },
    ];
    this.init();
  }

  init() {
    const domElement = document.getElementById('graph-3d');
    if (!domElement) {
      console.error("Element with id 'graph-3d' not found");
      return;
    }

    this.graph(domElement)
      .graphData({ nodes: this.familyData, links: this.links })
      .nodeLabel('name')
      .nodeColor(node => this.getNodeColor(node))
      .nodeThreeObject(node => this.createNodeObject(node))

      //人物を繋ぐ線の上を走る粒子の調整
      // .linkDirectionalParticles(2)
      // .linkDirectionalParticleWidth(3)

      .linkWidth(1.5)
      .linkColor(() => new Color(0x2E8B57)) // 深い緑色の線
      .backgroundColor('#F0F8FF') // アリスブルーの背景
      .onNodeDragEnd(node => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      })
      .onEngineStop(() => {
        this.graph.zoomToFit(400);
      });

    // 照明の追加
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    this.graph.scene().add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    this.graph.scene().add(directionalLight);

    // ノードの位置を固定
    this.familyData.forEach(node => {
      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    });
  }

  getNodeColor(node) {
    if (node.isCouple) {
      return new Color(0xFFA500); // カップルノードはオレンジ色
    }
    const colors = [
      0x4682B4, // スティールブルー
      0xDB7093, // パレオバイオレットレッド
      0x20B2AA  // ライトシーグリーン
    ];
    return new Color(colors[node.generation % colors.length]);
  }

  createNodeObject(node) {
    const group = new Group();

    const geometry = new SphereGeometry(node.isCouple ? 3 : 8);
    const material = new MeshBasicMaterial({ color: this.getNodeColor(node) });
    const sphere = new Mesh(geometry, material);
    group.add(sphere);

    if (!node.isCouple) {
      const sprite = new SpriteText(node.name);
      sprite.color = '#000000'; // 黒色のテキスト
      sprite.backgroundColor = '#FFFFFF'; // 白色の背景
      sprite.padding = 2;
      sprite.textHeight = 8;
      sprite.position.set(0, 10, 0);
      group.add(sprite);
    }

    return group;
  }
}

window.onload = () => {
  new FamilyTree3D();
};