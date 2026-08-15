import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { StudentView } from './pages/StudentView';
import { MerchantView } from './pages/MerchantView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<StudentView />} />
          <Route path="merchant" element={<MerchantView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
