import { Shape } from '../shape';

export class Character extends Shape {
  readonly defaultPath = '../../assets/images/';

  constructor(sprite: string) {
    super(sprite);
  }
}
