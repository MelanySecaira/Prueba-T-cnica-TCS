import Swal from 'sweetalert2';
import { NotificationService } from './notification.service';

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
    (Swal.fire as jest.Mock).mockClear();
  });

  it('should call Swal.fire with success message', () => {
    service.success('Operation completed');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Éxito',
      text: 'Operation completed',
      confirmButtonText: 'Aceptar'
    });
  });

  it('should call Swal.fire with error message', () => {
    service.error('Something went wrong');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong',
      confirmButtonText: 'Aceptar'
    });
  });

  it('should call Swal.fire with warning message', () => {
    service.warning('Check your input');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'warning',
      title: 'Atención',
      text: 'Check your input',
      confirmButtonText: 'Aceptar'
    });
  });

  it('should allow custom titles', () => {
    service.success('Great', 'Perfecto');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Perfecto',
      text: 'Great',
      confirmButtonText: 'Aceptar'
    });
  });
});
