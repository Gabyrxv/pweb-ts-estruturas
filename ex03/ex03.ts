export {};

function calcularTotal(valor: number, parcelas: number): number {
  if (parcelas <= 3) {
    return valor;
  }

  return valor * 1.02 ** parcelas;
}

function simularParcelamento(preco: number, entrada?: number): string {
  let valorEntrada = 0;

  if (typeof entrada !== "undefined") {
    valorEntrada = entrada;
  }

  const financiado = preco - valorEntrada;
  let linhas = "";

  for (let parcelas = 1; parcelas <= 12; parcelas++) {
    if (parcelas === 7 || parcelas === 8 || parcelas === 9 || parcelas === 11) {
      continue;
    }

    const total = calcularTotal(financiado, parcelas);
    const valorParcela = total / parcelas;

    if (valorParcela < 50) {
      break;
    }

    const juros = parcelas <= 3 ? "sem juros" : "2% a.m.";

    linhas +=
      `<tr>` +
      `<td>${parcelas}x</td>` +
      `<td>R$ ${valorParcela.toFixed(2)}</td>` +
      `<td>R$ ${total.toFixed(2)}</td>` +
      `<td>${juros}</td>` +
      `</tr>`;
  }

  return linhas;
}

const campoPreco = document.getElementById("preco") as HTMLInputElement;
const campoEntrada = document.getElementById("entrada") as HTMLInputElement;
const botao = document.getElementById("simular") as HTMLButtonElement;
const resultado = document.getElementById("resultado") as HTMLElement;
const corpoTabela = document.getElementById("parcelas") as HTMLTableSectionElement;

botao.addEventListener("click", () => {
  const preco = campoPreco.valueAsNumber;
  const entradaTexto = campoEntrada.value;
  const entrada = campoEntrada.valueAsNumber;

  corpoTabela.innerHTML = "";

  if (campoPreco.value === "" || !Number.isFinite(preco) || preco <= 0) {
    resultado.textContent = "Informe um preço válido.";
    resultado.className = "erro";
    return;
  }

  if (entradaTexto !== "" && (!Number.isFinite(entrada) || entrada < 0)) {
    resultado.textContent = "Informe uma entrada válida.";
    resultado.className = "erro";
    return;
  }

  if (entradaTexto !== "" && entrada >= preco) {
    resultado.textContent =
      "A entrada cobre o valor total. Não há parcelas.";
    resultado.className = "alerta";
    return;
  }

  let linhas: string;

  if (entradaTexto === "") {
    linhas = simularParcelamento(preco);
  } else {
    linhas = simularParcelamento(preco, entrada);
  }

  const valorFinanciado = entradaTexto === "" ? preco : preco - entrada;

  resultado.textContent =
    `Preço do produto: R$ ${preco.toFixed(2)}\n` +
    `Valor da entrada: R$ ${(entradaTexto === "" ? 0 : entrada).toFixed(2)}\n` +
    `Valor financiado: R$ ${valorFinanciado.toFixed(2)}`;

  resultado.className = "sucesso";
  corpoTabela.innerHTML = linhas;
});
