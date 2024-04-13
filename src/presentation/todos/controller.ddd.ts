import { error } from "console";
import { Request, Response } from "express"
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";


export class TodosController {
    //* Iyeccion de Dependencias
    constructor(
      private readonly todoRepository:TodoRepository
    ){

}

public getTodos = async (req:Request,res:Response)=>{
  const todos = await this.todoRepository.getAll();
    return res.json(todos);
  }
public getTodoById= async (req:Request,res:Response)=>{
    const id= +  req.params.id; //* EL "+" CONVIERTE EN NUMBER EL STRING
    try {
      const todo=await this.todoRepository.findById(id);
      return res.json(todo);
    }
    catch(error){
      return res.status(400).json(error);
    }
   
  }

  public createTodo= async(req:Request,res:Response)=>{
    const [error,createTodoDto] = CreateTodoDto.create(req.body);
    if(error) return res.status(400).json({error})
    
   
   const todo = await this.todoRepository.create(createTodoDto!);  
     res.json(todo);
  }
  public updateTodo= async (req:Request,res:Response)=>{
    const id = +req.params.id;
    const [error,updateTodoDto] = UpdateTodoDto.update({...req.body,id});
    if(error) return res.status(400).json({error});

try {
  const todo = await this.todoRepository.updateById(updateTodoDto!);
  if(!todo) return res.status(400).json({error:`TODO with id:${id} no found`});
  res.json(todo);
} catch (error) {
  
}



  }
  public deleteTodo= async (req:Request,res:Response)=>{
    const id = +req.params.id;
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});
    if(!id) return res.status(400).json({error:`ID is required to delete`});

    const todoDeleted = await this.todoRepository.deleteById(id)
    res.json(todoDeleted);
  }
}