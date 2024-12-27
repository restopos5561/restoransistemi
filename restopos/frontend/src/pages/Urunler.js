import React, { useState, useEffect } from 'react';
import { useUrun } from '../context/UrunContext';
import UrunListesi from '../components/UrunListesi';
import UrunEkleModal from '../components/UrunEkleModal';
import UrunDuzenleModal from '../components/UrunDuzenleModal';
import { PlusIcon } from '@heroicons/react/24/outline';

const Urunler = () => {
  const { getKategoriler, deleteUrun } = useUrun();

  // Modal state'leri
  const [ekleModalAcik, setEkleModalAcik] = useState(false);
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [seciliUrun, setSeciliUrun] = useState(null);

  // İlk yükleme
  useEffect(() => {
    const init = async () => {
      try {
        await getKategoriler();
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };
    init();
  }, [getKategoriler]);

  // Ürün ekleme modalını aç
  const handleUrunEkle = () => {
    setEkleModalAcik(true);
  };

  // Ürün düzenleme modalını aç
  const handleUrunDuzenle = (urun) => {
    setSeciliUrun(urun);
    setDuzenleModalAcik(true);
  };

  // Ürün silme işlemi
  const handleUrunSil = async (urunId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUrun(urunId);
      } catch (error) {
        console.error('Ürün silinirken hata:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık ve Yeni Ürün Butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-secondary-900">
          Ürün Yönetimi
        </h1>
        <button 
          onClick={handleUrunEkle}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Ürün
        </button>
      </div>

      {/* Ürün Listesi */}
      <UrunListesi
        onUrunEkle={handleUrunEkle}
        onUrunDuzenle={handleUrunDuzenle}
        onUrunSil={handleUrunSil}
      />

      {/* Ürün Ekleme Modalı */}
      <UrunEkleModal
        isOpen={ekleModalAcik}
        onClose={() => setEkleModalAcik(false)}
      />

      {/* Ürün Düzenleme Modalı */}
      <UrunDuzenleModal
        isOpen={duzenleModalAcik}
        onClose={() => {
          setDuzenleModalAcik(false);
          setSeciliUrun(null);
        }}
        urun={seciliUrun}
      />
    </div>
  );
};

export default Urunler; 