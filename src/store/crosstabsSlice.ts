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

        crossTabInfo: null,

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

        setCrossTabInfo(state, action) {
            state.crossTabInfo = action.payload;
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

export const { setField, setAggMethod, setCrossTabInfo, setResult } = crosstabsSlice.actions;

export const doCrossTabs = (payload) => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    const fieldMap = await getFieldMap();
    let relaventFieldIds = [...payload.rowFields, ...payload.colFields];
    if (payload.valueField) {
        relaventFieldIds.push(payload.valueField);
    }
    const allFieldNames = relaventFieldIds.map(fieldId => fieldMap[fieldId].name);
    const allRecords = await getValuesByFieldIds(relaventFieldIds);
    const allRecordsInMap = statDataFromRecords(allRecords, allFieldNames);

    dispatch(setCrossTabInfo({
        allRecords: allRecordsInMap,
        rowFieldNames: payload.rowFields.map(fieldId => fieldMap[fieldId].name),
        colFieldNames: payload.colFields.map(fieldId => fieldMap[fieldId].name),
        valueFieldName: payload.valueField ? fieldMap[payload.valueField].name : null,
    }));
    
    dispatch(setResult(''))
}


export default crosstabsSlice.reducer;