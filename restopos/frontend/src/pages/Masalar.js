import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import MasaKarti from '../components/MasaKarti';
import Modal from '../components/Modal';

const Masalar = () => {
  // State tanımlamaları
  const [masalar, setMasalar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [modalAcik, setModalAcik] = useState(false);
  const [secilenMasa, setSecilenMasa] = useState(null);
  const [islemTipi, setIslemTipi] = useState('');
  const [hedefMasa, setHedefMasa] = useState(null);

  // Masaları yükle
  const masalariYukle = async () => {
    setYukleniyor(true);
    try {
      // API'den masaları çek
      // const data = await masaService.getMasalar();
      // setMasalar(data);
      
      // Mock data
      setMasalar([
        { 
          id: 1, 
          numara: 1, 
          durum: 'bos',
          kisiSayisi: 0,
          tutar: 0,
          sure: ''
        },
        { 
          id: 2, 
          numara: 2, 
          durum: 'dolu',
          kisiSayisi: 4,
          tutar: 450.50,
          sure: '1 sa 30 dk'
        },
        { 
          id: 3, 
          numara: 3, 
          durum: 'rezerve',
          kisiSayisi: 2,
          tutar: 0,
          sure: ''
        }
      ]);
    } catch (error) {
      console.error('Masalar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    masalariYukle();
  }, []);

  // Masa taşıma işlemi
  const handleMasaTasi = async (kaynakMasaId, hedefMasaId) => {
    try {
      // await masaService.masaTasi(kaynakMasaId, hedefMasaId);
      console.log('Masa taşındı:', { kaynakMasaId, hedefMasaId });
      masalariYukle();
    } catch (error) {
      console.error('Masa taşınırken hata:', error);
    }
  };

  // Masa birleştirme işlemi
  const handleMasaBirlestir = async (kaynakMasaId, hedefMasaId) => {
    try {
      // await masaService.masaBirlestir(kaynakMasaId, hedefMasaId);
      console.log('Masalar birleştirildi:', { kaynakMasaId, hedefMasaId });
      masalariYukle();
    } catch (error) {
      console.error('Masalar birleştirilirken hata:', error);
    }
  };

  // Masa işlem modalı
  const MasaIslemModal = () => (
    <Modal
      baslik={`${islemTipi === 'tasi' ? 'Masa Taşı' : 'Masa Birleştir'}`}
      acik={modalAcik}
      onKapat={() => {
        setModalAcik(false);
        setSecilenMasa(null);
        setHedefMasa(null);
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kaynak Masa
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            Masa {secilenMasa?.numara}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hedef Masa
          </label>
          <select
            value={hedefMasa?.id || ''}
            onChange={(e) => {
              const masa = masalar.find(m => m.id === Number(e.target.value));
              setHedefMasa(masa);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Masa Seçin</option>
            {masalar
              .filter(m => m.id !== secilenMasa?.id)
              .map(masa => (
                <option key={masa.id} value={masa.id}>
                  Masa {masa.numara}
                </option>
              ))
            }
          </select>
        </div>

        {islemTipi === 'birlestir' && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Dikkat
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Masaları birleştirdiğinizde, seçilen masadaki tüm siparişler hedef masaya aktarılacak ve seçilen masa boşaltılacaktır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setModalAcik(false);
              setSecilenMasa(null);
              setHedefMasa(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            İptal
          </button>
          <button
            type="button"
            disabled={!hedefMasa}
            onClick={() => {
              if (islemTipi === 'tasi') {
                handleMasaTasi(secilenMasa.id, hedefMasa.id);
              } else {
                handleMasaBirlestir(secilenMasa.id, hedefMasa.id);
              }
              setModalAcik(false);
              setSecilenMasa(null);
              setHedefMasa(null);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {islemTipi === 'tasi' ? 'Taşı' : 'Birleştir'}
          </button>
        </div>
      </div>
    </Modal>
  );

  // Filtrelenmiş masalar
  const filtrelenenMasalar = masalar.filter(masa => 
    masa.numara.toString().includes(aramaMetni)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Masalar</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={masalariYukle}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                // Yeni masa ekleme modalını aç
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Yeni Masa</span>
            </button>
          </div>
        </div>

        {/* Arama */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Masa ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Masa Listesi */}
        {yukleniyor ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtrelenenMasalar.map((masa, index) => (
              <MasaKarti
                key={masa.id}
                masa={masa}
                index={index}
                onClick={() => {
                  // Masa detay modalını aç
                }}
                onMasaBirlestir={(masaId, tip) => {
                  setSecilenMasa(masa);
                  setIslemTipi(tip);
                  setModalAcik(true);
                }}
              />
            ))}

            {filtrelenenMasalar.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Masa bulunamadı
              </div>
            )}
          </div>
        )}

        {/* Masa İşlem Modalı */}
        {modalAcik && <MasaIslemModal />}
      </div>
    </DndProvider>
  );
};

export default Masalar; 