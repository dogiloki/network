class ModelTable{

    constructor(){
        this.columns={};
        this.rows={};
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
        return this.row[key]??null;
    }

    addRow(row){
        let new_row;
        row.array.forEach((item,key)=>{
            new_row[key]=item[key]??null;
        });
        this.rows.push(new_row);
    }

    countRows(){
        return this.rows.length;
    }

}