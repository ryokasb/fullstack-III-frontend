import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';
import Swal from 'sweetalert2';

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem('token');

      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("rol");

        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
          confirmButtonColor: '#051150',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
        }).then(() => {
          navigate("/");
        });
      }
    };

    check();
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}