import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { setField, setTestType, doHypothesisTest } from "../../store/hypothesisSlice";
import { T } from "../../locales/i18n";

export default () => {
    const dispatch = useDispatch<any>();
    const fields = useSelector((state: any) =>state.meta.fields);
    const result = useSelector((state: any) =>state.hypothesis.result);
    const error = useSelector((state: any) =>state.hypothesis.error);
    const testType = useSelector((state: any) =>state.hypothesis.testType);

    const allFieldOptions = fields.map(field =>(
        <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
    ));
    const makeFieldSelect = (key, label) => <Form.Select field={key} placeholder={T('pleaseSelectField')} label={label}>
            {allFieldOptions}
        </Form.Select>
    const makeFieldInput = (key, label) => <Form.Input field={key} label={label} 
            onChange={(value) => {dispatch(setField({'field': key, 'value': value}))}} />
    

    const hypoTestTypes = {
        'chiSquared': {name: T('hypothesis.chisquared'), 
            options: <>{makeFieldSelect('yFieldId', T('hypothesis.field1'))}{makeFieldSelect('xFieldId', T('hypothesis.field2'))}</>},
        'oneSampleTTest': {name: T('hypothesis.oneSampleT'), 
            options: <>{makeFieldSelect('yFieldId', T('hypothesis.numericField'))}{makeFieldInput('param', T('hypothesis.numberToTest'))}</>},
        'indTTest': {name: T('hypothesis.independentSampleT'),
            options: <>{makeFieldSelect('yFieldId', T('hypothesis.field2'))}{makeFieldSelect('xFieldId', T('hypothesis.field2'))}</>},
        'pairedTTest': {name: T('hypothesis.pairedSampleT'),
            options: <>{makeFieldSelect('yFieldId', T('hypothesis.field1'))}{makeFieldSelect('xFieldId', T('hypothesis.field2'))}</>},
        'oneWayAnova': {name: T('hypothesis.oneWayAnova'),
            options: <>{makeFieldSelect('yFieldId', T('hypothesis.independentVairableNumeric'))}{makeFieldSelect('xFieldId', T('hypothesis.categoricalField'))}</>},
    }

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title={T('modules.hypotest')}/>
            <div className="pageBody">
            <Form labelPosition='top' onSubmit={value => {dispatch(doHypothesisTest(value))}}>
                <Form.Select
                    field="testType"
                    placeholder={T('hypothesis.selectTestType')}
                    label={T('hypothesis.testType')}
                    onChange={(value) => {dispatch(setTestType(value))}}
                >
                    {Object.entries(hypoTestTypes).map(item =>
                        <Select.Option key={item[0]} value={item[0]}>{item[1].name}</Select.Option>)}
                    
                </Form.Select>
                {hypoTestTypes[testType].options}
                <Button type="primary" htmlType="submit" className="btn-margin-right">{T('run')}</Button>
            </Form>
            <div className="result-text">{result}</div>
            </div>
        </div>
    )    
}
