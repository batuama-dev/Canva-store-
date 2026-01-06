import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';

// Helper function to generate a slug from the product name
/*
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};
*/
const ProductForm = () => {
  console.log('ProductForm: Component rendered or re-rendered.');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discount_price: '',
    is_featured: false,
    main_preview: '', // This will hold the URL of the existing image in edit mode
    gallery: [], // This will hold URLs of existing gallery images
    canva_links: [''],
    download_file_url: '', // This will hold the URL of the existing download file in edit mode
    slug: ''
  });

  // State for new files to be uploaded
  const [mainPreviewFile, setMainPreviewFile] = useState(null);
  const [mainPreviewUrl, setMainPreviewUrl] = useState('');
  
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState([]);

  const [downloadFile, setDownloadFile] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('');


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios.get(`/api/products/${id}`)
        .then(res => {
          const data = {
            ...res.data,
            gallery: res.data.gallery || [],
            canva_links: res.data.canva_links && res.data.canva_links.length > 0 ? res.data.canva_links : ['']
          };
          setProduct(data);
          setMainPreviewUrl(data.main_preview); // Set existing main preview
          setGalleryPreviewUrls(data.gallery); // Set existing gallery previews
          setDownloadFileName(data.download_file_url ? data.download_file_url.split('/').pop() : ''); // Display existing file name
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load product data.');
          setLoading(false);
          console.error(err);
        });
    }
  }, [id, isEditing]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mainPreviewUrl && mainPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mainPreviewUrl);
      }
      galleryPreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [mainPreviewUrl, galleryPreviewUrls]);

  const categoryPriceMap = {
    'Pack Graphiste Pro': '50',
    'Pack Réseaux sociaux': '20',
    'Pack Entrepreneurs': '15',
    'Pack Événements': '10'
  };

  const priceCategoryMap = {
    '50': 'Pack Graphiste Pro',
    '20': 'Pack Réseaux sociaux',
    '15': 'Pack Entrepreneurs',
    '10': 'Pack Événements'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category') {
      const newPrice = categoryPriceMap[value] || '';
      setProduct(prev => ({
        ...prev,
        category: value,
        price: newPrice
      }));
    } else if (name === 'price') {
      const newCategory = priceCategoryMap[value] || '';
      setProduct(prev => ({
        ...prev,
        price: value,
        category: newCategory
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMainPreviewChange = (e) => {
    console.log('handleMainPreviewChange: Fired.');
    console.log('handleMainPreviewChange: Selected files:', e.target.files);
    const file = e.target.files[0];
    if (file) {
      setMainPreviewFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMainPreviewUrl(previewUrl);
    } else {
      setMainPreviewFile(null);
      setMainPreviewUrl(isEditing ? product.main_preview : ''); // Revert to existing or clear
    }
  };

  const handleGalleryFilesChange = (e) => {
    console.log('handleGalleryFilesChange: Fired.');
    console.log('handleGalleryFilesChange: Selected files:', e.target.files);
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setGalleryFiles(prevFiles => [...prevFiles, ...files]);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setGalleryPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    const urlToRemove = galleryPreviewUrls[indexToRemove];

    if (urlToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRemove);
        const fileIndexToRemove = galleryPreviewUrls.slice(0, indexToRemove + 1).filter(u => u.startsWith('blob:')).length - 1;
        setGalleryFiles(prev => prev.filter((_, i) => i !== fileIndexToRemove));

    } else {
        setProduct(prev => ({
            ...prev,
            gallery: prev.gallery.filter(url => url !== urlToRemove)
        }));
    }
    
    setGalleryPreviewUrls(prev => prev.filter((_, i) => i !== indexToRemove));
  };


  const handleDownloadFileChange = (e) => {
    console.log('handleDownloadFileChange: Fired.');
    console.log('handleDownloadFileChange: Selected files:', e.target.files);
    const file = e.target.files[0];
    if (file) {
      setDownloadFile(file);
      setDownloadFileName(file.name);
    } else {
      setDownloadFile(null);
      setDownloadFileName(isEditing && product.download_file_url ? product.download_file_url.split('/').pop() : '');
    }
  };


  const handleDynamicListChange = (e, index, field) => {
    const { value } = e.target;
    const list = [...product[field]];
    list[index] = value;
    setProduct(prev => ({ ...prev, [field]: list }));
  };

  const addDynamicListItem = (field) => {
    setProduct(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeDynamicListItem = (index, field) => {
    if (product[field].length <= 1) return;
    const list = product[field].filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, [field]: list }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();

    // Append text data
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('quantity', product.quantity || 1);
    
    // Append Canva links as a newline-separated string to match backend expectation
    formData.append('product_links', product.canva_links.join('\n'));

    // Append file for the main image
    if (mainPreviewFile) {
      formData.append('image', mainPreviewFile);
    }
    
    // Append file for the PDF download
    if (downloadFile) {
        formData.append('pdfFile', downloadFile);
    }

    try {
      const productResponse = await (isEditing
        ? axios.put(`/api/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : axios.post('/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }));

      const productId = isEditing ? id : productResponse.data.id;

      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();
        galleryFiles.forEach(file => {
          galleryFormData.append('images', file);
        });

        await axios.post(`/api/products/${productId}/images`, galleryFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccessMessage(`Pack ${isEditing ? 'mis à jour' : 'créé'} avec succès !`);
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez vérifier les champs et les fichiers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
    if (loading && isEditing && !product.name) {
        return <div className="flex justify-center items-center h-64"><div className="loader border-t-4 border-b-4 border-indigo-500 rounded-full w-16 h-16 animate-spin"></div></div>;
    }

  return (
    <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Modifier le Pack' : 'Ajouter un nouveau Pack'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
            {/* General Info Section */}
            <FormSection title="Informations Générales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nom du pack" name="name" value={product.name} onChange={handleChange} required />
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie <span className="text-red-500">*</span></label>
                        <select id="category" name="category" value={product.category} onChange={handleChange} required className="form-input">
                            <option value="">Sélectionner une catégorie</option>
                            {Object.keys(categoryPriceMap).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description longue</label>
                    <textarea id="description" name="description" value={product.description} onChange={handleChange} rows="6" className="form-input" placeholder="Description détaillée pour la page produit"></textarea>
                </div>
            </FormSection>

            {/* Pricing Section */}
            <FormSection title="Prix et Visibilité">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix Normal ($) <span className="text-red-500">*</span></label>
                        <select id="price" name="price" value={product.price} onChange={handleChange} required className="form-input">
                            <option value="">Sélectionner un prix</option>
                            {Object.keys(priceCategoryMap).map(p => (
                                <option key={p} value={p}>{p}$</option>
                            ))}
                        </select>
                    </div>
                    <InputField label="Prix Promotionnel ($)" name="discount_price" type="number" value={product.discount_price} onChange={handleChange} placeholder="Optionnel" />
                </div>
                <div className="mt-6"><label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="is_featured" checked={product.is_featured} onChange={handleChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><span className="text-gray-700 font-medium">Mettre en avant sur la page d'accueil</span></label></div>
            </FormSection>

            {/* Images Section */}
            <FormSection title="Images du Pack">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Principale</label>
                    <ImageUploadPreview previewUrl={mainPreviewUrl} onFileChange={handleMainPreviewChange} />
                </div>
                <div className="mt-6">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Galerie d'images (aperçus)</label>
                     <GalleryUploadGrid previews={galleryPreviewUrls} onFilesChange={handleGalleryFilesChange} onRemoveImage={removeGalleryImage} />
                </div>
            </FormSection>

            {/* Canva Links Section */}
            <FormSection title="Liens des Templates Canva">
                 {product.canva_links.map((link, index) => (
                    <DynamicInput key={index} value={link} onChange={(e) => handleDynamicListChange(e, index, 'canva_links')} onRemove={() => removeDynamicListItem(index, 'canva_links')} placeholder="https://www.canva.com/design/..." showRemove={product.canva_links.length > 1}/>
                ))}
                <button type="button" onClick={() => addDynamicListItem('canva_links')} className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">+ Ajouter un lien Canva</button>
            </FormSection>

            {/* Download File Section */}
            <FormSection title="Fichier PDF à Télécharger">
                <DownloadFileUploadField fileName={downloadFileName} onFileChange={handleDownloadFileChange} />
            </FormSection>

            {/* Messages and Actions */}
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm"><p className="font-bold">Erreur</p><p>{error}</p></div>}
            {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm"><p className="font-bold">Succès</p><p>{successMessage}</p></div>}

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 shadow-sm transition-transform transform hover:scale-105">Annuler</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 flex items-center justify-center min-w-[150px]">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEditing ? 'Sauvegarder' : 'Créer le Pack')}
                </button>
            </div>
        </form>
    </div>
  );
};

// --- Sub-components for cleaner structure ---

const FormSection = ({ title, children }) => (
    <div className="p-6 border border-gray-200 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="form-input"/>
    </div>
);

const ImageUploadPreview = ({ previewUrl, onFileChange }) => {
    console.log('ImageUploadPreview: Rendered.');
    return (
    <div className="flex items-center gap-4">
        {previewUrl ? (
            <img src={previewUrl} alt="Aperçu" className="w-32 h-32 rounded-lg object-cover shadow-md"/>
        ) : (
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">Pas d'image</div>
        )}
        <div>
            <label htmlFor="main_preview_file" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span>{previewUrl ? 'Changer l\'image' : 'Sélectionner une image'}</span>
                <input id="main_preview_file" name="main_preview_file" type="file" className="absolute inset-0 z-50 opacity-0 cursor-pointer" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" />
            </label>
             {previewUrl && (
                <button type="button" onClick={() => onFileChange({ target: { files: [] } })} className="ml-2 text-sm text-red-600 hover:text-red-800">Supprimer</button>
            )}
        </div>
    </div>
)};

const GalleryUploadGrid = ({ previews, onFilesChange, onRemoveImage }) => {
    console.log('GalleryUploadGrid: Rendered.');
    return (
    <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((url, index) => (
                <div key={index} className="relative group">
                    <img src={url} alt={`Aperçu galerie ${index + 1}`} className="w-full h-32 rounded-lg object-cover shadow-md" />
                    <button type="button" onClick={() => onRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
            <label htmlFor="gallery_files" className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="mt-2 block text-sm font-medium text-gray-600">Ajouter</span>
                <input id="gallery_files" name="gallery_files" type="file" className="absolute inset-0 z-50 opacity-0 cursor-pointer" onChange={onFilesChange} accept="image/png, image/jpeg, image/webp" multiple />
            </label>
        </div>
    </div>
)};

const DynamicInput = ({ value, onChange, onRemove, placeholder, showRemove }) => (
    <div className="flex items-center gap-2 mb-2">
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="form-input" />
        {showRemove && (
            <button type="button" onClick={onRemove} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        )}
    </div>
);

const DownloadFileUploadField = ({ fileName, onFileChange }) => {
    console.log('DownloadFileUploadField: Rendered.');
    return (
    <div className="flex items-center gap-4">
        <div className="flex-1">
            <label htmlFor="download_file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 relative">
                Fichier PDF
                <input id="download_file" name="download_file" type="file" className="absolute inset-0 z-50 opacity-0 cursor-pointer" onChange={onFileChange} accept=".pdf" />
            </label>
        </div>
        {fileName && (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{fileName}</span>
                <button type="button" onClick={() => onFileChange({ target: { files: [] } })} className="text-sm text-red-600 hover:text-red-800">Supprimer</button>
            </div>
        )}
    </div>
)};

export default ProductForm;