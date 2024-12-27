import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon as CashIcon,
  ArrowsPointingOutIcon as ArrowsExpandIcon
} from '@heroicons/react/24/outline';

const MASA_DURUMLARI = {
  BOS: 'bos',
  DOLU: 'dolu',
  REZERVE: 'rezerve'
};

const MasaKarti = ({ 
  masa, 
  onClick, 
  onMasaTasi, 
  onMasaBirlestir,
  index 
}) => {
  const [showBirlestirMenu, setShowBirlestirMenu] = useState(false);

  // Sürükle-bırak için DnD hook'ları
  const [{ isDragging }, drag] = useDrag({
    type: 'MASA',
    item: { id: masa.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'MASA',
    drop: (item) => {
      if (item.id !== masa.id) {
        // Aynı masa değilse birleştirme menüsünü göster
        setShowBirlestirMenu(true);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  // Duruma göre stil sınıfları
  const getDurumStili = () => {
    switch (masa.durum) {
      case MASA_DURUMLARI.DOLU:
        return 'bg-red-100 border-red-500';
      case MASA_DURUMLARI.REZERVE:
        return 'bg-yellow-100 border-yellow-500';
      default:
        return 'bg-green-100 border-green-500';
    }
  };

  // Birleştirme menüsü
  const BirlesmeMenu = () => (
    <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1">
        <button
          onClick={() => {
            onMasaBirlestir(masa.id, 'tasi');
            setShowBirlestirMenu(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Masayı Taşı
        </button>
        <button
          onClick={() => {
            onMasaBirlestir(masa.id, 'birlestir');
            setShowBirlestirMenu(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Masaları Birleştir
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative ${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${getDurumStili()} 
          ${isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'}`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Masa {masa.numara}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBirlestirMenu(!showBirlestirMenu);
            }}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ArrowsExpandIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-2">
          {masa.durum !== MASA_DURUMLARI.BOS && (
            <>
              <div className="flex items-center text-sm">
                <UserIcon className="w-4 h-4 mr-2" />
                <span>{masa.kisiSayisi} Kişi</span>
              </div>
              <div className="flex items-center text-sm">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{masa.sure}</span>
              </div>
              <div className="flex items-center text-sm">
                <CashIcon className="w-4 h-4 mr-2" />
                <span>{masa.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
              </div>
            </>
          )}
        </div>

        {showBirlestirMenu && <BirlesmeMenu />}
      </div>
    </div>
  );
};

export default MasaKarti; 