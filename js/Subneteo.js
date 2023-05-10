class Subneteo{

    static numberBits(subnets,bits=0){
        return Subneteo.numberDevices(bits)>=subnets?bits:Subneteo.numberBits(subnets,bits+1);
    }

    static numberDevices(bits){
        return Math.pow(2,bits)-2;
    }

    static bits(bit=0){
        let bits=[];
        for(let index=7; index>7-bit; index--){
            bits.push(Math.pow(2,index));
        }
        return bits;
    }

    constructor(ip,subnets){
        this.table=new ModelTable();
        this.ip=(ip instanceof IP)?ip:new IP(ip);
        this.subnets=subnets;
        this.number_bits=Subneteo.numberBits(this.subnets);
        this.number_devices;
        this.net_jump;
        this.netmask;
        this.calculeSubmask();
    }

    calculeSubmask(){
        let bits=Subneteo.bits(this.number_bits).reduce((prev_bit,bit)=>{
            return prev_bit+bit;
        });
        this.number_devices=Subneteo.numberDevices(this.ip.getOctectosHost().length*8-this.number_bits);
        this.netmask=this.ip.getOctectosRed().join(".")+"."+bits;
        this.net_jump=256-bits;
    }

    generateTable(action){
        this.table.addColumn("Subred","subred");
        this.table.addColumn("IP de red","ip_red");
        this.table.addColumn("1ar IP útil","ip_util_1");
        this.table.addColumn("2ar IP útil","ip_util_2");
        this.table.addColumn("IP de brodcast","ip_brodcast");
        let ip=this.ip.getAddress();
        /**
         * subred=número de subred
         * ip_red=ip de red
         * ip_util_1=ip_red+1
         * ip_brodcast=pred_ip_red-1
         * ip_util_2=ip_brodcast-1
         */
        for(let index=0; index<this.subnets; index++){
            let row={};

            row.subred=index+1;
            
            let num_octecto;

            let ip_red=new IP(ip);
            num_octecto=5-this.ip.getOctectosHost().length;
            ip_red.setOctecto(num_octecto,index*this.net_jump);
            row.ip_red=ip_red;

            let ip_util_1=new IP(ip);
            ip_util_1.setOctecto(num_octecto,index*this.net_jump);
            ip_util_1.setOctecto(this.ip.getOctectos().length,ip_util_1.getOctecto(this.ip.getOctectos().length)+1);
            row.ip_util_1=ip_util_1;

            let ip_brodcast=new IP(ip);
            ip_brodcast.setOctecto(num_octecto,((index+1)*this.net_jump)-1);
            ip_brodcast.setOctecto(num_octecto,ip_red.getOctecto(num_octecto)+3);
            if(this.ip.getAddressClassifier()==IP.ADDRESS_CLASSIFIERS.C){
                ip_brodcast.setOctecto(this.ip.getOctectos().length,((index+1)*this.net_jump)-1);
            }else
            if(this.ip.getAddressClassifier()==IP.ADDRESS_CLASSIFIERS.B){
                ip_brodcast.setOctecto(this.ip.getOctectos().length,255);
            }
            row.ip_brodcast=ip_brodcast;

            let ip_util_2=new IP(ip);
            ip_util_2.setOctecto(num_octecto,ip_brodcast.getOctecto(num_octecto));
            ip_util_2.setOctecto(this.ip.getOctectos().length,ip_brodcast.getOctecto(this.ip.getOctectos().length)-1);
            row.ip_util_2=ip_util_2;

            this.table.addRow(row);
            action(this.table.getColumns(),row,index);
        }
    }

}