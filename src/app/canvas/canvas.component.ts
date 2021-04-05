import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterMovement } from '../classes/character-movement';
import { InputHandler } from '../classes/input-handler';
import { Physics } from '../classes/physics';
import { Renderer } from '../classes/renderer';
import { AnimatedCharacter } from '../classes/shapes/animated-character';
import { CanvasRef } from '../contracts/convenience-types';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvass', { static: false })
  readonly canvas: CanvasRef;

  ngAfterViewInit(): void {
    const input = new InputHandler(10);
    const characterMovement = new CharacterMovement(input.key$);
    const renderer = new Renderer(this.canvas, 50);
    const animatedChar = new AnimatedCharacter('sprite-map');

    const physics = new Physics();
    physics.mapWithInertia(characterMovement.movement$);
    // const characterPosition$ = physics.vectorToPosition$(characterMovement.movement$, {x: 0, y: 0});
    // const positionableChar$ = combineLatest([animatedChar.image, characterPosition$]).pipe(map(pair => ({image: pair[0], pos: pair[1]})));

    // renderer.drawImage(positionableChar$);
  }
}
