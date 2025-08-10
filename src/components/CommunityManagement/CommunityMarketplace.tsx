'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
  Tabs,
  Tab
} from '@nextui-org/react';
import { 
  Plus, 
  Package, 
  Image as ImageIcon, 
  FileText, 
  Download,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'software' | 'other';
  price: number;
  currency: 'points' | 'tokens';
  tokenType?: string;
  imageUrl?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  totalSales: number;
  revenue: number;
  status: 'active' | 'inactive' | 'sold_out';
  createdAt: string;
  updatedAt: string;
  maxPurchases?: number;
  currentPurchases: number;
  tags: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  tokenType: string;
  maxPurchases?: number;
  tags: string[];
  imageFile?: File;
  productFile?: File;
}

interface CommunityMarketplaceProps {
  communityId: string;
  pointsName: string;
  pointsSymbol: string;
}

const CommunityMarketplace: React.FC<CommunityMarketplaceProps> = ({
  communityId,
  pointsName,
  pointsSymbol
}) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isPreviewModalOpen, onOpen: onPreviewModalOpen, onClose: onPreviewModalClose } = useDisclosure();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: 'image',
    price: 100,
    currency: 'points',
    tokenType: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [communityId]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockProducts: DigitalProduct[] = [
        {
          id: '1',
          name: 'Exclusive Community Wallpaper Pack',
          description: 'High-resolution wallpapers featuring community artwork and logos',
          type: 'image',
          price: 500,
          currency: 'points',
          imageUrl: '/api/placeholder/300/200',
          fileUrl: '/downloads/wallpaper-pack.zip',
          fileName: 'wallpaper-pack.zip',
          fileSize: 15728640, // 15MB
          downloadCount: 89,
          totalSales: 89,
          revenue: 44500,
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          currentPurchases: 89,
          tags: ['wallpaper', 'artwork', 'exclusive']
        },
        {
          id: '2',
          name: 'Trading Strategy Guide',
          description: 'Comprehensive PDF guide on cryptocurrency trading strategies',
          type: 'document',
          price: 1000,
          currency: 'points',
          imageUrl: '/api/placeholder/300/200',
          fileUrl: '/downloads/trading-guide.pdf',
          fileName: 'trading-guide.pdf',
          fileSize: 5242880, // 5MB
          downloadCount: 45,
          totalSales: 45,
          revenue: 45000,
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-18T00:00:00Z',
          maxPurchases: 100,
          currentPurchases: 45,
          tags: ['trading', 'guide', 'crypto', 'strategy']
        },
        {
          id: '3',
          name: 'Community Discord Bot',
          description: 'Custom Discord bot with community-specific features',
          type: 'software',
          price: 2500,
          currency: 'points',
          fileUrl: '/downloads/discord-bot.zip',
          fileName: 'discord-bot.zip',
          fileSize: 10485760, // 10MB
          downloadCount: 12,
          totalSales: 12,
          revenue: 30000,
          status: 'active',
          createdAt: '2024-01-08T00:00:00Z',
          updatedAt: '2024-01-08T00:00:00Z',
          maxPurchases: 50,
          currentPurchases: 12,
          tags: ['discord', 'bot', 'software', 'premium']
        },
        {
          id: '4',
          name: 'Limited Edition NFT Metadata',
          description: 'Exclusive NFT metadata files for community collection',
          type: 'other',
          price: 0.1,
          currency: 'tokens',
          tokenType: 'ETH',
          fileUrl: '/downloads/nft-metadata.json',
          fileName: 'nft-metadata.json',
          fileSize: 1024, // 1KB
          downloadCount: 25,
          totalSales: 25,
          revenue: 2.5,
          status: 'sold_out',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          maxPurchases: 25,
          currentPurchases: 25,
          tags: ['nft', 'metadata', 'limited', 'exclusive']
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'software':
        return <Package className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'sold_out':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPrice = (price: number, currency: string, tokenType?: string): string => {
    if (currency === 'points') {
      return `${price.toLocaleString()} ${pointsSymbol}`;
    } else {
      return `${price} ${tokenType}`;
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedTab === 'all') return true;
    return product.status === selectedTab;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'image',
      price: 100,
      currency: 'points',
      tokenType: '',
      tags: []
    });
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateProduct = async () => {
    try {
      // TODO: API call to create product with file upload
      console.log('Creating product:', formData);
      
      const newProduct: DigitalProduct = {
        id: Date.now().toString(),
        ...formData,
        fileUrl: '/downloads/placeholder.zip',
        fileName: 'placeholder.zip',
        fileSize: 1024,
        downloadCount: 0,
        totalSales: 0,
        revenue: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentPurchases: 0
      };
      
      setProducts(prev => [newProduct, ...prev]);
      resetForm();
      onCreateModalClose();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      type: product.type,
      price: product.price,
      currency: product.currency,
      tokenType: product.tokenType || '',
      maxPurchases: product.maxPurchases,
      tags: product.tags
    });
    setIsEditing(true);
    onEditModalOpen();
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      // TODO: API call to update product
      console.log('Updating product:', formData);
      
      setProducts(prev => prev.map(product =>
        product.id === selectedProduct.id
          ? { ...product, ...formData, updatedAt: new Date().toISOString() }
          : product
      ));
      
      resetForm();
      setIsEditing(false);
      onEditModalClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      // TODO: API call to delete product
      console.log('Deleting product:', selectedProduct.id);
      
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      onDeleteModalClose();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleProductStatus = async (product: DigitalProduct) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      setProducts(prev => prev.map(p =>
        p.id === product.id
          ? { ...p, status: newStatus, updatedAt: new Date().toISOString() }
          : p
      ));
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const renderProductForm = () => (
    <div className="space-y-4">
      <Input
        label="Product Name"
        placeholder="Enter product name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe your digital product"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        minRows={3}
        maxRows={6}
      />

      <Select
        label="Product Type"
        selectedKeys={[formData.type]}
        onSelectionChange={(keys) => setFormData(prev => ({ ...prev, type: Array.from(keys)[0] as string }))}
      >
        <SelectItem key="image">Image/Graphics</SelectItem>
        <SelectItem key="document">Document/PDF</SelectItem>
        <SelectItem key="video">Video</SelectItem>
        <SelectItem key="audio">Audio</SelectItem>
        <SelectItem key="software">Software</SelectItem>
        <SelectItem key="other">Other</SelectItem>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Price"
          value={formData.price.toString()}
          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          min={0}
          step={0.01}
          required
        />

        <Select
          label="Currency"
          selectedKeys={[formData.currency]}
          onSelectionChange={(keys) => setFormData(prev => ({ ...prev, currency: Array.from(keys)[0] as string }))}
        >
          <SelectItem key="points">{pointsName}</SelectItem>
          <SelectItem key="tokens">Cryptocurrency</SelectItem>
        </Select>
      </div>

      {formData.currency === 'tokens' && (
        <Input
          label="Token Type"
          placeholder="e.g., ETH, USDC, SOL"
          value={formData.tokenType}
          onChange={(e) => setFormData(prev => ({ ...prev, tokenType: e.target.value }))}
          required
        />
      )}

      <Input
        type="number"
        label="Max Purchases (Optional)"
        placeholder="Leave empty for unlimited"
        value={formData.maxPurchases?.toString() || ''}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          maxPurchases: e.target.value ? parseInt(e.target.value) : undefined 
        }))}
        min={1}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files?.[0] }))}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product File *
        </label>
        <input
          type="file"
          onChange={(e) => setFormData(prev => ({ ...prev, productFile: e.target.files?.[0] }))}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            size="sm"
          />
          <Button size="sm" onPress={handleAddTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Chip
              key={tag}
              onClose={() => handleRemoveTag(tag)}
              variant="flat"
              size="sm"
            >
              {tag}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Community Marketplace</h2>
              <p className="text-gray-600">Sell digital products to your community members</p>
            </div>
            
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onCreateModalOpen}
            >
              Add Product
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-xl font-bold">{products.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-xl font-bold">
                      {products.reduce((sum, p) => sum + p.totalSales, 0)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue ({pointsSymbol})</p>
                    <p className="text-xl font-bold">
                      {products
                        .filter(p => p.currency === 'points')
                        .reduce((sum, p) => sum + p.revenue, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Download className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Downloads</p>
                    <p className="text-xl font-bold">
                      {products.reduce((sum, p) => sum + p.downloadCount, 0)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="mb-6"
          >
            <Tab key="active" title="Active" />
            <Tab key="inactive" title="Inactive" />
            <Tab key="sold_out" title="Sold Out" />
            <Tab key="all" title="All" />
          </Tabs>

          <Table aria-label="Products table">
            <TableHeader>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>SALES</TableColumn>
              <TableColumn>REVENUE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getProductIcon(product.type)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.fileName} • {formatFileSize(product.fileSize)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      startContent={getProductIcon(product.type)}
                      variant="flat"
                      size="sm"
                    >
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {formatPrice(product.price, product.currency, product.tokenType)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.totalSales}</p>
                      {product.maxPurchases && (
                        <p className="text-sm text-gray-500">
                          / {product.maxPurchases} max
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {product.currency === 'points' 
                        ? `${product.revenue.toLocaleString()} ${pointsSymbol}`
                        : `${product.revenue} ${product.tokenType}`
                      }
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(product.status)}
                      variant="flat"
                      size="sm"
                    >
                      {product.status.replace('_', ' ').charAt(0).toUpperCase() + product.status.slice(1).replace('_', ' ')}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelectedProduct(product);
                          onPreviewModalOpen();
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => {
                          setSelectedProduct(product);
                          onDeleteModalOpen();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {selectedTab === 'all' 
                  ? 'Create your first digital product to start selling'
                  : `No ${selectedTab.replace('_', ' ')} products at the moment`
                }
              </p>
              {selectedTab === 'all' && (
                <Button
                  color="primary"
                  startContent={<Plus className="w-4 h-4" />}
                  onPress={onCreateModalOpen}
                >
                  Add Product
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Product Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Add Digital Product</h3>
          </ModalHeader>
          <ModalBody>
            {renderProductForm()}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreateProduct}>
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Edit Product</h3>
          </ModalHeader>
          <ModalBody>
            {renderProductForm()}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateProduct}>
              Update Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Product Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Delete Product</h3>
          </ModalHeader>
          <ModalBody>
            {selectedProduct && (
              <p>
                Are you sure you want to delete <strong>"{selectedProduct.name}"</strong>?
                This action cannot be undone and will remove all purchase history.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteProduct}>
              Delete Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Preview Product Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={onPreviewModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Product Preview</h3>
          </ModalHeader>
          <ModalBody>
            {selectedProduct && (
              <div className="space-y-4">
                {selectedProduct.imageUrl && (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width="100%"
                    height={200}
                    className="rounded-lg object-cover"
                  />
                )}
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">{selectedProduct.name}</h4>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">{selectedProduct.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-2 font-medium">
                        {formatPrice(selectedProduct.price, selectedProduct.currency, selectedProduct.tokenType)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">File:</span>
                      <span className="ml-2 font-medium">{selectedProduct.fileName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-2 font-medium">{formatFileSize(selectedProduct.fileSize)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sales:</span>
                      <span className="ml-2 font-medium">{selectedProduct.totalSales}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Downloads:</span>
                      <span className="ml-2 font-medium">{selectedProduct.downloadCount}</span>
                    </div>
                  </div>
                  
                  {selectedProduct.tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag) => (
                          <Chip key={tag} variant="flat" size="sm">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPreviewModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommunityMarketplace;