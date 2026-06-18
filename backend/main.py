from .database import engine, Sessionlocal
from . import models, schemas
from .seguranca import criptografar_senha,verificar_senha
from sqlalchemy.orm import Session
from fastapi import FastAPI,HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func

models.Base.metadata.create_all(bind=engine)


app=FastAPI()
# ADICIONAR ESSA TRAVA DE SEGURANÇA LIBERADA:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],# Permite que qualquer página (incluindo seu arquivo HTML) acesse a API
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)
def get_db():
    db=Sessionlocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/login_usuario')
def logar_usuario(usuario:schemas.UsuarioLogado,db: Session = Depends(get_db)):

    usuario_logado=db.query(models.Usuarios).filter(models.Usuarios.email==usuario.email).first()

    if not usuario_logado:
        raise HTTPException(status_code=404, detail="E-mail incorreto!.")
    
    senha=verificar_senha(usuario.senha,usuario_logado.senha)
    if not senha:
      raise HTTPException(status_code=401,detail="Senha incorreta!")
    
    return usuario_logado

@app.post('/cadastro_usuario', response_model=schemas.UsuariosResponse)
def CreateUsuario(usuario:schemas.CreateUsuario, db : Session = Depends(get_db)):
  
  usuario_existente=db.query(models.Usuarios).filter(models.Usuarios.email==usuario.email).first()
  if usuario_existente:
      raise HTTPException(status_code=404, detail="Ops! Você já tem uma conta no sistema. Que tal fazer o login?")
  
  senha_criptografada=criptografar_senha(usuario.senha)
  new_usuario=models.Usuarios(nome=usuario.nome, email=usuario.email,senha=senha_criptografada)
  db.add(new_usuario)
  db.commit()
  db.refresh(new_usuario)
  return new_usuario 

@app.post("/cadastro_atividades", response_model=schemas.TarefasResponse)
def CreateTarefas(tarefa:schemas.CreateTarefa,id_usuario:int, db: Session = Depends(get_db)):
    atividade_existe=db.query(models.Tarefas).filter(
        func.lower(models.Tarefas.titulo)==func.lower(tarefa.titulo),
        models.Tarefas.usuario_id==id_usuario).first()
    if atividade_existe:
        raise HTTPException(status_code=400,detail="Essa atividade já está cadastrada!")
    
    new_tarefa=models.Tarefas(titulo=tarefa.titulo,descricao=tarefa.descricao,status="Pendente",usuario_id=id_usuario)
  
    db.add(new_tarefa)
    db.commit()
    db.refresh(new_tarefa)
    return new_tarefa

@app.get("/usuarios", response_model=list[schemas.UsuariosResponse])
def view_usuarios(db: Session= Depends(get_db)):
    usuarios=db.query(models.Usuarios).all()
    return usuarios

@app.get("/atividades", response_model=list[schemas.TarefasResponse])
def view_tarefas(id_usuario:int,db: Session= Depends(get_db)):
    tarefas=db.query(models.Tarefas).filter(models.Tarefas.usuario_id==id_usuario).all()
    return tarefas

@app.delete("/delete_atividade")
def delete_atividade(id_tarefa:int,db: Session = Depends(get_db)):
    atividade_deletada=db.query(models.Tarefas).filter(models.Tarefas.id_tarefas==id_tarefa).first()
    if not atividade_deletada:
        raise HTTPException(status_code=404, detail="erro ao deletar")
    db.delete(atividade_deletada)
    db.commit()
    return {"mensagem": "Atividade apagada com sucesso!"}

@app.patch('/atualizar_atividade', response_model=schemas.TarefasResponse)
def atualizar_atividade(atividade:schemas.UpdateTarefa,id_usuario:int,id_atividade:int,db: Session = Depends(get_db)):
    busca_atividade=db.query(models.Tarefas).filter(models.Tarefas.id_tarefas==id_atividade).first()
    
    if not busca_atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    if atividade.titulo:
        busca_ativ_duplicada=db.query(models.Tarefas).filter( 
            models.Tarefas.usuario_id==id_usuario,
            func.lower(models.Tarefas.titulo)==func.lower(atividade.titulo.strip()),
            models.Tarefas.id_tarefas!=id_atividade).first()
        
        if busca_ativ_duplicada:
          raise HTTPException(status_code=404, detail="Essa atividade já está cadastrada!.")
    
    if atividade.titulo:
        busca_atividade.titulo = atividade.titulo
    if atividade.descricao:
        busca_atividade.descricao = atividade.descricao
    if atividade.status:
        busca_atividade.status=atividade.status

    db.commit()
    db.refresh(busca_atividade)
    return busca_atividade

@app.get('/buscar_atividade', response_model=schemas.TarefasResponse)
def buscar_atividade(id_usuario:int,titulo:str,db: Session= Depends(get_db)):
   #  Corrigido: O banco filtra pelo id do usuário logado E pelo título em minúsculo ao mesmo tempo
    atividade_buscada = db.query(models.Tarefas).filter(
        models.Tarefas.usuario_id == id_usuario,
        func.lower(models.Tarefas.titulo) == func.lower(titulo.strip())
    ).first()

    # Se a tarefa não existir OU se ela existir mas pertencer a outro ID de usuário, ela vai dar erro 404
    if not atividade_buscada:
        raise HTTPException(status_code=404, detail="Essa Atividade não existe para este usuário!")
    
    return atividade_buscada