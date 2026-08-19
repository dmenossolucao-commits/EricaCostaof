import React, { useState, useEffect, useRef } from 'react';
import { PHOTO_PRESETS } from '../data/initialData';
import { compressImageFile, isValidImageUrl } from '../utils/imageUtils';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  AlertCircle,
  Camera,
  CheckCircle2,
} from 'lucide-react';

interface PhotoSelectorModalProps {
  currentPhoto: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photoUrl: string) => void;
  title?: string;
}

export const PhotoSelectorModal: React.FC<PhotoSelectorModalProps> = ({
  currentPhoto,
  isOpen,
  onClose,
  onSelectPhoto,
  title = 'Alterar Foto Profissional',
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentPhoto);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or current photo changes
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentPhoto || '');
      setUploadError(null);
      setUploadSuccess(null);
      setIsProcessing(false);
      if (currentPhoto && !PHOTO_PRESETS.some((p) => p.url === currentPhoto)) {
        setCustomUrl(currentPhoto.startsWith('data:') ? '' : currentPhoto);
      }
    }
  }, [isOpen, currentPhoto]);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setUploadError(null);
      setUploadSuccess(null);

      // Compress and optimize client-side to prevent localStorage quota issues
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.85);
      setSelectedUrl(compressedDataUrl);
      setUploadSuccess('Foto carregada e otimizada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao processar imagem:', err);
      setUploadError(err.message || 'Falha ao processar o arquivo. Tente outra imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyCustomUrl = () => {
    const clean = customUrl.trim();
    if (clean) {
      if (!isValidImageUrl(clean)) {
        setUploadError('Por favor, insira uma URL válida iniciada por http:// ou https://');
        return;
      }
      setSelectedUrl(clean);
      setUploadError(null);
      setUploadSuccess('URL aplicada com sucesso!');
    }
  };

  const handleConfirm = () => {
    let finalUrl = selectedUrl;
    if (activeTab === 'url' && customUrl.trim()) {
      finalUrl = customUrl.trim();
    }

    if (!finalUrl) {
      setUploadError('Selecione ou envie uma foto antes de salvar.');
      return;
    }

    onSelectPhoto(finalUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E0D8] z-10 text-left max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE6DF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF3F0] text-[#4E6B58] flex items-center justify-center shadow-2xs shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F2923]">{title}</h3>
                <p className="text-xs text-[#718096]">
                  Escolha uma foto da galeria clínica, envie do seu dispositivo ou insira um link.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex items-center gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-200 border-2 border-[#4E6B58] shrink-0 shadow-xs">
              {selectedUrl ? (
                <img
                  src={selectedUrl}
                  alt="Prévia da Foto"
                  className="w-full h-full object-cover"
                  onError={() => setUploadError('A imagem selecionada não pôde ser carregada.')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4E6B58] bg-[#E3ECE6] px-2 py-0.5 rounded-full">
                  Prévia em Tempo Real
                </span>
                {uploadSuccess && (
                  <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {uploadSuccess}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#536157] leading-relaxed">
                Esta foto será exibida no cabeçalho, apresentação principal (hero), seção sobre mim e artigos.
              </p>
              {uploadError && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E5E0D8] mb-6 gap-2 sm:gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('presets');
                setUploadError(null);
              }}
              className={`pb-3 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-[#4E6B58] text-[#4E6B58]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Galeria de Retratos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setUploadError(null);
              }}
              className={`pb-3 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-[#4E6B58] text-[#4E6B58]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Enviar do Dispositivo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                setUploadError(null);
              }}
              className={`pb-3 px-1 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'border-[#4E6B58] text-[#4E6B58]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Link / URL</span>
            </button>
          </div>

          {/* TAB 1: Presets Catalog */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6 max-h-[300px] overflow-y-auto pr-1">
              {PHOTO_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedUrl(preset.url);
                      setUploadError(null);
                      setUploadSuccess('Foto da galeria selecionada!');
                    }}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group relative aspect-square shadow-2xs ${
                      isSelected
                        ? 'border-[#4E6B58] shadow-md ring-2 ring-[#4E6B58]/30 scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#4E6B58]/25 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#4E6B58] text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-left">
                      <p className="text-[10px] text-white font-semibold leading-tight line-clamp-1">
                        {preset.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Upload from Device */}
          {activeTab === 'upload' && (
            <div className="mb-6 space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center ${
                  isDragging
                    ? 'border-[#4E6B58] bg-[#EFF3F0]'
                    : 'border-[#CAD8CE] hover:bg-[#FAF8F5] bg-white'
                }`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#4E6B58] animate-spin mb-3" />
                    <p className="text-sm font-semibold text-[#1F2923]">Otimizando imagem para a web...</p>
                    <p className="text-xs text-gray-500 mt-1">Garantindo alta resolução com carregamento instantâneo.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-[#EFF3F0] text-[#4E6B58] flex items-center justify-center mb-3 shadow-2xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm sm:text-base text-[#1F2923] mb-1">
                      Clique para escolher uma foto do celular ou computador
                    </p>
                    <p className="text-xs text-gray-500 max-w-sm">
                      Arraste e solte ou toque para abrir a galeria/câmera. Aceita JPG, PNG e WEBP com compressão automática.
                    </p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#536157] flex items-center justify-between">
                <span>💡 Suporta fotos tiradas na hora pela câmera ou salvas na galeria.</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#4E6B58] font-bold hover:underline ml-2 shrink-0"
                >
                  Abrir Arquivos
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Direct URL */}
          {activeTab === 'url' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  URL Direta da Imagem:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      if (isValidImageUrl(e.target.value)) {
                        setSelectedUrl(e.target.value.trim());
                        setUploadError(null);
                      }
                    }}
                    placeholder="https://exemplo.com/foto-psicologa.jpg"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm text-[#1F2923] focus:outline-none focus:ring-2 focus:ring-[#4E6B58]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-5 py-3 rounded-xl bg-[#EFF3F0] hover:bg-[#E3ECE6] text-sm font-semibold text-[#4E6B58] transition-colors shrink-0"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Você pode colar links de imagens hospedadas no Google Drive (com link direto), Unsplash, Cloudinary, Imgur ou no seu próprio servidor.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              const defaultUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
              setSelectedUrl(defaultUrl);
              onSelectPhoto(defaultUrl);
              onClose();
            }}
            className="text-xs text-gray-500 hover:text-[#4E6B58] underline text-left"
          >
            Restaurar Foto Padrão Original
          </button>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] active:scale-98 text-white text-sm font-semibold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Salvar e Aplicar Foto</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
