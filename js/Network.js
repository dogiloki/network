class Network{

    constructor(obj=null){
        this.ips=[];
        if(obj!=null){
            this.ips=obj.ips;
        }
    }

    addIP(value){
        this.ips.push(value);
    }

    getIPs(){
        return this.ips;
    }

    removeIP(ip){
        let index=this.ips.indexOf(ip);
        if(index!==-1){
            this.ips.splice(index,1);
        }
    }


}