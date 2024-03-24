import ReactDOM from 'react-dom/client'
import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import App from './App';
import LoadApp from './components/LoadApp';
import store from './store';
import { Provider } from 'react-redux'
import PageDescriptive from './components/PageDescriptive';
import PageRegression from './components/PageRegression';
import PageHypothesis from './components/PageHypothesis';
import './locales/i18n' // 支持国际化
import PageCrosstabs from './components/PageCrosstabs';
import PageCorrelation from './components/PageCorrelation';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <LoadApp >
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/correlation" element={<PageCorrelation />} />
                    <Route path="/descriptive" element={<PageDescriptive />} />
                    <Route path="/crosstabs" element={<PageCrosstabs />} />
                    <Route path="/hypotest" element={<PageHypothesis />} />
                    <Route path="/regression" element={<PageRegression />} />
                </Routes>
            </HashRouter>
        </LoadApp>
    </Provider>
)


