// Carrega perguntas da API e salva no localStorage
fetch('/api/perguntas')
  .then(res => res.json())
  .then(data => {
      const perguntasConvertidas = data.map((item, index) => ({
          id: item.id,
          question: item.enunciado,
          options: item.alternativas,
          answer: item.correta,
          hint: item.dica
      }));

      saveQuestions(perguntasConvertidas);
  })
  .catch(err => {
      console.error("Erro ao carregar perguntas da API:", err);
  });

function getQuestions() {
    const questions = localStorage.getItem('pythonQuizQuestions');
    return questions ? JSON.parse(questions) : [];
}

function saveQuestions(questions) {
    localStorage.setItem('pythonQuizQuestions', JSON.stringify(questions));
}
