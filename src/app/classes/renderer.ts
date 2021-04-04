import { Observable } from 'rxjs';
import { CanvasRef } from '../contracts/convenience-types';
import { instanceOfSpriteMapImage } from '../contracts/image';
import { PositionableImage } from '../contracts/positonable-image';
import { Canvas } from './canvas';

export class Renderer {
  private readonly canvas: Canvas;
  private readonly refreshRate: number;

  constructor(canvas: CanvasRef, refreshRate: number) {
    this.refreshRate = refreshRate;
    this.canvas = new Canvas(canvas);
  }

  drawImage(posImage$: Observable<PositionableImage>): void {
    posImage$.subscribe((posImage) => {
      const { image: img, pos } = posImage;

      if (instanceOfSpriteMapImage(img)) {
        this.canvas.clear();
        this.canvas.ctx.drawImage(img.image, img.sx, img.sy, img.sWidth, img.sHeight, pos.x, pos.y, img.sHeight, img.sHeight);
      }
    });
  }
}
