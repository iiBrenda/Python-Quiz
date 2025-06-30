from models.usuario import Usuario

class Admin(Usuario):
    def __init__(self, nome, email):
        super().__init__(nome, email)

    def exibir_painel(self):
        return f"Acesso total: {self.nome} (admin)"
