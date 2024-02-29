import './style.css';
import { IconMenu } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';

export default ({title}) => {
    const navigate = useNavigate();
    const { Title } = Typography;
    return (
        <div className='pageHeader'>
            <Title heading={6}>
                <Button icon={<IconMenu />} onClick={()=>{ navigate(-1) }} type='tertiary' theme='borderless' />
                <span className='title-text'>{title}</span>
            </Title>
        </div>
    )    
}
