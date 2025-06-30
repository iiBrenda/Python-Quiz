from models.usuario import Usuario

class Jogador(Usuario):
    def __init__(self, nome, email, pontuacao=0):
        super().__init__(nome, email)
        self.pontuacao = pontuacao

    def exibir_painel(self):
        return f"Jogador: {self.nome}, Pontuação: {self.pontuacao}"
