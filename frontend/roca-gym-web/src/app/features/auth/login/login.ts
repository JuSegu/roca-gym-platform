import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  errorMessage: string | null = null;
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = (this.loginForm.value.email ?? '').trim();
    const password = (this.loginForm.value.password ?? '').trim();
    this.isLoading = true;
    this.errorMessage = null;

    // 1. Intentar iniciar sesión con Firebase Auth
    try {
      await this.auth.loginWithFirebase(email, password);
      this.errorMessage = null;
      this.isLoading = false;
      this.router.navigate(['/']);
      return;
    } catch (fbError) {
      // 2. Si Firebase falla o está en modo offline/demo, intentar autenticación local
      const localSuccess = this.auth.login(email, password);
      if (localSuccess) {
        this.errorMessage = null;
        this.isLoading = false;
        this.router.navigate(['/']);
        return;
      }

      this.isLoading = false;
      this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
    }
  }
}
