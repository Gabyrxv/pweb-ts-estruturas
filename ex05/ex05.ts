export {};

type Formatador = (valor: number) => string;

const formatarReal: Formatador = (valor: number): string => {
  return `R$ ${valor.toFixed(2)}`;
};

function lerPrecos(texto: string): {
  precos: number[];
  ignorados: number;
} {
  const linhas = texto.split("\n");
  const precos: number[] = [];
  let ignorados = 0;

  for (const linha of linhas) {
    const textoPreco = linha.trim();

    if (textoPreco === "") {
      continue;
    }

    const preco = Number(textoPreco.replace(",", "."));

    if (!Number.isFinite(preco) || preco <= 0) {
      ignorados++;
      continue;
    }

    if (precos.length >= 20) {
      break;
    }

    precos.push(preco);

    if (precos.length === 20) {
      break;
    }
  }

  return { precos, ignorados };
}

function somarItens(...precos: number[]): number {
  let total = 0;

  for (const preco of precos) {
    total += preco;
  }

  return total;
}

function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;

function calcularDesconto(
  total: number,
  desconto: number | string
): number {
  if (typeof desconto === "number") {
    return total * desconto / 100;
  }

  switch (desconto.toUpperCase()) {
    case "BEMVINDO":
      return total * 0.10;

    case "PROMO20":
      return total * 0.20;

    case "MENOS15":
      return total >= 100 ? 15 : 0;

    default:
      return 0;
  }
}

const campoItens = document.getElementById("itens") as HTMLTextAreaElement;
const campoCupom = document.getElementById("cupom") as HTMLInputElement;
const campoFidelidade = document.getElementById("fidelidade") as HTMLInputElement;
const botao = document.getElementById("fechar") as HTMLButtonElement;
const resultado = document.getElementById("resultado") as HTMLElement;

botao.addEventListener("click", () => {
  const leitura = lerPrecos(campoItens.value);
  const precos = leitura.precos;
  const ignorados = leitura.ignorados;

  if (precos.length === 0) {
    resultado.textContent = "Nenhum item válido";
    resultado.className = "erro";
    return;
  }

  const subtotal = somarItens(...precos);
  const cupomDigitado = campoCupom.value.trim();
  let descontoCupom = 0;
  let mensagemCupom = "";

  if (cupomDigitado !== "") {
    const cupom = cupomDigitado.toUpperCase();

    if (cupom === "BEMVINDO" || cupom === "PROMO20") {
      descontoCupom = calcularDesconto(subtotal, cupom);
      mensagemCupom =
        `Cupom ${cupom}: - ${formatarReal(descontoCupom)}`;
    } else if (cupom === "MENOS15" && subtotal >= 100) {
      descontoCupom = calcularDesconto(subtotal, cupom);
      mensagemCupom =
        `Cupom ${cupom}: - ${formatarReal(descontoCupom)}`;
    } else {
      mensagemCupom = "Cupom inválido ou não aplicável";
    }
  }

  const valorAposCupom = subtotal - descontoCupom;
  const descontoFidelidade = campoFidelidade.checked
    ? calcularDesconto(valorAposCupom, 5)
    : 0;

  const totalPagar = valorAposCupom - descontoFidelidade;

  let textoResultado = `Itens: ${precos.length}`;

  if (ignorados > 0) {
    textoResultado += ` (${ignorados} linha${ignorados === 1 ? "" : "s"} ignorada${ignorados === 1 ? "" : "s"})`;
  }

  textoResultado +=
    "\n" + `Subtotal: ${formatarReal(subtotal)}`;

  if (cupomDigitado !== "") {
    textoResultado +=
      "\n" + (
        mensagemCupom === "Cupom inválido ou não aplicável"
          ? mensagemCupom
          : mensagemCupom
      );
  }

  if (campoFidelidade.checked) {
    textoResultado +=
      "\n" + `Fidelidade (5%): - ${formatarReal(descontoFidelidade)}`;
  }

  textoResultado +=
    "\n" + `Total a pagar: ${formatarReal(totalPagar)}`;

  resultado.textContent = textoResultado;
  resultado.className = "sucesso";
});
