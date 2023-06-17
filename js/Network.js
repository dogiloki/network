class Network{

    static storage_key="network";

	static delete(){
		localStorage.setItem(Network.storage_key,null);	
	}

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