from models.pergunta import Pergunta
from models.database import db

class QuizController:
    def listar(self):
        return Pergunta.query.all()

    def buscar(self, id):
        return Pergunta.query.get(id)

    def adicionar(self, dados):
        nova_pergunta = Pergunta(**dados)
        db.session.add(nova_pergunta)
        db.session.commit()

    def atualizar(self, id, novos_dados):
        pergunta = Pergunta.query.get(id)
        for key, value in novos_dados.items():
            setattr(pergunta, key, value)
        db.session.commit()

    def deletar(self, id):
        pergunta = Pergunta.query.get(id)
        db.session.delete(pergunta)
        db.session.commit()