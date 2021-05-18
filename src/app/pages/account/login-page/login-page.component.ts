import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { Security } from 'src/app/utils/security.util';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public busy: boolean = false;

  constructor(private service: DataService, private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });

    const token = Security.getToken();
    if (token) {
      this.busy = true;
      this.service.refreshToken().subscribe((data: any) => {
        this.busy = false;
        this.setUser(data.customer, data.token),
        (err : any) => {
          localStorage.clear();
          this.busy = false;
        }
      })
    }
  }

  submit() {
    this.busy = true;
    this.service.authenticate(this.form.value).subscribe((data: any) => {
      this.busy = false;
      this.setUser(data.customer, data.token);
      (err : any) => {
        console.log(err);
        this.busy = false;
      }
    })
  }

  setUser(user: User, token: string) {
    Security.set(user, token);
    this.router.navigate(['']);
  }

}
