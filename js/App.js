class App{

    static storage_key="network";

    static save(){
		localStorage.setItem(App.storage_key,JSON.stringify(App.network));
	}

	static load(){
        App.network=new Network(
            JSON.parse(localStorage.getItem(App.storage_key))
        );
	}

    static delete(){
		localStorage.setItem(App.storage_key,null);	
        App.network=new Network();
	}

    static network;

    constructor(){
        this.content=Object.freeze({
            btns:{
                save: document.getElementById('btn-save'),
                clear: document.getElementById('btn-clear'),
            },
            ip:{
                form: document.getElementById('form-ip'),
                table: document.getElementById('table-ip')
            },
            templates:{
                window: document.getElementById('template-window').content
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
        this.content.btns.save.addEventListener('click',()=>{
            App.save();
        });
        this.content.btns.clear.addEventListener('click',()=>{
            App.delete();
            this.loadInit();
        });
        this.loadInit();
    }

    loadInit(){
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

    loadWindow(frame,title,append=false){
        new Template(
            this.content.templates.window,
            document.body,
            new TemplateAction(
                ["window","frame","title","btn-close","bar-title"],
                (elements)=>{
                    elements.window.setAttribute('title',title);
                    elements.title.textContent=title;
                    elements.btn_close.addEventListener('click',()=>{
                        Util.modal(elements.window,false);
                    });
                    if(!append){
                        elements.frame.innerHTML="";
                    }
                    elements.frame.appendChild(frame);
                    elements.bar_title.addEventListener('mousedown',(evt)=>{
                        let x=evt.clientX;
                        let y=evt.clientY;
                        let top=elements.window.offsetTop;
                        let left=elements.window.offsetLeft;
                        let width=elements.window.offsetWidth;
                        let height=elements.window.offsetHeight;
                        let mousemove=(evt)=>{
                            let top_=top+evt.clientY-y;
                            let left_=left+evt.clientX-x;
                            if(top_>=0&&top_<=window.innerHeight-height){
                                elements.window.style.top=top_+"px";
                            }
                            if(left_>=0&&left_<=window.innerWidth-width){
                                elements.window.style.left=left_+"px";
                            }
                        };
                        let mouseup=(evt)=>{
                            window.removeEventListener('mousemove',mousemove);
                            window.removeEventListener('mouseup',mouseup);
                        };
                        window.addEventListener('mousemove',mousemove);
                        window.addEventListener('mouseup',mouseup);
                    });
                }
            )
        );
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
        this.loadWindow(table,"Subneteo - "+ip);
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