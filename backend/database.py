from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DTB_URL=('postgresql://postgres:postgres@localhost:5432/todo_list')

engine=create_engine(DTB_URL)

Sessionlocal=sessionmaker(bind=engine)

Base=declarative_base()
