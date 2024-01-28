import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';

type DescriptiveResultType = {
    fieldName: string,
    values: any[],
    type: StatFieldType,
    max?: number,
    min?: number, 
    median?: number,
    mean?: number, 
}

export const descriptiveSlice = createSlice({
    name: 'descriptive',
    initialState: {
        results: [] as DescriptiveResultType[],
    }, 
    reducers: {
        
    },
})

// export const { setFields } = metaSlice.actions;

export const changeDescriptiveFields = (fieldIdList) => async (dispatch, getState) => {
    console.log(fieldIdList)
    const table = await bitable.base.getActiveTable();
    const fields = await getState().meta.fields;
    // TODO: if the user just remove some fields, don't need to fetch all records
    // TODO: process data more than 5000 lines 
    const response = await table.getRecords({
        pageSize: 5000
    })

    console.log(response.records);
    // result: {fieldName, values:[], type:categorical numeric, max, min, median, mean, ..}
    /* records format: 
        { recordId:ID, fields: [ fieldID: { 
            case 1: number // could be FieldType.DateTime, like 1705420800000
            case 2: [{type: 'text', text: '{TEXT}'}] // each line is one 
            case 3: [{id: 'OPTION_ID', text: 'option_text'}] // multiple choice
            case 4: {id: 'OPTION_ID', text: 'option_text'} // single choice
         }}
    */
}

export default descriptiveSlice.reducer;