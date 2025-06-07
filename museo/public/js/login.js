// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('correo');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('correo-error');
  const passwordError = document.getElementById('password-error');
  const emailValidIcon = document.getElementById('correo-valid-icon');
  const togglePasswordIcon = document.getElementById('toggle-password-icon');
  const loginForm = document.getElementById('login-form');

  // 1. Validar email en blur
  emailInput.addEventListener('blur', () => {
    const value = emailInput.value.trim();
    // Expresión regular simple para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '' || !emailRegex.test(value)) {
      emailError.style.display = 'block';
      emailValidIcon.style.display = 'none';
      emailInput.classList.add('is-danger');
      emailInput.classList.remove('is-success');
    } else {
      // Email válido
      emailError.style.display = 'none';
      emailValidIcon.style.display = 'inline-block';
      emailInput.classList.remove('is-danger');
      emailInput.classList.add('is-success');
    }
  });

  // 2. Validar contraseña en blur (no vacía y al menos 8 caracteres)
  passwordInput.addEventListener('blur', () => {
    const value = passwordInput.value;
    if (value.length < 8) {
      passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres.';
      passwordError.style.display = 'block';
      passwordInput.classList.add('is-danger');
      passwordInput.classList.remove('is-success');
    } else {
      passwordError.style.display = 'none';
      passwordInput.classList.remove('is-danger');
      passwordInput.classList.add('is-success');
    }
  });

  // 3. Toggle para mostrar/ocultar contraseña
  document.querySelector('.toggle-password').addEventListener('click', () => {
    const type = passwordInput.getAttribute('type');
    if (type === 'password') {
      passwordInput.setAttribute('type', 'text');
      togglePasswordIcon.classList.remove('fa-eye');
      togglePasswordIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.setAttribute('type', 'password');
      togglePasswordIcon.classList.remove('fa-eye-slash');
      togglePasswordIcon.classList.add('fa-eye');
    }
    // Mantener foco en el input al hacer toggle
    passwordInput.focus();
  });

  // 4. Validación final al enviar el formulario
  loginForm.addEventListener('submit', (e) => {
    let valid = true;

    // Revalidar email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === '' || !emailRegex.test(emailValue)) {
      emailError.style.display = 'block';
      emailInput.classList.add('is-danger');
      valid = false;
    }

    // Revalidar contraseña
    const passValue = passwordInput.value;
    if (passValue.length < 8) {
      passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres.';
      passwordError.style.display = 'block';
      passwordInput.classList.add('is-danger');
      valid = false;
    }

    if (!valid) {
      e.preventDefault(); // Evitar envío si hay errores
    }
  });

  // 5. Si el servidor devuelve un error de login, eliminamos la validación previa
  const serverError = document.getElementById('server-error');
  if (serverError) {
    // Borrar estilos de éxito y error de los inputs para que el usuario reingrese
    emailInput.classList.remove('is-success');
    emailInput.classList.remove('is-danger');
    passwordInput.classList.remove('is-success');
    passwordInput.classList.remove('is-danger');
    emailValidIcon.style.display = 'none';
  }
});
