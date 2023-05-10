class Subneteo{

    static numberBits(subredes,bits=0){
        return Subneteo.numberDevices(bits)>=subredes?bits:Subneteo.numberBits(subredes,bits+1);
    }

    static numberDevices(bits){
        return Math.pow(2,bits)-2;
    }

    static bits(bit){
        let bits=[];
        for(let a=7; a>=0; a--){
            bits.push(Math.pow(2,a));
        }
        return bits;
    }

    constructor(ip,subredes){
        this.table=new ModelTable();
        this.ip=(ip instanceof IP)?ip:new IP(ip);
        this.subredes=subredes;
        this.number_bits=Subneteo.numberBits(this.subredes);
        this.number_devices=Subneteo.numberDevices(this.number_bits);
        this.netmask=this.ip.address_classifier.netmask;
        this.net_jump;
    }

    calculeSubmask(){
        
    }

}