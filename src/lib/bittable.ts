import { FieldType, bitable, IFieldMeta } from "@lark-base-open/js-sdk";


function getValueOfField(fieldData, fieldType) {
    if (fieldType === FieldType.DateTime) { // like 1705420800000
        return (new Date(fieldData)).toLocaleDateString();
    }
    else if(Array.isArray(fieldData)) { // case 3: [{id: 'OPTION_ID', text: 'option_text'}] // multiple choice
        return (fieldData.map(item => item.text)).join("\n");
    }
    else if(typeof fieldData === "object") { // case 2: [{type: 'text', text: '{TEXT}'}] // each line is one 
        return fieldData.text;
    }
    else { // case: number
        return fieldData;
    }
}

type FieldMetaMap = {
    [key: string]: IFieldMeta
};

export async function getFieldMap() {
    const table = await bitable.base.getActiveTable();
    const fieldMetas = await table.getFieldMetaList();
    let fieldMetaMap:FieldMetaMap = {}
    for (const fieldMeta of fieldMetas) {
        fieldMetaMap[fieldMeta.id] = fieldMeta;
    }
    return fieldMetaMap;
}

export async function getValuesByFieldIds(fieldIds) {
    const table = await bitable.base.getActiveTable();

    const fieldMetaMap = await getFieldMap();
    const recordList = await table.getRecordList();
    let result:any[] = [];
    for (const record of recordList) {
        let recordValues:any[] = [];
        for (const fieldId of fieldIds) {
            const fieldType = fieldMetaMap[fieldId];
            const cell = await record.getCellByField(fieldId);
            const val = await cell.getValue();
            recordValues.push(getValueOfField(val, fieldType));
        }
        result.push(recordValues);
    }
    return result;
}


export async function getValuesByFieldId(fieldId) {
    const records = await getValuesByFieldIds([fieldId]);
    return records.map(item => item[0]);
}