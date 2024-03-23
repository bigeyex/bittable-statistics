import { createSlice } from '@reduxjs/toolkit'
import { FieldType, bitable } from "@lark-base-open/js-sdk";
import { StatFieldType } from '.';
import { oneWayANOVA } from 'statsmodels-js';
import Statistics from 'statistics.js';

import { getValuesByFieldId, getValuesByFieldIds, getFieldMap } from '../lib/bittable';
import { T } from '../locales/i18n';


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

function statDataFromRecords(records, labels) {
    // [[field1Value, field2Value], ...] => [{field1: field1Value, field2: field2Value}...]
    return records.map(record => Object.fromEntries(record.map((field, index) => [labels[index], field])));
}

async function chiSquaredTest({yFieldId, xFieldId}) {
    const allRecords = await getValuesByFieldIds([yFieldId, xFieldId]);
    const statData = statDataFromRecords(allRecords, ['yField', 'xField']);
    const statVars = { xField: {scale: 'nominal'}, yField: {scale: 'nominal'} };
    console.log(statData, statVars);
    const stats = new Statistics(statData, statVars);
    const chiSquared = stats.chiSquaredTest('xField', 'yField');
    return `${T('hypothesis.chisquaredValue')}: ${chiSquared.PearsonChiSquared}
            ${T('hypothesis.dof')}: ${chiSquared.degreesOfFreedom}
            P < ${chiSquared.significance}`
}

async function oneSampleTTest({yFieldId, param}) {
    const allRecords = await getValuesByFieldIds([yFieldId]);
    const statData = statDataFromRecords(allRecords, ['yField']);
    const statVars = { yField: {scale: 'metric'} };
    const stats = new Statistics(statData, statVars);
    const oneSample = stats.studentsTTestOneSample('yField', param);
    return `t-${T('hypothesis.statvalue')}: ${oneSample.tStatistic}
            ${T('hypothesis.dof')}: ${oneSample.degreesOfFreedom}
            P (${T('hypothesis.oneSided')}) < ${oneSample.pOneSided}
            P (${T('hypothesis.twoSided')}) < ${oneSample.pTwoSided}`
}

async function indTTest({yFieldId, xFieldId}) {
    const allRecords = await getValuesByFieldIds([yFieldId, xFieldId]);
    const statData = statDataFromRecords(allRecords, ['yField', 'xField']);
    const statVars = { xField: {scale: 'interval'}, yField: {scale: 'interval'} };
    const stats = new Statistics(statData, statVars);
    const twoSamples = stats.studentsTTestTwoSamples('xField', 'yField', { dependent: false });
    return `t-${T('hypothesis.statvalue')}: ${twoSamples.tStatistic}
            ${T('hypothesis.dof')}: ${twoSamples.degreesOfFreedom}
            P (${T('hypothesis.oneSided')}) < ${twoSamples.pOneSided}
            P (${T('hypothesis.twoSided')}) < ${twoSamples.pTwoSided}`
}

async function pairedTTest({yFieldId, xFieldId}) {
    const allRecords = await getValuesByFieldIds([yFieldId, xFieldId]);
    const statData = statDataFromRecords(allRecords, ['yField', 'xField']);
    const statVars = { xField: {scale: 'interval'}, yField: {scale: 'interval'} };
    const stats = new Statistics(statData, statVars);
    const twoSamples = stats.studentsTTestTwoSamples('xField', 'yField', { dependent: true });
    return `t-${T('hypothesis.statvalue')}: ${twoSamples.tStatistic}
            ${T('hypothesis.dof')}: ${twoSamples.degreesOfFreedom}
            P (${T('hypothesis.oneSided')}) < ${twoSamples.pOneSided}
            P (${T('hypothesis.twoSided')}) < ${twoSamples.pTwoSided}`
}

async function oneWayAnova({yFieldId, xFieldId}) {
    const allRecords = await getValuesByFieldIds([yFieldId, xFieldId]);
    let valuesByX = {}; // {x1: [x1y1, x1y2,...]}
    for (let record of allRecords) {
        let [y, x] = record;
        if (!(x in valuesByX)) {
            valuesByX[x] = [];
        }
        valuesByX[x].push(y);
    }
    const anovaResult = oneWayANOVA(...Object.values(valuesByX));
    return `F-${T('hypothesis.statvalue')}: ${anovaResult.statistic}
            P < ${anovaResult.pValue}`;
}


export const { setField, setTestType, setResult, setError } = descriptiveSlice.actions;

export const doHypothesisTest = (payload) => async (dispatch, getState) => {
    dispatch(setResult(T('calculating')));
    let resultStr = '';
    if (payload.testType === 'chiSquared') {
        resultStr = await chiSquaredTest(payload);
    }
    else if (payload.testType === 'oneSampleTTest') {
        resultStr = await oneSampleTTest(payload);
    }
    else if (payload.testType === 'indTTest') {
        resultStr = await indTTest(payload);
    }
    else if (payload.testType === 'pairedTTest') {
        resultStr = await pairedTTest(payload);
    }
    else if (payload.testType === 'oneWayAnova') {
        resultStr = await oneWayAnova(payload);
    }
    dispatch(setResult(resultStr))
}


export default descriptiveSlice.reducer;