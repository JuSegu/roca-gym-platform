import { Component, inject } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Facilities } from './components/facilities/facilities';
import { Plans } from './components/plans/plans';
import { Location } from './components/location/location';
import { Store } from './components/store/store';
import { CartModal } from './components/cart-modal/cart-modal';
import { Footer } from './components/footer/footer';
import { GymRadio } from './components/gym-radio/gym-radio';
import { IdleScreen } from './components/idle-screen/idle-screen';
import { Testimonials } from './components/testimonials/testimonials';
import { Faq } from './components/faq/faq';
import { WhatsappButton } from './components/whatsapp-button/whatsapp-button';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    About,
    Facilities,
    Plans,
    Location,
    Store,
    CartModal,
    GymRadio,
    Footer,
    IdleScreen,
    Testimonials,
    Faq,
    WhatsappButton,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly cart = inject(CartService);
}
