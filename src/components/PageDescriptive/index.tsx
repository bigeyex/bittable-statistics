import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { changeDescriptiveFields } from "../../store/descriptiveSlice";

export default () => {
    const dispatch = useDispatch<any>()
    const fields = useSelector((state: any) =>state.meta.fields)

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);


    return (
        <div>
            <PageHeader title="描述性统计"/>
            <div className="pageBody">
            <Form labelPosition='top'>
                <Form.Select
                    field="field"
                    multiple
                    placeholder='请选择参与描述性统计的字段'
                    label="统计字段"
                    onChange={(value) => {dispatch(changeDescriptiveFields(value))}}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
            </Form>
            </div>
        </div>
    )    
}
