import React from 'react';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-secondary-900">
          Dashboard
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Günlük Satış
          </h3>
          <p className="text-3xl font-bold text-primary-600">₺0.00</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Aktif Siparişler
          </h3>
          <p className="text-3xl font-bold text-accent-600">0</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Masa Doluluk
          </h3>
          <p className="text-3xl font-bold text-secondary-600">0%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 