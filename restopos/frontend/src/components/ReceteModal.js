import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  XMarkIcon as XIcon,
  BeakerIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon as SearchIcon,
  PhotoIcon as PhotographIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const ReceteModal = ({
  acik,
  onKapat,
  urun,
  mevcutRecete = null,
  onReceteKaydet
}) => {
  const [malzemeler, setMalzemeler] = useState([]);
  const [secilenMalzemeler, setSecilenMalzemeler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');

  // Mevcut reçeteyi yükle
  useEffect(() => {
    if (mevcutRecete) {
      setSecilenMalzemeler(mevcutRecete.malzemeler.map(m => ({
        ...m,
        miktar: m.miktar || 1
      })));
    } else {
      setSecilenMalzemeler([]);
    }
  }, [mevcutRecete]);

  // Malzemeleri yükle
  useEffect(() => {
    const malzemeleriGetir = async () => {
      setYukleniyor(true);
      try {
        // API'den malzemeleri çek
        // const data = await stokService.getMalzemeler();
        // setMalzemeler(data);
        
        // Mock data
        setMalzemeler([
          { id: 1, ad: 'Un', birim: 'kg', stokMiktari: 100 },
          { id: 2, ad: 'Şeker', birim: 'kg', stokMiktari: 50 },
          { id: 3, ad: 'Yağ', birim: 'lt', stokMiktari: 30 }
        ]);
      } catch (error) {
        console.error('Malzemeler yüklenirken hata:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    malzemeleriGetir();
  }, []);

  // Malzeme ekle/güncelle
  const handleMalzemeEkle = (malzeme) => {
    setSecilenMalzemeler(prev => {
      const mevcutMalzeme = prev.find(m => m.id === malzeme.id);
      if (mevcutMalzeme) {
        return prev.map(m => 
          m.id === malzeme.id 
            ? { ...m, miktar: m.miktar + 1 }
            : m
        );
      }
      return [...prev, { ...malzeme, miktar: 1 }];
    });
  };

  // Malzeme miktarını azalt
  const handleMalzemeAzalt = (malzemeId) => {
    setSecilenMalzemeler(prev => {
      const malzeme = prev.find(m => m.id === malzemeId);
      if (malzeme.miktar === 1) {
        return prev.filter(m => m.id !== malzemeId);
      }
      return prev.map(m =>
        m.id === malzemeId
          ? { ...m, miktar: m.miktar - 1 }
          : m
      );
    });
  };

  // Malzeme sil
  const handleMalzemeSil = (malzemeId) => {
    setSecilenMalzemeler(prev => prev.filter(m => m.id !== malzemeId));
  };

  // Reçeteyi kaydet
  const handleSubmit = () => {
    const receteData = {
      urunId: urun.id,
      malzemeler: secilenMalzemeler.map(m => ({
        malzemeId: m.id,
        miktar: m.miktar,
        birim: m.birim
      }))
    };

    onReceteKaydet(receteData);
  };

  // Filtrelenmiş malzemeler
  const filtrelenenMalzemeler = malzemeler.filter(malzeme =>
    malzeme.ad.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <Modal
      baslik={`${mevcutRecete ? 'Reçete Düzenle' : 'Yeni Reçete'} - ${urun?.ad}`}
      acik={acik}
      onKapat={onKapat}
      genislik="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Panel - Malzeme Listesi */}
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Malzeme ara..."
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
                {filtrelenenMalzemeler.map(malzeme => (
                  <div
                    key={malzeme.id}
                    className="p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                    onClick={() => handleMalzemeEkle(malzeme)}
                  >
                    <div>
                      <h4 className="font-medium">{malzeme.ad}</h4>
                      <p className="text-sm text-gray-500">
                        Stok: {malzeme.stokMiktari} {malzeme.birim}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <PlusIcon className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel - Seçilen Malzemeler */}
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto border rounded-lg">
            {secilenMalzemeler.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <DocumentTextIcon className="w-12 h-12 mb-2" />
                <p>Henüz malzeme seçilmedi</p>
              </div>
            ) : (
              <div className="divide-y">
                {secilenMalzemeler.map(malzeme => (
                  <div key={malzeme.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{malzeme.ad}</h4>
                        <p className="text-sm text-gray-500">
                          {malzeme.miktar} {malzeme.birim}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMalzemeAzalt(malzeme.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center">{malzeme.miktar}</span>
                        <button
                          onClick={() => handleMalzemeEkle(malzeme)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleMalzemeSil(malzeme.id)}
                          className="p-1 rounded-full hover:bg-gray-100 text-red-600"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-3">
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
              disabled={secilenMalzemeler.length === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              {mevcutRecete ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReceteModal; 