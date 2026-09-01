import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pincode: string;
}

@Component({
  selector: 'app-confirmation',
  standalone: true,
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation implements OnInit {

  user: User | null = null;

  ngOnInit(): void {

    const savedUser =
      localStorage.getItem('registeredUser');

    console.log(
      'Saved user from localStorage:',
      savedUser
    );

    if (!savedUser) {
      return;
    }

    try {

      this.user = JSON.parse(savedUser);

      console.log(
        'User displayed on confirmation page:',
        this.user
      );

    } catch (error) {

      console.error(
        'Could not read saved user:',
        error
      );

    }
  }
}