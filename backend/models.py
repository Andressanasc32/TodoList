from sqlalchemy import Integer,String,ForeignKey,Column
from sqlalchemy.orm import relationship
from .database import Base

class Usuarios(Base):
    __tablename__= 'usuarios'
    id_usuario=Column(Integer,primary_key=True,index=True)
    nome=Column(String)
    email=Column(String)
    senha=Column(String)
    tarefas=relationship("Tarefas",back_populates="usuario",cascade="all, delete-orphan")
class Tarefas(Base):
    __tablename__='tarefas'
    id_tarefas=Column(Integer,primary_key=True,index=True)
    titulo=Column(String)
    descricao=Column(String)
    status=Column(String)
    usuario_id=Column(Integer,ForeignKey("usuarios.id_usuario"))
    usuario=relationship("Usuarios", back_populates="tarefas")