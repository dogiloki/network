class Entity{

    constructor(){
        this.x;
        this.y;
        this.width;
        this.height;
        this.color;
        this.line_width;
    }

    move(x,y){
        this.x=x;
        this.y=y;
    }

    resize(width,height){
        this.width=width;
        this.height=height;
    }

}