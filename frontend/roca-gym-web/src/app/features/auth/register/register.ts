import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  errorMessage: string | null = null;
  isLoading = false;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    plan: new FormControl('Plan Anual', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    terms: new FormControl(true, [Validators.requiredTrue]),
  });

  ngOnInit(): void {
    const selectedPlan = this.route.snapshot.queryParamMap.get('plan');
    if (selectedPlan) {
      this.registerForm.patchValue({ plan: selectedPlan });
    }
  }

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

    this.isLoading = true;
    this.errorMessage = null;

    // 1. Intentar registrar en Firebase
    try {
      await this.auth.registerWithFirebase({
        name: val.name || '',
        email: val.email || '',
        phone: val.phone || '',
        password: val.password || '',
        plan: val.plan || 'Plan Anual',
      });
      this.errorMessage = null;
      this.isLoading = false;
      this.router.navigate(['/']);
      return;
    } catch (fbError) {
      // 2. Si Firebase falla o no tiene credenciales, registrar localmente
      const success = this.auth.register({
        name: val.name || '',
        email: val.email || '',
        phone: val.phone || '',
        password: val.password || '',
        plan: val.plan || 'Plan Anual',
      });

      this.isLoading = false;
      if (success) {
        this.errorMessage = null;
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Ocurrió un error al registrar tu cuenta.';
      }
    }
  }
}
