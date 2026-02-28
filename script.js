let carrito = [];
let total = 0;
// ===== UBICACIÓN SUPER POLLO =====
const superPollo = { lat: 18.9694538, lng: -98.2386325 };
let envio = 0;
let km = 0;
let linkMaps = "";

const aderezos = [
 "BBQ","BBQ Picante","Tamarindo",
 "Piña Habanero","Mango Habanero",
 "Habanero","Búfalo","Chiltipín","Ranch","Cacahuate"
];

// ================= UTIL =================
function setPrecio(id, precio){
  document.getElementById("precio-"+id).innerText = "$"+precio;
}

// ================= COMPLEMENTOS =================
function complementoHTML(id, tipo) {
  if (tipo === "entero") {
    return `
    <select class="form-select mb-2" id="tipoComp-${id}" onchange="mostrarComplementos('${id}')">
      <option value="">Tipo de complemento</option>
      <option value="uno">Un solo complemento (1 L)</option>
      <option value="mitad">Mitad y mitad</option>
    </select>
    <div id="comps-${id}"></div>`;
  }

  if (tipo === "medio") {
    return `
    <select class="form-select mb-2" id="comp-${id}">
      <option value="">Complemento</option>
      <option>Arroz</option>
      <option>Spaghetti</option>
      <option>Frijoles</option>
    </select>`;
  }
  return "";
}

function mostrarComplementos(id) {
  const tipo = document.getElementById("tipoComp-"+id).value;
  const div = document.getElementById("comps-"+id);

  if (tipo === "uno") {
    div.innerHTML = `
    <select class="form-select mb-2" id="comp1-${id}">
      <option>Arroz</option>
      <option>Spaghetti</option>
      <option>Frijoles</option>
    </select>`;
  }

  if (tipo === "mitad") {
    div.innerHTML = `
    <select class="form-select mb-2" id="comp1-${id}">
      <option>Arroz</option>
      <option>Spaghetti</option>
      <option>Frijoles</option>
    </select>
    <select class="form-select mb-2" id="comp2-${id}">
      <option>Arroz</option>
      <option>Spaghetti</option>
      <option>Frijoles</option>
    </select>`;
  }
}
// ================= ubicacion =================

function obtenerUbicacion(){
  if(!navigator.geolocation){
    alert("Tu navegador no soporta GPS");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      linkMaps = `https://www.google.com/maps?q=${lat},${lng}`;

      km = calcularDistancia(superPollo.lat, superPollo.lng, lat, lng);

      // TARIFAS
      if(km <= 2) envio = 10;
      else if(km <= 2.70) envio = 15;
      else if(km <= 4) envio = 30;
      else if(km <= 4.60) envio = 25;
      else if(km <= 5) envio = 30;
      else if(km <= 7) envio = 40;
      else{
        envio = 0;
        document.getElementById("info-envio").innerText =
        "⚠️ El costo de envío se calculará al llegar su pedido.";
        actualizar();
        return;
      }

      document.getElementById("info-envio").innerText =
      `Distancia: ${km.toFixed(2)} km | Envío: $${envio}`;

      actualizar();
    },
    () => alert("No se pudo obtener la ubicación")
  );
}

function calcularDistancia(lat1, lon1, lat2, lon2){
  const R = 6371; // km
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;

  const a =
    Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)*Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
// ================= POLLO - SABOR =================
function saborPolloHTML(id, nombre, maxPollos=1){
  // maxPollos = cuántos pollos puede llevar (1 o 2)
  let html = `
    <select class="form-select mb-2" id="sabor-${id}" onchange="seleccionarSabor('${id}', ${maxPollos})">
      <option value="">Sabor del pollo</option>
      <option value="natural">Natural</option>
      <option value="adobado">Adobado</option>
      <option value="banado">Bañado (+$10 por pollo)</option>
    </select>
    <div id="aderezoBana-${id}"></div>
  `;
  return html;
}

// Mostrar el menú de aderezos solo si es bañado
function seleccionarSabor(id, maxPollos){
  const sabor = document.getElementById("sabor-"+id).value;
  const div = document.getElementById("aderezoBana-"+id);

  if(sabor === "banado"){
    // Permitir seleccionar aderezos (1 por pollo)
    let html = `<p>Elige aderezo para bañar:</p>`;
    for(let i=1; i<=maxPollos; i++){
      html += `<select class="form-select mb-2" id="adrBana-${id}-${i}">
        ${aderezos.map(a=>`<option value="${a}">${a}</option>`).join("")}
      </select>`;
    }
    div.innerHTML = html;
  } else {
    div.innerHTML = "";
  }
}
// ================= COMPLEMENTO EXTRA =================
function complementoExtraHTML(id) {
  return `
    <select class="form-select mb-2" id="tam-${id}" onchange="seleccionarTamExtra('${id}')">
      <option value="">Seleccione tamaño</option>
      <option value="medio">Medio litro ($30)</option>
      <option value="litro">Litro completo ($50)</option>
    </select>
    <div id="precio-${id}"></div>
    <div id="comps-${id}"></div>`;
}

function seleccionarTamExtra(id) {
  const tam = document.getElementById("tam-" + id).value;
  const precioDiv = document.getElementById("precio-" + id);
  const compDiv = document.getElementById("comps-"+id);

  if (tam === "medio") {
    precioDiv.innerHTML = `<p>Precio: <strong>$30</strong></p>`;
    compDiv.innerHTML = `
      <select class="form-select mb-2" id="comp-${id}">
        <option value="">Complemento</option>
        <option>Arroz</option>
        <option>Spaghetti</option>
        <option>Frijoles</option>
      </select>`;
  }

  if (tam === "litro") {
    precioDiv.innerHTML = `<p>Precio: <strong>$50</strong></p>`;
    compDiv.innerHTML = `
      <select class="form-select mb-2" id="comp-${id}">
        <option value="">Complemento</option>
        <option>Arroz</option>
        <option>Spaghetti</option>
        <option>Frijoles</option>
      </select>`;
  }
}

function tortillasHTML(id) {
  return `
    <select class="form-select mb-2" id="tam-${id}" onchange="actualizarPrecioTortilla('${id}')">
      <option value="">Seleccione cantidad</option>
      <option value="medio">Medio kilo ($9)</option>
      <option value="kilo">1 kilo ($18)</option>
    </select>
    <input type="number" class="form-control mb-2" id="cant-${id}" value="1" min="1" max="10" onchange="actualizarPrecioTortilla('${id}')">
    <div id="precio-${id}"></div>
  `;
}

function actualizarPrecioTortilla(id) {
  const tam = document.getElementById("tam-" + id).value;
  const cant = parseInt(document.getElementById("cant-" + id).value) || 1;
  const precioDiv = document.getElementById("precio-" + id);

  let precioBase = 0;
  if(tam === "medio") precioBase = 9;
  if(tam === "kilo") precioBase = 18;

  const subtotal = precioBase * cant;
  precioDiv.innerHTML = `<p>Precio: <strong>$${subtotal}</strong></p>`;
}
// ================= ADEREZOS (ALITAS ) =================
function aderezosHTML(id, max){
  let html = `<p><strong>Elige hasta ${max} aderezos:</strong></p>`;
  aderezos.forEach(a=>{
    html += `
      <label>
        <input type="checkbox"
               name="adr_${id}"
               value="${a}"
               onclick="limitarAderezos('${id}', ${max})">
        ${a}
      </label><br>
    `;
  });
  return html;
}

// Limita la cantidad de aderezos
function limitarAderezos(id, max){
  const checks = document.querySelectorAll(`input[name="adr_${id}"]`);
  const seleccionados = Array.from(checks).filter(c=>c.checked);

  if(seleccionados.length > max){
    alert("Solo puedes elegir " + max + " aderezos");
    event.target.checked = false;
  }
}
const refrescos = ["Pepsi", "Mirinda", "Sangría", "7Up"];

// Tipo de refresco
function refrescoHTML(id){
  let html = `<select class="form-select mb-2" id="refresco-${id}">
    <option value="">Seleccione refresco</option>`;
  refrescos.forEach(r=>{
    html += `<option value="${r}">${r}</option>`;
  });
  html += `</select>`;
  return html;
}
// ================= ADEREZOS EXTRAS =================
function aderezosExtraHTML(id) {
  return `
    <select class="form-select mb-2" id="adrExtra-${id}" multiple onchange="seleccionarAderezosExtra('${id}')">
      <option>BBQ</option>
	  <option>Ranch</option>
      <option>BBQ Picante</option>
      <option>Tamarindo</option>
      <option>Piña Habanero</option>
      <option>Mango Habanero</option>
      <option>Habanero</option>
      <option>Búfalo</option>
      <option>Chiltipín</option>
      <option>Cacahuate</option>
    </select>
    <div id="precio-${id}"></div>
  `;
}

function seleccionarAderezosExtra(id){
  const select = document.getElementById("adrExtra-"+id);
  const seleccionados = Array.from(select.selectedOptions).map(opt => opt.value);
  const precioDiv = document.getElementById("precio-"+id);
  const subtotal = seleccionados.length * 10;
  precioDiv.innerHTML = `Precio: <strong>$${subtotal}</strong>`;
}

// ================= DESCRIPCIONES =================
const descripciones = {
  pollo1: "Pollo entero con 1 litro de complemento y 2 salsas (verde y roja).",
  pollo2: "Medio pollo con ½ litro de complemento y 2 salsas.",
  cos1: "1 kilo de costillas con 1 litro de complemento y 2 salsas.",
  cos2: "½ kilo de costillas con ½ litro de complemento y 2 salsas.",
  cos3: "¼ kilo de Costillas.",
  cos4: "Orden de costillas bañadas en aderezo.",
  lon1: "1 kilo de longaniza con 1 litro de complemento y 2 salsas.",
  lon2: "½ kilo de longaniza con ½ litro de complemento y 2 salsas.",
  lon3: "¼ kilo de longaniza.",
  ali1: "1 kilo de alitas bañadas en aderezo.",
  ali2: "½ kilo de alitas bañadas en aderezo.",
  ali3: "Orden de alitas bañadas en aderezo.",
  coch1: "1 kilo de cochinita pibil, tortillas calientes, limón, cebolla morada, salsa habanero..",
  coch2: "½ kilo de cochinita pibil,tortillas calientes, limón, cebolla morada, salsa habanero..",
  coch3: "¼ kilo de cochinita pibil,tortillas calientes, limón, cebolla morada, salsa habanero..",
  pro1: "Incluye: 1 pollo asado, ½ litro de complemento, ½ kg de tortillas, papas fritas, salsa verde y roja.",
  pro2: "Incluye: 1 pollo, ½ kg de tortillas, 1 cebollón, ½ litro de complemento, salsa verde y roja.",
  pro3: "Incluye: 1 pollo, 1 litro de complemento, refresco de 2 L, salsa verde y roja.",
  pro4: "Incluye: 1 pollo, ½ kg de costillas, 1 litro de complemento, salsa verde y roja.",
  pro5: "Incluye: 2 pollos, 1 litro de complemento, salsa verde y roja.",
  pro6: "Incluye: 1 pollo, ½ kg de longaniza, 1 litro de complemento, salsa verde y roja.",
  ext1: "Papas adobadas ½ litro.",
  ext2: "Papas adobadas 1 litro.",
  ext3: "Papas con rajas ½ litro.",
  ext4: "Papas con rajas 1 litro.",
  ext5: "Ensalada de manzana ½ litro.",
  ext6: "Ensalada de manzana 1 litro.",
  ext7: "Papas fritas caseras.",
  ext8: "Selecciona uno o varios aderezos extra. Cada uno $10.",
  ext9: "Selecciona cantidad de tortillas.",
  ext10: "Cebollon condimentado con : Mantequilla , pimienta y sal.",
  ext11: "Selecciona tamaño de complemento extra y su complemento.",
};
// ================= PRODUCTO =================
function crearProducto(id, nombre, precio, img, reglas = {}) {

  let complementoHTMLFinal = "";

  // ===== CANTIDAD =====
  if (reglas.cantidad) {
    complementoHTMLFinal += `
      <label>Cantidad:</label>
      <input type="number" id="cantidad-${id}" class="form-control mb-2" min="1" max="10" value="1">
    `;
  }

  // ===== SABOR DEL POLLO =====
  if (nombre.toLowerCase().includes("pollo")) {
    let maxPollos = 1;
    if (nombre.includes("2 Pollos")) maxPollos = 2;

    complementoHTMLFinal += `
      <select class="form-select mb-2" id="sabor-${id}" onchange="seleccionarSabor('${id}', ${maxPollos})">
        <option value="">Sabor del pollo</option>
        <option value="natural">Natural</option>
        <option value="adobado">Adobado</option>
        <option value="banado">Bañado (+$10 por pollo)</option>
      </select>
      <div id="aderezoBana-${id}"></div>
    `;
  }

  // ===== COMPLEMENTO =====
  if (reglas.complemento) {
    complementoHTMLFinal += complementoHTML(id, reglas.complemento);
  }

  // ===== ADEREZOS (ALITAS) =====
  if (reglas.aderezo) {
    complementoHTMLFinal += aderezosHTML(id, reglas.max || 1);
  }

  // ===== REFRESCO =====
  if (reglas.refresco) {
    complementoHTMLFinal += refrescoHTML(id);
  }

  // ===== CASOS ESPECIALES =====
  if (nombre === "Complemento Extra") complementoHTMLFinal = complementoExtraHTML(id);
  if (nombre === "Tortillas") complementoHTMLFinal = tortillasHTML(id);
  if (nombre === "Aderezo Extra") complementoHTMLFinal = aderezosExtraHTML(id);

  return `
    <div class="col-md-4 mb-3" id="${id}">
      <div class="card h-100">
        <img src="${img}" class="card-img-top">
        <div class="card-body">
          <h5>${nombre}</h5>
          <p class="text-muted">${descripciones[id] || ""}</p>
          <p id="precio-${id}">$${precio}</p>

          ${complementoHTMLFinal}

          <button class="btn btn-danger w-100"
            onclick="agregar('${nombre}', ${precio}, '${id}')">
            Agregar
          </button>
        </div>
      </div>
    </div>`;
}

// ================= MENÚ =================
// ================= MENÚ POLLO =================
document.getElementById("pollo").innerHTML =
  crearProducto("pollo1", "Pollo Entero", 160, "img/1POLLO.jpeg", { complemento: "entero" }) +
  crearProducto("pollo2", "½ Pollo", 80, "img/MEDIOPOLLO.jpeg", { complemento: "medio" });


document.getElementById("costillas").innerHTML =
crearProducto("cos1","Costillas 1 Kg",280,"img/KGCOSTILLA.jpeg",{complemento:"entero"}) +
crearProducto("cos2","½ Kg Costillas",140,"img/MEDIOCOSTILLAS.jpeg",{complemento:"medio"}) +
crearProducto("cos3","¼ Kg Costillas",70,"img/CUARTOCOSTILLAS.jpeg") +
crearProducto("cos4","Orden de Costillas",55,"img/ORDCOSTILLA.jpeg",{aderezo:true});

document.getElementById("longaniza").innerHTML =
crearProducto("lon1","Longaniza 1 Kg",280,"img/KGLONGANIZA.jpeg",{complemento:"entero"}) +
crearProducto("lon2","½ Kg Longaniza",140,"img/MEDIOLONGANIZA.jpeg",{complemento:"medio"}) +
crearProducto("lon3","¼ Kg Longaniza",70,"img/CUARTOLONGANIZA.jpeg");

document.getElementById("alitas").innerHTML =
crearProducto("ali1","Alitas 1 Kg",280,"img/KGALITAS.jpg",{aderezo:true, max:4}) +
crearProducto("ali2","½ Kg Alitas",140,"img/KGALITAS.jpg",{aderezo:true, max:2}) +
crearProducto("ali3","Orden de Alitas",50,"img/ALITAS.jpeg",{aderezo:true, max:1});

document.getElementById("cochinita").innerHTML =
crearProducto("coch1","Cochinita 1 Kg",250,"img/KGCOCHINITA.jpeg") +
crearProducto("coch2","½ Kg Cochinita",130,"img/KGCOCHINITA.jpeg") +
crearProducto("coch3","¼ Kg Cochinita",70,"img/CUARTOCOCHINITA.jpeg");

document.getElementById("promos").innerHTML =
crearProducto("pro1","Pollo  Papas",210,"img/POLLOSQPAPAS.jpeg",{complemento:"medio"}) +
crearProducto("pro2","Súper Pollo",170,"img/SUPERPOLLO.jpeg",{complemento:"medio"}) +
crearProducto("pro3","Pollo + Refresco",190,"img/POLLOREFRESCO.jpeg",{complemento:"entero", refresco:true}) +
crearProducto("pro4","Pollo + Costillas",275,"img/1POLLO.jpeg",{complemento:"entero"}) +
crearProducto("pro5","2 Pollos",275,"img/1POLLO.jpeg",{complemento:"entero"}) +
crearProducto("pro6","Pollo + Longaniza",275,"img/KGLONGANIZA.jpeg",{complemento:"entero"});

document.getElementById("extras").innerHTML =
crearProducto("ext1","Papas Adobadas ½ L",30,"img/PAPASADOBADAS.jpeg") +
crearProducto("ext2","Papas Adobadas 1 L",50,"img/PAPASADOBADAS.jpeg") +
crearProducto("ext3","Papas con Rajas ½ L",30,"img/PAPASRAJAS.jpeg") +
crearProducto("ext4","Papas con Rajas 1 L",50,"img/PAPASRAJAS.jpeg") +
crearProducto("ext5","Ensalada Manzana ½ L",40,"img/ENSALDAMANZANA.jpeg") +
crearProducto("ext6","Ensalada Manzana 1 L",80,"img/LTMANZANA.jpeg") +
crearProducto("ext7","Papas Fritas Caseras",55,"img/BOLASAPAPAS.jpeg",{cantidad:true}) +
crearProducto("ext8","Aderezo Extra",0,"img/ADEREZOS.jpg") +
  crearProducto("ext9","Tortillas",0,"img/TORTILLAS.jpeg",{cantidad:true})  +
crearProducto("ext10","Cebollon Condimentado",15,"img/CEBOLLON.jpeg",{cantidad:true}) +
crearProducto("ext11","Complemento Extra",0,"img/COMPLEMENTO.png")+
crearProducto("ext12","Agua natural de sabor 1L",25,"img/AGUA.JPG")+
crearProducto("ext13","Refresco 2L",35,"img/REFEZCOS.JPG",{refresco:true});
// ================= CARRITO =================
function agregar(nombre, precio, id){
  let texto = nombre;
  let subtotal = precio;

  const tipo = document.getElementById("tipoComp-"+id);
  const c1 = document.getElementById("comp1-"+id);
  const c2 = document.getElementById("comp2-"+id);
  const cMedio = document.getElementById("comp-"+id);

  if (tipo && tipo.value==="uno" && c1)
    texto += " | "+c1.value;

  if (tipo && tipo.value==="mitad" && c1 && c2)
    texto += " | "+c1.value+" y "+c2.value;

  if (cMedio)
    texto += " | "+cMedio.value;
	// ===== SABOR DEL POLLO =====
const sabor = document.getElementById("sabor-"+id);
let extraBana = 0;
if(sabor && sabor.value){
  texto += " | Sabor: " + sabor.value;

  if(sabor.value === "banado"){
    // contar cuántos pollos bañar y sumar $10 por cada uno
    let maxPollos = nombre.includes("2 Pollos") ? 2 : 1;
    for(let i=1; i<=maxPollos; i++){
      const adrB = document.getElementById(`adrBana-${id}-${i}`);
      if(adrB && adrB.value){
        texto += ` | Pollo ${i} bañado con ${adrB.value}`;
        extraBana += 10; // $10 por cada pollo bañado
      }
    }
  }
}

subtotal += extraBana;

// ===== CANTIDAD =====
const cantidadInput = document.getElementById("cantidad-"+id);
let cantidad = 1;
if(cantidadInput) cantidad = parseInt(cantidadInput.value) || 1;

subtotal *= cantidad;
texto += ` | Cantidad: ${cantidad}`;

  const adrs = document.querySelectorAll(`input[name="adr_${id}"]:checked`);
  if(adrs.length > 0){
    const lista = Array.from(adrs).map(a => a.value);
    texto += " | Aderezos: " + lista.join(", ");
  }

  const tamExtra = document.getElementById("tam-"+id);
  if(tamExtra && nombre==="Complemento Extra"){
    const t = tamExtra.value;
    if(t === "medio") subtotal = 30;
    if(t === "litro") subtotal = 50;
    const compExtra = document.getElementById("comp-"+id);
    if(compExtra) texto += " | "+compExtra.value+" ("+t+")";
  }

  const tamTort = document.getElementById("tam-"+id);
const cantTort = document.getElementById("cant-"+id);
if(tamTort && nombre==="Tortillas"){
  const t = tamTort.value;
  const cantidad = parseInt(cantTort.value) || 1;
  let precioBase = 0;
  if(t === "medio") precioBase = 9;
  if(t === "kilo") precioBase = 18;
  subtotal = precioBase * cantidad;
  texto += ` | ${t} x${cantidad}`;

  }
  // ===== REFRESCO =====
const ref = document.getElementById("refresco-"+id);
if(ref && ref.value){
  texto += " | Refresco: " + ref.value;
}

  const adrExtra = document.getElementById("adrExtra-"+id);
  if(adrExtra){
    const seleccionados = Array.from(adrExtra.selectedOptions).map(opt => opt.value);
    if(seleccionados.length > 0){
      texto += " | Aderezos: " + seleccionados.join(", ");
      subtotal = seleccionados.length * 10;
    }
  }
  

  carrito.push({texto, precio:subtotal});
  total += subtotal;
  actualizar();
  mostrarMensaje("Producto agregado ✅");
}

function actualizar(){
  const lista = document.getElementById("carrito");
  lista.innerHTML = "";

  carrito.forEach((p,i)=>{
    lista.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
      ${p.texto} - $${p.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminar(${i})">X</button>
    </li>`;
  });

  document.getElementById("total").innerText = total + envio;
}

function eliminar(i){
  const lista = document.getElementById("carrito").children[i];
  lista.classList.add("eliminar");
  setTimeout(() => {
    total -= carrito[i].precio;
    carrito.splice(i,1);
    actualizar();
    mostrarMensaje("Producto eliminado ❌");
  }, 400);
}


// ================= MENSAJE =================
function mostrarMensaje(texto){
  const msg = document.getElementById("mensaje-agregado");
  msg.innerText = texto;
  msg.classList.add("mostrar");
  setTimeout(() => {
    msg.classList.remove("mostrar");
  }, 1200);
}
// ================= WHATSAPP =================
function enviarWhats(){
  let msg = "Pedido El Super Pollo:\n";

  carrito.forEach(p=>{
    msg += `- ${p.texto} $${p.precio}\n`;
  });

  msg += `\nDistancia: ${km.toFixed(2)} km`;
  msg += `\nCosto de envío: $${envio}`;
  msg += `\nUbicación: ${linkMaps}`;
  msg += `\nTotal: $${total + envio}`;

  const direccion = document.getElementById("direccion").value;
  msg += `\nDirección: ${direccion}`;

  const metodo = document.getElementById("metodoPago").value;
  if(!metodo) return alert("Selecciona método de pago");

  msg += `\nMétodo de pago: ${metodo}`;

  if(metodo === "efectivo"){
    const pago = document.getElementById("pago").value;
    msg += `\nPaga con: $${pago}`;
  }else{
    msg += `\n(Instrucciones de pago se enviarán después)`;
  }

  window.open(`https://wa.me/5212211739094?text=${encodeURIComponent(msg)}`,"_blank");
}

window.addEventListener("load", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((c,i) => {
    setTimeout(() => {
      c.classList.add("aparecer");
    }, i * 100); // efecto escalonado
  });
});
