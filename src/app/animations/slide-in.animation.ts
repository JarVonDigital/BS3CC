import {transition, trigger, query, style, stagger, animate } from '@angular/animations';
export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    query("p-avatar", [
      style({opacity: 0}),
      stagger(300, [
        animate('500 ease-in-out', style({opacity: 1}))
      ])
    ])
  ])
])
