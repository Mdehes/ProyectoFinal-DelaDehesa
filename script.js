//Simulador Tienda de Objetos MMORPG "Tienda de las Rarezas".
header.innerText = "";
//Bienvenida a la pagina.
//Recopilacion de datos del usuario, almacenamiento en localStorage.
titulo.innerText = "Tienda de las Rarezas";
const bienvenidaUsuario = document.getElementById("bienvenidaUsuario");
const nombreInicial = localStorage.getItem("nombreUsuario");
bienvenidaUsuario.innerText = `Bienvenido a la Tienda de las Rarezas!\n ${
nombreInicial ? nombreInicial : `Dime tu nombre aventurero..`
}`;
const formulario = document.getElementById("formulario");
if (nombreInicial) {
    formulario.remove();
}
const guardarNombre = (event) => {
    event.preventDefault();
    const input = document.getElementById("inputNombre");
    const nombre = input.value;
    localStorage.setItem("nombreUsuario", nombre);
    bienvenidaUsuario.innerText = `Bienvenido a la Tienda de las Rarezas!\n ${nombre}`;
    formulario.remove();
};
//Construccion de usuario.
const DEFAULT_ORO = 200;
const DEFAULT_CAPACIDAD = 60;
const DEFAULT_VIDA = 100;
const DEFAULT_ATAQUE = 10;
const DEFAULT_CRITICO = 0.05;
const DEFAULT_DEFENSA = 5;
class Usuario {
    constructor(nombre) {
        (this.id = 0),
        (this.nombre = nombre),
        (this.nivel = null),
        (this.vida = DEFAULT_VIDA),
        (this.ataqueBasico = DEFAULT_ATAQUE),
        (this.probabilidadCritico = DEFAULT_CRITICO),
        (this.defensaInicial = DEFAULT_DEFENSA),
        (this.inventario = []),
        (this.objetosEquipados = []),
        (this.capacidadInventario = DEFAULT_CAPACIDAD),
        (this.balanceOro = DEFAULT_ORO);
    }
}
let usuario = new Usuario("NombreUsuario");
const contenedorDatos = document.getElementById("contenedorDatos");
const contenedorEstadisticas = document.getElementById(
    "contenedorEstadisticas"
);

inicializarUsuario();
inicializarInventario();
mostrarDatos();
mostrarEstadisticas();

function inicializarUsuario() {
    if (nombreInicial) {
        usuario = new Usuario(nombreInicial);
    }
    const datosUsuario = localStorage.getItem("datosUsuario");
    if (datosUsuario) {
        const datosUsuarioJson = JSON.parse(datosUsuario);
        const [nivel, balanceOro, capacidadInventario] = datosUsuarioJson;
        usuario.nivel = nivel;
        usuario.balanceOro = balanceOro;
        usuario.capacidadInventario = capacidadInventario;
    }
    const estadisticasUsuario = localStorage.getItem("estadisticasUsuario");
    if (estadisticasUsuario) {
        const estadisticasUsuarioJson = JSON.parse(estadisticasUsuario);
        const [vida, ataque, critico, defensa] = estadisticasUsuarioJson;
        usuario.vida = vida;
        usuario.ataqueBasico = ataque;
        usuario.probabilidadCritico = critico;
        usuario.defensaInicial = defensa;
    }
}

function mostrarDatos() {
    const {
        nivel,
        balanceOro,
        capacidadInventario
    } = usuario;
    datosUsuario = [nivel, balanceOro, capacidadInventario];
    contenedorDatos.innerHTML = "";
    const labels = ["Nivel", "Oro", "Capacidad de Inventario"];
    datosUsuario.forEach((dato, index) => {
        const p = document.createElement("p");
        p.innerText = `${labels[index]}: ${dato}`;
        contenedorDatos.appendChild(p);
    });
}

function mostrarEstadisticas() {
    const {
        vida,
        ataqueBasico,
        probabilidadCritico,
        defensaInicial
    } = usuario;
    const estadisticasUsuario = [
        vida,
        ataqueBasico,
        probabilidadCritico,
        defensaInicial,
    ];
    contenedorEstadisticas.innerHTML = "";
    const labels = ["Vida", "Ataque", "Probabilidad de Crítico", "Defensa"];
    estadisticasUsuario.forEach((dato, index) => {
        const p = document.createElement("p");
        p.innerText = `${labels[index]}: ${dato}`;
        contenedorEstadisticas.appendChild(p);
    });
}

function borrarLocalStorage() {
    localStorage.clear();
    Toastify({
        text: "LocalStorage borrado correctamente",
        duration: 1500, 
        gravity: "bottom", 
        position: "right",
        backgroundColor: "#FF7B54",
        style: {
            color: "black",
        },
        stopOnFocus: true
    }).showToast();
    borrarInventario();
}
//Construccion de Inventario.
function inicializarInventario() {
    let equipadosString = localStorage.getItem("objetosEquipados");
    let equipadosJson = JSON.parse(equipadosString);
    if (equipadosString) {
        usuario.objetosEquipados = equipadosJson.equipados;
        usuario.inventario = equipadosJson.inventario;
    }
    mostrarInventario();
    mostrarObjetosEquipados();
}

function mostrarInventario() {
    contenedorInventario.innerHTML = "";
    const mensaje =
        usuario.inventario.length === 0 ? document.createElement("p") : null;
    if (mensaje) mensaje.innerText = "El inventario está vacío.";
    mensaje && contenedorInventario.appendChild(mensaje);
    usuario.inventario.forEach((objeto) => {
        const div = document.createElement("div");
        div.id = objeto.id;
        div.innerHTML = `<img src="" alt="">
                        <p>${objeto.nombre}</p>
                        <p>${objeto.pasiva}</p>
                        <p>${objeto.elemento}</p>
                        <p>${objeto.categoria}</p>
                        <button class="mensajeEquipar" data-objeto-nombre="${objeto.nombre}" onclick="equiparObjeto(${objeto.id})">Equipar</button>`;
        contenedorInventario.appendChild(div);
    });

    const botonEquipar = document.querySelectorAll(".mensajeEquipar");

    function mostrarToast(event) {
        const boton = event.target;
        const objetoNombre = boton.getAttribute("data-objeto-nombre");
        const mensaje = "Equipando objeto " + objetoNombre;
        Toastify({
            text: mensaje,
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#D6D5A8",
            style: {
                color: "black",
            },
        }).showToast();
        setTimeout(() => {
            const segundoMensaje = objetoNombre + " equipado.";
            Toastify({
                text: segundoMensaje,
                duration: 1500,
                gravity: "top",
                position: "right",
                backgroundColor: "#7AA874",
                style: {
                    color: "black",
                },
            }).showToast();
        }, 1000);
    }
    botonEquipar.forEach((boton) => {
        boton.addEventListener("click", mostrarToast);
    });
}

function guardarInventario() {
    const inventario = {
        equipados: usuario.objetosEquipados,
        inventario: usuario.inventario,
    };
    const inventarioString = JSON.stringify(inventario);
    localStorage.setItem("objetosEquipados", inventarioString);
}

function borrarInventario() {
    usuario.inventario = [];
    usuario.objetosEquipados = [];
    usuario.balanceOro = DEFAULT_ORO;
    usuario.capacidadInventario = DEFAULT_CAPACIDAD;
    usuario.vida = DEFAULT_VIDA;
    usuario.ataqueBasico = DEFAULT_ATAQUE;
    usuario.probabilidadCritico = DEFAULT_CRITICO;
    usuario.defensaInicial = DEFAULT_DEFENSA;
    localStorage.removeItem("objetosEquipados");
    localStorage.removeItem("inventario");
    mostrarDatos();
    inicializarTienda();
    mostrarEstadisticas();
    mostrarInventario();
    mostrarObjetosEquipados();

    Toastify({
        text: "Tu inventario está vacío.",
        duration: 1500,
        gravity: "top",
        position: "right",
        backgroundColor: "#333",
        style: {
            color: "white",
        },
    }).showToast();

    Toastify({
        text: "Ya no tienes objetos equipados.",
        duration: 1500,
        gravity: "top",
        position: "right",
        backgroundColor: "#333",
        style: {
            color: "white",
        },
    }).showToast();
}

function equiparObjeto(objetoId) {
    const objeto = usuario.inventario.find((obj) => obj.id === objetoId);
    if (!objeto) {
        alert("El objeto seleccionado no está disponible en el inventario.");
        return;
    }
    if (usuario.objetosEquipados.length >= 2) {
        alert("Ya tienes el máximo de objetos equipados.");
        return;
    }
    usuario.objetosEquipados.push(objeto);
    usuario.vida += objeto.aumentoVida;
    usuario.ataqueBasico += objeto.ataqueBasico;
    usuario.probabilidadCritico += objeto.probabilidadCritico;
    usuario.defensaInicial += objeto.defensa;
    const indiceObjeto = usuario.inventario.findIndex(
        (obj) => obj.id === objetoId
    );
    if (indiceObjeto !== -1) {
        usuario.inventario.splice(indiceObjeto, 1);
    }
    const divTienda = document.getElementById(objeto.id);
    if (divTienda) {
        divTienda.remove();
    }
    localStorage.setItem(
        "estadisticasUsuario",
        JSON.stringify([
            usuario.vida,
            usuario.ataqueBasico,
            usuario.probabilidadCritico,
            usuario.defensaInicial,
        ])
    );
    mostrarObjetosEquipados();
    mostrarEstadisticas();
    mostrarInventario();
    guardarInventario();
}

function mostrarObjetosEquipados() {
    const contenedorEquipados = document.getElementById(
        "contenedorObjetosEquipados"
    );
    contenedorEquipados.innerHTML = "";
    usuario.objetosEquipados.forEach((objeto) => {
        const div = document.createElement("div");
        div.id = objeto.id;
        div.innerHTML = `<img src="" alt="">
                        <p>${objeto.nombre}</p>
                        <p>${objeto.pasiva}</p>
                        <p>${objeto.elemento}</p>
                        <p>${objeto.categoria}</p>`;
        contenedorEquipados.appendChild(div);
    });
}
//Construccion de Tienda.
class Objeto {
    constructor(
        id,
        nombre,
        elemento,
        categoria,
        tipoAtaque,
        tipoDefensa,
        ataqueBasico,
        defensa,
        probabilidadCritico,
        aumentoVida,
        pasiva,
        peso,
        precio
    ) {
        this.id = id;
        this.nombre = nombre;
        this.elemento = elemento;
        this.categoria = categoria;
        this.tipoAtaque = tipoAtaque;
        this.tipoDefensa = tipoDefensa;
        this.ataqueBasico = ataqueBasico;
        this.defensa = defensa;
        this.probabilidadCritico = probabilidadCritico;
        this.aumentoVida = aumentoVida;
        this.pasiva = pasiva;
        this.peso = peso;
        this.precio = precio;
    }
}
//Construccion de objetos.
const latigodelDruida = new Objeto(
    1,
    "El Latigo del Druida",
    "Madera",
    "Ataque",
    "Magico",
    null,
    15,
    0,
    0.1,
    10,
    "Alma Salvaje: este arma aumenta la efectividad de las habilidades de invocación y control de animales.",
    15,
    75
);
const mantoDeHojas = new Objeto(
    2,
    "El Manto de Hojas",
    "Madera",
    "Defensa",
    null,
    "Resistencia Magica",
    0,
    25,
    0.0,
    50,
    "Simbiosis: esta vestimenta tiene la habilidad de otorgar a su poseedor un vínculo simbiótico con el entorno natural, lo que le otorga un aumento de velocidad en la regeneración de vida.",
    30,
    100
);
const guanteDelMinero = new Objeto(
    3,
    "El Guante del Minero",
    "Metal",
    "Ataque",
    "Fisico",
    null,
    20,
    0,
    0.12,
    0,
    "Buscador de tesoros: aumento en la probabilidad de encontrar objetos raros o valiosos, como gemas o minerales especiales, lo que permite al personaje obtener recursos más valiosos y útiles.",
    25,
    90
);
const hombrerasDeLaMontaña = new Objeto(
    4,
    "Las Hombreras de la Montaña",
    "Metal",
    "Defensa",
    null,
    "Dureza Fisica",
    0,
    50,
    0.0,
    0,
    "Resistencia férrea: cuando tengas menos del 10% de salud, aumentara considerablemente la resistencia del personaje a ataques físicos.",
    35,
    120
);
const objetos = [
    latigodelDruida,
    mantoDeHojas,
    guanteDelMinero,
    hombrerasDeLaMontaña,
];

inicializarTienda();

function inicializarTienda() {
    const inventarioUsuario = usuario.inventario;
    contenedorObjetos.innerHTML = "";
    objetos.forEach((objeto) => {
        if (!inventarioUsuario.some((obj) => obj.id === objeto.id)) {
            const div = document.createElement("div");
            div.id = objeto.id;
            div.innerHTML = `<img src="" alt="">
                    <p>${objeto.nombre}</p>
                    <p>${objeto.pasiva}</p>
                    <p>${objeto.elemento}</p>
                    <p>${objeto.categoria}</p>
                    <button id="mensajeComprar" onclick="comprarObjeto(${objeto.id})">Adquirir objeto por ${objeto.precio} de Oro</button>`;
            contenedorObjetos.appendChild(div);
        }
    });

    const botonCompra = document.querySelectorAll("#mensajeComprar");

    function mostrarToast(event) {
        const boton = event.target;
        const objetoId = boton.parentNode.id;
        const objeto = objetos.find((obj) => obj.id === objetoId);
        const mensaje = `Adquiriendo objeto ${objeto.nombre} por ${objeto.precio} de Oro`;
        Toastify({
            text: mensaje,
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#D6D5A8",
            style: {
                color: "black",
            },
        }).showToast();
    }
    botonCompra.forEach((boton) => {
        boton.addEventListener("click", mostrarToast);
    });
}

function comprarObjeto(objetoId) {
    const objeto = objetos.find((obj) => obj.id === objetoId);
    if (!objeto) {
        Toastify({
            text: "El objeto seleccionado no está disponible en la tienda.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#D6D5A8",
            style: {
                color: "black",
            },
        }).showToast();
    } else if (usuario.capacidadInventario < objeto.peso) {
        Toastify({
            text: "Recuerda que no solo debes pagarlo, también debes tener espacio en tu inventario para cargarlo.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#E08E6D",
            style: {
                color: "black",
            },
        }).showToast();
    } else if (usuario.balanceOro < objeto.precio) {
        Toastify({
            text: "No tienes suficiente oro para comprar este objeto.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#E08E6D",
            style: {
                color: "black",
            },
        }).showToast();
    } else if (usuario.inventario.some((obj) => obj.id === objeto.id)) {
        Toastify({
            text: "Ya tienes este objeto en tu inventario.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#E08E6D",
            style: {
                color: "black",
            },
        }).showToast();
    } else {
        usuario.balanceOro -= objeto.precio;
        usuario.capacidadInventario -= objeto.peso;
        usuario.inventario.push(objeto);
        Toastify({
            text: `Has comprado ${objeto.nombre} por ${objeto.precio} de Oro.`,
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "#D6D5A8",
            style: {
                color: "black",
            },
        }).showToast();
        const div = document.getElementById(objeto.id);
        div.remove();
        const datosUsuarioArray = [
            usuario.nivel,
            usuario.balanceOro,
            usuario.capacidadInventario,
        ];
        localStorage.setItem("datosUsuario", JSON.stringify(datosUsuarioArray));
        guardarInventario();
        mostrarInventario();
        mostrarDatos();
    }
}

//Modo nocturno.
const botonDark = document.getElementById("btnfondo");
const setDark = () => document.body.classList.toggle("dark");
botonDark.addEventListener("click", () => {
    setDark();
    const modo = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("modo", modo);
});
inicializarModoNocturno();

function inicializarModoNocturno() {
    const modo = localStorage.getItem("modo");
    console.log(modo);
    if (modo === "dark") {
        setDark();
    }
}