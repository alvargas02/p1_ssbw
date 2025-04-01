import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const obras_singulares = [
  "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares"
  // Puedes agregar más URLs si existen
]

async function Recupera_urls_de(page, pag) {
  const pags = []
  await page.goto(pag)
  const locators = page.locator('.descripcion > a')
  for (const locator of await locators.all()) {
    const href = await locator.getAttribute('href')
    pags.push(href.startsWith('http') ? href : `https://www.museosdeandalucia.es${href}`)
  }
  return pags
}

async function Recupera_info_de(page, url) {
  await page.goto(url)

  const titulo = await page.locator('.header-title span').innerText()

  const imagenRelativa = await page.locator('.wrapper-gallery img').getAttribute('src')
  const imagen = imagenRelativa.startsWith('http') 
    ? imagenRelativa 
    : `https://www.museosdeandalucia.es${imagenRelativa}`

  const descripcion = await page.locator('.detalle > .body-content').nth(0).innerText()

  const procedencia = await page.locator('h4:has-text("Procedencia") + .body-content').innerText()

  const comentario = await page.locator('h4:has-text("Comentario") + .body-content').innerText()

  return {
    titulo,
    imagen,
    descripcion,
    procedencia,
    comentario
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const enlaces_de_obras_singulares = []   
  const lista_info_para_BD = []

  for (const pag of obras_singulares) {
    const urls = await Recupera_urls_de(page, pag)
    enlaces_de_obras_singulares.push(...urls)
  }

  console.log("🚀 Hay", enlaces_de_obras_singulares.length, 'páginas con obras singulares')

  for (const url of enlaces_de_obras_singulares) {
    const info_obra = await Recupera_info_de(page, url)
    lista_info_para_BD.push(info_obra)
    console.log(`✅ ${info_obra.titulo} extraído con éxito.`)
  }

  writeFileSync('info_obras.json', JSON.stringify(lista_info_para_BD, null, 2))

  await browser.close()
}

main()
