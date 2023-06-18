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
        this.total_windows=0;
        this.content=Object.freeze({
            btns:{
                save: document.getElementById('btn-save'),
                clear: document.getElementById('btn-clear'),
            },
            ip:{
                form: document.getElementById('form-ip'),
                table: document.getElementById('table-ip')
            },
            subneteo:{
                template: document.getElementById('template-subneteo').content,
                datas: [] // section:[document.section], subneteo:Subneteo
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
                subnets:this.content.ip.form['subnets'].value
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
                    this.createElement("td",ip.subnets),
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
                            this.loadTableSubneteo(ip.ip,ip.subnets);
                        });
                    })
                ])
            );
            index++;
        }
    }

    loadWindow(frame,title,append=false){
        this.total_windows++;
        new Template(
            this.content.templates.window,
            document.body,
            new TemplateElement(
                ["window","frame","title","btn-close","bar-title"],
                (elements)=>{
                    elements.window.setAttribute('id','window-'+this.total_windows);
                    elements.window.setAttribute('title',title);
                    elements.title.textContent=title;
                    elements.btn_close.addEventListener('click',()=>{
                        document.body.removeChild(elements.window);
                        this.total_windows--;
                    });
                    if(!append){
                        elements.frame.innerHTML="";
                    }
                    elements.frame.appendChild(frame);
                    elements.window.style.top="0px";
                    elements.window.style.right="0px";
                    elements.bar_title.addEventListener('mousedown',(evt)=>{
                        this.total_windows++;
                        elements.window.style.zIndex=this.total_windows;
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

    loadTableSubneteo(ip,subnets){
        // Verficar si ya se genero la tabla de subneteo
        for(let data of this.content.subneteo.datas){
            if(data.subneteo.ip.getAddress()==ip && data.subneteo.subnets==subnets){
                this.loadWindow(data.section.cloneNode(true),"Subneteo - "+ip);
                return;
            }
        }
        let subneteo=new Subneteo(ip,subnets);
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
        let section=document.createElement("section");
        this.content.subneteo.datas.push({
            section:section,
            subneteo:subneteo
        });
        new Template(
            this.content.subneteo.template,
            section,
            new TemplateElement(
                ["content-info","content-table"],
                (elements)=>{
                    elements.content_info.innerHTML="";
                    elements.content_table.innerHTML="";
                    elements.content_info.appendChild(this.createElement("p","IP: "+subneteo.ip.getAddress()));
                    elements.content_info.appendChild(this.createElement("p","Submáscara original: "+subneteo.ip.getNetMask()));
                    elements.content_info.appendChild(this.createElement("p","Clasificación de red: "+subneteo.ip.getName()));
                    elements.content_info.appendChild(this.createElement("p","Número de bits: "+subneteo.number_bits));
                    elements.content_info.appendChild(this.createElement("p","Total de dispositivos: "+subneteo.number_devices));
                    elements.content_info.appendChild(this.createElement("p","Submáscara: "+subneteo.netmask));
                    elements.content_info.appendChild(this.createElement("p","Saltos de bits: "+subneteo.net_jump));
                    elements.content_table.appendChild(table);
                }
            )
        );
        this.loadWindow(section,"Subneteo - "+ip);
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