import { FieldType, bitable, IFieldMeta, IRecord } from "@lark-base-open/js-sdk";


function getValueOfField(fieldData, fieldType) {
    if (fieldType === FieldType.DateTime) { // like 1705420800000
        return (new Date(fieldData)).toLocaleDateString();
    }
    else if(Array.isArray(fieldData)) { // case 3: [{id: 'OPTION_ID', text: 'option_text'}] // multiple choice
        return (fieldData.map(item => item.text)).join("\n");
    }
    else if(fieldData === null) {
        return null;
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
    const fieldList:any[] = [];
    for (const fieldId of fieldIds) {
        const field:any = await table.getFieldById(fieldId);
        fieldList.push(field);
    }

    let recordIdList:string[] = []
    let hasMorePage = false
    let nextPageToken: number | undefined = undefined
    do {
        const { hasMore, pageToken, recordIds } = await table.getRecordIdListByPage({
            pageToken: nextPageToken,
            pageSize: 200
        })
        nextPageToken = pageToken
        hasMorePage = hasMore
        recordIdList = recordIdList.concat(recordIds)
    } while (hasMorePage)

    await table.getRecordIdList();
    let result:any[] = [];
    for (const recordId of recordIdList) {
        let recordValues:any[] = [];
        for (const field of fieldList) {
            const val = await field.getValue(recordId);
            recordValues.push(getValueOfField(val, field.type));
        }
        result.push(recordValues);
    }
    return result;
}


export async function getValuesByFieldId(fieldId) {
    const records = await getValuesByFieldIds([fieldId]);
    return records.map(item => item[0]);
}