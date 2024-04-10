import { error } from "console";
import { Request, Response } from "express"

const todos = [
    {id:1,text:'Buy milk',completedAt:new Date()},
    {id:2,text:'Buy bread',completedAt:null},
    {id:3,text:'Buy butter',completedAt:new Date()},
];

export class TodosController {
    //* Iyeccion de Dependencias
    constructor(){

}

public getTodos = (req:Request,res:Response)=>{
    return res.json(todos);
  }
public getTodoById= (req:Request,res:Response)=>{
    const id= +  req.params.id; //* EL "+" CONVIERTE EN NUMBER EL STRING
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});
    const todoFinded = todos.find(todo=>todo.id ===id);
    return (todoFinded)?res.json(todoFinded):res.status(404).json({error:`TODO with id ${id} not found`});
  }

  public createTodo= (req:Request,res:Response)=>{
    const {text} = req.body;
    if(!text) return res.status(400).json({error:'text property is required'});
    const newTodo = {
        id:todos.length +1,
        text:text,
        completedAt:null
    }
    todos.push(newTodo)
     res.json(newTodo);
  }
  public updateTodo= (req:Request,res:Response)=>{
    const id = +req.params.id;
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});

    const todo=todos.find(todo=>todo.id===id);
    if(!todo) return res.status(400).json({error:`TODO with id:${id} no found`});
    
    const {text,completedAt} = req.body;

    todo.text = text || todo.text;
    (completedAt ==='null')? 
    todo.completedAt = null : 
    todo.completedAt = new Date(completedAt || todo.completedAt);


    //! OJO Esto se pasa por referencia 
   // todos.forEach((todo,index) => {
   //     if(todo.id ===id){
   //         todos[index] =todo;
   //     }
   // });

    res.json(todo);
  }
  public deleteTodo= (req:Request,res:Response)=>{
    const id = +req.params.id;
    if(isNaN(id)) return res.status(400).json({error:`ID argument is not a number`});
    if(!id) return res.status(400).json({error:`ID is required to delete`});
    const todo=todos.find(todo=>todo.id===id);
    if(!todo) return res.status(400).json({error:`TODO with id:${id} no found`});

    todos.splice(todos.indexOf(todo),1);
    res.json(todo);
  }
}