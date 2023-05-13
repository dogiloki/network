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
            let ip_red=new IP(ip);
            ip_red.add(this.net_jump*index);
            row.ip_red=ip_red;

            let ip_util_1=new IP(ip);
            ip_util_1.setOctectosHost(ip_red.getOctectosHost());
            ip_util_1.add(1,Util.DIRECTIONS.RIGHT);
            row.ip_util_1=ip_util_1;

            let ip_brodcast=new IP(ip);
            ip_brodcast.add(this.net_jump*(index+1)-1);
            for(let index_octeto=1; index_octeto<=ip_brodcast.getOctectosHost().length; index_octeto++){
                let octeto=ip_brodcast.getOctectoHost(index_octeto);
                Util.where(octeto==0,()=>{
                    ip_brodcast.setOctectoHost(index_octeto,255);
                });
            }
            row.ip_brodcast=ip_brodcast;

            let ip_util_2=new IP(ip);
            ip_util_2.setOctectosHost(ip_brodcast.getOctectosHost());
            ip_util_2.sub(1,Util.DIRECTIONS.RIGHT);
            row.ip_util_2=ip_util_2;

            this.table.addRow(row);
            action(this.table.getColumns(),row,index);
        }
    }

}