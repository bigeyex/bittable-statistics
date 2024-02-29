import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { setXField, setYField, doRegression } from "../../store/regressionSlice";

export default () => {
    const dispatch = useDispatch<any>();
    const fields = useSelector((state: any) =>state.meta.fields);
    const result = useSelector((state: any) =>state.regression.result);
    const error = useSelector((state: any) =>state.regression.error);

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title="线性回归"/>
            <div className="pageBody">
            <Form labelPosition='top'>
                <Form.Select
                    field="yfield"
                    placeholder='请选择字段'
                    label="因变量(Y)"
                    onChange={(value) => {dispatch(setYField(value))}}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
                <Form.Select
                    field="xfield"
                    multiple
                    placeholder='请选择字段'
                    label="自变量(X)"
                    onChange={(value) => {dispatch(setXField(value))}}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
                <Button onClick={()=>dispatch(doRegression(null))}>执行回归</Button>
            </Form>
            <div className="result-text">{result}</div>
            </div>
        </div>
    )    
}
