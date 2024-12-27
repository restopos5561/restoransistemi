import React, { useState } from 'react';
import {
  XMarkIcon as XIcon,
  ExclamationTriangleIcon as ExclamationIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const IPTAL_NEDENLERI = [
  { id: 'musteri_talebi', label: 'Müşteri Talebi' },
  { id: 'urun_bitti', label: 'Ürün Tükendi' },
  { id: 'yanlis_siparis', label: 'Yanlış Sipariş' },
  { id: 'kalite_sorunu', label: 'Kalite Sorunu' },
  { id: 'diger', label: 'Diğer' }
];

const SiparisIptalModal = ({
  acik,
  onKapat,
  siparis,
  onIptalTamamla,
  islemTipi = 'iptal' // 'iptal' veya 'iade'
}) => {
  const [secilenNeden, setSecilenNeden] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [iadeOrani, setIadeOrani] = useState(100);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async () => {
    if (!secilenNeden) return;

    setYukleniyor(true);
    try {
      await onIptalTamamla({
        siparisId: siparis.id,
        neden: secilenNeden,
        aciklama,
        iadeOrani: islemTipi === 'iade' ? iadeOrani : null,
        islemTipi
      });
      onKapat();
    } catch (error) {
      console.error('İptal/İade işlemi sırasında hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  const resetForm = () => {
    setSecilenNeden('');
    setAciklama('');
    setIadeOrani(100);
  };

  return (
    <Modal
      baslik={`Sipariş ${islemTipi === 'iptal' ? 'İptal' : 'İade'} İşlemi`}
      acik={acik}
      onKapat={() => {
        resetForm();
        onKapat();
      }}
    >
      <div className="space-y-6">
        {/* Uyarı Mesajı */}
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Dikkat
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {islemTipi === 'iptal'
                    ? 'Bu işlem siparişi iptal edecek ve ilgili ürünleri stoka geri ekleyecektir.'
                    : 'Bu işlem seçilen ürünleri iade alacak ve tutarı iade işlemine yönlendirecektir.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sipariş Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Sipariş Detayları</h4>
          <div className="text-sm text-gray-600">
            <p>Sipariş No: #{siparis?.id}</p>
            <p>Toplam Tutar: {siparis?.toplamTutar?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</p>
            <p>Tarih: {new Date(siparis?.tarih).toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* İptal/İade Nedeni */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {islemTipi === 'iptal' ? 'İptal' : 'İade'} Nedeni
          </label>
          <select
            value={secilenNeden}
            onChange={(e) => setSecilenNeden(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Neden Seçin</option>
            {IPTAL_NEDENLERI.map(neden => (
              <option key={neden.id} value={neden.id}>
                {neden.label}
              </option>
            ))}
          </select>
        </div>

        {/* İade Oranı (Sadece iade işleminde) */}
        {islemTipi === 'iade' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ��ade Oranı (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={iadeOrani}
              onChange={(e) => setIadeOrani(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ek açıklamalar..."
          />
        </div>

        {/* Butonlar */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onKapat();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!secilenNeden || yukleniyor}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {yukleniyor ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : islemTipi === 'iptal' ? (
              <XIcon className="w-5 h-5 mr-2" />
            ) : (
              <RefundIcon className="w-5 h-5 mr-2" />
            )}
            <span>
              {islemTipi === 'iptal' ? 'Siparişi İptal Et' : 'İade İşlemini Tamamla'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SiparisIptalModal; 