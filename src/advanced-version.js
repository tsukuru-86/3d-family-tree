//応用verのstockファイル

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

// Family data structure
const familyData = [
    { id: '1', name: '祖父', generation: 0, spouse: '2', children: ['3', '4'] },
    { id: '2', name: '祖母', generation: 0, spouse: '1', children: ['3', '4'] },
    { id: '3', name: '父', generation: 1, parents: ['1', '2'], spouse: '4', children: ['5', '6', '7'] },
    { id: '4', name: '母', generation: 1, parents: ['1', '2'], spouse: '3', children: ['5', '6', '7'] },
    { id: '5', name: '子A', generation: 2, parents: ['3', '4'], children: ['8', '9'] },
    { id: '6', name: '子B', generation: 2, parents: ['3', '4'], children: ['10'] },
    { id: '7', name: '子C', generation: 2, parents: ['3', '4'], children: ['11', '12'] },
    { id: '8', name: '孫A1', generation: 3, parents: ['5'] },
    { id: '9', name: '孫A2', generation: 3, parents: ['5'] },
    { id: '10', name: '孫B1', generation: 3, parents: ['6'] },
    { id: '11', name: '孫C1', generation: 3, parents: ['7'] },
    { id: '12', name: '孫C2', generation: 3, parents: ['7'] },
  ];
  
  const generationColors = [0x4e79a7, 0xf28e2c, 0xe15759, 0x76b7b2, 0x59a14f];
  
  class FamilyTree3D {
    constructor() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.orbitControls = null;
      this.dragControls = null;
      this.memberObjects = {};
      this.relationshipLines = {};
      this.selectedMember = null;
  
      this.init();
    }
  
    init() {
      // Scene setup
      this.scene.background = new THREE.Color(0xf0f0f0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
  
      // Camera setup
      this.camera.position.set(0, 5, 15);
  
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(10, 10, 10);
      this.scene.add(directionalLight);
  
      // Controls
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.enableDamping = true;
      this.orbitControls.target.set(0, -3, 0);
  
      // Create family members
      this.createFamilyMembers();
  
      // Create relationship lines
      this.createRelationshipLines();
  
      // Setup drag controls
      const draggableObjects = Object.values(this.memberObjects);
      this.dragControls = new DragControls(draggableObjects, this.camera, this.renderer.domElement);
      this.setupDragControls();
  
      // Event listeners
      window.addEventListener('resize', () => this.onWindowResize(), false);
      this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event), false);
  
      // Start animation loop
      this.animate();
    }
  
    createFamilyMembers() {
      familyData.forEach((member) => {
        const group = new THREE.Group();
        
        const geometry = new THREE.BoxGeometry(1.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: generationColors[member.generation % generationColors.length] });
        const cube = new THREE.Mesh(geometry, material);
        group.add(cube);
  
        // Add name label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        if (context) {
          context.font = 'Bold 32px Arial';
          context.fillStyle = 'white';
          context.textAlign = 'center';
          context.fillText(member.name, 128, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.position.set(0, -0.4, 0.3);
        label.scale.set(0.75, 0.375, 1);
        group.add(label);
  
        // Position calculation with 90-degree rotation for each generation
        const distance = 2;
        let x, y, z;
        switch (member.generation % 4) {
          case 0: // Original orientation
            x = (familyData.filter(m => m.generation === member.generation).indexOf(member) - 1) * distance;
            y = -member.generation * distance;
            z = 0;
            break;
          case 1: // 90 degrees around Y-axis
            z = (familyData.filter(m => m.generation === member.generation).indexOf(member) - 1) * distance;
            y = -member.generation * distance;
            x = distance;
            break;
          case 2: // 180 degrees around Y-axis
            x = -(familyData.filter(m => m.generation === member.generation).indexOf(member) - 1) * distance;
            y = -member.generation * distance;
            z = 0;
            break;
          case 3: // 270 degrees around Y-axis
            z = -(familyData.filter(m => m.generation === member.generation).indexOf(member) - 1) * distance;
            y = -member.generation * distance;
            x = -distance;
            break;
        }
        
        group.position.set(x, y, z);
        group.userData = { memberId: member.id };
        this.scene.add(group);
        this.memberObjects[member.id] = group;
      });
    }
  
    createRelationshipLines() {
      familyData.forEach((member) => {
        if (member.parents) {
          member.parents.forEach(parentId => {
            const lineId = `${parentId}-${member.id}`;
            const child = this.memberObjects[member.id].position;
            const parent = this.memberObjects[parentId].position;
            
            const points = [
              new THREE.Vector3(parent.x, parent.y, parent.z),
              new THREE.Vector3(parent.x, child.y, parent.z),
              new THREE.Vector3(child.x, child.y, child.z)
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x999999 }));
            this.scene.add(line);
            this.relationshipLines[lineId] = line;
          });
        }
        
        if (member.spouse) {
          const lineId = `${member.id}-${member.spouse}`;
          const person1 = this.memberObjects[member.id].position;
          const person2 = this.memberObjects[member.spouse].position;
          const geometry = new THREE.BufferGeometry().setFromPoints([person1, person2]);
          const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff00ff }));
          this.scene.add(line);
          this.relationshipLines[lineId] = line;
        }
      });
    }
  
    updateRelationshipLines() {
      familyData.forEach((member) => {
        if (member.parents) {
          member.parents.forEach(parentId => {
            const lineId = `${parentId}-${member.id}`;
            const line = this.relationshipLines[lineId];
            const child = this.memberObjects[member.id].position;
            const parent = this.memberObjects[parentId].position;
            
            const points = [
              new THREE.Vector3(parent.x, parent.y, parent.z),
              new THREE.Vector3(parent.x, child.y, parent.z),
              new THREE.Vector3(child.x, child.y, child.z)
            ];
            
            line.geometry.setFromPoints(points);
            line.geometry.attributes.position.needsUpdate = true;
          });
        }
        
        if (member.spouse) {
          const lineId = `${member.id}-${member.spouse}`;
          const line = this.relationshipLines[lineId];
          const person1 = this.memberObjects[member.id].position;
          const person2 = this.memberObjects[member.spouse].position;
          line.geometry.setFromPoints([person1, person2]);
          line.geometry.attributes.position.needsUpdate = true;
        }
      });
    }
  
    setupDragControls() {
      this.dragControls.addEventListener('dragstart', () => {
        this.orbitControls.enabled = false;
      });
  
      this.dragControls.addEventListener('drag', () => {
        this.updateRelationshipLines();
      });
  
      this.dragControls.addEventListener('dragend', () => {
        this.orbitControls.enabled = true;
        this.updateRelationshipLines();
      });
    }
  
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    onMouseClick(event) {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children, true);
  
      if (intersects.length > 0) {
        let selectedObject = intersects[0].object;
        while (selectedObject && !selectedObject.userData?.memberId) {
          selectedObject = selectedObject.parent;
        }
        if (selectedObject && selectedObject.userData?.memberId) {
          const member = familyData.find(m => m.id === selectedObject.userData.memberId);
          if (member) {
            this.selectedMember = member;
            this.updateInfoPanel();
          }
        }
      }
    }
  
    updateInfoPanel() {
      const infoPanel = document.getElementById('info-panel');
      if (this.selectedMember) {
        infoPanel.innerHTML = `
          <h3>${this.selectedMember.name}</h3>
          <p>世代: ${this.selectedMember.generation + 1}</p>
          ${this.selectedMember.parents ? `<p>親: ${this.selectedMember.parents.map(id => familyData.find(m => m.id === id)?.name).join(', ')}</p>` : ''}
          ${this.selectedMember.spouse ? `<p>配偶者: ${familyData.find(m => m.id === this.selectedMember.spouse)?.name}</p>` : ''}
          ${this.selectedMember.children ? `<p>子: ${this.selectedMember.children.map(id => familyData.find(m => m.id === id)?.name).join(', ')}</p>` : ''}
        `;
        infoPanel.style.display = 'block';
      } else {
        infoPanel.style.display = 'none';
      }
    }
  
    animate() {
      requestAnimationFrame(() => this.animate());
      this.orbitControls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  // Initialize the 3D family tree
  const familyTree = new FamilyTree3D();
  
  // Add info panel to the DOM
  const infoPanel = document.createElement('div');
  infoPanel.id = 'info-panel';
  infoPanel.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    display: none;
  `;
  document.body.appendChild(infoPanel);