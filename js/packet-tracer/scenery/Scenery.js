class Scenery{

    constructor(canvas=null){
        this.canvas=canvas==null?document.getElementById("canvas"):canvas;
        this.width=canvas.width;
        this.height=canvas.height;
        this.ctx=canvas.getContext("2d");
        this.entities=[];
    }

    setEvents(){
        document.addEventListener('mousedown',(evt)=>{

        });
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    move(){
        
    }

    findEntity(x,y){
        for(let i=0;i<this.entities.length;i++){
            let entity=this.entities[i];
            if(x>=entity.x && x<=entity.x+entity.width && y>=entity.y && y<=entity.y+entity.height){
                return entity;
            }
        }
        return null;
    }

    move(){
        this.entities.forEach(entity=>{
            entity.move(entity.x,entity.y);
        });
    }

    render(action=null){
        this.entities.forEach(entity=>{
            if(entity.line_width==null){
                this.ctx.fillStyle=entity.color;
                this.ctx.fillRect(entity.x,entity.y,entity.width,entity.height);
            }else{
                this.ctx.lineWidth=entity.line_width;
                this.ctx.strokeStyle=entity.color;
                this.ctx.strokeRect(entity.x,entity.y,entity.width,entity.height);
            }
            if(action!=null){
                action(ctx,entity);
            }
        });
    }

}