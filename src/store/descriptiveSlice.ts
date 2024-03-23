import { createSlice } from '@reduxjs/toolkit'
import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';

import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { T } from '../locales/i18n';

export const descriptiveSlice = createSlice({
    name: 'descriptive',
    initialState: {
        fieldNames: [],
        allRecordsByFieldName: [],
        result: '',
    }, 
    reducers: {
        setFieldNames(state, action) {
            state.fieldNames = action.payload;
        },

        setResult(state, action) {
            state.result = action.payload;
        },

        setAllRecordsByFieldName(state, action) {
            state.allRecordsByFieldName = action.payload;
        },

    },
})

export const { setFieldNames, setResult, setAllRecordsByFieldName } = descriptiveSlice.actions;

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

export const refreshAllRecords = () => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    const fieldMap = await getFieldMap();
    const allFieldIds = Object.keys(fieldMap);
    const allFieldNames = allFieldIds.map(fieldId => fieldMap[fieldId].name);
    const allRecords = await getValuesByFieldIds(allFieldIds);
    const allRecordsTransposed = transpose(allRecords);
    let recordsByFieldName = {};
    for (let i=0; i<allFieldNames.length; i++) {
        recordsByFieldName[allFieldNames[i]] = allRecordsTransposed[i];
    }

    dispatch(setAllRecordsByFieldName(recordsByFieldName));
    dispatch(setResult(''))
}

export default descriptiveSlice.reducer;