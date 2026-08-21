import { Component, inject } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Facilities } from './components/facilities/facilities';
import { Plans } from './components/plans/plans';
import { Store } from './components/store/store';
import { Dashboard } from './components/dashboard/dashboard';
import { CartModal } from './components/cart-modal/cart-modal';
import { Footer } from './components/footer/footer';
import { GymRadio } from './components/gym-radio/gym-radio';
import { Auth } from '../../core/services/auth';
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
    Store,
    Dashboard,
    CartModal,
    GymRadio,
    Footer,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly auth = inject(Auth);
  readonly cart = inject(CartService);
}
