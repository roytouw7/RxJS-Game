import { CanvasRef, Context } from '../contracts/convenience-types';

export class Canvas {
  private readonly canvas: CanvasRef;
  private readonly internalCtx: Context;
  private readonly width: number;
  private readonly height: number;

  constructor(canvas: CanvasRef) {
    this.canvas = canvas;
    this.internalCtx = this.canvas.nativeElement.getContext('2d') as Context;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  get ctx(): Context{
    return this.internalCtx;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
