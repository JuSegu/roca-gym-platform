import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  errorMessage: string | null = null;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    plan: new FormControl('Plan Anual VIP', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    terms: new FormControl(true, [Validators.requiredTrue]),
  });

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const val = this.registerForm.value;

    if (val.password !== val.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      await this.auth.registerWithFirebase({
        name: val.name || '',
        email: val.email || '',
        phone: val.phone || '',
        password: val.password || '',
        plan: val.plan || 'Plan Anual VIP',
      });
      this.errorMessage = null;
      this.router.navigate(['/']);
      return;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      this.errorMessage = message.includes('auth/email-already-in-use')
        ? 'Este correo ya está registrado.'
        : 'No fue posible crear la cuenta. Activa Email/Password y crea Firestore en Firebase.';
      return;
    }

    const success = this.auth.register({
      name: val.name || '',
      email: val.email || '',
      phone: val.phone || '',
      password: val.password || '',
      plan: val.plan || 'Plan Anual VIP',
    });

    if (success) {
      this.errorMessage = null;
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Ocurrió un error al registrar tu cuenta.';
    }
  }
}
