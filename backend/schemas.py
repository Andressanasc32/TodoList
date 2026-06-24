from pydantic import BaseModel,EmailStr,Field
from typing import Optional 
#biblioteca padrão do Python (typing)Optional Para os campos que o usuário não é obrigado a preencher
#como a descricao de uma tarefa, que pode ficar em branco.
class UsuarioLogado(BaseModel):
    email:EmailStr
    senha:str
class CreateUsuario(BaseModel):
    nome:str=Field(min_length=2,description="O nome precisa ter no mínimo 2 letras")
    email:EmailStr
    senha:str=Field(min_length=6, description="A senha precisa ter pelo ou menos 6 dígitos")

class UsuariosResponse(BaseModel):
    id_usuario:int
    nome:str
    email:EmailStr
    class Config:
        from_attributes=True

class CreateTarefa(BaseModel):
    titulo:str= Field(..., min_length=1, description="O título não pode ser vazio")
    descricao:Optional[str]=None 
    status:Optional[str]="Pendente"
class TarefasResponse(BaseModel):
    id_tarefas:int
    titulo:str
    descricao:Optional[str]=None
    status:str
    usuario_id:int
    class Config:
        from_attributes=True
class UpdateTarefa(BaseModel):
    titulo: Optional[str] = None #  Agora aceita não ser enviado
    descricao: Optional[str] = None 
    status: Optional[str] = None     #  Agora aceita não ser enviado