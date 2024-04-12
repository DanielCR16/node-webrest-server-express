import { error } from "console";
import { Request, Response } from "express"
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {
    //* Iyeccion de Dependencias
    constructor(){

}

public getTodos = async (req:Request,res:Response)=>{
  const todos = await prisma.todo.findMany();
    return res.json(todos);
  }
public getTodoById= async (req:Request,res:Response)=>{
    const id= +  req.params.id; //* EL "+" CONVIERTE EN NUMBER EL STRING
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});

    const todo = await prisma.todo.findFirst({
      where:{id}
    });
    return (todo)?res.json(todo):res.status(404).json({error:`TODO with id ${id} not found`});
  }

  public createTodo= async(req:Request,res:Response)=>{

    const [error,createTodoDto] = CreateTodoDto.create(req.body);
    if(error) return res.status(400).json({error})
    
   
   const todo = await prisma.todo.create({
      data:createTodoDto!
    });
   
     res.json(todo);
  }
  public updateTodo= async (req:Request,res:Response)=>{
    const id = +req.params.id;
    const [error,updateTodoDto] = UpdateTodoDto.update({...req.body,id});
    if(error) return res.status(400).json({error});


    const todo = await prisma.todo.findFirst({
      where:{id}
    });
    if(!todo) return res.status(400).json({error:`TODO with id:${id} no found`});
    


 
    const updatedTodo =await prisma.todo.update({
      where:{id},
      data:updateTodoDto!.values});

    res.json(updatedTodo);
  }
  public deleteTodo= async (req:Request,res:Response)=>{
    const id = +req.params.id;
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});
    if(!id) return res.status(400).json({error:`ID is required to delete`});
    const todo = await prisma.todo.findFirst({
      where:{id}
    });
    if(!todo) return res.status(400).json({error:`TODO with id:${id} no found`});
    const todoDeleted = await prisma.todo.delete({
      where:{id}
    });
    (todoDeleted) ? res.json(todoDeleted):res.status(400).json({error:`TODO with id:${id} no exist`})
    res.json({todo,todoDeleted});
  }
}