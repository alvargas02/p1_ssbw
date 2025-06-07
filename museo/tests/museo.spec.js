import { test, expect } from '@playwright/test';

// Suite de tests E2E para Museo Arqueológico

test.describe('Museo Arqueológico', () => {
  test('Título de la página', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await expect(page).toHaveTitle(/Museo Arqueológico/);
  });

  test('Búsqueda de "vaso" devuelve al menos una tarjeta', async ({ page }) => {
    await page.goto('http://localhost:8000/obras/buscar?busqueda=vaso');
    const cardsCount = await page.locator('.card').count();
    expect(cardsCount).toBeGreaterThan(0);
  });

  test('Registro y login exitoso', async ({ page }) => {
    // Generamos un correo único para evitar colisiones
    const correo = `user${Date.now()}@test.com`;
    const nombre = 'UsuarioTest';
    const password = 'test1234';

    // Paso 1: Registro
    await page.goto('http://localhost:8000/usuarios/registro');
    await page.fill('input[name="nombre"]', nombre);
    await page.fill('input[name="correo"]', correo);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Crear cuenta")');
    await expect(page).toHaveURL('http://localhost:8000/usuarios/login');

    // Paso 2: Login
    await page.fill('input[name="correo"]', correo);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Entrar")');
    await expect(page).toHaveURL('http://localhost:8000/');
    await expect(page.getByText(`Hola, ${nombre}`)).toBeVisible();
  });

  test('Login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('http://localhost:8000/usuarios/login');
    await page.fill('input[name="correo"]', 'noexiste@example.com');
    await page.fill('input[name="password"]', 'incorrecto');
    await page.click('button:has-text("Entrar")');
    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
  });
});
