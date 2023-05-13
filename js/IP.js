class IP{

    static ADDRESS_CLASSIFIERS=Object.freeze({
        A:{
            id:Symbol(),
            name:"A (No sé)",
            netmask:"255.0.0.0"
        },
        B:{
            id:Symbol(),
            name:"B (Link Local)",
            netmask:"255.255.0.0"
        },
        C:{
            id:Symbol(),
            name:"C (Site Local)",
            netmask:"255.255.255.0"
        },
        D:{
            id:Symbol(),
            name:"D (Multicast)",
            netmask:"255.255.255.255"
        },
        NONE:{
            id:Symbol(),
            name:"Sin determinar",
            netmask:""
        }
    });

    constructor(...bits){
        this.octetos=((""+bits[0]).indexOf(".")==-1)?bits:bits[0].replaceAll(" ","").split(".");
        this.octetos=this.octetos.map((octeto)=>{
            return Number(octeto);
        });
        this.address_classifier;
        this.indices_red=[];
        this.indices_host=[];
        this.calcule();
    }

    getAddress(){
        return this.octetos.join(".");
    }

    getNetMask(){
        return this.address_classifier.netmask;
    }
    
    getName(){
        return this.address_classifier.name;
    }

    calcule(){
        this.address_classifier=
        Util.range(this.getOctecto(1),1,127)?IP.ADDRESS_CLASSIFIERS.A:
        Util.range(this.getOctecto(1),128,191)?IP.ADDRESS_CLASSIFIERS.B:
        Util.range(this.getOctecto(1),191,223)?IP.ADDRESS_CLASSIFIERS.C:
        Util.range(this.getOctecto(1),224,239)?IP.ADDRESS_CLASSIFIERS.D:IP.ADDRESS_CLASSIFIERS.NONE;
        this.address_classifier.netmask.split(".").forEach((octeto,index)=>{
            if(octeto=="255"){
                this.indices_red.push(index+1);
            }else{
                this.indices_host.push(index+1);
            }
        });
    }

    add(quantity,direction=Util.DIRECTIONS.LEFT){
        return this.operation(Util.OPERATIONS.SUM,quantity,direction);
    }

    sub(quantity,direction=Util.DIRECTIONS.LEFT){
        return this.operation(Util.OPERATIONS.SUB,quantity,direction);
    }

    operation(operator,quantity,direction){
        let octetos=this.getOctectosHost();
        for(let index=0; index<octetos.length; index++){
            if(direction==Util.DIRECTIONS.LEFT){
                index=index;
            }else
            if(direction==Util.DIRECTIONS.RIGHT){
                index=octetos.length-(index+1);
            }
            let octeto=octetos[index];
            let diff;
            if(operator==Util.OPERATIONS.SUM){
                if(octeto==255){
                    continue;
                }
                octetos[index]+=quantity;
                diff=octetos[index]-255;
                if(diff>0){
                    octetos[index]=255;
                    this.operation(operator,diff);
                }
                break;
            }else
            if(operator==Util.OPERATIONS.SUB){
                if(octeto==0){
                    continue;
                }
                octetos[index]-=quantity;
                diff=octetos[index]-0;
                if(diff<0){
                    octetos[index]=0;
                    this.operation(operator,diff*-1);
                }
                break;
            }
        }
        this.setOctectosHost(octetos);
        return this;
    }

    setOctecto(index,octeto){
        this.octetos[index-1]=octeto;
    }

    setOctectos(octetos){
        this.octetos=octetos;
    }

    setOctectoRed(index,octeto){
        this.setOctecto(this.indices_red[index-1],octeto);
    }

    setOctectosRed(octetos){
        let index=1;
        for(let octeto of octetos){
            this.setOctectoRed(index,octeto);
            index++;
        }
    }

    setOctectoHost(index,octeto){
        this.setOctecto(this.indices_host[index-1],octeto);
    }

    setOctectosHost(octetos){
        let index=1;
        for(let octeto of octetos){
            this.setOctectoHost(index,octeto);
            index++;
        }
    }
    
    getOctecto(index){
        return this.octetos[index-1];
    }

    getOctectos(){
        return this.octetos;
    }

    getOctectoRed(index){
        return this.getOctecto(this.indices_red[index-1]);
    }

    getOctectosRed(){
        let octetos=[];
        for(let index of this.indices_red){
            octetos.push(this.getOctecto(index));
        }
        return octetos;
    }

    getOctectoHost(index){
        return this.getOctecto(this.indices_host[index-1]);
    }

    getOctectosHost(){
        let octetos=[];
        for(let index of this.indices_host){
            octetos.push(this.getOctecto(index));
        }
        return octetos;
    }

}