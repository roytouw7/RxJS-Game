import { Observable } from 'rxjs';
import { ImageRef } from './convenience-types';
import { Image } from './image';

export interface Drawable {
  image: Observable<ImageRef | Image>;
}
