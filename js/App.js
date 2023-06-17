class App{

    static save(){
		localStorage.setItem(Network.storage_key,JSON.stringify(App.network));
	}

	static load(){
        App.network=new Network(
            JSON.parse(localStorage.getItem(Network.storage_key))
        );
	}

    static network;

    constructor(){
        this.content=Object.freeze({
            ip:{
                form:document.getElementById('form_ip'),
                table:document.getElementById('table_ip')
            },
            subneteo:{
                section:document.getElementById('content_subneteos'),
                tables:[] // table, obj
            }
        });
        this.setEvents();
    }

    setEvents(){
        this.content.ip.form.addEventListener('submit',(evt)=>{
            evt.preventDefault();
            App.network.addIP({
                ip:this.content.ip.form['ip'].value,
                subredes:this.content.ip.form['subredes'].value
            });
            this.loadTableIPs();
        });
        this.loadTableIPs();
    }

    loadTableIPs(){
        let index=0;
        this.content.ip.table.innerHTML="";
        for(let ip of App.network.getIPs()){
            if(index==0){
                this.content.ip.table.appendChild(
                    this.createElement("tr",[
                        this.createElement("th","Dirección IP"),
                        this.createElement("th","Subredes"),
                        this.createElement("th","Acciones")
                    ])
                );
            }
            this.content.ip.table.appendChild(
                this.createElement("tr",[
                    this.createElement("td",ip.ip),
                    this.createElement("td",ip.subredes),
                    this.createElement("button",(content)=>{
                        content.textContent="Eliminar";
                        content.addEventListener('click',()=>{
                            App.network.removeIP(ip);
                            this.loadTableIPs();
                        });
                    }),
                    this.createElement("button",(content)=>{
                        content.textContent="Subneteo",
                        content.addEventListener('click',()=>{
                            this.loadTableSubneteo(ip.ip,ip.subredes);
                        });
                    })
                ])
            );
            index++;
        }
    }

    loadTableSubneteo(ip,subredes){
        let subneteo=new Subneteo(ip,subredes);
        let table=document.createElement("table");
        subneteo.generateTable((columns,row,index)=>{
            if(index==0){
                let tr=this.createElement("tr");
                for(let key in columns){
                    let column=columns[key];
                    let th=this.createElement("th",column);
                    tr.appendChild(th);
                    table.appendChild(tr);
                    continue;
                }
            }
            let tr=this.createElement("tr",[
                this.createElement("td",row.subred),
                this.createElement("td",row.ip_red.getAddress()),
                this.createElement("td",row.ip_util_1.getAddress()),
                this.createElement("td",row.ip_util_2.getAddress()),
                this.createElement("td",row.ip_brodcast.getAddress())
            ]);
            table.appendChild(tr);
        });
        this.content.subneteo.tables.push({
            table:table,
            obj:subneteo
        });
    }

    createElement(type,value=null){
        let content=document.createElement(type);
        if(value==null){
            return content;
        }
        if(Array.isArray(value)){
            value.forEach((item)=>{
                content.appendChild(item);
            });
        }else
        if(typeof value ==='function'){
            value(content);
            return content;
        }else{
            content.innerHTML=value;
        }
        return content;
    }

}

App.load();
var app=new App();

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
    this.content_info.appendChild(this.createElement("p","Submáscara original: "+this.subneteo.ip.getNetMask()));
    this.content_info.appendChild(this.createElement("p","Clasificación de red: "+this.subneteo.ip.getName()));
    this.content_info.appendChild(this.createElement("p","Número de bits: "+this.subneteo.number_bits));
    this.content_info.appendChild(this.createElement("p","Total de dispositivos: "+this.subneteo.number_devices));
    this.content_info.appendChild(this.createElement("p","Submáscara: "+this.subneteo.netmask));
    this.content_info.appendChild(this.createElement("p","Saltos de bits: "+this.subneteo.net_jump));
}