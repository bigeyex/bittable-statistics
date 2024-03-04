import ReactDOM from 'react-dom/client'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoadApp from './components/LoadApp';
import store from './store';
import { Provider } from 'react-redux'
import PageDescriptive from './components/PageDescriptive';
import PageRegression from './components/PageRegression';
import PageHypothesis from './components/PageHypothesis';
// import './locales/i18n' // 支持国际化
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <LoadApp >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/hypotest" element={<PageHypothesis />} />
                    <Route path="/regression" element={<PageRegression />} />
                </Routes>
            </BrowserRouter>
        </LoadApp>
    </Provider>
)


