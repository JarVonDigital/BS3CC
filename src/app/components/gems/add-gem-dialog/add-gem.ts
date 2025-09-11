import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  Output,
  output,
  signal,
  Signal
} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputGroup} from "primeng/inputgroup";
import {InputNumber} from "primeng/inputnumber";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {Textarea} from "primeng/textarea";
import {BibleReadingEngine, BibleReadingRef} from '../../../services/bible-reading.engine';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-gem',
    imports: [
        Button,
        InputGroup,
        InputNumber,
        ReactiveFormsModule,
        Select,
        Textarea
    ],
  templateUrl: './add-gem.html',
  styleUrl: './add-gem.scss'
})
export class AddGem implements OnInit, OnDestroy {

  gem = input()
  reading = input();

  protected dialog = inject(DynamicDialogRef);
  protected fb = inject(FormBuilder);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);

  protected form = this.fb.group({
    book: this.fb.control(0, {validators: [Validators.required]}),
    chapter: this.fb.control(0, {validators: [Validators.required]}),
    verse: this.fb.control(0, {validators: [Validators.required]}),
    throughVerse: 0,
    comment: this.fb.control("", {validators: [Validators.required]})
  })

  ngOnInit() {
    if(this.gem()) {
      this.form.patchValue({
        ...this.gem() as any
      })
    }
  }

  ngOnDestroy() {
    this.form.reset();
  }

  clearForm() {
    this.form.reset();
  }

  /**
   * Submits a gem using data from the gem submission form and updates the dialog visibility.
   * The method adds a gem to the BibleReadingEngine and clears the gem submission form after submission.
   *
   * @return {Promise<void>} A promise that resolves when the gem submission process completes.
   */
  async submitGem(): Promise<void> {
    const gem = this.gem() as any
    const reading = this.reading() as BibleReadingRef
    if(gem) {
      await this.bibleReadingEngine.updateGem(gem, this.form.getRawValue() as any)
    }
    if(this.reading()) {
      await this.bibleReadingEngine.addGem(gem.groupId, reading, this.form.getRawValue() as any)
    }

    this.dialog.close()
  }
}
