import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { pearsonr } from '../lib/statsmodels';
import Statistics from 'statistics.js';

import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';
import { T } from '../locales/i18n';


export const correlationSlice = createSlice({
    name: 'correlation',
    initialState: {
        // field values 
        correlationInfo: null, // {'fieldMap': {}, 'fieldIds": [...], 'correlations: {'fieldId,fieldId': {v: ..., p: ...}}}

        // result
        result: '',
        error: '',
    }, 
    reducers: {
        setCorrelationInfo(state, action) {
            state.correlationInfo = action.payload;
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

export const { setCorrelationInfo, setResult } = correlationSlice.actions;

export const doCorrelation = (payload) => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    const fieldMap = await getFieldMap();
    const fieldIds = payload.fields;

    const allRecords = await getValuesByFieldIds(fieldIds);
    const statData = statDataFromRecords(allRecords, fieldIds);
    const statVars = Object.fromEntries(fieldIds.map(id => [id, {scale: 'interval'}]))
    const stats = new Statistics(statData, statVars);
    let correlations = {};
    for (let i=0; i<fieldIds.length; i++) {
        for (let j=i+1; j<fieldIds.length; j++) {
            let correlationResult;
            if (payload.method === 'pearson') {
                const a = statData.map(row => row[fieldIds[i]]);
                const b = statData.map(row => row[fieldIds[j]]);
                const result = pearsonr(a, b);
                correlationResult = {
                    v: result.r.toFixed(3),
                    p: result.pValue,
                }
            }
            else {
                if (payload.method === 'spearman') {
                    const result = stats.spearmansRho(fieldIds[i], fieldIds[j]);
                    correlationResult = {
                        v: result.rho.toFixed(3),
                        p: result.significanceStudent.pTwoTailed,
                    }
                }
                else { // kendall's tau
                    const result = stats.kendallsTau(fieldIds[i], fieldIds[j]);
                    console.log('tau', result);
                    correlationResult = {
                        v: result.b.tauB.toFixed(3),
                        p: result.b.pTwoTailed,
                    }
                }
            }
            correlations[fieldIds[i] + fieldIds[j]] = correlationResult;
        }
    }

    dispatch(setCorrelationInfo({
        fieldMap: fieldMap,
        fieldIds: fieldIds,
        correlations: correlations,
    }));
    
    dispatch(setResult(''))
}


export default correlationSlice.reducer;