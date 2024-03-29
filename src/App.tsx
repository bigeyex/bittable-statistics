import './App.css';
import { IconArrowUpRight, IconBeaker, IconGridRectangle, IconHistogram, IconInherit } from '@douyinfe/semi-icons';
import { Button, Form, Nav } from '@douyinfe/semi-ui';
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from './locales/i18n';

export default function App() {
  const navigate = useNavigate();

  return (
    <main className="main">
      <div style={{ width: '100%' }}>
        <Nav
            bodyStyle={{ height: '90vh' }}
            style={{ width: '100%' }}
            items={[
                { itemKey: 'descriptive', text: T('modules.descriptive'), icon: <IconHistogram /> },
                { itemKey: 'crosstabs', text: T('modules.crosstabs'), icon: <IconGridRectangle /> },
                { itemKey: 'correlation', text: T('modules.correlation'), icon: <IconInherit /> },
                { itemKey: 'regression', text: T('modules.regression'), icon: <IconArrowUpRight /> },
                { itemKey: 'hypotest', text: T('modules.hypotest'), icon: <IconBeaker /> },
            ]}
            onSelect={item => navigate(item.itemKey as string)}
        />
      </div>
    </main>
  )
}