import { SpriteMap } from 'src/app/contracts/spriteMap';
import { AnimationShape } from '../animation-shape';

/**
 * @todo: spriteMap must be given as constructor argument.
 */
export class AnimatedCharacter extends AnimationShape {
  private static spriteMap: SpriteMap = {
    frameWidth: 50,
    frameHeight: 61,
    rows: 2,
    columns: 5,
    frameRate: 1000,
  };
  readonly defaultPath = '../../assets/images/';

  constructor(sprite: string) {
    super(sprite, AnimatedCharacter.spriteMap);
  }
}
