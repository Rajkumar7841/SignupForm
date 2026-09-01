import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  signupForm: FormGroup;

  submitted = false;

  serverError = '';

  private apiUrl =
  'http://3.108.145.171:8080/api/users/register';


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    this.signupForm = this.fb.group({

    
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+$/)
        ]
      ],

     
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+$/)
        ]
      ],

      
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

     
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(\+[1-9][0-9]{11}|[1-9][0-9]{9})$/
          )
        ]
      ],

      
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$&!]).+$/
          )
        ]
      ],

      
      repeatPassword: [
        '',
        Validators.required
      ],

     
      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]{5}$/)
        ]
      ]

    });
  }




  onSubmit(): void {

    this.submitted = true;

    this.serverError = '';


   

    if (this.email?.hasError('duplicate')) {

      const errors = {
        ...this.email.errors
      };

      delete errors['duplicate'];

      this.email.setErrors(
        Object.keys(errors).length > 0
          ? errors
          : null
      );
    }



    if (this.pincode?.hasError('serverPincode')) {

      const errors = {
        ...this.pincode.errors
      };

      delete errors['serverPincode'];

      this.pincode.setErrors(
        Object.keys(errors).length > 0
          ? errors
          : null
      );
    }


   
    if (this.signupForm.invalid) {

      this.signupForm.markAllAsTouched();

      return;
    }


    const formData =
      this.signupForm.value;


  

    if (
      formData.password !==
      formData.repeatPassword
    ) {

      this.serverError =
        'Passwords do not match.';

      return;
    }


    console.log(
      'Sending registration data:',
      formData
    );


  

    this.http
      .post<any>(
        this.apiUrl,
        formData
      )
      .subscribe({

     

        next: (response) => {

          console.log(
            'REGISTRATION SUCCESS:',
            response
          );


          
          const registeredUser = {

            id: response.id,

            firstName:
              response.firstName,

            lastName:
              response.lastName,

            email:
              response.email,

            phone:
              response.phone,

            pincode:
              response.pincode
          };


          localStorage.setItem(
            'registeredUser',
            JSON.stringify(
              registeredUser
            )
          );


          console.log(
            'Saved registered user:',
            registeredUser
          );


         
          this.router.navigateByUrl(
            '/confirmation'
          );
        },




        error: (error) => {

          console.error(
            'REGISTRATION ERROR:',
            error
          );

          console.log(
            'HTTP STATUS:',
            error.status
          );

          console.log(
            'ERROR BODY:',
            error.error
          );


         

          if (error.status === 0) {

            this.serverError =
              'Cannot connect to Spring Boot. Make sure the backend is running on port 8080.';

            return;
          }


         

          if (error.error?.email) {

            this.email?.setErrors({

              ...this.email?.errors,

              duplicate: true
            });

            this.email?.markAsTouched();
          }


          

          if (error.error?.pincode) {

            this.pincode?.setErrors({

              ...this.pincode?.errors,

              serverPincode: true
            });

            this.pincode?.markAsTouched();
          }



          if (error.error?.repeatPassword) {

            this.serverError =
              error.error.repeatPassword;
          }


        

          if (
            error.error?.message &&
            !error.error?.email &&
            !error.error?.pincode &&
            !error.error?.repeatPassword
          ) {

            this.serverError =
              error.error.message;
          }


        

          if (
            typeof error.error ===
            'string'
          ) {

            this.serverError =
              error.error;
          }

        }

      });
  }


  

  get firstName() {
    return this.signupForm.get(
      'firstName'
    );
  }


  get lastName() {
    return this.signupForm.get(
      'lastName'
    );
  }


  get email() {
    return this.signupForm.get(
      'email'
    );
  }


  get phone() {
    return this.signupForm.get(
      'phone'
    );
  }


  get password() {
    return this.signupForm.get(
      'password'
    );
  }


  get repeatPassword() {
    return this.signupForm.get(
      'repeatPassword'
    );
  }


  get pincode() {
    return this.signupForm.get(
      'pincode'
    );
  }

}