import {inject, Injectable} from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {FormBuilder, Validators} from '@angular/forms';
import {AddGem} from '../components/community-gems/gems/add-gem-dialog/add-gem';

@Injectable({
  providedIn: 'root'
})
export class GemsEngine {

  private dialog: DynamicDialogRef | null = null;
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  private gemSubmissionForm = this.fb.group({
    book: this.fb.control(0, {validators: [Validators.required]}),
    chapter: this.fb.control(0, {validators: [Validators.required]}),
    verse: this.fb.control(0, {validators: [Validators.required]}),
    throughVerse: 0,
    comment: this.fb.control("", {validators: [Validators.required]})
  })

  openNewGemDialog(reading: any) {

    // Open Dialog
    this.dialog = this.dialogService.open(AddGem, {
      header: 'Add Gem',
      closable: true,
      modal: true,
      inputValues: { reading },
      style: {
        width: '90vw'
      }
    })

  }

  openExistingGemsDialog(gem?: any) {

    // Open Dialog
    this.dialog = this.dialogService.open(AddGem, {
      header: 'Edit Gem',
      closable: true,
      modal: true,
      inputValues: { gem },
      style: {
        width: '90vw'
      }
    })

  }
}
