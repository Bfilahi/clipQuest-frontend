import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal-service';

describe('ModalService', () => {
  let service: ModalService;
  const modal: string = 'modal-1';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register()', () => {
    it('should register a modal as hidden by default', () => {
      service.register(modal);

      expect(service.isModalOpen(modal)).toBeFalse();
    });
  });

  describe('isModalOpen()', () => {
    it('should return false for an unregistered modal', () => {
      expect(service.isModalOpen(modal)).toBeFalse();
    });

    it('should return true after the modal is toggled open', () => {
      service.register(modal);

      service.toggleModal(modal);
      expect(service.isModalOpen(modal)).toBeTrue();
    });
  });

  describe('toggleModal()', () => {
    it('should toggle visibility on and off', () => {
      service.register(modal);

      service.toggleModal(modal);
      expect(service.isModalOpen(modal)).toBeTrue();

      service.toggleModal(modal);
      expect(service.isModalOpen(modal)).toBeFalse();
    });

    it('should not throw when toggling an unregistered modal', () => {
      expect(() => service.toggleModal(modal)).not.toThrow();
    });
  });

  describe('unregistered()', () => {
    it('should make the modal invisible after unregistering', () => {
      service.register(modal);
      service.toggleModal(modal);

      service.unregister(modal);
      expect(service.isModalOpen(modal)).toBeFalse();
    });
  });
});
