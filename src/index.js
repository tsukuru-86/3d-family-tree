import ForceGraph3D from '3d-force-graph';
import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  Vector3,
  MeshPhongMaterial,
  LineCurve3,
  TubeGeometry
} from 'three';

class FamilyTree3D {
  constructor() {
    this.graph = ForceGraph3D();
    this.familyData = [
      { id: '1', name: '祖父', generation: 0, children: ['3'] },
      { id: '2', name: '祖母', generation: 0, children: ['3'] },
      { id: '3', name: '父', generation: 1, children: ['5', '6'], parents: ['1', '2'] },
      { id: '4', name: '母', generation: 1, children: ['5', '6'] },
      { id: '5', name: '子A', generation: 2, parents: ['3', '4'] },
      { id: '6', name: '子B', generation: 2, parents: ['3', '4'] },
    ];
    this.links = this.generateLinks();
    this.init();
  }

  generateLinks() {
    const links = [];
    this.familyData.forEach(person => {
      if (person.children) {
        person.children.forEach(childId => {
          links.push({ source: person.id, target: childId });
        });
      }
    });
    return links;
  }

  init() {
    const domElement = document.getElementById('graph-3d');
    if (!domElement) {
      console.error("Element with id 'graph-3d' not found");
      return;
    }

    const GENERATION_GAP = 50;

    this.graph(domElement)
      .graphData({
        nodes: this.familyData,
        links: this.links
      })
      .nodeLabel('name')
      .nodeAutoColorBy('generation')
      .nodeThreeObject(node => this.createNodeObject(node))
      .linkThreeObject(link => this.createLinkObject(link))
      .linkPositionUpdate((sprite, { start, end }) => {
        const middlePos = new Vector3().addVectors(start, end).multiplyScalar(0.5);
        sprite.position.copy(middlePos);
      })
      .backgroundColor('#101020')
      .d3Force('charge', null)  // 電荷力を無効化
      .d3Force('link')          // リンク力を有効化
        .distance(() => GENERATION_GAP)
      .d3Force('center', null)  // 中心力を無効化
      .d3Force('collide')
        .radius(10)             // ノード間の最小距離

    // カスタムフォース
    this.graph.d3Force('customZ', nodes => {
      nodes.forEach(node => {
        node.fz = -(node.generation * GENERATION_GAP);
      });
    });

    // ドラッグ終了時にノードの位置を固定
    this.graph.onNodeDragEnd(node => {
      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    });
  }

  createNodeObject(node) {
    const geometry = new SphereGeometry(5);  // ノードのサイズを大きく
    const material = new MeshBasicMaterial({ color: new Color(node.color) });
    return new Mesh(geometry, material);
  }

  createLinkObject(link) {
    const start = new Vector3(link.source.x, link.source.y, link.source.z);
    const end = new Vector3(link.target.x, link.target.y, link.target.z);
    const curve = new LineCurve3(start, end);
    const geometry = new TubeGeometry(curve, 20, 0.5, 8, false);

    const material = new MeshPhongMaterial({
      color: 0x4477AA,
      shininess: 100,
      specular: 0x111111
    });

    return new Mesh(geometry, material);
  }
}

window.onload = () => {
  new FamilyTree3D();
};