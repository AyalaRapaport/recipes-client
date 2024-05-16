import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface DifficultyInput {
  index: number;
  difficulty: number;
}

@Directive({
  selector: '[appDifficulty]',
  standalone: true
})

export class DifficultyDirective implements OnInit {
  @Input('appDifficulty')
  input!: DifficultyInput;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const { index, difficulty } = this.input;
    if (index < difficulty) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }
}