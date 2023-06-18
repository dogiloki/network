class Template{

    constructor(template,element,params=null,append=true){
        this.template=template;
        this.element=element;
        this.params=params;
        this.append=append;
        this.loadTemplate();
    }

    loadTemplate(){
        let template=this.template.cloneNode(true);
        if(this.params!=null){
            let elements={};
            for(let id of this.params.ids){
                elements[id]=template.getElementById(id);
                elements[id.replaceAll("-","_")]=elements[id];
            }
            this.params.action(elements);
        }
        if(!this.append){
            this.element.innerHTML="";
        }
        this.element.appendChild(template);
    }

    getElement(){
        return this.element;
    }

}

class TemplateElement{

    constructor(ids=[],action=null){
        this.ids=ids;
        this.action=action;
    }

}