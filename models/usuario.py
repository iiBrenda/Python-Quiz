from abc import ABC, abstractmethod

class Usuario(ABC):
    def __init__(self, nome, email):
        self.nome = nome
        self.email = email
    
    @abstractmethod
    def tem_permissao_admin(self):
        pass