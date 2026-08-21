import { Component } from '@angular/core';

interface FaqItem {
  q: string;
  a: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.html',
})
export class Faq {
  faqs: FaqItem[] = [
    {
      q: '¿Dónde están ubicados exactamente?',
      a: 'Estamos ubicados en la Calle 80 #92-49, muy cerca de la estación de Transmilenio de Quiriguá, en el occidente de Bogotá. Tenemos parqueadero cerca.',
      isOpen: false
    },
    {
      q: '¿Tienen clases grupales o aeróbicos?',
      a: 'No. En ROCA GYM nos especializamos 100% en el alto rendimiento: musculación, levantamiento de pesas (free weights), maquinaria biomecánica y máquinas cardiovasculares.',
      isOpen: false
    },
    {
      q: '¿Puedo comprar suplementos sin estar inscrito?',
      a: '¡Sí! Puedes comprar desde nuestra web como invitado (invitado) o acercarte directamente a la recepción. Si eres miembro activo, tienes 5% de descuento automático.',
      isOpen: false
    },
    {
      q: '¿Qué formas de pago aceptan?',
      a: 'Aceptamos transferencias por Nequi, Daviplata, transferencia bancaria, o pago en efectivo/datáfono directamente en la recepción de la sede.',
      isOpen: false
    },
    {
      q: '¿Cómo funciona la aplicación de la web (Symmetry Pro)?',
      a: 'Es nuestro sistema inteligente. Te conectas con tu celular, eliges tu rutina del día y el sistema te dirá qué hacer, llevará el tiempo de descanso, y guardará tus récords personales. Al final te da XP para que subas de nivel.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs = this.faqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false // Cerrar los demás al abrir uno
    }));
  }
}
