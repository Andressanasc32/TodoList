import bcrypt

def criptografar_senha(senha_pura:str)-> str:

  salt=bcrypt.gensalt()
  senha_criptograda=bcrypt.hashpw(senha_pura.encode('utf-8'),salt)
  return senha_criptograda.decode('utf-8')

def verificar_senha(senha_pura:str,senha_criptografada_do_banco:str)-> bool:
  
  return bcrypt.checkpw(senha_pura.encode('utf-8'),
    senha_criptografada_do_banco.encode('utf-8')
    )