import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { setField, setTestType, doHypothesisTest } from "../../store/hypothesisSlice";

export default () => {
    const dispatch = useDispatch<any>();
    const fields = useSelector((state: any) =>state.meta.fields);
    const result = useSelector((state: any) =>state.hypothesis.result);
    const error = useSelector((state: any) =>state.hypothesis.error);
    const testType = useSelector((state: any) =>state.hypothesis.testType);

    const allFieldOptions = fields.map(field =>(
        <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
    ));
    const makeFieldSelect = (key, label) => <Form.Select field={key} placeholder='请选择字段' label={label}>
            {allFieldOptions}
        </Form.Select>
    const makeFieldInput = (key, label) => <Form.Input field={key} label={label} 
            onChange={(value) => {dispatch(setField({'field': key, 'value': value}))}} />
    

    const hypoTestTypes = {
        'chiSquared': {name: '卡方检验(分类-分类)', 
            options: <>{makeFieldSelect('yFieldId', '字段一')}{makeFieldSelect('xFieldId', '字段二')}</>},
        'oneSampleTTest': {name: '单样本T检验(数值-固定数字)', 
            options: <>{makeFieldSelect('yFieldId', '数值字段')}{makeFieldInput('param', '检验数值')}</>},
        'indTTest': {name: '独立样本T检验(数值-数值)', 
            options: <>{makeFieldSelect('yFieldId', '字段一')}{makeFieldSelect('xFieldId', '字段二')}</>},
        'pairedTTest': {name: '配对样本T检验(数值-数值)', 
            options: <>{makeFieldSelect('yFieldId', '字段一')}{makeFieldSelect('xFieldId', '字段二')}</>},
        'oneWayAnova': {name: 'F检验/One-Way ANOVA(数值-分类)', 
            options: <>{makeFieldSelect('yFieldId', '因变量（数值）')}{makeFieldSelect('xFieldId', '分类字段')}</>},
    }

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title="假设检验"/>
            <div className="pageBody">
            <Form labelPosition='top' onSubmit={value => {dispatch(doHypothesisTest(value))}}>
                <Form.Select
                    field="testType"
                    placeholder='请选择检验类型'
                    label="检验类型"
                    onChange={(value) => {dispatch(setTestType(value))}}
                >
                    {Object.entries(hypoTestTypes).map(item =>
                        <Select.Option key={item[0]} value={item[0]}>{item[1].name}</Select.Option>)}
                    
                </Form.Select>
                {hypoTestTypes[testType].options}
                <Button type="primary" htmlType="submit" className="btn-margin-right">执行检验</Button>
            </Form>
            <div className="result-text">{result}</div>
            </div>
        </div>
    )    
}
