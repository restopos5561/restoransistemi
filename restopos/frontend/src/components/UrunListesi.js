import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUrun } from '../context/UrunContext';
import { 
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowsRightLeftIcon as SwitchHorizontalIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const UrunListesi = ({ onUrunEkle, onUrunDuzenle, onUrunSil }) => {
  const { 
    urunler, 
    kategoriler,
    yukleniyor,
    hata,
    seciliKategori,
    setSeciliKategori,
    getUrunler,
    getKategoriler,
    updateUrunDurum
  } = useUrun();

  // State tanımlamaları
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenenUrunler, setFiltrelenenUrunler] = useState([]);

  // İlk yükleme
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          getUrunler(),
          getKategoriler()
        ]);
      } catch (error) {
        console.error('Ürün listesi yüklenirken hata:', error);
      }
    };
    init();
  }, [getUrunler, getKategoriler]);

  // Kategori değiştiğinde ürünleri filtrele
  useEffect(() => {
    if (seciliKategori) {
      getUrunler(seciliKategori.id);
    } else {
      getUrunler();
    }
  }, [seciliKategori, getUrunler]);

  // Arama ve filtreleme
  useEffect(() => {
    const filtreliListe = urunler.filter(urun => {
      const aramaUygun = urun.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        urun.kategori.ad.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUygun = !seciliKategori || urun.kategoriId === seciliKategori.id;
      return aramaUygun && kategoriUygun;
    });
    setFiltrelenenUrunler(filtreliListe);
  }, [urunler, aramaMetni, seciliKategori]);

  // Durum güncelleme
  const handleDurumDegistir = async (urunId, yeniDurum) => {
    try {
      await updateUrunDurum(urunId, yeniDurum);
    } catch (error) {
      console.error('Ürün durumu güncellenirken hata:', error);
    }
  };

  // Yükleniyor durumu
  if (yukleniyor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Hata durumu
  if (hata) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {hata}
        </p>
        <button 
          onClick={() => getUrunler()}
          className="mt-4 btn btn-primary"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Yeni Ürün Butonu */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-secondary-900">
          Ürünler
        </h2>
        <button 
          className="btn btn-primary flex items-center"
          onClick={onUrunEkle}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Ürün
        </button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Arama */}
        <div className="relative flex-1">
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Kategori Filtresi */}
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-secondary-400" />
          <select
            value={seciliKategori?.id || ''}
            onChange={(e) => {
              const kategori = kategoriler.find(k => k.id === Number(e.target.value));
              setSeciliKategori(kategori || null);
            }}
            className="input !py-[0.63rem]"
          >
            <option value="">Tüm Kategoriler</option>
            {kategoriler.map(kategori => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.ad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtrelenenUrunler.map(urun => (
          <div 
            key={urun.id}
            className="p-4 rounded-lg border border-secondary-200 space-y-4"
          >
            {/* Ürün Resmi */}
            {urun.resimUrl && (
              <img
                src={urun.resimUrl}
                alt={urun.ad}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            {/* Ürün Bilgileri */}
            <div className="space-y-2">
              <h3 className="font-medium text-secondary-900">
                {urun.ad}
              </h3>
              <div className="text-sm text-secondary-600">
                {urun.kategori.ad}
              </div>
              <div className="text-lg font-semibold text-primary-600">
                ₺{urun.fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUrunDuzenle(urun)}
                  className="p-2 rounded-lg text-secondary-400 hover:bg-secondary-50 
                    transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onUrunSil(urun.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 
                    transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleDurumDegistir(urun.id, !urun.aktif)}
                className={`p-2 rounded-lg transition-colors
                  ${urun.aktif 
                    ? 'text-primary-600 hover:bg-primary-50' 
                    : 'text-secondary-400 hover:bg-secondary-50'}`}
              >
                <SwitchHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Boş Durum */}
      {filtrelenenUrunler.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600">
            {aramaMetni || seciliKategori
              ? 'Arama kriterlerine uygun ürün bulunamadı.'
              : 'Henüz ürün eklenmemiş.'}
          </p>
        </div>
      )}
    </div>
  );
};

UrunListesi.propTypes = {
  onUrunEkle: PropTypes.func.isRequired,
  onUrunDuzenle: PropTypes.func.isRequired,
  onUrunSil: PropTypes.func.isRequired
};

export default UrunListesi; 