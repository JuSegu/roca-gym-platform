import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-black flex items-center justify-center px-6">

      <!-- Fondo de luz roja -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="h-96 w-96 rounded-full bg-red-600/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 text-center">

        <!-- 404 enorme -->
        <div class="select-none">
          <p class="text-[clamp(6rem,30vw,14rem)] font-black leading-none text-white/5 tracking-tighter">
            404
          </p>
          <p class="mt-[-2rem] text-[clamp(6rem,30vw,14rem)] font-black leading-none text-red-600/20 tracking-tighter blur-sm">
            404
          </p>
        </div>

        <!-- Logo RG -->
        <div class="mt-[-4rem] flex items-center justify-center gap-3">
          <div class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-600 bg-black shadow-[0_0_30px_rgba(220,38,38,0.5)]">
            <span class="text-lg font-black tracking-tight text-red-600">RG</span>
          </div>
        </div>

        <!-- Mensaje -->
        <h1 class="mt-6 text-2xl font-black uppercase text-white sm:text-4xl">
          Ruta no encontrada
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-zinc-400 max-w-sm mx-auto">
          Esta página no existe o fue movida. Regresa al inicio para seguir entrenando.
        </p>

        <!-- Botones -->
        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            routerLink="/"
            class="rounded-xl bg-red-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(220,38,38,0.4)] transition hover:bg-red-500"
          >
            ← Ir al Inicio
          </a>
          <a
            href="https://wa.me/573001234567?text=Hola%20ROCA%20GYM,%20necesito%20ayuda"
            target="_blank"
            rel="noopener"
            class="rounded-xl border border-green-500/40 bg-green-950/30 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-green-400 transition hover:border-green-500 hover:text-green-300"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  `,
})
export class NotFound {}
