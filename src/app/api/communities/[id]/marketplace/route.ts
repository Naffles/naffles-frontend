import { NextRequest, NextResponse } from 'next/server';

// GET /api/communities/[id]/marketplace - Get community marketplace products
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const currency = searchParams.get('currency');
    
    // TODO: Get user from session/auth
    const userId = 'current_user_id';
    
    const queryParams = new URLSearchParams({
      ...(status && { status }),
      ...(type && { type }),
      ...(currency && { currency })
    });
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/marketplace?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch marketplace products');
    }

    const products = await response.json();

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch marketplace products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/marketplace - Create marketplace product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    // TODO: Get user from session/auth and verify permissions
    const userId = 'current_user_id';
    
    // Extract form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string;
    const tokenType = formData.get('tokenType') as string;
    const maxPurchases = formData.get('maxPurchases') ? parseInt(formData.get('maxPurchases') as string) : undefined;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    
    const imageFile = formData.get('imageFile') as File | null;
    const productFile = formData.get('productFile') as File | null;
    
    // Validate required fields
    if (!name || !type || !price || !currency || !productFile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, type, price, currency, and product file are required'
        },
        { status: 400 }
      );
    }
    
    // TODO: Handle file uploads to storage service
    // For now, we'll create mock URLs
    const imageUrl = imageFile ? `/uploads/images/${Date.now()}-${imageFile.name}` : undefined;
    const fileUrl = `/uploads/products/${Date.now()}-${productFile.name}`;
    
    const productData = {
      name,
      description,
      type,
      price,
      currency,
      tokenType,
      maxPurchases,
      tags,
      imageUrl,
      fileUrl,
      fileName: productFile.name,
      fileSize: productFile.size,
      communityId: id,
      creatorId: userId
    };
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/marketplace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to create marketplace product');
    }

    const product = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating marketplace product:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create marketplace product',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}