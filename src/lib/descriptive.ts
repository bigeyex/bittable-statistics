import Statistics from 'statistics.js';
import { FieldType, IFieldMeta } from "@lark-base-open/js-sdk";


function getFieldTypeMap(allFields) {
    let fieldTypeMap = {};
    for (let field of allFields) {
        fieldTypeMap[field.name] = field.type;
    }
    return fieldTypeMap;
}

/*
    for all, export n, missing
    for categorical, draw a bar chart of top 6
    for numeric, print avg, sd, min, 25%, median, 75%, max,  draw histogram
*/
export function getDescriptiveResults(records, fieldNames, allFields) {
    if (records.length === 0 || fieldNames.length === 0) {
        return [];
    }

    const stats = new Statistics([], {});
    const fieldTypeMap = getFieldTypeMap(allFields);
    let descriptiveResults:object[] = [];

    for (let fieldName of fieldNames) {
        const data = records[fieldName]
        const nonNullData = data.filter(x => x !== null);
        let fieldDescriptive = {
            n: data.length,
            name: fieldName,
            missing: data.length - nonNullData.length,
            isNumeric: fieldTypeMap[fieldName] === FieldType.Number
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