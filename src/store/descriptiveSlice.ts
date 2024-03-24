import { createSlice } from '@reduxjs/toolkit'
import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';

import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { T } from '../locales/i18n';
import { getDescriptiveResults } from '../lib/descriptive';

export const descriptiveSlice = createSlice({
    name: 'descriptive',
    initialState: {
        selectedFieldIds: [],
        allRecordsByFieldId: [],
        result: '',
        descriptiveResults: [],
    }, 
    reducers: {
        setSelectedFieldIds(state, action) {
            state.selectedFieldIds = action.payload;
        },

        setResult(state, action) {
            state.result = action.payload;
        },

        setAllRecordsByFieldId(state, action) {
            state.allRecordsByFieldId = action.payload;
        },

        setDescriptiveResults(state, action) {
            state.descriptiveResults = action.payload;
        },

    },
})

export const { setSelectedFieldIds, setResult, setAllRecordsByFieldId, 
    setDescriptiveResults } = descriptiveSlice.actions;

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

export const refreshAllRecords = (payload) => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    const selectedFieldIds = payload.yfields;
    const fieldMetaMap = await getFieldMap();
    const allRecords = await getValuesByFieldIds(selectedFieldIds);
    const allRecordsTransposed = transpose(allRecords);
    let recordsByFieldId = {};
    for (let i=0; i<selectedFieldIds.length; i++) {
        recordsByFieldId[selectedFieldIds[i]] = allRecordsTransposed[i];
    }
    dispatch(setDescriptiveResults(getDescriptiveResults(recordsByFieldId, selectedFieldIds, fieldMetaMap)));
    dispatch(setResult(''))
}

export default descriptiveSlice.reducer;