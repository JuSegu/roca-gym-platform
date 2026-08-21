import { Component } from '@angular/core';

/**
 * Botón flotante de WhatsApp — visible en toda la landing pública.
 * Se expande al pasar el cursor / tocar en móvil.
 */
@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <a
      href="https://wa.me/573001234567?text=Hola%20ROCA%20GYM!%20%F0%9F%92%AA%20Quiero%20informaci%C3%B3n%20sobre%20los%20planes%20y%20horarios."
      target="_blank"
      rel="noopener noreferrer"
      class="group fixed bottom-24 left-4 z-40 flex items-center gap-3 rounded-full border border-green-500/50 bg-zinc-950/95 py-3 pl-3.5 pr-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] sm:bottom-6 sm:left-6"
      title="Hablar con ROCA GYM por WhatsApp"
      aria-label="Contactar ROCA GYM por WhatsApp"
    >
      <!-- Ícono WhatsApp SVG oficial -->
      <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
        <svg class="h-5 w-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </div>

      <!-- Texto — visible en hover / foco -->
      <div class="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 group-hover:max-w-[160px]">
        <p class="text-[11px] font-black uppercase tracking-wider text-white leading-none">
          ¿Te ayudamos?
        </p>
        <p class="text-[9px] font-bold text-green-400">
          Chat en vivo · WhatsApp
        </p>
      </div>
    </a>
  `,
})
export class WhatsappButton {}
