import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {GemCard} from './gem-card/gem-card';
import {InputGroup} from 'primeng/inputgroup';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {Fluid} from 'primeng/fluid';

@Component({
  selector: 'app-community-gems',
  imports: [
    GemCard,
    InputGroup,
    InputIcon,
    InputText,
    IconField,
    Fluid
  ],
  templateUrl: './community-gems.html',
  styleUrl: './community-gems.scss'
})
export class CommunityGems {
  protected bibleReadingEngine = inject(BibleReadingEngine)
  gems = toSignal(this.bibleReadingEngine.getGems(), {initialValue: []});
}
