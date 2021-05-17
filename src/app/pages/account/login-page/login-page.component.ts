import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {

  public form: FormGroup = new FormGroup({});

  constructor(private service: DataService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });

    const token = localStorage.getItem('petshop.token');
    if (token) {
      this.service.refreshToken().subscribe((data: any) => {
        localStorage.setItem('petshop.token', data.token),
        (err : any) => localStorage.clear();
      })
    }
  }

  submit() {
    this.service.authenticate(this.form.value).subscribe((data: any) => {
      localStorage.setItem('petshop.token', data.token),
      (err : any) => console.log(err)
    })
  }

}
