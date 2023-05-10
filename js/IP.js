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
        this.octetos=(bits[0].indexOf(".")==-1)?bits:bits[0].replaceAll(" ","").split(".");
        this.address_classifier;
        this.octetos_red=[];
        this.octetos_host=[];
        this.calcule();
    }

    getAddress(){
        return this.octetos.join();
    }

    calcule(){
        this.address_classifier=
        Util.range(this.getOctecto(1),1,127)?IP.ADDRESS_CLASSIFIERS.A:
        Util.range(this.getOctecto(1),128,191)?IP.ADDRESS_CLASSIFIERS.B:
        Util.range(this.getOctecto(1),191,223)?IP.ADDRESS_CLASSIFIERS.C:
        Util.range(this.getOctecto(1),224,239)?IP.ADDRESS_CLASSIFIERS.D:IP.ADDRESS_CLASSIFIERS.NONE;
        this.address_classifier.netmask.split(".").forEach((octeto)=>{
            if(octeto=="255"){
                this.octetos_red.push(octeto);
            }else{
                this.octetos_host.push(octeto);
            }
        });
    }

    getOctecto(num){
        return this.octetos[num-1]??"";
    }

    getOctectos(){
        return this.octetos;
    }

    getAddressClassifier(){
        return this.address_classifier;
    }

}