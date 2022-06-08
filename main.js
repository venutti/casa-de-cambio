// REST API
const API_KEY = "wR4koLbONx0bPczYHAPpVYmniDPQ062j";
const header = new Headers();
header.append("apikey", API_KEY);
const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: header,
};

//GLOBALES
const $botonCalcular = document.querySelector("#conversor button");
const $inputRespuesta = document.querySelector("#input-respuesta");
const $selectOrigen = document.querySelector("#divisa-origen");
const $selectDestino = document.querySelector("#divisa-destino");

$botonCalcular.onclick = calcularConversion;

function cargarSimbolos() {
    fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
        .then(response => response.json())
        .then(result => {
            const simbolos = result["symbols"];
            Object.keys(simbolos).forEach(simbolo => {
                const optionOrigen = document.createElement("option");
                optionOrigen.value = simbolo;
                optionOrigen.textContent = simbolo + " - " +simbolos[simbolo];
                $selectOrigen.appendChild(optionOrigen);

                const optionDestino = document.createElement("option");
                optionDestino.value = simbolo;
                optionDestino.textContent = simbolo + " - " + simbolos[simbolo];
                $selectDestino.appendChild(optionDestino);

                if(simbolo === "ARS") {
                    optionOrigen.setAttribute("selected", "");
                }else if(simbolo === "USD") {
                    optionDestino.setAttribute("selected", "");
                }
            })
        }).catch(error => {
            $inputRespuesta.placeholder = "Ocurrió un ERROR";
            $botonCalcular.setAttribute("disabled", "");
            console.log("Ocurrió un error :c", error);
        });
}

function calcularConversion(evento) {
    if($selectDestino.querySelectorAll("option").length === 0) {
        console.log("Clickeaste antes de tiempo!");
        return false;
    }
    
    const cantidad = validarCantidad(Number(document.querySelector("#cantidad").value));
    const divisaOrigen = $selectOrigen.value;
    const divisaDestino = $selectDestino.value;
    if(!cantidad) {
        $inputRespuesta.placeholder = `${divisaOrigen} 0.00 = ${divisaDestino} 0.00`;
        return false;
    }
    $botonCalcular.setAttribute("disabled", "");
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${divisaDestino}&from=${divisaOrigen}&amount=${cantidad}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const resultado = redondearADosDecimales(Number(result["result"]));
            $inputRespuesta.placeholder = `${divisaOrigen} ${cantidad} = ${divisaDestino} ${resultado}`;
            $botonCalcular.removeAttribute("disabled");
        })
        .catch(error => {
            $botonCalcular.removeAttribute("disabled");
            console.log("Ocurrió un error :c", error);
        });
    return false;
}

function validarCantidad(cantidad) {
    if(cantidad >= 0) {
        return redondearADosDecimales(cantidad);
    }else{
        return 0;
    }
}
function redondearADosDecimales(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

//Consultar los tipos de moneda a la API
cargarSimbolos();
