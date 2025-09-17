import {Component, computed, effect, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {GemCard} from './gem-card/gem-card';
import {InputGroup} from 'primeng/inputgroup';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {Fluid} from 'primeng/fluid';
import Fuse from 'fuse.js';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-community-gems',
  imports: [
    GemCard,
    InputGroup,
    InputIcon,
    InputText,
    IconField,
    Fluid,
    FormsModule
  ],
  templateUrl: './community-gems.html',
  styleUrl: './community-gems.scss'
})
export class CommunityGems {
  protected bibleReadingEngine = inject(BibleReadingEngine)
  $gems = toSignal(this.bibleReadingEngine.getGems(), {initialValue: []});
  $search = signal<any[]>([])
  $searchTerm = signal('')
  $searchedGems = computed(() => {
    return this.$search().length > 0 ? this.$search() : this.$gems()
  })

  onSearch = effect(() => {
    const fuse = new Fuse(this.$gems(), {
      keys: ['comment'],
      isCaseSensitive: false
    })
    const search = fuse.search(this.$searchTerm());
    this.$search.set(search.map(r => r.item))
  })
}
