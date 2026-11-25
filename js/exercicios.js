document.querySelectorAll(".pergunta-quiz").forEach((pergunta) => {
  const botoes = pergunta.querySelectorAll(".opcao-btn");
  const feedback = pergunta.querySelector(".feedback-quiz");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      
      botoes.forEach((b) => b.classList.remove("correta", "incorreta"));

      if (botao.dataset.correta === "true") {
        botao.classList.add("correta");
        feedback.textContent = "Correto! Muito bem.";
        feedback.className = "feedback-quiz sucesso";
      } else {
        botao.classList.add("incorreta");
        feedback.textContent = "Resposta incorreta. Tente novamente!";
        feedback.className = "feedback-quiz erro";
      }
    });
  });
});