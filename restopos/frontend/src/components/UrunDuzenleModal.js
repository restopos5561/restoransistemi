import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { useUrun } from '../context/UrunContext';
import {
  PhotoIcon,
  XMarkIcon as XIcon,
  UploadIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const UrunDuzenleModal = ({ isOpen, onClose, urun }) => {
  const { updateUrun, kategoriler, yukleniyor } = useUrun();

  // Form state
  const [formData, setFormData] = useState({
    ad: '',
    fiyat: '',
    kategoriId: '',
    aciklama: '',
    resim: null,
    resimOnizleme: null
  });

  // Validation state
  const [hatalar, setHatalar] = useState({});

  // Ürün verilerini forma yükle
  useEffect(() => {
    if (urun) {
      setFormData({
        ad: urun.ad || '',
        fiyat: urun.fiyat?.toString() || '',
        kategoriId: urun.kategoriId?.toString() || '',
        aciklama: urun.aciklama || '',
        resim: null,
        resimOnizleme: urun.resimUrl || null
      });
      setHatalar({});
    }
  }, [urun]);

  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata varsa temizle
    if (hatalar[name]) {
      setHatalar(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Resim yükleme
  const handleResimSecimi = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resim: file,
        resimOnizleme: URL.createObjectURL(file)
      }));
    }
  };

  // Resmi kaldır
  const handleResimKaldir = () => {
    setFormData(prev => ({
      ...prev,
      resim: null,
      resimOnizleme: urun.resimUrl || null
    }));
  };

  // Form doğrulama
  const validateForm = () => {
    const yeniHatalar = {};

    if (!formData.ad.trim()) {
      yeniHatalar.ad = 'Ürün adı gereklidir';
    }

    if (!formData.fiyat) {
      yeniHatalar.fiyat = 'Fiyat gereklidir';
    } else if (isNaN(formData.fiyat) || Number(formData.fiyat) <= 0) {
      yeniHatalar.fiyat = 'Geçerli bir fiyat giriniz';
    }

    if (!formData.kategoriId) {
      yeniHatalar.kategoriId = 'Kategori seçimi gereklidir';
    }

    setHatalar(yeniHatalar);
    return Object.keys(yeniHatalar).length === 0;
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const guncelUrun = {
        ...formData,
        fiyat: Number(formData.fiyat)
      };

      await updateUrun(urun.id, guncelUrun);
      onClose();
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      setHatalar(prev => ({
        ...prev,
        submit: error.message
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ürün Düzenle"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ürün Resmi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Ürün Resmi
          </label>
          <div className="flex items-center justify-center">
            {formData.resimOnizleme ? (
              <div className="relative">
                <img
                  src={formData.resimOnizleme}
                  alt="Ürün önizleme"
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleResimKaldir}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 
                    text-red-600 hover:bg-red-200 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-48 h-48 flex flex-col items-center justify-center 
                border-2 border-dashed border-secondary-300 rounded-lg 
                hover:border-primary-500 hover:bg-secondary-50 transition-colors 
                cursor-pointer">
                <PhotoIcon className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-secondary-600">
                  Resim Seç
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleResimSecimi}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Ürün Adı */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Ürün Adı
          </label>
          <input
            type="text"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            className={`input w-full ${hatalar.ad ? 'border-red-500' : ''}`}
            placeholder="Ürün adını girin"
          />
          {hatalar.ad && (
            <p className="text-sm text-red-600">{hatalar.ad}</p>
          )}
        </div>

        {/* Fiyat */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Fiyat
          </label>
          <div className="relative">
            <input
              type="number"
              name="fiyat"
              value={formData.fiyat}
              onChange={handleChange}
              className={`input w-full pl-8 ${hatalar.fiyat ? 'border-red-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 
              text-secondary-500">
              ₺
            </span>
          </div>
          {hatalar.fiyat && (
            <p className="text-sm text-red-600">{hatalar.fiyat}</p>
          )}
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Kategori
          </label>
          <select
            name="kategoriId"
            value={formData.kategoriId}
            onChange={handleChange}
            className={`input w-full ${hatalar.kategoriId ? 'border-red-500' : ''}`}
          >
            <option value="">Kategori seçin</option>
            {kategoriler.map(kategori => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.ad}
              </option>
            ))}
          </select>
          {hatalar.kategoriId && (
            <p className="text-sm text-red-600">{hatalar.kategoriId}</p>
          )}
        </div>

        {/* Açıklama */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Açıklama
          </label>
          <textarea
            name="aciklama"
            value={formData.aciklama}
            onChange={handleChange}
            className="input w-full h-24 resize-none"
            placeholder="Ürün açıklaması girin (opsiyonel)"
          />
        </div>

        {/* Hata Mesajı */}
        {hatalar.submit && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {hatalar.submit}
          </div>
        )}

        {/* Form Butonları */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={yukleniyor}
          >
            İptal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={yukleniyor}
          >
            {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

UrunDuzenleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  urun: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ad: PropTypes.string,
    fiyat: PropTypes.number,
    kategoriId: PropTypes.number,
    aciklama: PropTypes.string,
    resimUrl: PropTypes.string
  })
};

export default UrunDuzenleModal; 