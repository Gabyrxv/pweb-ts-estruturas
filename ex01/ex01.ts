
export {};

function calcularMedia(n1: number, n2: number): number {
  return (n1 + n2) / 2;
}

function dadosValidos(
  n1: number,
  n2: number,
  frequencia: number
): boolean {
  return (
    n1 >= 0 &&
    n1 <= 10 &&
    n2 >= 0 &&
    n2 <= 10 &&
    frequencia >= 0 &&
    frequencia <= 100
  );
}

function situacao(media: number, frequencia: number): string {
  if (frequencia < 75) {
    return "Reprovado por falta";
  } else if (media >= 7) {
    return "Aprovado";
  } else if (media >= 4) {
    return `Exame final. Precisa tirar ${(
      10 - media
    ).toFixed(1)} pontos no exame`;
  } else {
    return "Reprovado por nota";
  }
}

const campoNome = document.getElementById("nome") as HTMLInputElement;
const campoN1 = document.getElementById("n1") as HTMLInputElement;
const campoN2 = document.getElementById("n2") as HTMLInputElement;
const campoFrequencia = document.getElementById(
  "frequencia"
) as HTMLInputElement;
const botao = document.getElementById("calcular") as HTMLButtonElement;
const resultado = document.getElementById("resultado") as HTMLElement;

botao.addEventListener("click", () => {
  const nome = campoNome.value.trim();
  const n1 = campoN1.valueAsNumber;
  const n2 = campoN2.valueAsNumber;
  const frequencia = campoFrequencia.valueAsNumber;

  if (
    nome === "" ||
    campoN1.value === "" ||
    campoN2.value === "" ||
    campoFrequencia.value === "" ||
    !dadosValidos(n1, n2, frequencia)
  ) {
    resultado.textContent = "Dados inválidos";
    resultado.className = "erro";
    return;
  }

  const media = calcularMedia(n1, n2);
  const resultadoSituacao = situacao(media, frequencia);

  resultado.textContent =
    `Aluno(a): ${nome}\n` +
    `Média: ${media.toFixed(1)}\n` +
    `Situação: ${resultadoSituacao}`;

  resultado.className =
    resultadoSituacao === "Aprovado" ? "sucesso" : "erro";
});
