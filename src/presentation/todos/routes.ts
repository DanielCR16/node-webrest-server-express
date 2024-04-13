import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDataSourceImpl } from "../../infraestructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infraestructure/repositories/todo.repository.imp";





export class TodoRoutes {

    static get routes():Router{
        const router = Router();
        
        const datasource = new TodoDataSourceImpl();
        const repository = new TodoRepositoryImpl(datasource)
        const todoController = new TodosController(repository);

        router.get('/',(req,res)=>todoController.getTodos(req,res));
        router.get('/:id',(req,res)=>todoController.getTodoById(req,res));
        router.post('/',todoController.createTodo);
        router.put('/:id',todoController.updateTodo);
        router.delete('/:id',todoController.deleteTodo);
        return router;
    }
}