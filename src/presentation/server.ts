import express, { Router } from 'express';
import path from 'path';
interface Options {
    port:number;
    public_path?:string;
    routes:Router;
}

export class Server {

private app = express();
private readonly port:number;
private readonly publicPath:string;
private readonly routes:Router;
constructor(opciones:Options){
    const {port,routes,public_path='public'} =opciones;
    this.port=port;
    this.publicPath=public_path;
    this.routes=routes;
}

async start(){
    
    //* MIDDLEWARES : Es una funcion que se va a ejecutar cuando pase por esa linea
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:true})); // x-www-form-urlencoded
    //* Public Folders
    this.app.use(express.static(this.publicPath));
    //
    //* Routes
    this.app.use(this.routes);
    //* SPA
    this.app.get('*',(req,res)=>{
        console.log("url solicita",req.url)
        const indexPath= path.join(__dirname +`../../../${this.publicPath}/index.html`);
        res.sendFile(indexPath);
        return;
    })

    this.app.listen(this.port,()=>{
        console.log(`server running on port ${this.port}`);
    });
}

}