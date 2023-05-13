class Util{

    static OPERATIONS={
        SUM:{
            id: Symbol(),
            name: "Suma",
            operator: "+"
        },
        SUB:{
            id: Symbol(),
            name: "Resta",
            operator: "-"
        },
        MUL:{
            id: Symbol(),
            name: "Multiplication",
            operator: "*"
        },
        DIV:{
            id: Symbol(),
            name: "División",
            operator: "/"
        }
    };

    static DIRECTIONS={
        LEFT:{
            id: Symbol(),
            name: "Izquierda",
            operator: "<<"
        },
        RIGHT:{
            id: Symbol(),
            name: "Derecha",
            operator: ">>"
        }
    };

    static range(num,min,max){
        return num>=min && num<=max;
    }

    static where(conditional,action){
        if(conditional){
            action();
        }
    }

}