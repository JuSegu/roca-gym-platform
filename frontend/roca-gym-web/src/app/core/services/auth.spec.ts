import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { FirebaseService } from '../firebase/firebase.service';

describe('Auth Service', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth, FirebaseService],
    });
    service = TestBed.inject(Auth);
    service.logout();
  });

  it('should start logged out or with loaded session', () => {
    expect(service).toBeTruthy();
  });

  it('should login with default test credentials', () => {
    const ok = service.login('admin@rocagym.com', '12345678');
    expect(ok).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser()?.email).toBe('admin@rocagym.com');
  });

  it('should register a new user profile correctly', () => {
    const registered = service.register({
      name: 'Nuevo Miembro',
      email: 'nuevo@rocagym.com',
      password: 'secretpassword',
      plan: 'Plan Anual VIP',
    });

    expect(registered).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser()?.name).toBe('Nuevo Miembro');
    expect(service.currentUser()?.role).toBe('Miembro VIP');
  });

  it('should record workout and update stats', () => {
    service.login('admin@rocagym.com', '12345678');
    const initialCalories = service.currentUser()?.stats.calories || 0;
    const initialAttendances = service.currentUser()?.stats.attendances || 0;

    service.recordWorkout(500, 60);

    expect(service.currentUser()?.stats.calories).toBe(initialCalories + 500);
    expect(service.currentUser()?.stats.attendances).toBe(initialAttendances + 1);
  });

  it('should logout cleanly', () => {
    service.login('admin@rocagym.com', '12345678');
    expect(service.isLoggedIn()).toBeTrue();
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });
});
