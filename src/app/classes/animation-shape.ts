import { combineLatest, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageRef } from '../contracts/convenience-types';
import { Drawable } from '../contracts/drawable';
import { Image } from '../contracts/image';
import { SpriteMap } from '../contracts/spriteMap';
import { Shape } from './shape';

export abstract class AnimationShape extends Shape implements Drawable {
  private readonly ticks$: Observable<number>;
  protected readonly spriteMap: SpriteMap;
  protected readonly frames: number;
  private readonly internalImage: Observable<Image>;
  private test = false;

  constructor(sprite: string, spriteMap: SpriteMap, format = 'png') {
    super(sprite, format);
    this.frames = spriteMap.columns * spriteMap.rows;
    this.spriteMap = spriteMap;
    this.ticks$ = interval(this.spriteMap.frameRate).pipe(map((x) => x % this.frames));
    this.internalImage = this.createImage();
  }

  get image(): Observable<Image> {
    return this.internalImage;
  }

  /**
   * the iteration over sub images doesnt work correct
   */
  createImage(): Observable<Image> {
    const img$ = new Observable<ImageRef>((subscriber) => {
      const img = new Image();
      img.addEventListener('load', () => {
        if (!this.test) {
          subscriber.next(img);
          subscriber.complete();
          this.test = true;
        }
      });
      img.src = this.sprite;
    });

    return combineLatest([img$, this.ticks$]).pipe(
      map((pair) => {
        const [img, tick] = pair;
        const column = Math.floor(tick / this.spriteMap.rows);
        const row = tick % this.spriteMap.rows;

        return {
          image: img,
          sx: column * this.spriteMap.frameWidth,
          sy: row * this.spriteMap.frameHeight,
          sWidth: this.spriteMap.frameWidth,
          sHeight: this.spriteMap.frameHeight,
        };
      }),
    );
  }
}
