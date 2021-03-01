import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch, MustNotMatch} from '../../../../_helpers/must-match.validator';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserService} from '../../../../_services/user/user.service';
import {AlertDialogService} from '../../../../modal/alert/alert-dialog.service';

@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss']
})
export class AccountSecurityComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public accountSecurityForm: FormGroup;
  public asSubmitted: any;
  public destroy$: any = new Subject<any>();
  public proUser: any;

  constructor(private formBuilder: FormBuilder, private store: Store<any>,
              private userService: UserService, private alertDialogService: AlertDialogService) {
  }

  ngOnInit() {
    this.createAccountSecurityForm();
    this.getProUser();
  }


  createAccountSecurityForm() {
    const strPattern: any = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/;
    this.accountSecurityForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(strPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: [
        MustNotMatch('oldPassword', 'newPassword'),
        MustMatch('newPassword', 'confirmPassword')
      ]
    });
  }

  get f() {
    return this.accountSecurityForm.controls;
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
        }
      });
  }

  async onASSubmit() {
    if (!this.asSubmitted) {
      this.asSubmitted = true;
    }

    // stop here if form is invalid
    if (this.accountSecurityForm.invalid) {
      return;
    }
    const data: any = this.accountSecurityForm.getRawValue();
    data.email = this.proUser.email;
    const res: any = await this.userService.updatePassword(data);
    if (res && res.status && res.message) {
      this.alertDialogService.alert(res.message);
    }
    if (res && res.status && res.messages && res.messages.length) {
      this.alertDialogService.alert(res.messages[0]['message']);
    }
    this.asSubmitted = false;
    this.accountSecurityForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
