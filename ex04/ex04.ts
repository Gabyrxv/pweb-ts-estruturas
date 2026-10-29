
export {};

type Formatador = (valor: number) => string;

type ResultadoEconomia = {
  meses: number;
  saldo: number;
  depositado: number;
};

const formatarReal: Formatador = (valor: number): string => {
  return `R$ ${valor.toFixed(2)}`;
};

const formatarMeses = (meses: number): string => {
  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;

  if (anos === 0) {
    return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  }

  if (restoMeses === 0) {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  return `${anos} ${anos === 1 ? "ano" : "anos"} e ` +
    `${restoMeses} ${restoMeses === 1 ? "mês" : "meses"}`;
};

function calcularMeses(
  meta: number,
  deposito: number,
  taxa: number = 0.5
): ResultadoEconomia {
  let saldo = 0;
  let totalDepositado = 0;
  let meses = 0;

  while (saldo < meta) {
    meses++;

    if (meses > 600) {
      break;
    }

    saldo = saldo * (1 + taxa / 100);

    const valorDeposito = meses % 12 === 0
      ? deposito * 2
      : deposito;

    saldo += valorDeposito;
    totalDepositado += valorDeposito;
  }

  return {
    meses,
    saldo,
    depositado: totalDepositado
  };
}

function exibirValor(
  rotulo: string,
  valor: number,
  formatar: Formatador
): string {
  return `${rotulo}: ${formatar(valor)}`;
}

const campoMeta = document.getElementById("meta") as HTMLInputElement;
const campoDeposito = document.getElementById("deposito") as HTMLInputElement;
const campoTaxa = document.getElementById("taxa") as HTMLInputElement;
const botao = document.getElementById("calcular") as HTMLButtonElement;
const resultado = document.getElementById("resultado") as HTMLElement;

botao.addEventListener("click", () => {
  const meta = campoMeta.valueAsNumber;
  const deposito = campoDeposito.valueAsNumber;
  const taxa = campoTaxa.valueAsNumber;

  if (
    campoMeta.value === "" ||
    campoDeposito.value === "" ||
    !Number.isFinite(meta) ||
    !Number.isFinite(deposito) ||
    meta <= 0 ||
    deposito <= 0
  ) {
    resultado.textContent = "Informe valores positivos";
    resultado.className = "erro";
    return;
  }

  if (
    campoTaxa.value !== "" &&
    (!Number.isFinite(taxa) || taxa < 0)
  ) {
    resultado.textContent = "Informe um rendimento válido.";
    resultado.className = "erro";
    return;
  }

  const calculo = campoTaxa.value === ""
    ? calcularMeses(meta, deposito)
    : calcularMeses(meta, deposito, taxa);

  const rendimento = calculo.saldo - calculo.depositado;

  if (calculo.meses > 600 || calculo.saldo < meta) {
    resultado.textContent =
      "Meta inalcançável em 50 anos.\n" +
      exibirValor("Saldo após 600 meses", calculo.saldo, formatarReal);

    resultado.className = "erro";
    return;
  }

  resultado.textContent =
    `Você atinge a meta em ${calculo.meses} meses ` +
    `(${formatarMeses(calculo.meses)}).\n` +
    exibirValor("Saldo final", calculo.saldo, formatarReal) + "\n" +
    exibirValor("Total depositado", calculo.depositado, formatarReal) + "\n" +
    exibirValor("Rendimento", rendimento, formatarReal);

  resultado.className = "sucesso";
});
