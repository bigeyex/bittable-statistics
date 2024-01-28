import './style.css';
import { IconMenu } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';

export default ({title}) => {
    const navigate = useNavigate();
    return (
        <div className='pageHeader'>
            <Button icon={<IconMenu />} onClick={()=>{ navigate(-1) }} type='tertiary' theme='borderless' />
            <h2>{title}</h2>
        </div>
    )    
}
