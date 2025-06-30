from flask_sqlalchemy import SQLAlchemy
from .database import db

class PerguntaBase(db.Model):
    __tablename__ = 'pergunta_base'
    id = db.Column(db.Integer, primary_key=True)
    enunciado = db.Column(db.String(500), nullable=False)

    type = db.Column(db.String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'base',
        'polymorphic_on': type
    }

class PerguntaMultiplaEscolha(PerguntaBase):
    __tablename__ = 'pergunta_multipla'
    id = db.Column(db.Integer, db.ForeignKey('pergunta_base.id'), primary_key=True)
    opcao_a = db.Column(db.String(200))
    opcao_b = db.Column(db.String(200))
    opcao_c = db.Column(db.String(200))
    opcao_d = db.Column(db.String(200))
    resposta_correta = db.Column(db.String(1))

    __mapper_args__ = {
        'polymorphic_identity': 'multipla_escolha',
    }
