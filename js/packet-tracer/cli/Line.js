class Line{

    constructor(commands=[]){
        this.commands=commands;
    }

    addCommand(command){
        this.commands.push(command);
    }

    toString(){
        this.commands.join(" ");
    }

}