import { error } from "console";
import { Request, Response } from "express"
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";


export class TodosController {
    //* Iyeccion de Dependencias
    constructor(
      private readonly todoRepository:TodoRepository
    ){

}

public getTodos =  (req:Request,res:Response)=>{
  new GetTodos(this.todoRepository)
  .execute()
  .then(todos=>res.json(todos))
  .catch(err=>res.status(400).json(err));
  }
public getTodoById=  (req:Request,res:Response)=>{
    const id= +  req.params.id; //* EL "+" CONVIERTE EN NUMBER EL STRING
    new GetTodo(this.todoRepository)
    .execute(id)
   .then(todo=>res.json(todo))
   .catch(error=>res.status(400).json(error));
  }

  public createTodo= (req:Request,res:Response)=>{
    const [error,createTodoDto] = CreateTodoDto.create(req.body);
    if(error) return res.status(400).json({error})
    
    new CreateTodo(this.todoRepository)
    .execute(createTodoDto!)
    .then(todo=>res.json(todo))
    .catch(errocito=>res.status(400).json(errocito));
  }
  public updateTodo=  (req:Request,res:Response)=>{
    const id = +req.params.id;
    const [error,updateTodoDto] = UpdateTodoDto.update({...req.body,id});
    if(error) return res.status(400).json({error});
    new UpdateTodo(this.todoRepository)
    .execute(updateTodoDto!)
    .catch(error=>res.status(400).json(error));

   
  }
  public deleteTodo=  (req:Request,res:Response)=>{
    const id = +req.params.id;
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});
    if(!id) return res.status(400).json({error:`ID is required to delete`});

    new DeleteTodo(this.todoRepository)
    .execute(id)
    .then(todo=>res.json(todo))
    .catch(error=>res.status(400).json(error))
 
  }
}