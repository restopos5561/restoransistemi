import React, { useState } from 'react';
import {
  PrinterIcon,
  XMarkIcon as XIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon as DownloadIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const AdisyonModal = ({
  acik,
  onKapat,
  siparis,
  firma = {
    ad: 'RestoPOS',
    adres: 'Örnek Mah. Test Sok. No:1',
    telefon: '0212 345 67 89',
    vergiDairesi: 'Örnek V.D.',
    vergiNo: '1234567890'
  }
}) => {
  const [yazdiriliyor, setYazdiriliyor] = useState(false);

  // Adisyon yazdırma işlemi
  const handleYazdir = async () => {
    setYazdiriliyor(true);
    try {
      window.print();
    } catch (error) {
      console.error('Yazdırma sırasında hata:', error);
    } finally {
      setYazdiriliyor(false);
    }
  };

  // PDF olarak kaydet
  const handlePdfKaydet = () => {
    // PDF oluşturma ve indirme işlemi burada yapılacak
    console.log('PDF kaydetme işlemi');
  };

  // Tarih formatla
  const formatTarih = (tarih) => {
    return new Date(tarih).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      baslik="Adisyon Önizleme"
      acik={acik}
      onKapat={onKapat}
      genislik="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Yazdırma Butonları */}
        <div className="flex justify-end space-x-3 print:hidden">
          <button
            type="button"
            onClick={handlePdfKaydet}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            PDF Kaydet
          </button>
          <button
            type="button"
            onClick={handleYazdir}
            disabled={yazdiriliyor}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {yazdiriliyor ? (
              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PrinterIcon className="w-5 h-5 mr-2" />
            )}
            Yazdır
          </button>
        </div>

        {/* Adisyon İçeriği */}
        <div className="p-6 bg-white border rounded-lg" id="adisyon-content">
          {/* Firma Bilgileri */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">{firma.ad}</h2>
            <p className="text-sm text-gray-600">{firma.adres}</p>
            <p className="text-sm text-gray-600">Tel: {firma.telefon}</p>
            <p className="text-sm text-gray-600">
              {firma.vergiDairesi} - {firma.vergiNo}
            </p>
          </div>

          {/* Sipariş Bilgileri */}
          <div className="mb-6">
            <div className="flex justify-between text-sm">
              <div>
                <p>Sipariş No: #{siparis?.id}</p>
                <p>Masa: {siparis?.masaNumara}</p>
              </div>
              <div className="text-right">
                <p>Tarih: {formatTarih(siparis?.tarih)}</p>
                <p>Personel: {siparis?.personel}</p>
              </div>
            </div>
          </div>

          {/* Ürün Listesi */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Ürün</th>
                <th className="py-2 text-center">Adet</th>
                <th className="py-2 text-right">Birim Fiyat</th>
                <th className="py-2 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {siparis?.urunler.map((urun, index) => (
                <tr key={index}>
                  <td className="py-2">{urun.ad}</td>
                  <td className="py-2 text-center">{urun.adet}</td>
                  <td className="py-2 text-right">
                    {urun.birimFiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </td>
                  <td className="py-2 text-right">
                    {(urun.birimFiyat * urun.adet).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Toplam Bilgileri */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Toplam Tutar:</span>
              <span>{siparis?.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
            </div>
            {siparis?.indirimTutari > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>İndirim:</span>
                <span>-{siparis?.indirimTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
              </div>
            )}
            {siparis?.kdvTutari > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>KDV (%{siparis?.kdvOrani}):</span>
                <span>{siparis?.kdvTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xl font-bold mt-4">
              <span>Genel Toplam:</span>
              <span>{siparis?.genelToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
            <p>İyi günler dileriz.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdisyonModal; 