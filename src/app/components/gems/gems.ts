import {
  AfterContentInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA, ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Card} from 'primeng/card';
import {toSignal} from '@angular/core/rxjs-interop';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {UserEngine} from '../../services/user.engine';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {GemsEngine} from '../../services/gems.engine';
import {SwiperOptions} from 'swiper/types';
import Swiper from 'swiper';
import {Autoplay} from 'swiper/modules';

Swiper.use([Autoplay])

@Component({
  selector: 'app-gems',
  imports: [
    Card,
    DatePipe,
    Button,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gems.html',
  styleUrl: './gems.scss'
})
export class Gems implements AfterContentInit {
  protected gemsEngine = inject(GemsEngine);
  protected readonly userEngine = inject(UserEngine);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  items = toSignal(this.bibleReadingEngine.getGems(), {initialValue: []});
  $users = toSignal(this.userEngine.getUsers(), {initialValue: []});
  @ViewChild('swiper', {static: true}) swiperContainer!: ElementRef<any>;

  swiper: SwiperOptions = {
    slidesPerView: 1.2,
    direction: "horizontal",
    loop: true,
    autoplay: {
      delay: 7000,
      disableOnInteraction: true,
    }
  };

  ngAfterContentInit() {
    const swiperEL = this.swiperContainer.nativeElement;
    Object.assign(swiperEL, this.swiper);
    swiperEL.initialize();
  }

  getBook(item: any) {
    return this.bibleReadingEngine.$bibleBooks()
      .find((b) => b.id === item.book);
  }

  async getUser(item: any) {
    return this.$users().find((u) => u.uid === item.userId);
  }
}
