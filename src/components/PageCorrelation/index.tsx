import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { doCorrelation } from "../../store/correlationSlice";
import { T } from "../../locales/i18n";
import '../../lib/reactPivitTable/pivottable.css';

export default () => {
    const dispatch = useDispatch<any>();
    const fields = useSelector((state: any) =>state.meta.fields);
    const result = useSelector((state: any) =>state.correlation.result);
    const correlationInfo = useSelector((state: any) =>state.correlation.correlationInfo);

    const renderCorrelationTable = () => {
        if (correlationInfo === null) {
            return '';
        }

        const {fieldMap, fieldIds, correlations} = correlationInfo;
        return <table className="pvtTable">
            <thead>
                <th className="pvtColLabel"></th>
                {fieldIds.map(fieldId => <th key={fieldId} className="pvtColLabel">{fieldMap[fieldId].name}</th>)}
            </thead>
            <tbody>
                {fieldIds.map((fieldIdi, i) => <tr key={fieldIdi}>
                    <td className="pvtRowLabel">{fieldMap[fieldIdi].name}</td>
                    {fieldIds.map((fieldIdj, j) => {
                        let correlationInfo = {v: 1, p: 1}; // i==j case
                        if (i<j) {
                            correlationInfo = correlations[fieldIdi+fieldIdj];
                        }
                        else if (i>j) {
                            correlationInfo = correlations[fieldIdj+fieldIdi];
                        }
                        return <td className="pvtVal">
                            {correlationInfo.v}{correlationInfo.p<0.01?'**':correlationInfo.p<0.05?'*':''}
                        </td>
                    })}
                </tr>)}
            </tbody>
        </table>
    }

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title={T('modules.correlation')}/>
            <div className="pageBody">
            <Form labelPosition='top' onSubmit={value => {dispatch(doCorrelation(value))}}>
                <Form.Select
                    field="fields"
                    multiple
                    placeholder={T('pleaseSelectField')}
                    label={T('fields')}
                >
                    {
                        fields.map(field =>(
                            <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                        ))
                    }
                </Form.Select>
                <Form.Select
                    field="method"
                    label={T('methods')}
                    initValue="pearson"
                >
                    <Select.Option value="pearson">{T('correlation.pearson')}</Select.Option>
                    <Select.Option value="spearman">{T('correlation.spearman')}</Select.Option>
                    <Select.Option value="kendall">{T('correlation.kendall')}</Select.Option>
                </Form.Select>
                <Button type="primary" htmlType="submit" className="btn-margin-right">{T('run')}</Button>
            </Form>
            <div className="result-text">{result}</div>
            </div>
            {renderCorrelationTable()}
            <p className="figureNote">{correlationInfo!==null? T('correlation.pnote') : ''}</p>
        </div>
    )    
}
