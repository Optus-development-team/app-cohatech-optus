import * as THREE from 'three';

export interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

export class CommonClass {
  width = 0;
  height = 0;
  aspect = 1;
  pixelRatio = 1;
  isMobile = false;
  breakpoint = 768;
  fboWidth: number | null = null;
  fboHeight: number | null = null;
  time = 0;
  delta = 0;
  container: HTMLElement | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  clock: THREE.Clock | null = null;

  init(container: HTMLElement) {
    this.container = container;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.autoClear = false;
    this.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
    const el = this.renderer.domElement;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.display = 'block';
    this.clock = new THREE.Clock();
    this.clock.start();
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.aspect = this.width / this.height;
    if (this.renderer) this.renderer.setSize(this.width, this.height, false);
  }

  update() {
    if (!this.clock) return;
    this.delta = this.clock.getDelta();
    this.time += this.delta;
  }
}

export class MouseClass {
  mouseMoved = false;
  coords = new THREE.Vector2();
  coords_old = new THREE.Vector2();
  diff = new THREE.Vector2();
  timer: number | null = null;
  container: HTMLElement | null = null;
  docTarget: Document | null = null;
  listenerTarget: Window | null = null;
  isHoverInside = false;
  hasUserControl = false;
  isAutoActive = false;
  autoIntensity = 2.0;
  takeoverActive = false;
  takeoverStartTime = 0;
  takeoverDuration = 0.25;
  takeoverFrom = new THREE.Vector2();
  takeoverTo = new THREE.Vector2();
  onInteract: (() => void) | null = null;

  private _onMouseMove = this.onDocumentMouseMove.bind(this);
  private _onTouchStart = this.onDocumentTouchStart.bind(this);
  private _onTouchMove = this.onDocumentTouchMove.bind(this);
  private _onTouchEnd = this.onTouchEnd.bind(this);
  private _onDocumentLeave = this.onDocumentLeave.bind(this);

  init(container: HTMLElement) {
    this.container = container;
    this.docTarget = container.ownerDocument || null;
    const defaultView = this.docTarget?.defaultView || (typeof window !== 'undefined' ? window : null);
    if (!defaultView) return;
    this.listenerTarget = defaultView;
    this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
    this.listenerTarget.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.listenerTarget.addEventListener('touchmove', this._onTouchMove, { passive: true });
    this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
    this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave);
  }

  dispose() {
    if (this.listenerTarget) {
      this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
      this.listenerTarget.removeEventListener('touchstart', this._onTouchStart);
      this.listenerTarget.removeEventListener('touchmove', this._onTouchMove);
      this.listenerTarget.removeEventListener('touchend', this._onTouchEnd);
    }
    if (this.docTarget) {
      this.docTarget.removeEventListener('mouseleave', this._onDocumentLeave);
    }
    this.listenerTarget = null;
    this.docTarget = null;
    this.container = null;
  }

  private isPointInside(clientX: number, clientY: number) {
    if (!this.container) return false;
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  private updateHoverState(clientX: number, clientY: number) {
    this.isHoverInside = this.isPointInside(clientX, clientY);
    return this.isHoverInside;
  }

  setCoords(x: number, y: number) {
    if (!this.container) return;
    if (this.timer) window.clearTimeout(this.timer);
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = (x - rect.left) / rect.width;
    const ny = (y - rect.top) / rect.height;
    this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
    this.mouseMoved = true;
    this.timer = window.setTimeout(() => {
      this.mouseMoved = false;
    }, 100);
  }

  setNormalized(nx: number, ny: number) {
    this.coords.set(nx, ny);
    this.mouseMoved = true;
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (!this.updateHoverState(event.clientX, event.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(event.clientX, event.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
  }

  onTouchEnd() {
    this.isHoverInside = false;
  }

  onDocumentLeave() {
    this.isHoverInside = false;
  }

  update() {
    if (this.takeoverActive) {
      const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
      if (t >= 1) {
        this.takeoverActive = false;
        this.coords.copy(this.takeoverTo);
        this.coords_old.copy(this.coords);
        this.diff.set(0, 0);
      } else {
        const k = t * t * (3 - 2 * t);
        this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
      }
    }
    this.diff.subVectors(this.coords, this.coords_old);
    this.coords_old.copy(this.coords);
    if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
    if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
  }
}
