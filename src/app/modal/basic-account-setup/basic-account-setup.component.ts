import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
import {AuthService} from '../../_services/auth/auth.service';
import {SpaceValidator} from '../../constant';

@Component({
  selector: 'app-basic-account-setup',
  templateUrl: './basic-account-setup.component.html',
  styleUrls: ['./basic-account-setup.component.scss']
})
export class BasicAccountSetupComponent implements OnInit {

  public basicAccountSetupForm: FormGroup;
  public submitted: any = false;
  public message: any;

  constructor(private dialogRef: MatDialogRef<BasicAccountSetupComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private formBuilder: FormBuilder,
              private _auth: AuthService) {
    this.createForm();
  }

  ngOnInit() {
    this.updateForm();
  }

  createForm() {
    const email: string = this.data && this.data.email ? this.data.email : '';
    const isEmail: any = email !== '';
    const strPattern: any = /^(?=\D*\d)(?=.*[!@#$.,'"?\/%^&*])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/;
    this.basicAccountSetupForm = this.formBuilder.group({
      first_name: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      last_name: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      email: [{value: '', disabled: isEmail}, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(strPattern)]],
      confirm_password: ['', Validators.required],
      social_id: [''],
      social_type: ['']
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
  }

  updateForm() {
    const first_name: string = this.data && this.data.firstName ? this.data.firstName : '';
    const last_name: string = this.data && this.data.lastName ? this.data.lastName : '';
    const email: string = this.data && this.data.email ? this.data.email : '';
    const social_id: string = this.data && this.data.id ? this.data.id : '';
    const social_type: string = this.data && this.data.social_type ? this.data.social_type : '';
    this.basicAccountSetupForm.patchValue({first_name, last_name, email, social_id, social_type});
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.basicAccountSetupForm.controls;
  }

  async onSubmit() {
    if (!this.submitted) {
       Object.keys(this.basicAccountSetupForm.controls).forEach(control=>{
        this.basicAccountSetupForm.controls[control].markAsDirty();
       });
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.basicAccountSetupForm.invalid) {
      return;
    }

    const res: any = await this._auth.signUp(this.basicAccountSetupForm.getRawValue());
    if (res && res.status && res.message) {
      this.message = res.message;
    }
    if (res && res.status && res.messages && res.messages.length) {
      this.message = res.messages[0]['message'];
    }
    if (res.status === 'success' && res.user) {
      this.closeDialog();
      this._auth.openConfirmEmailModal(res.user);
    }
  }

  closeDialog(data?: any) {
    this.dialogRef.close(data);
  }
}
