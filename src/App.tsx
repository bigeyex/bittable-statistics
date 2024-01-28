import './App.css';
import { IconSimilarity } from '@douyinfe/semi-icons';
import { Button, Form, Nav } from '@douyinfe/semi-ui';
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  return (
    <main className="main">
      <div style={{ width: '100%' }}>
        <Nav
            bodyStyle={{ height: '90vh' }}
            style={{ width: '100%' }}
            items={[
                { itemKey: 'descriptive', text: '描述性统计', icon: <IconSimilarity /> },
                { itemKey: 'crosstabs', text: '交叉（透视）表', icon: <IconSimilarity /> },
                { itemKey: 'correlation', text: '相关系数', icon: <IconSimilarity /> },
                { itemKey: 'regression', text: '回归分析', icon: <IconSimilarity /> },
                { itemKey: 'hypotest', text: '假设检验', icon: <IconSimilarity /> },
            ]}
            onSelect={item => navigate(item.itemKey as string)}
        />
      </div>
    </main>
  )
}