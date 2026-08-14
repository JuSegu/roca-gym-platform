import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth as FirebaseAuth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';

/**
 * Single Firebase entry point. Keeping initialization here prevents Firebase
 * from running during Angular SSR and makes switching from demo storage safe.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly app: FirebaseApp | null;
  readonly auth: FirebaseAuth | null;
  readonly firestore: Firestore | null;
  readonly isEnabled: boolean;

  constructor() {
    this.isEnabled = this.isBrowser && firebaseConfig !== null;
    this.app = this.isEnabled ? (getApps()[0] ?? initializeApp(firebaseConfig!)) : null;
    this.auth = this.app ? getAuth(this.app) : null;
    this.firestore = this.app ? getFirestore(this.app) : null;
  }
}
