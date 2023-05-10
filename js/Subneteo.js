class Subneteo{

    static numberBits(subredes,bits=0){
        return Subneteo.numberDevices(bits)>=subredes?bits:Subneteo.numberBits(subredes,bits+1);
    }

    static numberDevices(bits){
        return Math.pow(2,bits)-2;
    }

    static bits(bit=0){
        let bits=[];
        for(let index=7; index>=bit; index--){
            bits.push(Math.pow(2,index));
        }
        return bits;
    }

    constructor(ip,subredes){
        this.table=new ModelTable();
        this.ip=(ip instanceof IP)?ip:new IP(ip);
        this.subredes=subredes;
        this.number_bits=Subneteo.numberBits(this.subredes);
        this.number_devices=Subneteo.numberDevices(this.number_bits);
        this.net_jump;
        this.calculeSubmask();
        this.generateTable();
    }

    calculeSubmask(){
        let octeto=this.ip.octetos_host[0];
        let bits=Subneteo.bits(this.number_bits).reduce((prev_bit,bit)=>{
            return prev_bit+bit;
        });
        this.netmask=this.ip.octetos_red.join(".")+"."+bits;
        this.net_jump=256-bits;
    }

    generateTable(){
        this.table.addColumn("Subred","subred");
        this.table.addColumn("IP de red","ip_red");
        this.table.addColumn("1ar IP útil","ip_util_1");
        this.table.addColumn("2ar IP útil","ip_util_2");
        this.table.addColumn("IP de brodcast","ip_brodcast");
        let ip=this.ip.getAddress();
        for(let index=0; index<this.subredes; index++){
            let row={};

            row.subred=index+1;
            
            let ip_red=new IP(ip);
            ip_red.setOctecto(4,index*this.net_jump);
            row.ip_red=ip_red;

            let ip_util_1=new IP(ip);
            ip_util_1.setOctecto(4,(index*this.net_jump)+1);
            row.ip_util_1=ip_util_1;

            let ip_util_2=new IP(ip);
            ip_util_2.setOctecto(4,((index+1)*this.net_jump)-2);
            row.ip_util_2=ip_util_2;

            let ip_brodcast=new IP(ip);
            ip_brodcast.setOctecto(4,((index+1)*this.net_jump)-1);
            row.ip_brodcast=ip_brodcast;

            this.table.addRow(row);
        }
    }

}