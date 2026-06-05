import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import '../components/styles/login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <span className="brand-licit">licit</span>
            <span className="brand-ia">IA</span>
          </div>
          <h1 className="login-tagline">Bienvenido de nuevo</h1>
          <p className="login-sub">
            Inicia sesión para acceder a la plataforma y continuar<br />
            con tus procesos.
          </p>
        </div>
        <div className="deco-circle deco-circle-1" />
        <div className="deco-circle deco-circle-2" />
        <div className="deco-circle deco-circle-3" />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-card-title">Iniciar sesión</h2>
          <p className="login-card-sub">Ingresa tus credenciales para acceder</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="login-field">
              <label>Correo electrónico</label>
              <div className="login-input-wrap">
                <Mail size={16} className="field-icon" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label>Contraseña</label>
              <div className="login-input-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-forgot">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : 'Iniciar sesión'}
            </button>

            <p className="login-register">
              ¿No tienes cuenta? <a href="#">Registrarse</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
