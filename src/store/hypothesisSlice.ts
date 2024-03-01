import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { SimpleLinearRegression, MultipleLinearRegression } from 'statsmodels-js';
import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';


export const descriptiveSlice = createSlice({
    name: 'hypothesis',
    initialState: {
        // field values 
        testType: 'indTTest',

        // result
        result: '',
        error: '',
    }, 
    reducers: {
        setField(state, action) {
            state[action.payload.field] = action.payload.value;
        },
        
        setTestType(state, action) {
            state.testType = action.payload;
        },

        setResult(state, action) {
            state.result = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        }
    },
})



async function chiSquaredTest({yFieldId, xFieldId}) {
    const values = await getValuesByFieldIds([yFieldId, xFieldId]);
}

async function oneSampleTTest(payload) {
    
}

async function indTTest(payload) {
    
}

async function pairedTTest(payload) {
    
}

async function oneWayAnova(payload) {
    
}


export const { setField, setTestType,  setResult, setError } = descriptiveSlice.actions;

export const doHypothesisTest = (payload) => async (dispatch, getState) => {
    dispatch(setResult('计算中...'));
    console.log(payload);
    // console.log(SimpleLinearRegression);

}


export default descriptiveSlice.reducer;