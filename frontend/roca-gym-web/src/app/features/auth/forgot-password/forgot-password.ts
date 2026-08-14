import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly auth = inject(Auth);
  isSubmitted = signal(false);
  errorMessage = signal<string | null>(null);

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    try {
      await this.auth.requestPasswordReset(this.forgotForm.value.email ?? '');
      this.errorMessage.set(null);
      this.isSubmitted.set(true);
    } catch {
      this.errorMessage.set('No fue posible enviar el correo. Verifica la configuración de Firebase.');
    }
  }
}
