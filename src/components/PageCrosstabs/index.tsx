import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { setRowFieldNames, setColFieldNames, setAggMethod, setValueFieldName, doCrossTabs } from "../../store/crosstabsSlice";
import { T } from "../../locales/i18n";
import PivotTable from "../../lib/reactPivitTable/pivotTable";
import '../../lib/reactPivitTable/pivottable.css';

export default () => {
    const dispatch = useDispatch<any>();
    const fields = useSelector((state: any) =>state.meta.fields);
    const result = useSelector((state: any) =>state.crosstabs.result);
    const aggMethod = useSelector((state: any) =>state.crosstabs.aggMethod);
    const rowFieldNames = useSelector((state: any) =>state.crosstabs.rowFieldNames);
    const colFieldNames = useSelector((state: any) =>state.crosstabs.colFieldNames);
    const valueFieldName = useSelector((state: any) =>state.crosstabs.valueFieldName);
    const allRecords = useSelector((state: any) =>state.crosstabs.allRecords);

    const allFieldOptions = fields.map(field =>(
        <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
    ));

    const aggTypes = {
        'Count': {name: T('crosstabs.count'), needField: false },
        'Count as Fraction of Rows': {name: T('crosstabs.countFractionRow'), needField: false },
        'Count as Fraction of Columns': {name: T('crosstabs.countFractionCol'), needField: false },
        'Count as Fraction of Total': {name: T('crosstabs.countFractionTotal'), needField: false },
        'Count Unique Values': {name: T('crosstabs.countUnique'), needField: false },
        'Sum': {name: T('crosstabs.sum'), needField: true },
        'Sum as Fraction of Rows': {name: T('crosstabs.sumFractionRow'), needField: true },
        'Sum as Fraction of Columns': {name: T('crosstabs.sumFractionCol'), needField: true },
        'Sum as Fraction of Total': {name: T('crosstabs.sumFractionTotal'), needField: true },
        'Average': {name: T('crosstabs.average'), needField: true },
        'Median': {name: T('crosstabs.median'), needField: true },
        'Minimum': {name: T('crosstabs.minimum'), needField: true },
        'Maximum': {name: T('crosstabs.maximum'), needField: true },
    }

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title={T('modules.crosstabs')}/>
            <div className="pageBody">
            <Form labelPosition='top' onSubmit={value => {dispatch(doCrossTabs(value))}}>
                <Form.Select
                    field="rowFields"
                    multiple
                    placeholder={T('pleaseSelectField')}
                    label={T('crosstabs.rowfield')}
                    onChange={(value:any) => {dispatch(setRowFieldNames(value.map(val => val.label)))}}
                    onChangeWithObject={true}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
                <Form.Select
                    field="colFields"
                    multiple
                    placeholder={T('pleaseSelectField')}
                    label={T('crosstabs.colfield')}
                    onChange={(value:any) => {dispatch(setColFieldNames(value.map(val => val.label)))}}
                    onChangeWithObject={true}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
                <Form.Select
                    field="aggMethod"
                    placeholder={T('crosstabs.selectaggmethod')}
                    label={T('crosstabs.selectaggmethod')}
                    onChange={(value) => {dispatch(setAggMethod(value))}}
                    initValue="Count"
                >
                    {Object.entries(aggTypes).map(item =>
                        <Select.Option key={item[0]} value={item[0]}>{item[1].name}</Select.Option>)}
                    
                </Form.Select>
                {aggTypes[aggMethod].needField ? 
                <Form.Select field="valueField" placeholder={T('pleaseSelectField')} 
                            label={T("crosstabs.valuefield")}
                            onChange={(value:any) => {dispatch(setValueFieldName(value.label))}}
                            onChangeWithObject={true}>
                    {allFieldOptions}
                </Form.Select>
                 : ''}
                <Button type="primary" htmlType="submit" className="btn-margin-right">{T('run')}</Button>
            </Form>
            <div className="result-text">{result}</div>
            { allRecords.length > 0 && rowFieldNames.length > 0 && colFieldNames.length > 0 ?
                    <PivotTable data={allRecords} rows={rowFieldNames} 
                        cols={colFieldNames} vals={[valueFieldName]} aggregatorName={aggMethod}/>
            :""}
            </div>
        </div>
    )    
}
