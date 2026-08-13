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

  // Mensaje de error para mostrar en la interfaz
  errorMessage: string | null = null;

  // ==========================================
  // FORMULARIO DE LOGIN
  // ==========================================

  loginForm = new FormGroup({

    // Campo de correo electrónico
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    // Campo de contraseña
    password: new FormControl('', [
      Validators.required
    ])

  });


  // ==========================================
// ENVIAR FORMULARIO
// ==========================================

onSubmit(): void {

  // Si el formulario no es válido,
  // detenemos la ejecución.
  if (this.loginForm.invalid) {

    // Mostramos todos los campos como tocados
    // para que aparezcan sus mensajes de error.
    this.loginForm.markAllAsTouched();

    return;
  }

  // Obtenemos el correo introducido por el usuario.
  const email = this.loginForm.value.email ?? '';

  // Obtenemos la contraseña introducida.
  const password = this.loginForm.value.password ?? '';

  // Enviamos las credenciales al servicio Auth.
  const loginSuccessful = this.auth.login(email, password);

  // Comprobamos si el servicio aceptó las credenciales.
  if (loginSuccessful) {
    this.errorMessage = null;
    console.log('🎉 Bienvenido a ROCA GYM');
    // Redirigir a la página principal / dashboard
    this.router.navigate(['/']);
  } else {
    console.log('❌ Correo o contraseña incorrectos');
    this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
  }

}
}