class Template{

    constructor(template,element,template_action=null,append=true){
        this.template=template;
        this.element=element;
        this.template_action=template_action;
        this.append=append;
        this.loadTemplate();
    }

    loadTemplate(){
        let template=this.template.cloneNode(true);
        if(this.template_action!=null){
            let elements={};
            for(let id of this.template_action.ids){
                elements[id]=template.getElementById(id);
                elements[id.replaceAll("-","_")]=elements[id];
            }
            this.template_action.action(elements);
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

class TemplateAction{

    constructor(ids=[],action=null){
        this.ids=ids;
        this.action=action;
    }

}