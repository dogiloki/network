var form=document.getElementById('form');
var content_table=document.getElementById('content_table');
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
    let table=this.subneteo.table;
    let columns=table.getColumns();
    let rows=table.getRows();
    let tr=this.createElement("tr");
    for(let key in columns){
        let column=columns[key];
        let th=this.createElement("th",column);
        tr.appendChild(th);
        this.content_table.appendChild(tr);
    }
    for(let row of rows){
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
    }
}

function createElement(type,value=null){
    let content=document.createElement(type);
    if(value!=null){
        content.innerHTML=value;
    }
    return content;
}