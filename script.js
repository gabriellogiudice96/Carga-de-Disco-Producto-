'use strict';

let discos = [];

//ejecutar buscador
function ejecutarBuscador() {
    let buscadorForm = document.getElementById('buscador-form');
    let buscadorValue = document.getElementById('buscador').value;
    let mostrarResultado = document.getElementById('mostrar-resultado');
    let mostrarTitulo = document.getElementById('mostrar-titulo');
    let mostrarErrores = document.getElementById('mostrar-errores');
    let errores = [];
    //validar value (debe ser un Number, no puede estar vacio, debe coincidir con id de disco)
    if (buscadorValue == '' || isNaN(buscadorValue) == true) {
        errores.push('Debe ingresar un codigo de identificacion valido');
    } else if (buscadorValue < 1 || buscadorValue > 999) {
        errores.push('Los codigos de identificacion van del 1 al 999');
    }
    if (errores.length != 0) {
        mostrarErrores.innerHTML = '';
        mostrarTitulo.innerHTML = 'Se ha producido un error en la busqueda...'
        for (let i = 0; i < errores.length; i++) {
            const error = errores[i];
            mostrarErrores.innerHTML = `
                <li class='list-group-item text-danger'>${error}</li>
            `;
        }
        buscadorForm.reset();
    } else {
        let resultado = buscarPorId(buscadorValue);
        mostrarErrores.innerHTML = '';
        if (resultado == undefined) {
            mostrarResultado.innerHTML = `<p>No se encontro ningun disco con el codigo de identificacion: <strong>${buscadorValue}</strong></p>`;
        } else {
            mostrarTitulo.innerHTML = '';
            mostrarResultado.innerHTML = `
                                <h2 class="accordion-header">
                                ${resultado.nombre}
                                </h2>
                                
                                <div class="accordion-body">
                                Autor: 
                                <strong>${resultado.autor}</strong>
                                <br />
                                <p>Codigo de identificacion: <strong>${
                                    resultado.id
                                }</strong></p>
                                <p>Total de pistas: <strong>${
                                    resultado.calculos.totalPistas
                                }</strong></p>
                                <p>Duracion del disco: <strong>${
                                    resultado.calculos.totalDuracion
                                }</strong></p>
                                <p>Promedio de duracion de pistas: <strong>${
                                    resultado.calculos.promedioDuracion
                                }</strong></p>
                                <p>Duracion de pista mas larga: <strong>${
                                    resultado.calculos.pistaMasLarga
                                }</strong></p>
                                <p class="mb-1">Pistas:</p>
                                <ul class="list-group mb-3" id="lista-de-pistas">
                                ${generarLista(resultado.pistas)}
                                </ul>
                                </div>
                                `;
        }
        buscadorForm.reset();
    }
}

//funcion para buscar por id
function buscarPorId(id) {
    let resultado;
    for (let i = 0; i < discos.length; i++) {
        const idDisco = discos[i].id;
        if (id == idDisco) {
            resultado = discos[i];
        }
    }
    return resultado;
}

//Procesar formulario para cargar disco
function cargarDisco() {
    //aca se almacenan los errores
    let errores = [];
    //validacones de datos
    let nombreDisco = document.getElementById('nombre-disco').value;
    if (nombreDisco == '') {
        errores.push('el disco debe tener un nombre');
    }
    let autorDisco = document.getElementById('autor-disco').value;
    if (autorDisco == '') {
        errores.push('el disco debe tener un autor');
    }
    let idDisco = document.getElementById('id-disco').value;
    let idCoincide = buscarPorId(idDisco);
    if (idDisco == '') {
        errores.push('el disco debe tener un codigo de identificacion');
    } else {
        if (idDisco <= 999 && idDisco >= 1) {
            if (idCoincide != undefined) {
                errores.push('el codigo de identificacion ya esta en uso');
            }
        } else {
            errores.push("el codigo de identificacion no puede tener mas de 3 digitos");
        }
    }
    //si hay errores
    if (errores.length != 0) {
        for (let i = 0; i < errores.length; i++) {
            const error = errores[i];
            alert( error );
        }
        alert( "error en la carga del disco, vuelva a intentarlo..." );
    }else {
        let pistas = cargarPistas();
        let nuevoDisco = {
            nombre: nombreDisco,
            autor: autorDisco,
            id: idDisco,
            pistas: pistas,
            calculos: {
                totalPistas: pistas.length,
                totalDuracion: totalDuracion(pistas),
                promedioDuracion: parseInt(promedioDuracion(pistas)),
                pistaMasLarga: pistaMasLarga(pistas),
            },
        };
        discos.push(nuevoDisco);
        // TODO: solucionar error "los inputs quedan completos despues de enviar"
        document.getElementById('modal-form').reset();
        totalDiscos();
    }
}
//Carga las pistas en un array
function cargarPistas() {
    let pistas = [];
    let nombre, duracion;
    do {
        do {
            nombre = prompt('ingrese el nombre de la pista');
            if (nombre == "") {
                alert("la pista debe tener un nombre");
            }
        } while (nombre == "");
        do {
            duracion = parseInt(prompt('ingrese la duracion de la pista'));
            if (isNaN(duracion) || duracion == 0) {
                alert("la pista debe tener una duracion asignada");
            }else if (duracion > 7200) {
                alert("la duracion de la pista debe ser menor a 7200 segundos");
            }
        } while ( !(!isNaN(duracion) && (duracion <= 7200 && duracion > 0)) );
        pistas.push({
            nombre: nombre,
            duracion: duracion,
        });
        if (pistas.length == 0) {
            alert('debe ingresar al menos una pista');
        }
    } while (confirm('desea agregar otra pista?'));
    return pistas;
}
//Calculos de informacion de pistas
function totalDuracion(pistas) {
    let resultado = 0; 
    for (let i = 0; i < pistas.length; i++) {
        const duracion = pistas[i].duracion;
        resultado += duracion;
    }
    return resultado;
}
function promedioDuracion(pistas) {
    let sumaDuracion = 0;
    let contador = 0;
    for (let i = 0; i < pistas.length; i++) {
        contador++
        const duracion = pistas[i].duracion;
        sumaDuracion += duracion;
    }
    return sumaDuracion / contador;
}
function pistaMasLarga(pistas) {
    let max = 0;
    for (let i = 0; i < pistas.length; i++) {
        const duracion = pistas[i].duracion;
        if (duracion > max) {
            max = duracion;
        }
    }
    return max;
}

//Mostrar todos los discos
function mostrarDiscos() {
    let listado = document.getElementById('accordionExample');
    // TODO: Calcular la pista mas larga y marcarla en rojo
    let max;
    listado.innerHTML = '';
    for (let i = 0; i < discos.length; i++) {
        const disco = discos[i];
        listado.innerHTML += `
        <div class="accordion-item" id="cancion-${disco.id}">
        <h2 class="accordion-header">
        <button
        class="accordion-button collapsed"
        type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse${disco.id}"
                                aria-expanded="false"
                                aria-controls="collapse${disco.id}"
                                >
                                ${disco.nombre}
                                </button>
                                </h2>
                                <div
                                id="collapse${disco.id}"
                                class="accordion-collapse collapse"
                                data-bs-parent="#accordionExample"
                                >
                                <div class="accordion-body">
                                Autor: 
                                <strong>${disco.autor}</strong>
                                <br />
                                <p>Codigo de identificacion: <strong>${
                                    disco.id
                                }</strong></p>
                                <p>Total de pistas: <strong>${
                                    disco.calculos.totalPistas
                                }</strong></p>
                                <p>Duracion del disco: <strong>${
                                    disco.calculos.totalDuracion
                                }</strong></p>
                                <p>Promedio de duracion de pistas: <strong>${
                                    disco.calculos.promedioDuracion
                                }</strong></p>
                                <p>Duracion de pista mas larga: <strong>${
                                    disco.calculos.pistaMasLarga
                                }</strong></p>
                                <p class="mb-1">Pistas:</p>
                                <ul class="list-group mb-3" id="lista-de-pistas">
                                ${generarLista(disco.pistas)}
                                </ul>
                                <button type="button" class="btn btn-danger" onclick="borrarDisco(${
                                    disco.id
                                })">
                                Delete
                                </button>
                                </div>
                                </div>
                                </div>
                                `;
    }
    totalDiscos();
}
// funcion para generar la lista de pistas en cada disco
function generarLista(dato) {
    let resultado = '';
    for (let i = 0; i < dato.length; i++) {
        const pista = dato[i];
        resultado += `
        <li
        class="list-group-item d-flex justify-content-between align-items-center"
        >
        ${pista.nombre}
        <span class="badge ${ pista.duracion > 180 ? 'bg-danger' : 'bg-primary'} rounded-pill"
        >${pista.duracion + ' segundos'}
        </span>
        </li>
        `;
    }
    return resultado;
}

//borrar disco
function borrarDisco(discoId) {
    for (let i = 0; i < discos.length; i++) {
        const disco = discos[i];
        if (disco.id == discoId) {
            let idBorrar = discos.indexOf(disco);
            discos.splice(idBorrar, 1);
        }
    }
    totalDiscos();
    mostrarDiscos();
}

//Mantiene el total de discos actualizados
function totalDiscos() {
    let totalDiscos = document.getElementById('total-discos');
    totalDiscos.innerHTML = discos.length;
}
