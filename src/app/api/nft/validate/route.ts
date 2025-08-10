import { NextRequest, NextResponse } from 'next/server';

// Mock NFT validation for development/testing
const mockNFTs = {
  '0x1234567890abcdef': {
    '1': {
      name: 'Bored Ape #1',
      image: 'https://via.placeholder.com/300x300?text=Bored+Ape+1',
      valid: true
    },
    '1234': {
      name: 'Bored Ape #1234',
      image: 'https://via.placeholder.com/300x300?text=Bored+Ape+1234',
      valid: true
    }
  },
  '0xabcdef1234567890': {
    '5678': {
      name: 'CryptoPunk #5678',
      image: 'https://via.placeholder.com/300x300?text=CryptoPunk+5678',
      valid: true
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, tokenId } = body;

    if (!contractAddress || !tokenId) {
      return NextResponse.json(
        { success: false, message: 'Contract address and token ID are required' },
        { status: 400 }
      );
    }

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if NFT exists in mock data
    const contract = mockNFTs[contractAddress.toLowerCase()];
    if (contract && contract[tokenId]) {
      const nft = contract[tokenId];
      return NextResponse.json({
        success: true,
        valid: true,
        name: nft.name,
        image: nft.image,
        contractAddress,
        tokenId
      });
    }

    // For demo purposes, validate any contract that looks like an Ethereum address
    if (contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({
        success: true,
        valid: true,
        name: `NFT #${tokenId}`,
        image: `https://via.placeholder.com/300x300?text=NFT+${tokenId}`,
        contractAddress,
        tokenId
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid NFT or you do not own this NFT' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error validating NFT:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to validate NFT' },
      { status: 500 }
    );
  }
}