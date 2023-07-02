class Device extends Entity{

    constructor(name,ip){
        this.name=name;
        this.ip=(ip instanceof IP)?ip:new IP(ip);
    }

}