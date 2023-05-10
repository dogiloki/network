class ModelTable{

    constructor(){
        this.columns={};
        this.rows=[];
    }

    getColumns(){
        return this.columns;
    }

    addColumn(name,key=null){
        if(key==null){
            this.columns.push(name);
        }else{
            this.columns[key]=name;
        }
    }

    countColumns(){
        return this.columns.length;
    }

    getRows(){
        return this.rows;
    }

    getRow(key){
        return this.rows[key]??null;
    }

    addRow(row){
        this.rows.push(row);
    }

    countRows(){
        return this.rows.length;
    }

}