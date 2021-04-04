import { Observable } from 'rxjs';
import { ImageRef } from '../contracts/convenience-types';
import { Drawable } from '../contracts/drawable';
import { Image } from '../contracts/image';

export abstract class Shape implements Drawable {
  private static counter = 1;
  readonly id: number;
  private internalSprite: string;
  abstract readonly defaultPath: string;

  constructor(sprite: string, format = 'png') {
    this.id = Shape.counter++;
    this.internalSprite = `${sprite}.${format}`;
  }

  get sprite(): string {
    return `${this.defaultPath}/${this.internalSprite}`;
  }

  get image(): Observable<Image> {
    return new Observable<{ image: ImageRef }>((subscriber) => {
      const img = new Image();
      img.addEventListener('load', () => {
        subscriber.next({ image: img });
        subscriber.complete();
      });
      img.src = this.sprite;
    });
  }
}
