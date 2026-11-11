class Caja {
    constructor(nom, inicial) {
        this.nombre = nom;
        this.dinero = inicial;
        this.movimientos = [inicial];
    }

    ingresar(monto) {
        this.dinero += monto;
        this.movimientos.push(monto);
    }

    retirar(monto) {
        this.dinero -= monto;
        this.movimientos.push(-monto);
    }
}

function seleccionarCaja(cajas, accion) {
    if (cajas.length === 0) {
        alert("No hay cajas registradas.");
        return null;
    }

    let lista = cajas.map((caja, index) => `${index + 1}- ${caja.nombre} (Saldo: $${caja.dinero})`).join("\n");

    while (true) {
        let input = prompt(`Seleccione una caja para ${accion}:\n\n${lista}\nIngrese el número (1 al ${cajas.length}) o el nombre exacto de la caja:`);
        if (input === null) return null;

        let entrada = input.trim();

        let numero = parseInt(entrada);
        if (!Number.isNaN(numero) && numero >= 1 && numero <= cajas.length) {
            return cajas[numero - 1];
        }

        let cajaEncontrada = cajas.find(caja => caja.nombre.toLowerCase() === entrada.toLowerCase());
        if (cajaEncontrada) {
            return cajaEncontrada;
        }

        alert("Caja no encontrada. Ingrese un número o nombre válido.");
    }
}

function pedirMontoValido(mensaje) {
    while (true) {
        let input = prompt(mensaje);
        if (input === null) return null;

        let monto = parseFloat(input);
        if (!Number.isNaN(monto) && monto > 0) {
            return monto;
        }
        alert("Por favor, ingrese un monto válido mayor a 0.");
    }
}

function solicitarOpcionMenu(cajas) {
    let saldoTotal = cajas.reduce((acumulado, caja) => acumulado + caja.dinero, 0);

    let opcion = prompt(
        `Cajas activas: ${cajas.length} | Saldo total acumulado: $${saldoTotal}\n\n` +
        `¿Qué operación desea realizar?\n` +
        `1- Ingresar dinero\n` +
        `2- Retirar dinero\n` +
        `3- Movimientos de una caja\n` +
        `4- Listar cajas de ahorro\n` +
        `5- Crear caja\n` +
        `6- Borrar caja\n` +
        `7- Salir`
    );
    return opcion === null ? "7" : opcion;
}

function ingresarDinero(cajas) {
    let caja = seleccionarCaja(cajas, "ingresar dinero");
    if (caja === null) return;

    let monto = pedirMontoValido(`Dinero a ingresar en '${caja.nombre}': $`);
    if (monto === null) {
        alert("Operación cancelada.");
        return;
    }

    caja.ingresar(monto);
    alert(`Has ingresado: $${monto} en la caja '${caja.nombre}'.\nNuevos fondos de la caja: $${caja.dinero}`);
}

function retirarDinero(cajas) {
    let caja = seleccionarCaja(cajas, "retirar dinero");
    if (caja === null) return;

    let monto = pedirMontoValido(`Dinero a retirar de '${caja.nombre}': $`);
    if (monto === null) {
        alert("Operación cancelada.");
        return;
    }

    if (monto <= caja.dinero) {
        caja.retirar(monto);
        alert(`Retiro exitoso de la caja '${caja.nombre}'.\nNuevos fondos de la caja: $${caja.dinero}`);
    } else {
        alert(`No tenés fondos suficientes en '${caja.nombre}' para este retiro.`);
    }
}

function listarMovimientos(cajas) {
    let caja = seleccionarCaja(cajas, "ver movimientos");
    if (caja === null) return;

    let lineasMovimientos = caja.movimientos.map((mov, i) => `${i + 1}° movimiento: $${mov}`);
    alert(`Movimientos de la caja '${caja.nombre}':\n` + lineasMovimientos.join("\n"));
}

function listarCajas(cajas) {
    if (cajas.length === 0) {
        alert("No hay cajas de ahorro registradas.");
        return;
    }

    let lineas = cajas.map((caja, index) =>
        `${index + 1}- Nombre: ${caja.nombre} | Saldo: $${caja.dinero} | Total movimientos: ${caja.movimientos.length}`
    );
    alert("Cajas de ahorro registradas:\n" + lineas.join("\n"));
}

function crearCaja(cajas) {
    let nombre = prompt("Ingrese el nombre de la nueva caja:");
    if (nombre === null || nombre.trim() === "") {
        alert("Operación cancelada. El nombre no puede estar vacío.");
        return;
    }

    nombre = nombre.trim();

    let existe = cajas.some(caja => caja.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        alert("Ya existe una caja con ese nombre.");
        return;
    }

    let inputInicial = prompt(`Monto inicial para la caja '${nombre}' (dejar vacío o 0 si no ingresa dinero):`);
    if (inputInicial === null) {
        alert("Operación cancelada.");
        return;
    }

    let saldoInicial = parseFloat(inputInicial);
    if (Number.isNaN(saldoInicial) || saldoInicial < 0) {
        saldoInicial = 0;
    }

    cajas.push(new Caja(nombre, saldoInicial));
    alert(`¡Caja '${nombre}' creada exitosamente con un saldo de $${saldoInicial}!`);
}

function borrarCaja(cajas) {
    let cajaABorrar = seleccionarCaja(cajas, "borrar");
    if (cajaABorrar === null) return;

    let confirmacion = prompt(`¿Está seguro que desea eliminar la caja '${cajaABorrar.nombre}'?\nEscriba 'SI' para confirmar:`).trim();
    if (confirmacion.toUpperCase() === "SI") {
        let indice = cajas.indexOf(cajaABorrar);
        cajas.splice(indice, 1);
        alert(`La caja '${cajaABorrar.nombre}' fue eliminada.`);
    } else {
        alert("Borrado cancelado.");
    }
}

const cajas = [];
cajas.push(new Caja("ahorro", 0));

let usuarioInput;

do {
    usuarioInput = solicitarOpcionMenu(cajas);

    switch (usuarioInput) {
        case "1":
            ingresarDinero(cajas);
            break;
        case "2":
            retirarDinero(cajas);
            break;
        case "3":
            listarMovimientos(cajas);
            break;
        case "4":
            listarCajas(cajas);
            break;
        case "5":
            crearCaja(cajas);
            break;
        case "6":
            borrarCaja(cajas);
            break;
        case "7":
            alert("¡Gracias por ser usuario de nuestro banco!");
            break;
        default:
            alert("Opción inválida. Por favor, elija una opción válida.");
            break;
    }
} while (usuarioInput !== "7");
