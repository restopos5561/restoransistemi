import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './context/AuthContext';
import { SiparisProvider } from './context/SiparisContext';
import { UrunProvider } from './context/UrunContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <AuthProvider>
          <UrunProvider>
            <SiparisProvider>
              <AppRoutes />
            </SiparisProvider>
          </UrunProvider>
        </AuthProvider>
      </Router>
    </DndProvider>
  );
}

export default App;
