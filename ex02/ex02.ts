export {};

type TipoCliente = "residencial" | "rural" | "comercial" | "industrial";
type Bandeira = "verde" | "amarela" | "vermelha1" | "vermelha2";

function tarifaPorCliente(tipo: TipoCliente): number {
  switch (tipo) {
    case "residencial":
    case "rural":
      return 0.80;

    case "comercial":
    case "industrial":
      return 0.95;
  }
}

function adicionalBandeira(
  consumo: number,
  bandeira: Bandeira = "verde"
): number {
  switch (bandeira) {
    case "verde":
      return consumo * 0;

    case "amarela":
      return consumo * 0.02;

    case "vermelha1":
      return consumo * 0.04;

    case "vermelha2":
      return consumo * 0.08;
  }
}

function nomeBandeira(bandeira: Bandeira = "verde"): string {
  switch (bandeira) {
    case "verde":
      return "Verde";
    case "amarela":
      return "Amarela";
    case "vermelha1":
      return "Vermelha 1";
    case "vermelha2":
      return "Vermelha 2";
    default:
      return "Verde";
  }
}

const campoConsumo = document.getElementById("consumo") as HTMLInputElement;
const campoTipo = document.getElementById("tipoCliente") as HTMLSelectElement;
const campoBandeira = document.getElementById("bandeira") as HTMLSelectElement;
const botao = document.getElementById("calcular") as HTMLButtonElement;
const resultado = document.getElementById("resultado") as HTMLElement;

botao.addEventListener("click", () => {
  const consumo = campoConsumo.valueAsNumber;
  const tipo = campoTipo.value as TipoCliente;
  const bandeira = campoBandeira.value as Bandeira;

  if (campoConsumo.value === "" || !Number.isFinite(consumo) || consumo <= 0) {
    resultado.textContent = "Informe um consumo válido, maior que zero.";
    resultado.className = "erro";
    return;
  }

  const tarifa = tarifaPorCliente(tipo);
  const valorConsumo = consumo * tarifa;
  const adicional = adicionalBandeira(consumo, bandeira);
  const total = valorConsumo + adicional;

  resultado.textContent =
    `Consumo: ${consumo.toFixed(1)} kWh\n` +
    `Tipo de cliente: ${tipo}\n` +
    `Bandeira: ${nomeBandeira(bandeira)}\n` +
    `Valor do consumo: R$ ${valorConsumo.toFixed(2)}\n` +
    `Adicional da bandeira: R$ ${adicional.toFixed(2)}\n` +
    `Total da conta: R$ ${total.toFixed(2)}`;

  resultado.className = bandeira === "verde" ? "sucesso" : "alerta";
});

console.log(adicionalBandeira(100));
// Sem informar a bandeira, o parâmetro opcional usa "verde", cujo adicional é zero.
