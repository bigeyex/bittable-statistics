import Statistics from 'statistics.js';
import { FieldType, IFieldMeta } from "@lark-base-open/js-sdk";


function getFieldMetaMap(fieldMetas) {
    let fieldTypeMap = {};
    for (let field of fieldMetas) {
        fieldTypeMap[field.id] = field;
    }
    return fieldTypeMap;
}

/*
    for all, export n, missing
    for categorical, draw a bar chart of top 6
    for numeric, print avg, sd, min, 25%, median, 75%, max,  draw histogram
*/
export function getDescriptiveResults(records, selectedFieldIds, fieldMetaMap) {
    if (records.length === 0 || selectedFieldIds.length === 0) {
        return [];
    }

    const stats = new Statistics([], {});
    let descriptiveResults:object[] = [];

    for (let fieldId of selectedFieldIds) {
        const data = records[fieldId]
        const nonNullData = data.filter(x => x !== null);
        let fieldDescriptive = {
            n: data.length,
            name: fieldMetaMap[fieldId].name,
            missing: data.length - nonNullData.length,
            isNumeric: fieldMetaMap[fieldId].type === FieldType.Number
        };

        if (fieldDescriptive.isNumeric) {
            fieldDescriptive = Object.assign(fieldDescriptive, {
                x: nonNullData,
                avg: stats.arithmeticMean(nonNullData),
                sd: stats.standardDeviation(nonNullData),
                min: stats.minimum(nonNullData),
                quantile25: stats.quantile(nonNullData, 0.25),
                median: stats.median(nonNullData),
                quantile75: stats.quantile(nonNullData, 0.75),
                max: stats.maximum(nonNullData),
            });
        }
        else {  // categorical
            type FrequencyResultType = {value:string, absolute:number, relative:number};
            const frequencies:FrequencyResultType[] = stats.frequencies(nonNullData);
            fieldDescriptive = Object.assign(fieldDescriptive, {
                x: frequencies.slice(0, 6).map(item => item.value),
                y: frequencies.slice(0, 6).map(item => item.absolute),
            });
        }

        descriptiveResults.push(fieldDescriptive);
    }
    return descriptiveResults;
}