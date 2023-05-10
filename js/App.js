var form=document.getElementById('form');
var content_table=document.getElementById('content_table');
var content_info=document.getElementById('content_info');
var subneteo;

form.addEventListener('submit',(evt)=>{
    evt.preventDefault();
    this.subneteo=new Subneteo(
        new IP(
            form['ip_1'].value,
            form['ip_2'].value,
            form['ip_3'].value,
            form['ip_4'].value
        ),
        form['subredes'].value
    );
    this.generateTable();
});

function generateTable(){
    this.content_table.innerHTML="";
    this.subneteo.generateTable((columns,row,index)=>{
        if(index==0){
            let tr=this.createElement("tr");
            for(let key in columns){
                let column=columns[key];
                let th=this.createElement("th",column);
                tr.appendChild(th);
                this.content_table.appendChild(tr);
            }
        }
        let tr=this.createElement("tr");
        let td_subred=this.createElement("td",row.subred);
        let td_ip_red=this.createElement("td",row.ip_red.getAddress());
        let td_ip_util_1=this.createElement("td",row.ip_util_1.getAddress());
        let td_ip_util_2=this.createElement("td",row.ip_util_2.getAddress());
        let td_ip_brodcast=this.createElement("td",row.ip_brodcast.getAddress());
        tr.appendChild(td_subred);
        tr.appendChild(td_ip_red);
        tr.appendChild(td_ip_util_1);
        tr.appendChild(td_ip_util_2);
        tr.appendChild(td_ip_brodcast);
        this.content_table.appendChild(tr);
    });
    this.content_info.innerHTML="";
    this.content_info.appendChild(this.createElement("p","IP: "+this.subneteo.ip.getAddress()));
    this.content_info.appendChild(this.createElement("p","Submascara original: "+this.subneteo.ip.getNetMask()));
    this.content_info.appendChild(this.createElement("p","Número de bits: "+this.subneteo.number_bits));
    this.content_info.appendChild(this.createElement("p","Número de dispositivos: "+this.subneteo.number_devices));
    this.content_info.appendChild(this.createElement("p","Submascara: "+this.subneteo.netmask));
    this.content_info.appendChild(this.createElement("p","Saltos de bits: "+this.subneteo.net_jump));
}

function createElement(type,value=null){
    let content=document.createElement(type);
    if(value!=null){
        content.innerHTML=value;
    }
    return content;
}