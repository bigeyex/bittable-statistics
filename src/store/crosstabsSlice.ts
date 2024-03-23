import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { oneWayANOVA } from 'statsmodels-js';
import Statistics from 'statistics.js';

import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';
import { T } from '../locales/i18n';


export const crosstabsSlice = createSlice({
    name: 'crosstabs',
    initialState: {
        // field values 
        aggMethod: 'Count',
        rowFieldNames: [],
        colFieldNames: [],
        valueFieldName: null,
        allRecords: [],

        // result
        result: '',
        error: '',
    }, 
    reducers: {
        setField(state, action) {
            state[action.payload.field] = action.payload.value;
        },

        setAggMethod(state, action) {
            state.aggMethod = action.payload;
        },
        
        setRowFieldNames(state, action) {
            state.rowFieldNames = action.payload;
        },

        setColFieldNames(state, action) {
            state.colFieldNames = action.payload;
        },

        setValueFieldName(state, action) {
            state.valueFieldName = action.payload;
        },

        setAllRecords(state, action) {
            state.allRecords = action.payload;
        },

        setResult(state, action) {
            state.result = action.payload;
        },
    },
})

function statDataFromRecords(records, labels) {
    // [[field1Value, field2Value], ...] => [{field1: field1Value, field2: field2Value}...]
    return records.map(record => Object.fromEntries(record.map((field, index) => [labels[index], field])));
}

export const { setField, setAggMethod, setRowFieldNames, setColFieldNames, setValueFieldName, setAllRecords, setResult } = crosstabsSlice.actions;

export const doCrossTabs = (payload) => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    const fieldMap = await getFieldMap();
    const allFieldIds = Object.keys(fieldMap);
    const allFieldNames = allFieldIds.map(fieldId => fieldMap[fieldId].name);
    const allRecords = await getValuesByFieldIds(allFieldIds);
    const allRecordsInMap = statDataFromRecords(allRecords, allFieldNames);

    dispatch(setAllRecords(allRecordsInMap));
    
    dispatch(setResult(''))
}


export default crosstabsSlice.reducer;