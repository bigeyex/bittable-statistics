import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { SimpleLinearRegression, MultipleLinearRegression } from 'statsmodels-js';
import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';


export const descriptiveSlice = createSlice({
    name: 'regression',
    initialState: {
        // field values 
        yFieldId: null,
        xFieldIdList: [],

        // result
        result: '',
        error: '',
    }, 
    reducers: {
        setXField(state, action) {
            state.xFieldIdList = action.payload;
        },

        setYField(state, action) {
            state.yFieldId = action.payload;
        },

        setResult(state, action) {
            state.result = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        }
    },
})

function prefixPlusWhenPositive(value) {
    return value > 0 ? '+ ' + value : '- ' + Math.abs(value);
}

export const { setXField, setYField, setResult, setError } = descriptiveSlice.actions;

export const doRegression = (fieldIdList) => async (dispatch, getState) => {
    dispatch(setResult('计算中...'));
    const yFieldId = await getState().regression.yFieldId;
    const xFieldIdList = await getState().regression.xFieldIdList;
    const yValues = await getValuesByFieldId(yFieldId);
    const fieldMap = await getFieldMap();
    if (xFieldIdList.length == 1) {
        const xValues = await getValuesByFieldId(xFieldIdList[0]);
        const regressionResult = new SimpleLinearRegression(xValues, yValues).fit().summary();
        dispatch(setResult(`${fieldMap[yFieldId].name} = 
            ${regressionResult.coef} * ${fieldMap[xFieldIdList[0]].name}
            ${prefixPlusWhenPositive(regressionResult.intercept)} \n
            R2 Score = ${regressionResult['r2Score']} `));

    }
    else { // multiple regression
        const xValues = await getValuesByFieldIds(xFieldIdList);
        const regressionResult = new MultipleLinearRegression(xValues, yValues).fit().summary();
        const coefResult = xFieldIdList.map((fieldId, ind) => 
            `${prefixPlusWhenPositive(regressionResult['x'+(ind+1)])} * ${fieldMap[fieldId].name}`).join('\n');
        dispatch(setResult(`${fieldMap[yFieldId].name} = 
            ${coefResult}
            ${prefixPlusWhenPositive(regressionResult.intercept)} \n
            R2 Score = ${regressionResult['r2Score']} `));
    }
    
    // console.log(SimpleLinearRegression);

}


export default descriptiveSlice.reducer;