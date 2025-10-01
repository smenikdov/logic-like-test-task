import { BrowserRouter, Routes, Route } from 'react-router';
import { ToastProvider, HeroUIProvider } from '@heroui/react';
import Home from './pages/Home.tsx';
import './styles/index.css';

function App() {
    return (
        <HeroUIProvider>
            <ToastProvider />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </HeroUIProvider>
    );
}

export default App;
