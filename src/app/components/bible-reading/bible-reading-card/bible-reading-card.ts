import {
  AfterContentInit,
  Component,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import {Card} from 'primeng/card';
import {BibleReadingSchedule} from '../../../data/br.schedule.data';
import {ProgressBar} from 'primeng/progressbar';
import {BibleReadingEngine, BibleReadingProgressObject, BibleReadingRef} from '../../../services/bible-reading.engine';
import {AsyncPipe, DatePipe, JsonPipe} from '@angular/common';
import {AvatarGroup} from 'primeng/avatargroup';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../../services/user.engine';
import {ButtonGroup} from 'primeng/buttongroup';
import {Button} from 'primeng/button';
import {Fluid} from 'primeng/fluid';
import {from} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {Dialog} from 'primeng/dialog';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {InputGroup} from 'primeng/inputgroup';
import {Textarea} from 'primeng/textarea';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutoFocus} from 'primeng/autofocus';

@Component({
  selector: 'app-bible-reading-card',
  imports: [
    Card,
    ProgressBar,
    DatePipe,
    AvatarGroup,
    Avatar,
    JsonPipe,
    ButtonGroup,
    Button,
    Button,
    Dialog,
    Select,
    InputNumber,
    InputGroup,
    Textarea,
    ReactiveFormsModule,
    AutoFocus
  ],
  templateUrl: './bible-reading-card.html',
  styleUrl: './bible-reading-card.scss'
})
export class BibleReadingCard implements AfterContentInit {

  $header: InputSignal<any> = input();
  $reading: InputSignal<BibleReadingRef> = input.required();
  $getDialogVisible = signal(false);

  protected readonly userEngine = inject(UserEngine)
  protected fb = inject(FormBuilder);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  protected readonly BibleReadingSchedule = BibleReadingSchedule;
  protected readonly Math = Math;

  $progress: WritableSignal<BibleReadingProgressObject | null | undefined> = signal(null);

  gemSubmissionForm = this.fb.group({
    book: this.fb.control(0, {validators: [Validators.required]}),
    chapter: this.fb.control(0, {validators: [Validators.required]}),
    verse: this.fb.control(0, {validators: [Validators.required]}),
    throughVerse: 0,
    comment: this.fb.control("", {validators: [Validators.required]})
  })

  ngAfterContentInit() {
    this.bibleReadingEngine.getProgress(this.$reading().scheduleId, 0, this.$reading().day)
      .subscribe(p => {
        this.$progress.set(p);
      })
  }

  clearForm() {
    this.gemSubmissionForm.reset();
  }

  /**
   * Submits a gem using data from the gem submission form and updates the dialog visibility.
   * The method adds a gem to the BibleReadingEngine and clears the gem submission form after submission.
   *
   * @return {Promise<void>} A promise that resolves when the gem submission process completes.
   */
  async submitGem(): Promise<void> {
    await this.bibleReadingEngine.addGem(0, this.gemSubmissionForm.getRawValue() as any)
    this.$getDialogVisible.set(false);
    this.clearForm();
  }
}
