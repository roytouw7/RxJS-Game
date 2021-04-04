import { ImageRef } from './convenience-types';

export interface SingleImage {
  image: ImageRef;
}

export interface SpriteMapImage {
  image: ImageRef;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

export type Image = SingleImage | SpriteMapImage;

export const instanceOfSpriteMapImage = (object: any): object is SpriteMapImage => {
  let valid = true;
  ['image', 'sx', 'sy', 'sWidth', 'sHeight'].forEach(property => {
    if (object[property] === undefined) {
      valid = false;
    }
  });
  return valid;
};

export const instanceOfSingleImage = (object: any): object is SingleImage => {
  return true;
};
