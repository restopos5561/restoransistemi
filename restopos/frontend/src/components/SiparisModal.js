import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  XMarkIcon as XIcon,
  PrinterIcon,
  BanknotesIcon as CashIcon,
  CreditCardIcon,
  ArrowPathIcon as RefreshIcon,
  ExclamationTriangleIcon as ExclamationIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';
import SiparisIptalModal from './SiparisIptalModal';
import AdisyonModal from './AdisyonModal';

const SiparisModal = ({
  acik,
  onKapat,
  masa,
  siparis,
  onSiparisTamamla,
  onSiparisGuncelle,
  onSiparisIptal,
  onSiparisIade
}) => {
  // State tanımlamaları
  const [secilenUrunler, setSecilenUrunler] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [notlar, setNotlar] = useState('');
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [toplamTutar, setToplamTutar] = useState(0);
  const [iptalModalAcik, setIptalModalAcik] = useState(false);
  const [islemTipi, setIslemTipi] = useState('iptal'); // 'iptal' veya 'iade'
  const [adisyonModalAcik, setAdisyonModalAcik] = useState(false);

  // Ürünleri yükle
  useEffect(() => {
    const urunleriGetir = async () => {
      setYukleniyor(true);
      try {
        // API'den ürünleri çek
        // const data = await urunService.getUrunler();
        // setUrunler(data);
        
        // Mock data
        setUrunler([
          { id: 1, ad: 'Karışık Pizza', fiyat: 120.00, kategori: 'Pizza' },
          { id: 2, ad: 'Cola 330ml', fiyat: 15.00, kategori: 'İçecek' },
          { id: 3, ad: 'Tavuk Şiş', fiyat: 90.00, kategori: 'Ana Yemek' }
        ]);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    urunleriGetir();
  }, []);

  // Mevcut siparişi yükle
  useEffect(() => {
    if (siparis) {
      setSecilenUrunler(siparis.urunler.map(urun => ({
        ...urun,
        durum: urun.durum || 'hazirlaniyor'
      })));
      setNotlar(siparis.notlar || '');
      setDuzenlemeModu(true);
    } else {
      setSecilenUrunler([]);
      setNotlar('');
      setDuzenlemeModu(false);
    }
  }, [siparis]);

  // Toplam tutarı hesapla
  useEffect(() => {
    const toplam = secilenUrunler.reduce((acc, urun) => {
      return acc + (urun.fiyat * urun.adet);
    }, 0);
    setToplamTutar(toplam);
  }, [secilenUrunler]);

  // Ürün ekle/güncelle
  const handleUrunEkle = (urun) => {
    setSecilenUrunler(prev => {
      const mevcutUrun = prev.find(u => u.id === urun.id);
      if (mevcutUrun) {
        return prev.map(u => 
          u.id === urun.id 
            ? { ...u, adet: u.adet + 1 }
            : u
        );
      }
      return [...prev, { ...urun, adet: 1, durum: 'hazirlaniyor' }];
    });
  };

  // Ürün adedi azalt
  const handleUrunAzalt = (urunId) => {
    setSecilenUrunler(prev => {
      const urun = prev.find(u => u.id === urunId);
      if (urun.adet === 1) {
        return prev.filter(u => u.id !== urunId);
      }
      return prev.map(u =>
        u.id === urunId
          ? { ...u, adet: u.adet - 1 }
          : u
      );
    });
  };

  // Ürün sil
  const handleUrunSil = (urunId) => {
    setSecilenUrunler(prev => prev.filter(u => u.id !== urunId));
  };

  // Ürün durumu güncelle
  const handleDurumGuncelle = (urunId, yeniDurum) => {
    setSecilenUrunler(prev => prev.map(urun =>
      urun.id === urunId
        ? { ...urun, durum: yeniDurum }
        : urun
    ));
  };

  // Siparişi kaydet
  const handleSubmit = () => {
    const siparisData = {
      masaId: masa.id,
      urunler: secilenUrunler,
      notlar,
      toplamTutar,
      duzenlemeModu
    };

    if (duzenlemeModu) {
      onSiparisGuncelle(siparisData);
    } else {
      onSiparisTamamla(siparisData);
    }
  };

  // İptal/İade işlemini başlat
  const handleIptalIadeBaslat = (tip) => {
    setIslemTipi(tip);
    setIptalModalAcik(true);
  };

  // İptal/İade işlemini tamamla
  const handleIptalIadeTamamla = async (islemData) => {
    if (islemTipi === 'iptal') {
      await onSiparisIptal(islemData);
    } else {
      await onSiparisIade(islemData);
    }
    setIptalModalAcik(false);
  };

  // Filtrelenmiş ürünler
  const filtrelenenUrunler = urunler.filter(urun =>
    urun.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    urun.kategori.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  // Adisyon modalını aç
  const handleAdisyonAc = () => {
    setAdisyonModalAcik(true);
  };

  return (
    <>
      <Modal
        baslik={`${duzenlemeModu ? 'Sipariş Düzenle' : 'Yeni Sipariş'} - Masa ${masa?.numara}`}
        acik={acik}
        onKapat={onKapat}
        genislik="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol Panel - Ürün Listesi */}
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="h-[400px] overflow-y-auto border rounded-lg">
              {yukleniyor ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="divide-y">
                  {filtrelenenUrunler.map(urun => (
                    <div
                      key={urun.id}
                      className="p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                      onClick={() => handleUrunEkle(urun)}
                    >
                      <div>
                        <h4 className="font-medium">{urun.ad}</h4>
                        <p className="text-sm text-gray-500">{urun.kategori}</p>
                      </div>
                      <span className="font-medium text-blue-600">
                        {urun.fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Seçilen Ürünler */}
          <div className="space-y-4">
            <div className="h-[400px] overflow-y-auto border rounded-lg">
              {secilenUrunler.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBagIcon className="w-12 h-12 mb-2" />
                  <p>Henüz ürün seçilmedi</p>
                </div>
              ) : (
                <div className="divide-y">
                  {secilenUrunler.map(urun => (
                    <div key={urun.id} className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{urun.ad}</h4>
                          <p className="text-sm text-gray-500">
                            {(urun.fiyat * urun.adet).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUrunAzalt(urun.id)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <MinusIcon className="w-5 h-5 text-gray-600" />
                          </button>
                          <span className="w-8 text-center">{urun.adet}</span>
                          <button
                            onClick={() => handleUrunEkle(urun)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <PlusIcon className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleUrunSil(urun.id)}
                            className="p-1 rounded-full hover:bg-gray-100 text-red-600"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {duzenlemeModu && (
                        <div className="flex items-center space-x-2 mt-2">
                          <select
                            value={urun.durum}
                            onChange={(e) => handleDurumGuncelle(urun.id, e.target.value)}
                            className="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="hazirlaniyor">Hazırlanıyor</option>
                            <option value="hazirlandi">Hazırlandı</option>
                            <option value="teslim_edildi">Teslim Edildi</option>
                            <option value="iptal">İptal</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notlar
              </label>
              <textarea
                value={notlar}
                onChange={(e) => setNotlar(e.target.value)}
                rows={2}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Sipariş notları..."
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Toplam Tutar:</span>
                <span className="text-xl font-semibold text-blue-600">
                  {toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </div>

              <div className="flex justify-between items-center">
                {/* İptal/İade/Yazdır Butonları */}
                {duzenlemeModu && (
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => handleIptalIadeBaslat('iptal')}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      <XCircleIcon className="w-5 h-5 mr-1" />
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIptalIadeBaslat('iade')}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                    >
                      <RefundIcon className="w-5 h-5 mr-1" />
                      İade
                    </button>
                    <button
                      type="button"
                      onClick={handleAdisyonAc}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <PrinterIcon className="w-5 h-5 mr-1" />
                      Adisyon
                    </button>
                  </div>
                )}

                {/* Kaydet/İptal Butonları */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onKapat}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={secilenUrunler.length === 0}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {duzenlemeModu ? (
                      <>
                        <SaveIcon className="w-5 h-5 mr-2" />
                        <span>Güncelle</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        <span>Sipariş Oluştur</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* İptal/İade Modalı */}
      <SiparisIptalModal
        acik={iptalModalAcik}
        onKapat={() => setIptalModalAcik(false)}
        siparis={siparis}
        onIptalTamamla={handleIptalIadeTamamla}
        islemTipi={islemTipi}
      />

      {/* Adisyon Modalı */}
      <AdisyonModal
        acik={adisyonModalAcik}
        onKapat={() => setAdisyonModalAcik(false)}
        siparis={{
          ...siparis,
          urunler: secilenUrunler,
          toplamTutar,
          genelToplam: toplamTutar,
          tarih: new Date(),
          masaNumara: masa?.numara
        }}
      />
    </>
  );
};

export default SiparisModal; 