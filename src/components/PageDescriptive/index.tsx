import { ReactElement, useEffect, useState } from "react"
import PageHeader from "../PageHeader"
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFields } from "../../store/metaSlice";
import { refreshAllRecords, setSelectedFieldIds } from "../../store/descriptiveSlice";
import { T } from "../../locales/i18n";
import Plot from 'react-plotly.js';
import { getDescriptiveResults } from "../../lib/descriptive";
import './style.css';

export default () => {
    const dispatch = useDispatch<any>()
    const fields = useSelector((state: any) =>state.meta.fields)
    const descriptiveResults = useSelector((state: any) =>state.descriptive.descriptiveResults);
    const result = useSelector((state: any) =>state.descriptive.result);

    const buildCategoricalDescriptive = (desc) => <div className="desc-item" key={desc.name} >
        <div className="desc-title">{desc.name}</div>
        <div className="desc-facts">n: {desc.n}, {T('descriptive.missing')}: {desc.missing}</div>
        <div className="desc-chart">
            <Plot data={[ {type:'bar', x:desc.x, y:desc.y} ]}
                layout={ {width: 320, height: 140, autosize:false, margin: {l:20,r:0,b:15,t:0}} }
                config={ {displayModeBar: false} }
                orientation="h"/>
        </div>
    </div>

    const buildNumericalDescriptive = (desc) => <div className="desc-item" key={desc.name}>
        <div className="desc-title">{desc.name}</div>
        <div className="desc-facts">
            <p>
                n: {desc.n}, {T('descriptive.missing')}: {desc.missing},
                {T('descriptive.avg')}: {desc.avg.toPrecision(5)},
                {T('descriptive.sd')}: {desc.sd.toPrecision(5)}
            </p>
            <p>
                {T('descriptive.min')}: {desc.min.toPrecision(5)},
                {T('descriptive.quantile25')}: {desc.quantile25.toPrecision(5)},
                {T('descriptive.median')}: {desc.median.toPrecision(5)},
                {T('descriptive.quantile75')}: {desc.quantile75.toPrecision(5)},
                {T('descriptive.max')}: {desc.max.toPrecision(5)}
            </p>
        </div>
        <div className="desc-chart">
            <Plot data={[ {type:'histogram', x:desc.x} ]}
                layout={ {width: 320, height: 140, autosize:false, margin: {l:20,r:0,b:15,t:0}} }
                config={ {displayModeBar: false} } />
        </div>
    </div>

    const descriptiveComponents = descriptiveResults.map((desc:any) => {
        if (desc.isNumeric) {
            return buildNumericalDescriptive(desc);
        }
        else {
            return buildCategoricalDescriptive(desc);
        }
    })

    useEffect(() => {
        dispatch(fetchAllFields());
    }, []);

    return (
        <div>
            <PageHeader title={T('modules.descriptive')}/>
            <div className="pageBody">
                <Form labelPosition='top' onSubmit={value => {dispatch(refreshAllRecords(value))}}>
                    <Form.Select
                            field="yfields"
                            placeholder={T('pleaseSelectField')}
                            label={T('fields')}
                            multiple
                            onChange={(value) => {dispatch(setSelectedFieldIds(value))}}
                        >
                            {
                                fields.map(field =>(
                                    <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                                ))
                            }
                    </Form.Select>
                    <Button type="primary" htmlType="submit" className="btn-margin-right">{T('run')}</Button>
                </Form>
                <div className="result-text">{result}</div>
                <div className="desc-area">{descriptiveComponents}</div>
            </div>
        </div>
    )    
}
