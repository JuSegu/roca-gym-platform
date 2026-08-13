import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Facilities } from './components/facilities/facilities';
import { Plans } from './components/plans/plans';
import { Store } from './components/store/store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Hero , About, Facilities, Plans, Store],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
